using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    /*[Route("api/[controller]")] // https://localhost:5004/api/products
    [ApiController]*/
    public class ProductsController(StoreContext context, IMapper mapper, ImageService imageService, UserManager<User> userManager) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts([FromQuery]ProductParams productParams) // ? znaci optional
        {
            var query = context.Products
                /*
                .Sort(productParams.OrderBy)
                */
                .Search(productParams.SearchTerm)
                .Filter(productParams.Types)
                .AsQueryable();
            var products = await PagedList<Product>.ToPagedList(query, 
                productParams.PageNumber, productParams.PageSize);
            
            Response.AddPaginationHeader(products.Metadata);
            return products;
        }

        [HttpGet("{id}")] // api/products/2
        public async Task<ActionResult<ProductWithCreatorDto>> GetProduct(int id)
        {
            var product = await context.Products
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            var currentUser = await userManager.GetUserAsync(User);
            var isSaved = false;
            var saveCount = await context.Saves.CountAsync(s => s.ProductId == id);

            if (currentUser != null)
            {
                isSaved = await context.Saves
                    .AnyAsync(s => s.UserId == currentUser.Id && s.ProductId == id);
            }

            var productDto = new ProductWithCreatorDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                PictureUrl = product.PictureUrl,
                Type = product.Type,
                QuantityInStock = product.QuantityInStock,
                PublicId = product.PublicId,
                UserId = product.UserId,
                CreatorName = product.User?.Name,
                CreatorCity = product.User?.City,
                CreatorMunicipality = product.User?.Municipality,
                CreatorNaselba = product.User?.Naselba,
                CreatedDate = product.CreatedDate,
                IsSaved = isSaved,
                SaveCount = saveCount
            };

            return productDto;
        }

        [HttpGet("filters")]
        public async Task<ActionResult> GetFilters()
        {
            var types = await context.Products.Select(x => x.Type).Distinct().ToListAsync();

            return Ok(new {types});
        }

        [Authorize]
        [HttpGet("my-products")]
        public async Task<ActionResult<List<Product>>> GetMyProducts([FromQuery]ProductParams productParams)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var query = context.Products
                .Where(p => p.UserId == user.Id)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Types)
                .AsQueryable();
            
            var products = await PagedList<Product>.ToPagedList(query, 
                productParams.PageNumber, productParams.PageSize);
            
            Response.AddPaginationHeader(products.Metadata);
            return products;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var product = mapper.Map<Product>(productDto);
            product.UserId = user.Id;

            if (productDto.File != null)
            {
                var imageResult = await imageService.AddImageAsync(productDto.File);

                if (imageResult.Error != null)
                {
                    return BadRequest(imageResult.Error.Message);
                }

                product.PictureUrl = imageResult.SecureUrl.AbsoluteUri;
                product.PublicId = imageResult.PublicId;
            }
            
            context.Products.Add(product);
            
            var result = await context.SaveChangesAsync() > 0;
            
            if (result) return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            
            return BadRequest("Problem creating new product");
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct(UpdateProductDto updateProductDto)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var product = await context.Products.FindAsync(updateProductDto.Id);
            
            if (product == null) return NotFound();
            if (product.UserId != user.Id) return Forbid();
            
            mapper.Map(updateProductDto, product);

            if (updateProductDto.File != null)
            {
                var imageResult = await imageService.AddImageAsync (updateProductDto.File);
                
                if (imageResult.Error != null) 
                    return BadRequest(imageResult.Error.Message);
                
                if (!string.IsNullOrEmpty(product.PublicId))
                    await imageService.DeleteImageAsync(product.PublicId);
                
                product.PictureUrl = imageResult.SecureUrl.AbsoluteUri;
                product.PublicId = imageResult.PublicId;
            }
            
            var result = await context.SaveChangesAsync() > 0;
            
            if (result) return NoContent();
            
            return BadRequest("Problem updating product");
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var product = await context.Products.FindAsync(id);
            
            if (product == null) return NotFound();
            if (product.UserId != user.Id) return Forbid();
            
            if (!string.IsNullOrEmpty(product.PublicId))
                await imageService.DeleteImageAsync(product.PublicId);
            
            context.Products.Remove(product);
            
            var result = await context.SaveChangesAsync() > 0;
            
            if (result) return Ok();
            
            return BadRequest("Problem deleting the product");
        }

        [Authorize]
        [HttpPost("{id}/save")]
        public async Task<ActionResult> SaveProduct(int id)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var product = await context.Products.FindAsync(id);
            if (product == null) return NotFound();

            var existingSave = await context.Saves
                .FirstOrDefaultAsync(s => s.UserId == user.Id && s.ProductId == id);

            if (existingSave != null)
            {
                return BadRequest("Product already saved");
            }

            var save = new Save
            {
                UserId = user.Id,
                ProductId = id
            };

            context.Saves.Add(save);
            await context.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpDelete("{id}/save")]
        public async Task<ActionResult> UnsaveProduct(int id)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var save = await context.Saves
                .FirstOrDefaultAsync(s => s.UserId == user.Id && s.ProductId == id);

            if (save == null)
            {
                return BadRequest("Product not saved");
            }

            context.Saves.Remove(save);
            await context.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpGet("saved")]
        public async Task<ActionResult<List<ProductWithCreatorDto>>> GetSavedProducts([FromQuery]ProductParams productParams)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var query = context.Saves
                .Where(s => s.UserId == user.Id)
                .Include(s => s.Product)
                .ThenInclude(p => p.User)
                .Select(s => s.Product)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Types)
                .AsQueryable();

            var products = await PagedList<Product>.ToPagedList(query, 
                productParams.PageNumber, productParams.PageSize);

            var productDtos = products.Select(p => new ProductWithCreatorDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                PictureUrl = p.PictureUrl,
                Type = p.Type,
                QuantityInStock = p.QuantityInStock,
                PublicId = p.PublicId,
                UserId = p.UserId,
                CreatorName = p.User?.Name,
                CreatorCity = p.User?.City,
                CreatorMunicipality = p.User?.Municipality,
                CreatorNaselba = p.User?.Naselba,
                CreatedDate = p.CreatedDate,
                IsSaved = true,
                SaveCount = context.Saves.Count(s => s.ProductId == p.Id)
            }).ToList();

            Response.AddPaginationHeader(products.Metadata);
            return productDtos;
        }
    }
}