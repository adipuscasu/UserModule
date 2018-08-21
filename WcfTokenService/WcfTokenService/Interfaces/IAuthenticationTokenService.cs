using System.ServiceModel;
using System.ServiceModel.Web;
using WcfTokenService.Contracts;
using WTS.Model.Security;

namespace WcfTokenService.Interfaces
{
    [ServiceContract(Namespace = "")]
    
    public interface IAuthenticationTokenService
    {
        [WebInvoke(Method = "POST", 
            RequestFormat = WebMessageFormat.Json, 
            ResponseFormat = WebMessageFormat.Json, 
            BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        [OperationContract]
        UserDataContract Authenticate(Credentials creds);
    }
}