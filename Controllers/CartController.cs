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
    public IActionResult Index( )
    {
       
        var customer = User.Identity.Name;
        var id = _dataContext.Customers.Where(c => c.Email == customer).FirstOrDefault().CustomerId;
       // ViewBag.id = id;
        return View(_dataContext.CartItems.Where(c => c.CustomerId == id).Include(p => p.Product).Include(p => p.Customer).OrderBy(c => c.Product.ProductName));
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

    public IActionResult CheckOut(  ){
       // ViewBag.id = id;
       
        var customer = User.Identity.Name;
        var id = _dataContext.Customers.Where(c => c.Email == customer).FirstOrDefault().CustomerId;
        return View(_dataContext.CartItems.Where(c => c.CustomerId == id).Include(p => p.Product).Include(p => p.Customer).OrderBy(c => c.Product.ProductName));
    }

   


    public IActionResult Update(CartItemJSON cartItemJSON)
    {
        // Fetching the item that matches the given id.
        _dataContext.CartItems.Add(new CartItem() { CartItemId = cartItemJSON.id, Quantity = cartItemJSON.qty });

        return RedirectToAction("Index");

    }

    // public IActionResult PlaceOrder(int id){
    //   var customer =  _dataContext.Customers.Where(c => c.CustomerId == id);
    // }

}