using System.Text.Json;
using Core.Entities;

namespace Infrastracture.Data.SeedData
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context)
        {
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

                context.Users.AddRange(users);

                await context.SaveChangesAsync();
            }
        }
    }
}