using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserRepository userRepository) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<User>>> GetUsers()
    {
        return Ok(await userRepository.GetUsersAsync());
    }

    [HttpGet("user-type/{userTypeId}")]
    public async Task<ActionResult<IReadOnlyList<User>>> GetUsersByUserType(int userTypeId)
    {
        var users = await userRepository.GetUsersByUserTypeAsync(userTypeId);
        if (users.Count == 0)
        {
            return NotFound($"[Users] No users found for UserTypeId {userTypeId}.");
        }

        return Ok(users);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await userRepository.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return user;
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        userRepository.AddUser(user);
        if (await userRepository.SaveChangesAsync())
        {
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
        return BadRequest("[Users] Problem creating user.");
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, User user)
    {
        if (id != user.Id || !userRepository.UserExists(id))
        {
            return BadRequest(user.Id);
        }

        userRepository.UpdateUser(user);

        if (await userRepository.SaveChangesAsync())
        {
            return NoContent();
        }

        return BadRequest("[Users] Problem updating user.");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await userRepository.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound("[Users] User not found.");
        }

        userRepository.DeleteUser(user);
        if (await userRepository.SaveChangesAsync())
        {
            return NoContent();
        }

        return BadRequest("[Users] Problem deleting user.");
    }
}