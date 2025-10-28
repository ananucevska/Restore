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
            // Облека и додатоци - Облека - Женска
            new()
            {
                Name = "Zara фустан - Женска",
                Description = "Елегантен летен фустан од Zara. Црна боја, размер M, перфектен за официјални настани.",
                PictureUrl = "/images/products/Jacket.jpg",
                Type = "Clothing & Accessories - Clothing - Female",
                Condition = "Like New",
                CargoDelivery = true,
                Delivery = "[\"Can deliver\"]"
            },
            // Облека и додатоци - Чевли - Машка
            new()
            {
                Name = "Nike Air Max - Машка",
                Description = "Спортски чевли Nike Air Max за мажи. Бела боја, размер 42, перфектни за трчање.",
                PictureUrl = "/images/products/sb-ts1.png",
                Type = "Clothing & Accessories - Shoes - Male",
                Condition = "Functional",
                CargoDelivery = false,
                Delivery = "[\"Pick up only\"]"
            },
            // Облека и додатоци - Чевли - Женска
            new()
            {
                Name = "Adidas Stan Smith - Женска",
                Description = "Класични Adidas Stan Smith чевли за жени. Бела боја, размер 38, универзални за секојдневна употреба.",
                PictureUrl = "/images/products/hat-core1.png",
                Type = "Clothing & Accessories - Shoes - Female",
                Condition = "Good",
                CargoDelivery = true,
                Delivery = "[\"Pick up only\", \"Can deliver\"]"
            },
            new()
            {
                Name = "iPhone 15 Pro",
                Description = "Најнов iPhone 15 Pro со најдобри камери и најбрз процесор. 256GB меморија, сина боја.",
                PictureUrl = "/images/products/Smart_Watch.jpg",
                Type = "Appliances & Electronics - Electronics",
                Condition = "Like New",
                CargoDelivery = true,
                Delivery = "[\"Can deliver\"]"
            },
            // Спорт и рекреација - Велосипеди
            new()
            {
                Name = "Trek горски велосипед",
                Description = "Професионален горски велосипед од Trek. 21 брзини, диск кочници, црна боја.",
                PictureUrl = "/images/products/glove-react1.png",
                Type = "Sports & Outdoors - Bicycles",
                Condition = "Good",
                CargoDelivery = false,
                Delivery = "[\"Pick up only\"]"
            },
            // Спорт и рекреација - Вежбање
            new()
            {
                Name = "Bowflex тежински сет",
                Description = "Комплетен тежински сет за дома. Вклучува гантели, штанга и клупи за сестрани вежби.",
                PictureUrl = "/images/products/glove-react2.png",
                Type = "Sports & Outdoors - Exercise Equipment",
                Condition = "Like New",
                CargoDelivery = true,
                Delivery = "[\"Can deliver\"]"
            },
            // Книги и медиуми - Книги
            new()
            {
                Name = "Хари Потер - Философски камен",
                Description = "Класична книга Хари Потер и филозофскиот камен на македонски јазик. Тврди корици, одлично сочувана.",
                PictureUrl = "/images/products/Book.jpg",
                Type = "Books & Media - Books",
                Condition = "Good",
                CargoDelivery = true,
                Delivery = "[\"Pick up only\", \"Can deliver\"]"
            },
            // Автомобили и мотори - Автомобили
            new()
            {
                Name = "Toyota Corolla 2019",
                Description = "Надежен автомобил Toyota Corolla 2019 година. 1.6L мотор, автоматска менувачка, сива боја.",
                PictureUrl = "/images/products/boot-core2.png",
                Type = "Miscellaneous / Other",
                Condition = "Good",
                CargoDelivery = false,
                Delivery = "[\"Pick up only\"]"
            },
            // Работа и кариера - Опрема за работа
            new()
            {
                Name = "Ergonomic компјутерска столица",
                Description = "Ергономска столица за долгорочна работа на компјутер. Регулабилна висина, поддршка за грб.",
                PictureUrl = "/images/products/boot-core1.png",
                Type = "Miscellaneous / Other",
                Condition = "Like New",
                CargoDelivery = true,
                Delivery = "[\"Can deliver\"]"
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