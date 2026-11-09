using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastracture.Data
{
    public class UserRepository(StoreContext context) : IUserRepository
    {
        private readonly StoreContext context = context;

        public void AddUser(User user)
        {
            context.Users.Add(user);
        }

        public void DeleteUser(User user)
        {
            context.Users.Remove(user);
        }

        public async Task<IReadOnlyList<User>> GetUsersByUserTypeAsync(int userTypeId)
        {
            return await context.Users
                .Where(u => u.UserTypeId == userTypeId)
                .ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await context.Users.FindAsync(id);
        }

        public async Task<IReadOnlyList<User>> GetUsersAsync(int UserTypeId, string? sort)
        {
            if (!string.IsNullOrEmpty(sort))
            {
                if (sort.ToLower() == "asc")
                {
                    return await context.Users
                        .OrderBy(u => u.Id)
                        .ToListAsync();
                }
                else if (sort.ToLower() == "desc")
                {
                    return await context.Users
                        .OrderByDescending(u => u.Id)
                        .ToListAsync();
                }
            }

            if (UserTypeId > 0)
            {
                return await context.Users
                    .Where(u => u.UserTypeId == UserTypeId)
                    .ToListAsync();
            }
            return await context.Users.ToListAsync();
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public void UpdateUser(User user)
        {
            context.Entry(user).State = EntityState.Modified;
        }

        public bool UserExists(int id)
        {
            return context.Users.Any(u => u.Id == id);
        }
    }
}