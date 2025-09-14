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

        if (!userManager.Users.Any())
        {
            var user = new User
            {
                UserName = "bob@test.com",
                Email = "bob@test.com",
                City = "New York",
                Name = "Bob Smith"
            };
            
            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");
        }
        
        if (context.Products.Any()) return; // if there is any, return them
        var products = new List<Product> //create list of products adn save to database -- do it before app gets started vo program.cs so DbInitializer
        {
            new()
            {
                Name = "Angular Speedster Board 2000",
                Description =
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/sb-ang1.png",
                Type = "Boards",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Green Angular Board 3000",
                Description = "Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
                PictureUrl = "/images/products/sb-ang2.png",
                Type = "Boards",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Core Board Speed Rush 3",
                Description =
                    "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                PictureUrl = "/images/products/sb-core1.png",
                Type = "Boards",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Net Core Super Board",
                Description =
                    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                PictureUrl = "/images/products/sb-core2.png",
                Type = "Boards",
                QuantityInStock = 100
            },
            new()
            {
                Name = "React Board Super Whizzy Fast",
                Description =
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/sb-react1.png",
                Type = "Boards",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Typescript Entry Board",
                Description =
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/sb-ts1.png",
                Type = "Boards",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Core Blue Hat",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/hat-core1.png",
                Type = "Hats",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Green React Woolen Hat",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/hat-react1.png",
                Type = "Hats",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Purple React Woolen Hat",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/hat-react2.png",
                Type = "Hats",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Blue Code Gloves",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/glove-code1.png",
                Type = "Gloves",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Green Code Gloves",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/glove-code2.png",
                Type = "Gloves",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Purple React Gloves",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/glove-react1.png",
                Type = "Gloves",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Green React Gloves",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/glove-react2.png",
                Type = "Gloves",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Redis Red Boots",
                Description =
                    "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                PictureUrl = "/images/products/boot-redis1.png",
                Type = "Boots",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Core Red Boots",
                Description =
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                PictureUrl = "/images/products/boot-core2.png",
                Type = "Boots",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Core Purple Boots",
                Description =
                    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                PictureUrl = "/images/products/boot-core1.png",
                Type = "Boots",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Angular Purple Boots",
                Description = "Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.",
                PictureUrl = "/images/products/boot-ang2.png",
                Type = "Boots",
                QuantityInStock = 100
            },
            new()
            {
                Name = "Angular Blue Boots",
                Description =
                    "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                PictureUrl = "/images/products/boot-ang1.png",
                Type = "Boots",
                QuantityInStock = 100
            },
        };
        
        context.Products.AddRange(products); //tracking list of products in memory
        context.SaveChanges(); //request to the database
    }
}