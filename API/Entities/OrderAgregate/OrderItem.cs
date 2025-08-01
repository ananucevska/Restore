﻿namespace API.Entities.OrderAgregate;

public class OrderItem
{
    public int Id { get; set; }
    public required ProductItemOrdered ItemOrdered { get; set; }
    public long Price { get; set; }
    public int Quantity { get; set; }
}