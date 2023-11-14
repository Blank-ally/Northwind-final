using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

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
    public IActionResult Index()
    {
        var customer = GetCustomer();

        if (customer != null)
        {
            return View(_dataContext.CartItems.Where(c => c.CustomerId == customer.CustomerId).OrderBy(ci => ci.Product.ProductName));
        }

        return View(Enumerable.Empty<CartItem>());
    }



    [HttpPost]
    public IActionResult Add(int id, int qty)
    {
        var product = _dataContext.Products.Find(id);
        var customer = GetCustomer();

        if (product == null || customer == null)
        {
            return NotFound();
        }

        // Check if item already exists in the cart
        var existingCartItem = _dataContext.CartItems.FirstOrDefault(c => c.ProductId == product.ProductId && c.CustomerId == customer.CustomerId);

        if (existingCartItem != null)
        {
            // Item exists, increase quantity
            existingCartItem.Quantity += qty;
        }
        else
        {
            // Item does not exist, add new
            _dataContext.CartItems.Add(new CartItem
            {
                ProductId = product.ProductId,
                CustomerId = customer.CustomerId,
                Quantity = qty
            });
        }

        _dataContext.SaveChanges();
        return RedirectToAction("Index");
    }

    [HttpPost]
    public IActionResult Remove(int id)
    {
        var product = _dataContext.Products.Find(id);
        var customer = GetCustomer();

        if (product == null || customer == null)
        {
            return NotFound();
        }

        // Check if item exist in the cart
        var existingCartItem = _dataContext.CartItems.FirstOrDefault(c => c.ProductId == product.ProductId && c.CustomerId == customer.CustomerId);

        if (existingCartItem != null)
        {
            // Item exists, remove from cart
            _dataContext.CartItems.Remove(existingCartItem);
            _dataContext.SaveChanges();
        }

        return RedirectToAction("Index");
    }

    private Customer GetCustomer()
    {
        // Assuming the Email is unique and used as UserName in Identity.
        var userId = _userManager.GetUserId(User);
        return _dataContext.Customers.FirstOrDefault(c => c.Email == userId);
    }
}
