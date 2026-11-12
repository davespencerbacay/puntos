using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UserUpdateDTO
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public string Avatar { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string EmailAddress { get; set; } = string.Empty;

        [Required]
        public int UserTypeId { get; set; }
    }
}
