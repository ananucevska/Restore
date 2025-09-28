using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
// ReSharper disable ArrangeObjectCreationWhenTypeEvident

namespace API.Data;

public class DbInitializer
{
    public static void InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope(); //garbage collector

        var context = scope.ServiceProvider.GetRequiredService<StoreContext>()
            ?? throw new InvalidOperationException("Store context is null");
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>()
                      ?? throw new InvalidOperationException("Failed to retrieve user manager");
        SeedData(context, userManager).Wait(); // synchronously wait during startup
    }

    private static async Task SeedData(StoreContext context, UserManager<User> userManager)
    {
        context.Database.Migrate(); //sekad se povikuva

        User? user = null;
        if (!userManager.Users.Any())
        {
            user = new User
            {
                UserName = "bob@test.com",
                Email = "bob@test.com",
                City = "New York",
                Name = "Bob Smith"
            };
            
            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");
        }
        else
        {
            user = await userManager.Users.FirstAsync();
        }
        
        if (context.Products.Any()) return; // if there is any, return them
        var products = new List<Product> //create list of products adn save to database -- do it before app gets started vo program.cs so DbInitializer
        {
            new()
            {
                Name = "Samsung Smart TV 55\"",
                Description =
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/sb-ang1.png",
                Type = "TV"
            },
            new()
            {
                Name = "LG OLED TV 65\"",
                Description = "Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
                PictureUrl = "/images/products/sb-ang2.png",
                Type = "TV"
            },
            new()
            {
                Name = "Sony Bluetooth Speaker",
                Description =
                    "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                PictureUrl = "/images/products/sb-core1.png",
                Type = "Audio"
            },
            new()
            {
                Name = "JBL Wireless Headphones",
                Description =
                    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                PictureUrl = "/images/products/sb-core2.png",
                Type = "Audio"
            },
            new()
            {
                Name = "Dell Laptop Inspiron",
                Description =
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/sb-react1.png",
                Type = "Computers"
            },
            new()
            {
                Name = "MacBook Pro 13\"",
                Description =
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/sb-ts1.png",
                Type = "Computers"
            },
            new()
            {
                Name = "NVIDIA RTX 4080",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/hat-core1.png",
                Type = "Computer components",
            },
            new()
            {
                Name = "Intel Core i7 Processor",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/hat-react1.png",
                Type = "Computer components",
            },
            new()
            {
                Name = "iPhone 15 Pro",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/hat-react2.png",
                Type = "Phones",
            },
            new()
            {
                Name = "Samsung Galaxy S24",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/glove-code1.png",
                Type = "Phones",
            },
            new()
            {
                Name = "Bosch Refrigerator",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/glove-code2.png",
                Type = "Major Appliances - Fridges",
            },
            new()
            {
                Name = "Whirlpool Washing Machine",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/glove-react1.png",
                Type = "Major Appliances - Washers/Dryers",
            },
            new()
            {
                Name = "Nike Air Max - Male",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/glove-react2.png",
                Type = "Shoes - male",
            },
            new()
            {
                Name = "Adidas Running Shoes - Female",
                Description =
                    "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                PictureUrl = "/images/products/boot-redis1.png",
                Type = "Shoes - female",
            },
            new()
            {
                Name = "Levi's Jeans - Male",
                Description =
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/boot-core2.png",
                Type = "Clothing - male",
            },
            new()
            {
                Name = "Zara Dress - Female",
                Description =
                    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                PictureUrl = "/images/products/boot-core1.png",
                Type = "Clothing - female",
            },
            new()
            {
                Name = "IKEA Bed Frame",
                Description = "Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.",
                PictureUrl = "/images/products/boot-ang2.png",
                Type = "Furniture - Bedroom",
            },
            new()
            {
                Name = "Sofa Set Living Room",
                Description =
                    "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                PictureUrl = "/images/products/boot-ang1.png",
                Type = "Furniture - Living Room",
            },
            new()
            {
                Name = "Garden Table Set",
                Description = "Perfect outdoor dining set for your garden. Weather resistant and durable.",
                PictureUrl = "/images/products/boot-core1.png",
                Type = "Furniture - Garden",
            },
            new()
            {
                Name = "Decorative Wall Art",
                Description = "Beautiful abstract wall art to enhance your home decor.",
                PictureUrl = "/images/products/boot-ang2.png",
                Type = "Home decor",
            },
            new()
            {
                Name = "Garden Chairs",
                Description = "Comfortable outdoor chairs perfect for garden relaxation.",
                PictureUrl = "/images/products/sb-ang1.png",
                Type = "Furniture - Garden",
            },
        };
        
        // Assign the user to all products
        foreach (var product in products)
        {
            product.UserId = user.Id;
        }
        
        context.Products.AddRange(products); //tracking list of products in memory
        context.SaveChanges(); //request to the database
    }
}