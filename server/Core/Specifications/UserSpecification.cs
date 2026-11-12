using Core.Entities;

namespace Core.Specifications
{
    public class UserSpecification : BaseSpecification<User>
    {
        public UserSpecification(UserSpecParams userSpecParams) : base(x => userSpecParams.UserTypes.Count == 0 || userSpecParams.UserTypes.Contains(x.UserTypeId.ToString()))
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