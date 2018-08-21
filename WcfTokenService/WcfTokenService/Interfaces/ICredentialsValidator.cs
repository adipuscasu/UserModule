using WTS.Model.Security;

namespace WcfTokenService.Interfaces
{
    public interface ICredentialsValidator
    {
        User IsValid(Credentials creds);
    }
}