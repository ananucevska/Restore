using API.Entities;
using Microsoft.AspNetCore.Identity;
using System;
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
                UserName = "anna_nucevska@hotmail.com",
                Email = "anna_nucevska@hotmail.com",
                City = "Skopje",
                Name = "Ana Nucevska"
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
                Name = "Зимска јакна со внатрешно крзно",
                Description = "Зимска јакна со внатрешно крзно, многу малку носена. Идеална за многу ладни зими.",
                PictureUrl = "/images/products/Jacket.jpg",
                Type = "Clothing & Accessories - Clothing - Female",
                Condition = "Like New",
                CargoDelivery = true,
                Delivery = "[\"Can deliver\"]"
            },
            new()
            {
                Name = "Лежерна сомотска чанта",
                Description = "Рачката се подесува, привезоците се вадат",
                PictureUrl = "/images/products/Bag.jpg",
                Type = "Clothing & Accessories - Bags",
                Condition = "Like New",
                CargoDelivery = true,
                Delivery = "[\"Can deliver\"]"
            },
            new()
            {
                Name = "Стаклена декорација",
                Description = "Интересна стаклена декорација со медуза",
                PictureUrl = "/images/products/Decoration.jpg",
                Type = "Miscellaneous / Other",
                Condition = "Like New",
                CargoDelivery = true,
                Delivery = "[\"Can deliver\"]"
            },
            new()
            {
                Name = "Samsung паметен часовник",
                Description = "Модел S23FE, малку користен",
                PictureUrl = "/images/products/Smart_Watch.jpg",
                Type = "Clothing & Accessories - Accessories",
                Condition = "Like New",
                CargoDelivery = true,
                Delivery = "[\"Can deliver\"]"
            },
            new()
            {
                Name = "Велосипед",
                Description = "Велосипедот е во одлична состојба, многу малку користен",
                PictureUrl = "/images/products/Bike.jpeg",
                Type = "Sports & Outdoors - Bicycles",
                Condition = "Good",
                CargoDelivery = false,
                Delivery = "[\"Pick up only\"]"
            },
            new()
            {
                Name = "Животинска фарма - Џорџ Орвел",
                Description = "Како нова, верзија на англиски јазик.",
                PictureUrl = "/images/products/Book.jpg",
                Type = "Books & Media - Books",
                Condition = "Good",
                CargoDelivery = true,
                Delivery = "[\"Pick up only\", \"Can deliver\"]"
            },
            new()
            {
                Name = "Cluedo друштвена игра",
                Description = "Верзијата е од 2024, добро сочувана",
                PictureUrl = "/images/products/Board_Game.jpg",
                Type = "Books & Media - Board Games",
                Condition = "Good",
                CargoDelivery = false,
                Delivery = "[\"Pick up only\"]"
            },
            new()
            {
                Name = "Не лути се човече",
                Description = "Стандардно издание од играта, во добра состојба",
                PictureUrl = "/images/products/Board_Game-1.jpg",
                Type = "Books & Media - Board Games",
                Condition = "Good",
                CargoDelivery = false,
                Delivery = "[\"Pick up only\"]"
            }
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