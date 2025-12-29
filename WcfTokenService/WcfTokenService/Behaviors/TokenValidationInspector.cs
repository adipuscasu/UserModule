using System.Net;
using System.Security.Authentication;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Dispatcher;
using System.ServiceModel.Web;
using WcfTokenService.Business;
using WcfTokenService.Database;
using WcfTokenService.Interfaces;

namespace WcfTokenService.Behaviors
{
    public class TokenValidationInspector : IDispatchMessageInspector
    {
        public object AfterReceiveRequest(ref Message request, IClientChannel channel, InstanceContext instanceContext)
        {
            // Return BadRequest if request is null
            if (WebOperationContext.Current == null) { throw new WebFaultException(HttpStatusCode.Unauthorized); }

            try
            {
                // Get Token from header
                var token = WebOperationContext.Current.IncomingRequest.Headers["Token"];
                if (!string.IsNullOrWhiteSpace(token))
                {
                    ValidateToken(token);
                }
                else
                {
                    ValidateBasicAuthentication();
                }
            }
            catch (WebFaultException err)
            {
                // Re-throw WebFaultException as-is (e.g., Forbidden from ValidateToken)
                // todo : log the error
                System.Diagnostics.Debug.WriteLine("Eroare generica la validarea token-ului: " + err.Message);
                throw new WebFaultException(HttpStatusCode.Unauthorized);
            }
            catch (AuthenticationException)
            {
                // Convert AuthenticationException to 401 Unauthorized
                throw new WebFaultException(HttpStatusCode.Unauthorized);
            }
            catch (System.Exception err)
            {
                // Catch any other unexpected exceptions and return 401
                System.Diagnostics.Debug.WriteLine("Eroare generica la validarea token-ului: " + err.Message);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }

            return null;
        }

        private static void ValidateToken(string token)
        {
            System.Diagnostics.Debug.WriteLine("Validate token cu valoarea : " + token);
            if (token != "signup")  //daca token include signup fac exceptie la regula validarii pentru noii utilizatori
            {
                using (var dbContext = new UserTokenDbContext())
                {
                    ITokenValidator validator = new DatabaseTokenValidator(dbContext);
                    if (!validator.IsValid(token))
                    {
                        throw new WebFaultException(HttpStatusCode.Forbidden);
                    }
                    // Add User ids to the header so the service has them if needed
                    //WebOperationContext.Current.IncomingRequest.Headers.Add("User", validator.Token.User.Username);
                    //WebOperationContext.Current.IncomingRequest.Headers.Add("UserId", validator.Token.User.Id.ToString());
                    //WebOperationContext.Current.OutgoingResponse.Headers.Add("User", validator.Token.User.Username.ToString());
                    //WebOperationContext.Current.OutgoingResponse.Headers.Add("UserId", validator.Token.User.Id.ToString());
                    //WebOperationContext.Current.OutgoingResponse.Headers.Add("Role", validator.Token.User.Role.ToString());
                }
            }
        }


        private static void ValidateBasicAuthentication()
        {
            var authorization = WebOperationContext.Current.IncomingRequest.Headers["Authorization"];
            if (!string.IsNullOrWhiteSpace(authorization))
            {
                using (var dbContext = new UserTokenDbContext())
                {
                    var basicAuth = new BasicAuth(authorization);
                    if (null == new DatabaseCredentialsValidator(dbContext).IsValid(basicAuth.Creds))
                    {
                        throw new AuthenticationException();
                    }
                }
            }
        }

        public void BeforeSendReply(ref Message reply, object correlationState)
        {
        }
    }
}