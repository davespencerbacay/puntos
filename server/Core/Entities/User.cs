namespace Core.Entities
{
    public class User : BaseEntity
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Avatar { get; set; }
        public required string EmailAddress { get; set; }
        public required string Password { get; set; }
        public int UserTypeId { get; set; }
        public required UserType UserType { get; set; }
        public UserSettings? Settings { get; set; }
    }
}