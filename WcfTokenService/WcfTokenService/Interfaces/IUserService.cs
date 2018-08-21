using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using WTS.Model.Common;
using WTS.Model.Security;

namespace WcfTokenService.Interfaces
{
    [ServiceContract]
    public interface IUserService
    {
        [OperationContract]
        [WebInvoke(Method = "GET",
           RequestFormat = WebMessageFormat.Json,
           ResponseFormat = WebMessageFormat.Json)]
        List<User> GetAllUsers();

        [OperationContract]
        [WebInvoke(Method = "POST",
           RequestFormat = WebMessageFormat.Json,
           ResponseFormat = WebMessageFormat.Json, BodyStyle =WebMessageBodyStyle.WrappedRequest)]
        string HashPass(string pass, string salt);

        [OperationContract]
        [WebInvoke(Method = "POST",
           RequestFormat = WebMessageFormat.Json,
           ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        string AddUser(string userName, string password);

        [WebInvoke(Method = "GET",
           RequestFormat = WebMessageFormat.Json,
           ResponseFormat = WebMessageFormat.Json)]
        User GetUserDetails(string UserId);

        [OperationContract]
        [WebInvoke(Method = "POST",
           RequestFormat = WebMessageFormat.Json,
           ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        bool UpdateUser(string Id, string Username, string Password, string Role, string Salt);

        [OperationContract]
        [FaultContract(typeof(MyError))]
        [WebInvoke(Method = "POST",
           RequestFormat = WebMessageFormat.Json,
           ResponseFormat = WebMessageFormat.Json)]
        bool DeleteUser(string UserId);
    }
}