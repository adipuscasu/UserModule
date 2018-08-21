namespace WcfTokenService.Database
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("User")]
    public partial class User
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public User()
        {
            Tokens = new HashSet<Token>();
        }

        public int Id { get; set; }

        [Column("Username")]
        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        [StringLength(250)]
        public string Password { get; set; }

        [Required]
        [StringLength(250)]
        public string Salt { get; set; }

        [Required]
        [StringLength(50)]
        public string Role { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Token> Tokens { get; set; }
    }
}
