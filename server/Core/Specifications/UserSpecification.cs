using Core.Entities;

namespace Core.Specifications
{
    public class UserSpecification : BaseSpecification<User>
    {
        public UserSpecification(int userTypeId, string? sort)
            : base(x => x.UserTypeId == userTypeId)
        {
            if (!string.IsNullOrWhiteSpace(sort))
            {
                switch (sort.ToLower())
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