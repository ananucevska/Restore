using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await RetrieveBasket();
        if (basket == null) return NoContent();
        return basket.ToDto();
    }

    [HttpPost]
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    { 
        /* get basket */
        var basket = await RetrieveBasket();
        /* create basket */
        basket ??= CreateBasket();
        /* get product */
        var product = await context.Products.FindAsync(productId);
        if (product == null) return BadRequest("Problem adding item to Basket");
        /* add item to basket */
        basket.AddItem(product, quantity);
        /* save changes */
        
        var result = await context.SaveChangesAsync() > 0;
        
        Console.WriteLine($"Saving basket {basket.BasketId} with {basket.Items.Count} item(s)");
        
        if (result) return CreatedAtAction(nameof(GetBasket), basket.ToDto());
        return BadRequest("Problem updating Basket");
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
        /* get basket
         remove the item or reduce its quantity
         save changes */
        var basket = await RetrieveBasket();
        if (basket == null) return BadRequest("Unable to retrieve basket");
        basket.RemoveItem(productId, quantity);
        var result = await context.SaveChangesAsync() > 0;
        if (result) return Ok();
        return BadRequest("Problem updating basket");
    }
    
    private Basket CreateBasket()
    {
        var basketId = Guid.NewGuid().ToString();
        var cookieOptions = new CookieOptions
        { 
            IsEssential = true,
            Expires = DateTime.UtcNow.AddDays(30)
        };
        Response.Cookies.Append("basketId", basketId, cookieOptions);
        var basket = new Basket {BasketId = basketId};
        context.Baskets.Add(basket);
        return basket;
    }
    /*x e shorthand za item*/

    private async Task<Basket?> RetrieveBasket()
    {
        return await context.Baskets
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x=> x.BasketId == Request.Cookies["basketId"]);
    }
}