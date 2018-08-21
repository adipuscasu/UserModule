using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using WcfTokenService.Business;
using WcfTokenService.Contracts;
using WcfTokenService.Database;
using WcfTokenService.Interfaces;
using WTS.Model.Security;


namespace WcfTokenService.Services
{

    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AuthenticationTokenService : IAuthenticationTokenService
    {

        public UserDataContract Authenticate(Credentials creds)
        {
            if (creds == null && WebOperationContext.Current != null)
            {
                creds = new BasicAuth(WebOperationContext.Current.IncomingRequest.Headers["Authorization"]).Creds;
            }
            using (var dbContext = new UserTokenDbContext())
            {
                    return new DatabaseTokenBuilder(dbContext).Build(creds);                
            }
        }
    }
}
