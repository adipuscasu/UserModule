using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.ServiceModel.Activation;
using WcfTokenService.Business;
using WcfTokenService.Database;
using WcfTokenService.Interfaces;
using WTS.Model.Security;

namespace WcfTokenService.Services
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "UserService" in code, svc and config file together.

    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UserService : IUserService
    {
        public string AddUser(string userName, string password)
        {
            System.Diagnostics.Debug.WriteLine("AddUser cu valorile : username="+ userName+" password="+password);
            var rng = new RNGCryptoServiceProvider();
            var salt = Hash.GenerateRandomSalt(rng, 16);
            string message = "";
            bool isUserName = false;
            using (var dbContext = new UserTokenDbContext())
            {
                isUserName = new DatabaseUsers(dbContext).IsUserName(userName);
                if (isUserName) { return "Numele de utilizator este deja folosit !"; }
                else
                {
                        string hashedPass = Hash.Get(password, salt);
                        User newUsr = new User();
                        newUsr.Username = userName;
                        newUsr.Password = hashedPass;
                        newUsr.Salt = salt;
                        var userAdaugat = new DatabaseUsers(dbContext).AddNewUser(newUsr);
                        if (userAdaugat)
                        {
                            message = "Am adaugat utilizatorul "+ userName;
                        }
                }
            }
            return message;
        }

        public bool DeleteUser(string UserId)
        {
            using (var dbContext = new UserTokenDbContext())
            {
                System.Diagnostics.Debug.WriteLine("DeleteUser cu id-ul : " + UserId);
                var userDeleted = new DatabaseUsers(dbContext).DeleteUser(UserId);
                return userDeleted;
            }
        }

        public List<User> GetAllUsers()
        {
            using (var dbContext = new UserTokenDbContext())
            {
                System.Diagnostics.Debug.WriteLine("GetAllUsers");
                var userList = new DatabaseUsers(dbContext).GetUsers();
                return userList;
            }
        }

        public User GetUserDetails(string UserId)
        {
            using (var dbContext = new UserTokenDbContext())
            {
                System.Diagnostics.Debug.WriteLine("GetUserDetails cu id-ul: "+UserId);
                var userDetails = new DatabaseUsers(dbContext).GetUserDetails(UserId); ;
                return userDetails;
            }
        }

        public string HashPass(string pass, string salt)
        {
            System.Diagnostics.Debug.WriteLine("HashPass");
            var hashedPass = Hash.Get(pass, salt);
            return hashedPass;
        }

        public bool UpdateUser(string Id, string Username, string Password, string Role, string Salt)
        {
            using (var dbContext = new UserTokenDbContext())
            {
                User contact = new User();
                contact.Id = Convert.ToInt32(Id);
                contact.Username = Username;
                contact.Password = Password;
                contact.Role = Role;
                contact.Salt = Salt;
                System.Diagnostics.Debug.WriteLine("UpdateUser");
                var userUpdated = new DatabaseUsers(dbContext).UpdateUser(contact);
                return userUpdated;
            }
        }
    }
}
