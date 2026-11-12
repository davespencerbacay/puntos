using Core.Entities;

namespace Core.Specifications
{
    public class UserSpecification : BaseSpecification<User>
    {
        public UserSpecification(int id) : base(x => x.Id == id)
        {
            AddInclude(x => x.UserType);
        }

        public UserSpecification(UserSpecParams userSpecParams) : base(x =>
            (string.IsNullOrEmpty(userSpecParams.Search) || x.FirstName.ToLower().Contains(userSpecParams.Search) || x.LastName.ToLower().Contains(userSpecParams.Search)) &&
            (!userSpecParams.UserTypeId.HasValue || x.UserTypeId == userSpecParams.UserTypeId) &&
            (userSpecParams.UserTypes.Count == 0 || userSpecParams.UserTypes.Contains(x.UserTypeId.ToString())))
        {
            AddInclude(x => x.UserType);
            ApplyPaging(userSpecParams.PageSize * (userSpecParams.PageIndex - 1), userSpecParams.PageSize);

            if (!string.IsNullOrWhiteSpace(userSpecParams.Sort))
            {
                switch (userSpecParams.Sort.ToLower())
                {
                    case "asc":
                        AddOrderBy(x => x.Id);
                        break;
                    case "desc":
                        AddOrderByDescending(x => x.Id);
                        break;
                    default:
                        AddOrderBy(x => x.Id);
                        break;
                }
            }
            else
            {
                AddOrderBy(x => x.Id);
            }
        }
    }
}