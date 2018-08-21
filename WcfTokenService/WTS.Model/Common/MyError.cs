using System.Runtime.Serialization;
using System.ServiceModel;

namespace WTS.Model.Common
{
    [DataContract]
    public class MyError
    {
        public MyError(string eroare, string mesaj)
        {
            Eroare = eroare;
            Mesaj = mesaj;
        }
        public FaultReason Message(FaultReason errmess)
        {
            return errmess;
        }
        [DataMember]
        public string Eroare { get; set; }
        [DataMember]
        public string Mesaj { get; set; }
    }
}
