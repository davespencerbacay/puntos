using System.Text.Json;
using Core.Entities;

namespace Infrastracture.Data.SeedData
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context)
        {
            if (!context.UserTypes.Any())
            {
                var userTypes = new List<UserType>
                {
                    new() { Name = "Customer" },
                    new() { Name = "Partner" },
                    new() { Name = "Business" }
                };

                context.UserTypes.AddRange(userTypes);
                await context.SaveChangesAsync();
            }

            if (!context.Users.Any())
            {
                var usersData = await File.ReadAllTextAsync(
                    "../Infrastracture/Data/SeedData/users.json"
                );

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var users = JsonSerializer.Deserialize<List<User>>(
                    usersData,
                    options
                ) ?? throw new Exception("Failed to deserialize users data.");

                foreach (var user in users)
                {
                    user.UserTypeId = 1;
                }

                context.Users.AddRange(users);

                await context.SaveChangesAsync();
            }
        }
    }
}