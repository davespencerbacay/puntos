using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastracture.Data
{
    public class UserTypeRepository(StoreContext context) : IUserTypeRepository
    {
        private readonly StoreContext context = context;

        public void AddUserType(UserType userType)
        {
            context.UserTypes.Add(userType);
        }

        public void DeleteUserType(UserType userType)
        {
            context.UserTypes.Remove(userType);
        }

        public async Task<UserType?> GetUserTypeByIdAsync(int id)
        {
            return await context.UserTypes.FindAsync(id);
        }

        public async Task<IReadOnlyList<UserType>> GetUserTypesAsync()
        {
            return await context.UserTypes.ToListAsync();
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public void UpdateUserType(UserType userType)
        {
            context.Entry(userType).State = EntityState.Modified;
        }

        public bool UserTypeExists(int id)
        {
            return context.UserTypes.Any(u => u.Id == id);
        }
    }
}
