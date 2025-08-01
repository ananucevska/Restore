﻿using API.Entities.OrderAgregate;
//dtos are for shaping the data in json for postman
namespace API.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public required string BuyerEmail { get; set; }
    public required ShippingAddress ShippingAddress { get; set; }
    public DateTime OrderDate { get; set; }
    public List<OrderItemDto> OrderItems { get; set; } = [];
    public long Subtotal { get; set; }
    public long DeliveryFee { get; set; }
    public long Discount  { get; set; }
    public long Total { get; set; }
    public required string OrderStatus { get; set; }
    public required PaymentSummary PaymentSummary { get; set; }
}