using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(SignInManager<User> signInManager) : BaseApiController
{
    [HttpPost("register")]

    public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
    {
        // Validate password confirmation
        if (registerDto.Password != registerDto.ConfirmPassword)
        {
            ModelState.AddModelError("ConfirmPassword", "Password and confirm password do not match.");
            return ValidationProblem();
        }

        var user = new User
        {
            UserName = registerDto.Email, 
            Email = registerDto.Email, 
            City = registerDto.City, 
            Name = registerDto.Username,
            Municipality = registerDto.Municipality,
            Neighborhood = registerDto.Neighborhood
        };

        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }
        
        await signInManager.UserManager.AddToRoleAsync(user, "Member");
        
        return Ok();
    }
    
    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated == false) return NoContent();
        
        var user = await signInManager.UserManager.GetUserAsync(User);
        
        if (user  == null) return Unauthorized();
        
        var roles = await signInManager.UserManager.GetRolesAsync(user);

        return Ok(new
        {
            user.Id,
            user.Email,
            user.UserName,
            user.Name,
            user.City,
            user.Municipality,
            user.Neighborhood,
            Roles = roles
        });
    }

    [Authorize]
    [HttpPut("update-profile")]
    public async Task<ActionResult> UpdateProfile(UpdateProfileDto updateProfileDto)
    {
        var user = await signInManager.UserManager.GetUserAsync(User);
        
        if (user == null) return Unauthorized();
        
        user.Name = updateProfileDto.Name;
        user.City = updateProfileDto.City;
        user.Municipality = updateProfileDto.Municipality;
        user.Neighborhood = updateProfileDto.Neighborhood;
        
        var result = await signInManager.UserManager.UpdateAsync(user);
        
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();
        }
        
        return Ok();
    }

    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        
        return NoContent();
    }

}
