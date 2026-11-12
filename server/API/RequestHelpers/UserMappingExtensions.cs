using API.DTOs;
using Core.Entities;

namespace API.RequestHelpers
{
    public static class UserMappingExtensions
    {
        public static UserDTO ToDto(this User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Avatar = user.Avatar,
                EmailAddress = user.EmailAddress,
                UserTypeId = user.UserTypeId,
                UserTypeName = user.UserType?.Name
            };
        }

        public static User ToEntity(this UserRegisterDTO dto, UserType userType)
        {
            return new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Avatar = dto.Avatar,
                EmailAddress = dto.EmailAddress,
                Password = dto.Password,
                UserTypeId = userType.Id,
                UserType = userType
            };
        }

        public static void UpdateFromDto(this User user, UserUpdateDTO dto, UserType userType)
        {
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Avatar = dto.Avatar;
            user.EmailAddress = dto.EmailAddress;
            user.UserTypeId = userType.Id;
            user.UserType = userType;
        }
    }
}
