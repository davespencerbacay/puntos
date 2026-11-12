using API.DTOs;
using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IGenericRepository<User> userRepository, IGenericRepository<UserType> userTypeRepository) : BaseApiController
{

    [HttpGet]
    public async Task<ActionResult<Pagination<UserDTO>>> GetUsers([FromQuery] UserSpecParams userSpecParams)
    {
        var spec = new UserSpecification(userSpecParams);
        return await CreatePagedResult(userRepository, spec, userSpecParams.PageIndex, userSpecParams.PageSize, u => u.ToDto());
    }

    [HttpGet("user-type/{userTypeId}")]
    public async Task<ActionResult<IReadOnlyList<UserDTO>>> GetUsersByUserType(int userTypeId)
    {
        var spec = new UserSpecification(new UserSpecParams { UserTypes = new List<string> { userTypeId.ToString() } });
        var users = await userRepository.ListAsync(spec);
        if (users.Count == 0)
        {
            return NotFound($"[Users] No users found for UserTypeId {userTypeId}.");
        }

        return Ok(users.Select(u => u.ToDto()).ToList());
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDTO>> GetUser(int id)
    {
        var user = await userRepository.GetEntityWithSpec(new UserSpecification(id));
        if (user == null)
        {
            return NotFound();
        }
        return user.ToDto();
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> CreateUser(UserRegisterDTO userRegisterDto)
    {
        var userType = await userTypeRepository.GetByIdAsync(userRegisterDto.UserTypeId);
        if (userType == null)
        {
            return BadRequest($"[Users] UserTypeId {userRegisterDto.UserTypeId} does not exist.");
        }

        var user = userRegisterDto.ToEntity(userType);
        userRepository.Add(user);
        if (await userRepository.SaveChangesAsync())
        {
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user.ToDto());
        }
        return BadRequest("[Users] Problem creating user.");
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UserUpdateDTO userUpdateDto)
    {
        var user = await userRepository.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound("[Users] User not found.");
        }

        var userType = await userTypeRepository.GetByIdAsync(userUpdateDto.UserTypeId);
        if (userType == null)
        {
            return BadRequest($"[Users] UserTypeId {userUpdateDto.UserTypeId} does not exist.");
        }

        user.UpdateFromDto(userUpdateDto, userType);
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
