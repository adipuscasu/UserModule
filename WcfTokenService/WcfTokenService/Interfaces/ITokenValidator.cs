using WTS.Model.Security;

namespace WcfTokenService.Interfaces
{
    public interface ITokenValidator
    {
        bool IsValid(string token);
        Token Token { get; set; }
    }
}