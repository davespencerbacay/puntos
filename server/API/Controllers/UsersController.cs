using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IGenericRepository<User> userRepository) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<User>>> GetUsers([FromQuery] UserSpecParams userSpecParams)
    {
        var spec = new UserSpecification(userSpecParams);
        var users = await userRepository.ListAsync(spec);
        var count = await userRepository.CountAsync(spec);
        var pagination = new Pagination<User>(userSpecParams.PageIndex, userSpecParams.PageSize, count, users);
        return Ok(pagination);
    }

    [HttpGet("user-type/{userTypeId}")]
    public async Task<ActionResult<IReadOnlyList<User>>> GetUsersByUserType(int userTypeId)
    {
        var spec = new UserSpecification(new UserSpecParams { UserTypes = new List<string> { userTypeId.ToString() } });
        var users = await userRepository.ListAsync(spec);
        if (users.Count == 0)
        {
            return NotFound($"[Users] No users found for UserTypeId {userTypeId}.");
        }

        return Ok(users);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await userRepository.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return user;
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        userRepository.Add(user);
        if (await userRepository.SaveChangesAsync())
        {
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
        return BadRequest("[Users] Problem creating user.");
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, User user)
    {
        if (id != user.Id || !userRepository.Exists(id))
        {
            return BadRequest(user.Id);
        }

        userRepository.Update(user);

        if (await userRepository.SaveChangesAsync())
        {
            return NoContent();
        }

        return BadRequest("[Users] Problem updating user.");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await userRepository.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound("[Users] User not found.");
        }

        userRepository.Remove(user);
        if (await userRepository.SaveChangesAsync())
        {
            return NoContent();
        }

        return BadRequest("[Users] Problem deleting user.");
    }
}