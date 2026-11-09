using Core.Entities;

namespace Core.Interfaces
{
    public interface IUserRepository
    {
        Task<IReadOnlyList<User>> GetUsersAsync(int UserTypeId, string? sort);
        Task<User?> GetUserByIdAsync(int id);
        Task<IReadOnlyList<User>> GetUsersByUserTypeAsync(int userTypeId);
        void AddUser(User user);
        void UpdateUser(User user);
        void DeleteUser(User user);
        bool UserExists(int id);
        Task<bool> SaveChangesAsync();
    }
}