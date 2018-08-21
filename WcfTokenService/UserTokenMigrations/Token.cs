namespace UserTokenMigration
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Data.Entity.Infrastructure;


    public class TokenContext : DbContext 
    {
        public DbSet<Token> Tokens { get; set; }
    }
    [Table("Token")]
    public partial class Token
    {
        public int Id { get; set; }

        [Column("Token")]
        [Required]
        [StringLength(250)]
        public string TokenString { get; set; }

        public int UserId { get; set; }

        public DateTime CreateDate { get; set; }

        public virtual User User { get; set; }
    }
}
