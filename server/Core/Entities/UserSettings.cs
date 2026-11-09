namespace Core.Entities
{
    public class UserSettings : BaseEntity
    {
        public int UserId { get; set; }
        public bool IsProfilePrivate { get; set; } = false;
        public bool IsDarkModeEnabled { get; set; } = false;
        public bool CanReceiveEmailNotifications { get; set; } = true;
        public bool IsAutoLogoutEnabled { get; set; } = true;
        public bool IsTwoFactorAuthenticationEnabled { get; set; } = false;
        public bool IsLoginAlertsEnabled { get; set; } = true;
        public bool IsTransactionAlertsEnabled { get; set; } = true;
        public User User { get; set; } = null!;
    }
}