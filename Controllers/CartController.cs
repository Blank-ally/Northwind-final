using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

[Authorize]
public class CartController : Controller
{
    private readonly DataContext _dataContext;
    private UserManager<AppUser> _userManager;

    public CartController(DataContext db, UserManager<AppUser> usrMgr)
    {
        _dataContext = db;
        _userManager = usrMgr;
    }

    // Display all items in customer's cart
    public IActionResult Index(int id)
    {
        ViewBag.id = id;
        return
             View(_dataContext.CartItems.Include(p => p.Product).Include(p => p.Customer).OrderBy(c => c.Product.ProductName));
    }

    public IActionResult Remove(int id)
    {
        _dataContext.DeleteCartItem(_dataContext.CartItems.FirstOrDefault(c => c.CartItemId == id));

        return RedirectToAction("Index");

    }

    public IActionResult Edit(int id)
    {
        _dataContext.EditCart(_dataContext.CartItems.FirstOrDefault(c => c.CartItemId == id));

        return RedirectToAction("Index");

    }


    public IActionResult Update(CartItemJSON cartItemJSON)
    {
        // Fetching the item that matches the given id.
        _dataContext.CartItems.Add(new CartItem() { CartItemId = cartItemJSON.id, Quantity = cartItemJSON.qty });

        return RedirectToAction("Index");

    }

    public IActionResult CheckOut(int id)
    {
         return View(_dataContext.CartItems.Where(c => c.CustomerId == id).Include(c => c.Product).ToList());
    }


    [HttpPost]
    public IActionResult Checkout(int iD)
    {
        // var userId = User.Identity.Name;

        var orderModel = new Order();

        // Get the cart items for the current user
        var cartItems = _dataContext.CartItems.Where(c => c.CustomerId == iD).Include(c => c.Product).ToList();

       

        // Process the checkout
        using (var transaction = _dataContext.Database.BeginTransaction())
        {
            try
            {
                // Loop through the cart items
                foreach (var cartItem in cartItems)
                {
                    // Create a new order detail record
                    var orderDetail = new OrderDetails
                    {
                        ProductId = cartItem.ProductId,
                        Quantity = (short)cartItem.Quantity,
                        UnitPrice = cartItem.Product.UnitPrice,
                        Discount = 0 // Put your discount calculation logic here
                    };

                    // Add the order detail to the order
                    orderModel.OrderDetails.Add(orderDetail);
                }

                // Set the customer ID and order date
                orderModel.CustomerId = iD;
                orderModel.OrderDate = DateTime.Now;

                // Add the order to the database
                _dataContext.Orders.Add(orderModel);
                _dataContext.SaveChanges();

                // Remove the cart items from the database
                _dataContext.CartItems.RemoveRange(cartItems);
                _dataContext.SaveChanges();

                transaction.Commit();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                // Log the exception
                // Consider returning a view to inform the user about the error
                return View("Error", ex); // creates a generic 'Error' view that displays the exception message.
            }
        }

        return View("~/Views/Cart/CheckOut.cshtml", orderModel);

    }

}