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
            // Бебиња и деца - Детска облека - Машка
            new()
            {
                Name = "Nike детска мајца - Машка",
                Description = "Комфортна детска мајца од Nike за активни момчиња. 100% памук, лесна за перење.",
                PictureUrl = "/images/products/sb-ang1.png",
                Type = "Baby & Kids - Kids Clothes - Male",
                Condition = "Like New",
                CargoDelivery = true,
                Delivery = "[\"Pick up only\", \"Can deliver\"]"
            },
            // Бебиња и деца - Детска облека - Женска
            new()
            {
                Name = "Adidas детска фустан - Женска",
                Description = "Убава детска фустан од Adidas за активни девојчиња. Современ дизајн и удобност.",
                PictureUrl = "/images/products/sb-ang2.png",
                Type = "Baby & Kids - Kids Clothes - Female",
                Condition = "Good",
                CargoDelivery = false,
                Delivery = "[\"Pick up only\"]"
            },
            // Бебиња и деца - Бебешка облека - Машка
            new()
            {
                Name = "H&M бебешка комбинезон - Машка",
                Description = "Мека бебешка комбинезон за новороденчиња. Органски памук, без штетни хемикалии.",
                PictureUrl = "/images/products/sb-core1.png",
                Type = "Baby & Kids - Baby Clothes - Male",
                Condition = "Like New",
                CargoDelivery = true,
                Delivery = "[\"Can deliver\"]"
            },
            // Облека и додатоци - Облека - Машка
            new()
            {
                Name = "Levi's фармерки - Машка",
                Description = "Класични Levi's фармерки за мажи. 501 модел, сина боја, размер 32/34.",
                PictureUrl = "/images/products/sb-core2.png",
                Type = "Clothing & Accessories - Clothing - Male",
                Condition = "Good",
                CargoDelivery = true,
                Delivery = "[\"Pick up only\", \"Can deliver\"]"
            },
            // Облека и додатоци - Облека - Женска
            new()
            {
                Name = "Zara фустан - Женска",
                Description = "Елегантен летен фустан од Zara. Црна боја, размер M, перфектен за официјални настани.",
                PictureUrl = "/images/products/sb-react1.png",
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
            // Технологија и електроника - Компјутери
            new()
            {
                Name = "Dell Laptop Inspiron 15",
                Description = "Моќен лаптоп Dell Inspiron 15 за работа и забава. Intel i7 процесор, 16GB RAM, 512GB SSD.",
                PictureUrl = "/images/products/hat-react1.png",
                Type = "Technology & Electronics - Computers",
                Condition = "Like New",
                CargoDelivery = false,
                Delivery = "[\"Pick up only\"]"
            },
            // Технологија и електроника - Телефони
            new()
            {
                Name = "iPhone 15 Pro",
                Description = "Најнов iPhone 15 Pro со најдобри камери и најбрз процесор. 256GB меморија, сина боја.",
                PictureUrl = "/images/products/hat-react2.png",
                Type = "Technology & Electronics - Phones",
                Condition = "Like New",
                CargoDelivery = true,
                Delivery = "[\"Can deliver\"]"
            },
            // Дом и градина - Мебел
            new()
            {
                Name = "IKEA кревет за спална соба",
                Description = "Модерен кревет од IKEA за спална соба. Бела боја, размер 160x200cm, со полици.",
                PictureUrl = "/images/products/glove-code1.png",
                Type = "Home & Garden - Furniture",
                Condition = "Good",
                CargoDelivery = false,
                Delivery = "[\"Pick up only\"]"
            },
            // Дом и градина - Домаќински апарати
            new()
            {
                Name = "Bosch фрижидер",
                Description = "Енергетски ефикасен фрижидер од Bosch. 300L капацитет, A+++ енергетска класа, сива боја.",
                PictureUrl = "/images/products/glove-code2.png",
                Type = "Home & Garden - Appliances",
                Condition = "Functional",
                CargoDelivery = true,
                Delivery = "[\"Pick up only\", \"Can deliver\"]"
            },
            // Спорт и рекреација - Велосипеди
            new()
            {
                Name = "Trek горски велосипед",
                Description = "Професионален горски велосипед од Trek. 21 брзини, диск кочници, црна боја.",
                PictureUrl = "/images/products/glove-react1.png",
                Type = "Sports & Recreation - Bicycles",
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
                Type = "Sports & Recreation - Exercise Equipment",
                Condition = "Like New",
                CargoDelivery = true,
                Delivery = "[\"Can deliver\"]"
            },
            // Книги и медиуми - Книги
            new()
            {
                Name = "Хари Потер - Философски камен",
                Description = "Класична книга Хари Потер и филозофскиот камен на македонски јазик. Тврди корици, одлично сочувана.",
                PictureUrl = "/images/products/boot-redis1.png",
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
                Type = "Cars & Motorcycles - Cars",
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
                Type = "Work & Career - Office Equipment",
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