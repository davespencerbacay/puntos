using Core.Entities;
using Infrastracture.Config;
using Microsoft.EntityFrameworkCore;

namespace Infrastracture.Data
{
    public class StoreContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(UserConfiguration).Assembly);
        }
    }
}
