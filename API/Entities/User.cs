using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class User : IdentityUser
{
    public string City { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}