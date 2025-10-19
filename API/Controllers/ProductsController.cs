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
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController(StoreContext context, IMapper mapper, ImageService imageService, UserManager<User> userManager) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<ProductWithCreatorDto>>> GetProducts([FromQuery]ProductParams productParams) // ? znaci optional
        {
            var query = context.Products
                .Include(p => p.User)
                /*
                .Sort(productParams.OrderBy)
                */
                .Search(productParams.SearchTerm)
                .Filter(productParams.Types)
                .FilterByCategories(productParams.SelectedCategories)
                .FilterBySelectedFilters(productParams.SelectedFilters)
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
                PublicId = p.PublicId,
                UserId = p.UserId,
                CreatorName = p.User?.Name,
                CreatorCity = p.User?.City,
                CreatorMunicipality = p.User?.Municipality,
                CreatorNeighborhood = p.User?.Neighborhood,
                CreatedDate = p.CreatedDate,
                IsSaved = false, // Will be set by frontend if needed
                SaveCount = 0, // Will be set by frontend if needed
                CargoDelivery = p.CargoDelivery,
                Condition = p.Condition,
                Delivery = p.Delivery,
                Images = new List<ProductImageDto>() // Will be loaded separately if needed
            }).ToList();
            
            Response.AddPaginationHeader(products.Metadata);
            return productDtos;
        }

        [HttpGet("{id}")] // api/products/2
        public async Task<ActionResult<ProductWithCreatorDto>> GetProduct(int id)
        {
            var product = await context.Products
                .Include(p => p.User)
                .Include(p => p.Images)
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
                PublicId = product.PublicId,
                UserId = product.UserId,
                CreatorName = product.User?.Name,
                CreatorCity = product.User?.City,
                CreatorMunicipality = product.User?.Municipality,
                CreatorNeighborhood = product.User?.Neighborhood,
                CreatedDate = product.CreatedDate,
                IsSaved = isSaved,
                SaveCount = saveCount,
                CargoDelivery = product.CargoDelivery,
                Condition = product.Condition,
                Delivery = product.Delivery,
                Images = product.Images.Select(img => new ProductImageDto
                {
                    Id = img.Id,
                    Url = img.Url,
                    PublicId = img.PublicId,
                    Order = img.Order
                }).OrderBy(img => img.Order).ToList()
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
                .Include(p => p.Images)
                .Where(p => p.UserId == user.Id)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Types)
                .FilterByCategories(productParams.SelectedCategories)
                .FilterBySelectedFilters(productParams.SelectedFilters)
                .AsQueryable();
            
            var products = await PagedList<Product>.ToPagedList(query, 
                productParams.PageNumber, productParams.PageSize);
            
            Response.AddPaginationHeader(products.Metadata);
            return products;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            // Check if at least one file is provided
            var files = new[] { 
                productDto.File, productDto.File2, productDto.File3, productDto.File4, productDto.File5,
                productDto.File6, productDto.File7, productDto.File8, productDto.File9, productDto.File10
            }.Where(f => f != null).ToArray();

            if (files.Length == 0)
            {
                return BadRequest(new { message = "At least one image is required" });
            }

            var product = mapper.Map<Product>(productDto);
            product.UserId = user.Id;

            // Handle main image (first file)
            var mainFile = files[0];
            var imageResult = await imageService.AddImageAsync(mainFile);

            if (imageResult.Error != null)
            {
                return BadRequest(imageResult.Error.Message);
            }

            product.PictureUrl = imageResult.SecureUrl.AbsoluteUri;
            product.PublicId = imageResult.PublicId;
            
            context.Products.Add(product);
            await context.SaveChangesAsync(); // Save first to get the product ID
            
            // Handle all images (including the main one)
            for (int i = 0; i < files.Length; i++)
            {
                var file = files[i];
                var additionalImageResult = await imageService.AddImageAsync(file);

                if (additionalImageResult.Error != null)
                {
                    return BadRequest(additionalImageResult.Error.Message);
                }

                var productImage = new ProductImage
                {
                    Url = additionalImageResult.SecureUrl.AbsoluteUri,
                    PublicId = additionalImageResult.PublicId,
                    ProductId = product.Id,
                    Order = i
                };

                context.ProductImages.Add(productImage);
            }
            
            var result = await context.SaveChangesAsync() > 0;
            
            if (result) return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            
            return BadRequest(new { message = "Problem creating new product" });
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProductDto updateProductDto)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            if (string.IsNullOrEmpty(updateProductDto.Id) || !int.TryParse(updateProductDto.Id, out int productId) || productId <= 0)
                return BadRequest(new { message = $"Invalid product ID: '{updateProductDto.Id}'" });

            var product = await context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == productId);
            
            if (product == null) return NotFound($"Product with ID {productId} not found");
            if (product.UserId != user.Id) return Forbid();

            
            // Update basic properties
            var hasChanges = false;
            
            if (product.Name != updateProductDto.Name)
            {
                product.Name = updateProductDto.Name;
                hasChanges = true;
            }
            
            if (product.Description != updateProductDto.Description)
            {
                product.Description = updateProductDto.Description;
                hasChanges = true;
            }
            
            if (product.Type != updateProductDto.Type)
            {
                product.Type = updateProductDto.Type;
                hasChanges = true;
            }
            
            if (product.CargoDelivery != updateProductDto.CargoDelivery)
            {
                product.CargoDelivery = updateProductDto.CargoDelivery;
                hasChanges = true;
            }
            
            if (product.Condition != updateProductDto.Condition)
            {
                product.Condition = updateProductDto.Condition;
                hasChanges = true;
            }
            
            if (product.Delivery != updateProductDto.Delivery)
            {
                product.Delivery = updateProductDto.Delivery;
                hasChanges = true;
            }

            // Handle multiple images
            var files = new[] 
            { 
                updateProductDto.File, updateProductDto.File2, updateProductDto.File3, 
                updateProductDto.File4, updateProductDto.File5, updateProductDto.File6,
                updateProductDto.File7, updateProductDto.File8, updateProductDto.File9, 
                updateProductDto.File10 
            }.Where(f => f != null).ToArray();


            if (files.Length > 0)
            {
                try
                {
                    hasChanges = true; // We have image changes
                    
                    // Delete existing images
                    foreach (var existingImage in product.Images)
                    {
                        if (!string.IsNullOrEmpty(existingImage.PublicId))
                            await imageService.DeleteImageAsync(existingImage.PublicId);
                    }
                    context.ProductImages.RemoveRange(product.Images);
                    
                    // Clear the collection to ensure EF detects the change
                    product.Images.Clear();

                    // Upload new images
                    var newImages = new List<ProductImage>();
                    for (int i = 0; i < files.Length; i++)
                    {
                        var imageResult = await imageService.AddImageAsync(files[i]);
                        
                        if (imageResult.Error != null) 
                            return BadRequest(new { message = $"Image upload error: {imageResult.Error.Message}" });
                        
                        var productImage = new ProductImage
                        {
                            Url = imageResult.SecureUrl.AbsoluteUri,
                            PublicId = imageResult.PublicId,
                            Order = i,
                            ProductId = product.Id
                        };
                        newImages.Add(productImage);
                    }

                    // Set the first image as the main picture
                    if (newImages.Count > 0)
                    {
                        if (product.PictureUrl != newImages[0].Url)
                        {
                            product.PictureUrl = newImages[0].Url;
                            hasChanges = true;
                        }
                        if (product.PublicId != newImages[0].PublicId)
                        {
                            product.PublicId = newImages[0].PublicId;
                            hasChanges = true;
                        }
                    }

                    // Add new images to the collection
                    foreach (var image in newImages)
                    {
                        product.Images.Add(image);
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = $"Error processing images: {ex.Message}" });
                }
            }
            
            try
            {
                if (!hasChanges)
                {
                    return BadRequest(new { message = "No changes detected to save" });
                }
                
                var result = await context.SaveChangesAsync() > 0;
                
                if (result) return NoContent();
                
                return BadRequest(new { message = "Problem updating product - no changes saved" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Database error: {ex.Message}" });
            }
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
            
            return BadRequest(new { message = "Problem deleting the product" });
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
                return BadRequest(new { message = "Product already saved" });
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
                return BadRequest(new { message = "Product not saved" });
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
                .FilterByCategories(productParams.SelectedCategories)
                .FilterBySelectedFilters(productParams.SelectedFilters)
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
                PublicId = p.PublicId,
                UserId = p.UserId,
                CreatorName = p.User?.Name,
                CreatorCity = p.User?.City,
                CreatorMunicipality = p.User?.Municipality,
                CreatorNeighborhood = p.User?.Neighborhood,
                CreatedDate = p.CreatedDate,
                IsSaved = true,
                SaveCount = context.Saves.Count(s => s.ProductId == p.Id),
                CargoDelivery = p.CargoDelivery,
                Condition = p.Condition,
                Delivery = p.Delivery
            }).ToList();

            Response.AddPaginationHeader(products.Metadata);
            return productDtos;
        }
    }
}