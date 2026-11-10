namespace Core.Specifications
{
    public class UserSpecParams
    {
        public List<string> _userTypes { get; set; } = [];
        public List<string> UserTypes
        {
            get => _userTypes;
            set
            {
                _userTypes = value.SelectMany(x => x.Split(',', StringSplitOptions.RemoveEmptyEntries)).ToList();
            }
        }

        public string? Sort { get; set; }
    }
}