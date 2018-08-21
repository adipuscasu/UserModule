using System;
using System.Linq;
using WcfTokenService.Interfaces;
using WcfTokenService.Database;
using WTS.Model.Security;

namespace WcfTokenService.Business
{
    public class DatabaseCredentialsValidator : ICredentialsValidator
    {
        private readonly UserTokenDbContext _DbContext;

        public DatabaseCredentialsValidator(UserTokenDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        public User IsValid(Credentials creds)
        {
            var user = _DbContext.Users.SingleOrDefault(u => u.Username.Equals(creds.User, StringComparison.CurrentCultureIgnoreCase));
            if(user != null && Hash.Compare(creds.Password, user.Salt, user.Password, Hash.DefaultHashType, Hash.DefaultEncoding))
            {
                return user;
            }
            return null;
        }
    }
}