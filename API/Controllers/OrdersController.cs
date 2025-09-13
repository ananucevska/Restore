using System.Net;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAgregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class OrdersController(StoreContext context) : BaseApiController // storecontext gives us access to the database
{
    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders() // vrakja lista od tip OrderDto
    {
        var orders = await context.Orders
            .ProjectToDto()
            .Where(x => x.BuyerEmail == User.GetUsername())
            .ToListAsync();
        
        return orders;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderDetails(int id)
    {
        var order = await context.Orders
            .ProjectToDto()
            .Where(x => x.BuyerEmail == User.GetUsername() && id == x.Id) 
            .FirstOrDefaultAsync();
        
        if (order == null) return NotFound();
        
        return order;
    }
}