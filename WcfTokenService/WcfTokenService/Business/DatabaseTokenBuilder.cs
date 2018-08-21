using System;
using System.Linq;
using System.Security.Authentication;
using System.Security.Cryptography;
using WcfTokenService.Contracts;
using WcfTokenService.Database;
using WcfTokenService.Interfaces;
using WTS.Model.Security;

namespace WcfTokenService.Business
{
    public class DatabaseTokenBuilder : ITokenBuilder
    {
        public static int TokenSize = 100;
        private readonly UserTokenDbContext _DbContext;

        public DatabaseTokenBuilder(UserTokenDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        public UserDataContract Build(Credentials creds)
        {
            User userA = new DatabaseCredentialsValidator(_DbContext).IsValid(creds);
            if (null == userA)
            {
                throw new AuthenticationException();
            }
            var token = BuildSecureToken(TokenSize);
            var user = _DbContext.Users.SingleOrDefault(u => u.Username.Equals(creds.User, StringComparison.CurrentCultureIgnoreCase));
            _DbContext.Tokens.Add(new Token { TokenString = token, User = user, CreateDate = DateTime.Now });
            _DbContext.SaveChanges();
            UserDataContract jsonObject = new UserDataContract();
            jsonObject.token = token;
            jsonObject.Role = userA.Role.Trim();
            jsonObject.UserID = userA.Id;
            jsonObject.UserName = userA.Username;
            
            return jsonObject;
        }

        private string BuildSecureToken(int length)
        {
            var buffer = new byte[length];
            using (var rngCryptoServiceProvider = new RNGCryptoServiceProvider())
            {
                rngCryptoServiceProvider.GetNonZeroBytes(buffer);
            }
            return Convert.ToBase64String(buffer);
        }
    }
}