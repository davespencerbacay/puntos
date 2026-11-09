using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastracture.Config
{
    public class UserTypeConfiguration : IEntityTypeConfiguration<UserType>
    {
        public void Configure(EntityTypeBuilder<UserType> builder)
        {
            builder.Property(u => u.Id).IsRequired();
            builder.Property(u => u.Name).IsRequired();
        }
    }
}