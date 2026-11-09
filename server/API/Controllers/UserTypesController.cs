using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserTypesController(IUserTypeRepository userTypeRepository) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UserType>>> GetUserTypes()
    {
        return Ok(await userTypeRepository.GetUserTypesAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserType>> GetUserType(int id)
    {
        var userType = await userTypeRepository.GetUserTypeByIdAsync(id);
        if (userType == null)
        {
            return NotFound();
        }

        return userType;
    }

    [HttpPost]
    public async Task<ActionResult<UserType>> CreateUserType(UserType userType)
    {
        userTypeRepository.AddUserType(userType);
        if (await userTypeRepository.SaveChangesAsync())
        {
            return CreatedAtAction(nameof(GetUserType), new { id = userType.Id }, userType);
        }

        return BadRequest("[UserTypes] Problem creating user type.");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUserType(int id, UserType userType)
    {
        if (id != userType.Id || !userTypeRepository.UserTypeExists(id))
        {
            return BadRequest(userType.Id);
        }

        userTypeRepository.UpdateUserType(userType);

        if (await userTypeRepository.SaveChangesAsync())
        {
            return NoContent();
        }

        return BadRequest("[UserTypes] Problem updating user type.");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUserType(int id)
    {
        var userType = await userTypeRepository.GetUserTypeByIdAsync(id);
        if (userType == null)
        {
            return NotFound("[UserTypes] User type not found.");
        }

        userTypeRepository.DeleteUserType(userType);
        if (await userTypeRepository.SaveChangesAsync())
        {
            return NoContent();
        }

        return BadRequest("[UserTypes] Problem deleting user type.");
    }
}
