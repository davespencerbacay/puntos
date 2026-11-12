namespace API.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public int UserTypeId { get; set; }
        public string? UserTypeName { get; set; }
    }
}
