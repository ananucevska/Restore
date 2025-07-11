namespace API.RequestHelpers;
//objekt za parametrite od kontrolerot za metodot  public async Task<ActionResult<List<Product>>> GetProducts()
//da ne gi davame direktno deka se mnogu i moze da zakoci ili neso
public class ProductParams : PaginationParams
{
    public string? OrderBy { get; set; }
    public string? SearchTerm { get; set; }
    public string? Brands { get; set; }
    public string? Types { get; set; }
}