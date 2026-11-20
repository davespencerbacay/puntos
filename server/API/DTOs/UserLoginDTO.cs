using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UserLoginDTO
    {

        [Required]
        public string EmailAddress { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}