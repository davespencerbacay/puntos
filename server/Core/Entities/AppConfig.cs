namespace Core.Entities
{
    public class AppConfig : BaseEntity
    {
        public required string Name { get; set; }
        public required string TagLine { get; set; }
        public required string LogoURL { get; set; }
    }
}