﻿using API.Entities.OrderAgregate;

namespace API.DTOs;

public class CreateOrderDto
{
    public required ShippingAddress ShippingAddress { get; set; }
    public required PaymentSummary PaymentSummary { get; set; }
}