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

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await context.Users.FindAsync(id);
        }

        public async Task<IReadOnlyList<User>> GetUsersAsync()
        {
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