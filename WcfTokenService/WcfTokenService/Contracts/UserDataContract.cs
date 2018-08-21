using System.Runtime.Serialization;

namespace WcfTokenService.Contracts
{
    [DataContract]
    public class UserDataContract
    {
        [DataMember]
        public string UserName;
        [DataMember]
        public string Role;
        [DataMember]
        public string token;
        [DataMember]
        public int UserID;
    }
}