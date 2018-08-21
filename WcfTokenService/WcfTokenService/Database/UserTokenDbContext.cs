using System.Data.Entity;
using WTS.Model.Security;

namespace WcfTokenService.Database
{

    public partial class UserTokenDbContext : DbContext
    {
        public UserTokenDbContext()
            : base("name=UserTokenDbContext")
        {
        }

        public virtual DbSet<Token> Tokens { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(e => e.Role)
                .IsFixedLength();

            modelBuilder.Entity<User>()
                .HasMany(e => e.Tokens)
                .WithRequired(e => e.User)
                .WillCascadeOnDelete(false);
        }
    }
}
