namespace Core.Entities
{
    public class UserType : BaseEntity
    {
        public required string Name { get; set; }
        public ICollection<User> Users { get; set; } = [];
    }
}