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
                    typePatterns.Add($"{categoryValue.ToLower()} - {subcategoryValue.ToLower()}");
                }
                // If there are tags, add the combined patterns
                else if (selectedCategory.Tags != null && selectedCategory.Tags.Count > 0)
                {
                    foreach (var tag in selectedCategory.Tags)
                    {
                        typePatterns.Add($"{categoryValue.ToLower()} - {tag.ToLower()}");
                    }
                }
                // If no subcategory and no tags, add patterns for all products in this category
                else
                {
                    // Add the main category pattern
                    typePatterns.Add(categoryValue.ToLower());
                    
                    // For categories with tags, if no specific tags are selected,
                    // show all products (both male and female) by default
                    var categoryHasTags = HasCategoryTags(selectedCategory.CategoryId);
                    if (categoryHasTags)
                    {
                        typePatterns.Add($"{categoryValue.ToLower()} - male");
                        typePatterns.Add($"{categoryValue.ToLower()} - female");
                    }
                }
            }
            
            // Filter products that match any of the type patterns
            query = query.Where(x => typePatterns.Contains(x.Type.ToLower()));

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
            "tv" => "TV",
            "audio" => "Audio",
            "computers" => "Computers",
            "computer-components" => "Computer components",
            "phones" => "Phones",
            "major-appliances" => "Major Appliances",
            "household-appliances" => "Household appliances",
            "sport-recreation" => "Sport and Recreation",
            "tools" => "Tools",
            "furniture" => "Furniture",
            "home-decor" => "Home decor",
            "clothing" => "Clothing",
            "shoes" => "Shoes",
            "accessories" => "Accessories",
            "cosmetics" => "Cosmetics",
            "miscellaneous" => "Miscellaneous",
            _ => categoryId
        };
    }

    private static string MapSubcategoryIdToValue(string categoryId, string subcategoryId)
    {
        if (categoryId == "major-appliances")
        {
            return subcategoryId switch
            {
                "fridges" => "Fridges",
                "washers-dryers" => "Washers/Dryers",
                "stoves" => "Stoves",
                "dishwashers" => "Dishwashers",
                "microwaves" => "Microwaves",
                "boilers" => "Boilers",
                _ => subcategoryId
            };
        }
        
        if (categoryId == "furniture")
        {
            return subcategoryId switch
            {
                "bedroom" => "Bedroom",
                "living-room" => "Living Room",
                "dining-room" => "Dining Room",
                "kids-room" => "Kids' room",
                "bath" => "Bath",
                "garden" => "Garden",
                _ => subcategoryId
            };
        }
        
        return subcategoryId;
    }
    
    private static bool HasCategoryTags(string categoryId)
    {
        // Only these categories have male/female tags
        return categoryId switch
        {
            "clothing" => true,
            "shoes" => true,
            "accessories" => true,
            _ => false
        };
    }
}