using WcfTokenService.Contracts;
using WTS.Model.Security;

namespace WcfTokenService.Interfaces
{
    interface ITokenBuilder
    {
        UserDataContract Build(Credentials creds);
    }
}