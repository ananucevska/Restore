using API.Data;
using Microsoft.EntityFrameworkCore;
using SQLitePCL; // <- Make sure this is at the top

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt => 
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapControllers();
DbInitializer.InitDb(app);
app.Run();