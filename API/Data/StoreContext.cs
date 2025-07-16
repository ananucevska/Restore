using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }
    public required DbSet<Basket> Baskets { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole {Id = "7c8a27aa-05b5-4bfd-ae31-23fe20c3ddc0", Name = "Member", NormalizedName = "MEMBER" },
                new IdentityRole {Id = "05c2d88e-224e-42bc-9f94-a425dd3a365d", Name = "Admin", NormalizedName = "ADMIN" }
            );    
    }
}