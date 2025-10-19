using API.Entities;
using API.DTOs;
using System.Text.Json;

namespace API.Extensions;

public static class ProductExtensions
{
    /*public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
    {
        query = orderBy switch
        {
            "price" => query.OrderBy(x => x.Price),
            "priceDesc" => query.OrderByDescending(x => x.Price),
            _ => query.OrderBy(x => x.Name)
        };
        
        return query;
    }*/

    public static IQueryable<Product> Search(this IQueryable<Product> query, string? searchTerm)
    {
        if (string.IsNullOrEmpty(searchTerm)) return query;
        var lowerCaseSearchTerm  = searchTerm.Trim().ToLower();
        return query.Where(x => x.Name.ToLower().Contains(lowerCaseSearchTerm));
    }

    public static IQueryable<Product> Filter(this IQueryable<Product> query, string? types)
    {
        var typeList = new List<string>();

        if (!string.IsNullOrEmpty(types))
        {
            typeList.AddRange([.. types.ToLower().Split(",")]);
        }
        
        query = query.Where(x => typeList.Count == 0 || typeList.Contains(x.Type.ToLower()));

        return query;
    }

    public static IQueryable<Product> FilterByCategories(this IQueryable<Product> query, string? selectedCategoriesJson)
    {
        if (string.IsNullOrEmpty(selectedCategoriesJson)) return query;

        try
        {
            var selectedCategories = JsonSerializer.Deserialize<List<SelectedCategoryDto>>(selectedCategoriesJson);
            
            if (selectedCategories == null || selectedCategories.Count == 0) return query;

            // Build a list of type patterns to match
            var typePatterns = new List<string>();
            
            foreach (var selectedCategory in selectedCategories)
            {
                // Map category IDs to their corresponding values
                var categoryValue = MapCategoryIdToValue(selectedCategory.CategoryId);
                var subcategoryValue = !string.IsNullOrEmpty(selectedCategory.SubcategoryId) 
                    ? MapSubcategoryIdToValue(selectedCategory.CategoryId, selectedCategory.SubcategoryId) 
                    : null;
                
                // If there's a subcategory, add the combined pattern
                if (!string.IsNullOrEmpty(subcategoryValue))
                {
                    // If there are also tags, combine subcategory with each tag
                    if (selectedCategory.Tags != null && selectedCategory.Tags.Count > 0)
                    {
                        foreach (var tag in selectedCategory.Tags)
                        {
                            var mappedTag = MapTagToValue(tag);
                            typePatterns.Add($"{categoryValue} - {subcategoryValue} - {mappedTag}");
                        }
                    }
                    else
                    {
                        typePatterns.Add($"{categoryValue} - {subcategoryValue}");
                    }
                }
                // If there are tags but no subcategory, add the combined patterns
                else if (selectedCategory.Tags != null && selectedCategory.Tags.Count > 0)
                {
                    foreach (var tag in selectedCategory.Tags)
                    {
                        var mappedTag = MapTagToValue(tag);
                        typePatterns.Add($"{categoryValue} - {mappedTag}");
                    }
                }
                // If no subcategory and no tags, add patterns for all products in this category
                else
                {
                    // Add the main category pattern
                    typePatterns.Add(categoryValue);
                    
                    // For categories with tags, if no specific tags are selected,
                    // show all products (both male and female) by default
                    var categoryHasTags = HasCategoryTags(selectedCategory.CategoryId);
                    if (categoryHasTags)
                    {
                        typePatterns.Add($"{categoryValue} - Male");
                        typePatterns.Add($"{categoryValue} - Female");
                    }
                }
            }
            
            // Filter products that match any of the type patterns
            if (typePatterns.Any())
            {
                query = query.Where(x => typePatterns.Any(pattern => 
                    x.Type.ToLower() == pattern.ToLower()));
            }

            return query;
        }
        catch (JsonException)
        {
            // If JSON parsing fails, return the original query
            return query;
        }
    }

    private static string MapCategoryIdToValue(string categoryId)
    {
        return categoryId switch
        {
            "furniture" => "Furniture",
            "appliances-electronics" => "Appliances & Electronics",
            "sports-outdoors" => "Sports & Outdoors",
            "books-media" => "Books & Media",
            "baby-kids" => "Baby & Kids",
            "clothing-accessories" => "Clothing & Accessories",
            "technology-electronics" => "Technology & Electronics",
            "home-garden" => "Home & Garden",
            "home-kitchen" => "Home & Garden",
            "health-beauty" => "Health & Beauty",
            "automotive" => "Automotive",
            _ => categoryId
        };
    }

    private static string MapSubcategoryIdToValue(string categoryId, string subcategoryId)
    {
        // Map subcategory IDs to their display names
        return subcategoryId switch
        {
            "clothing" => "Clothing",
            "shoes" => "Shoes",
            "accessories" => "Accessories",
            "baby-clothes" => "Baby Clothes",
            "kids-clothes" => "Kids Clothes",
            "computers" => "Computers",
            "phones" => "Phones",
            "furniture" => "Furniture",
            "curtains" => "Curtains",
            "pillows" => "Pillows",
            "appliances" => "Appliances",
            "sports" => "Sports",
            "books" => "Books",
            "cds-dvds" => "CDs/DVDs",
            "magazines" => "Magazines",
            "board-games" => "Board Games",
            "health" => "Health",
            "automotive" => "Automotive",
            _ => subcategoryId
        };
    }
    
    private static string MapTagToValue(string tag)
    {
        return tag switch
        {
            "male" => "Male",
            "female" => "Female",
            _ => tag
        };
    }
    
    private static bool HasCategoryTags(string categoryId)
    {
        // Only these categories have male/female tags
        return categoryId switch
        {
            "clothing-accessories" => true,
            "baby-kids" => true,
            _ => false
        };
    }

    public static IQueryable<Product> FilterBySelectedFilters(this IQueryable<Product> query, string? selectedFiltersJson)
    {
        if (string.IsNullOrEmpty(selectedFiltersJson)) return query;

        try
        {
            var selectedFilters = JsonSerializer.Deserialize<SelectedFiltersDto>(selectedFiltersJson);
            if (selectedFilters == null) return query;

            // Filter by condition options
            if (selectedFilters.Condition != null && selectedFilters.Condition.Count > 0)
            {
                query = query.Where(x => x.Condition != null && selectedFilters.Condition.Contains(x.Condition));
            }

            // Filter by delivery options
            if (selectedFilters.Delivery != null && selectedFilters.Delivery.Count > 0)
            {
                var hasDeliveryFilter = selectedFilters.Delivery.Contains("Can deliver");
                var hasPickupOnlyFilter = selectedFilters.Delivery.Contains("Pick up only");

                if (hasDeliveryFilter && hasPickupOnlyFilter)
                {
                    // If both options are selected, show all products
                    // No additional filtering needed
                }
                else if (hasDeliveryFilter)
                {
                    // Only show products that can be delivered
                    query = query.Where(x => x.CargoDelivery == true);
                }
                else if (hasPickupOnlyFilter)
                {
                    // Only show products that require pickup
                    query = query.Where(x => x.CargoDelivery == false);
                }
            }

            return query;
        }
        catch (JsonException)
        {
            // If JSON parsing fails, return the original query
            return query;
        }
    }
}