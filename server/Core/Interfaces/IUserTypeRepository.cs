using Core.Entities;

namespace Core.Interfaces
{
    public interface IUserTypeRepository
    {
        Task<IReadOnlyList<UserType>> GetUserTypesAsync();
        Task<UserType?> GetUserTypeByIdAsync(int id);
        void AddUserType(UserType userType);
        void UpdateUserType(UserType userType);
        void DeleteUserType(UserType userType);
        bool UserTypeExists(int id);
        Task<bool> SaveChangesAsync();
    }
}
