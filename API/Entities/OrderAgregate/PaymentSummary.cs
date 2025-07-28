using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAgregate;

[Owned]
public class PaymentSummary
{
    public int Last4  { get; set; }
    public required string Brand {get; set;}
    [JsonPropertyName("exp_month")]
    public int ExpMonth { get; set; }
    [JsonPropertyName("exp_year")] // deka go prekrstivme vaka vo order.ts
    public int ExpYear { get; set; }
}