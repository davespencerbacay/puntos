using System.Text.Json.Serialization;

namespace Core.Entities
{
    public class UserType : BaseEntity
    {
        public required string Name { get; set; }

        [JsonIgnore]
        public ICollection<User> Users { get; set; } = [];
    }
}
