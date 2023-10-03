using Microsoft.EntityFrameworkCore;
using test1.Model;

namespace test1.Context
{
    public class TestContext : DbContext
    {
        public TestContext(DbContextOptions<TestContext> options) : base(options)
        {
        }

        public DbSet<UserTable> UserTable { get; set; }
        public DbSet<TaskList> TaskList { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<Project> Project { get; set; }
        public DbSet<TaskCategory> TaskCategory { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           
            modelBuilder.Entity<AuthorizedUser>()
                .Property(e => e.Id)
                .HasAnnotation("SqlServer:Identity", "100, 1"); 
        }
        public DbSet<AuthorizedUser> AuthorizedUser { get; set; }

    }
}