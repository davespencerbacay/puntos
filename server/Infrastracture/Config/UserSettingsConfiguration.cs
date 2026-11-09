using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastracture.Config
{
    public class UserSettingsConfiguration : IEntityTypeConfiguration<UserSettings>
    {
        public void Configure(EntityTypeBuilder<UserSettings> builder)
        {
            builder.Property(us => us.UserId).IsRequired();
            builder.Property(us => us.IsProfilePrivate).HasDefaultValue(false);
            builder.Property(us => us.IsDarkModeEnabled).HasDefaultValue(false);
            builder.Property(us => us.CanReceiveEmailNotifications).HasDefaultValue(true);
            builder.Property(us => us.IsAutoLogoutEnabled).HasDefaultValue(true);
            builder.Property(us => us.IsTwoFactorAuthenticationEnabled).HasDefaultValue(false);
            builder.Property(us => us.IsLoginAlertsEnabled).HasDefaultValue(true);
            builder.Property(us => us.IsTransactionAlertsEnabled).HasDefaultValue(true);

            builder.HasOne(us => us.User)
                .WithOne(u => u.Settings)
                .HasForeignKey<UserSettings>(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}