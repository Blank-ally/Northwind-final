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
    public IActionResult Index(int id ) 
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
}
