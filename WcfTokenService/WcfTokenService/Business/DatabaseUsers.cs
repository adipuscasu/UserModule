using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using WcfTokenService.Database;
using WTS.Model.Security;
using WTS.Model.Common;

namespace WcfTokenService.Business
{
    public class DatabaseUsers
    {
        private readonly UserTokenDbContext _DbContext;

        public DatabaseUsers(UserTokenDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        public List<User> GetUsers()
        {
            var query = (from a in _DbContext.Users select a).Distinct();
            List<User> userList = new List<User>();
            query.ToList().ForEach(rec =>
            {
                userList.Add(new User
                {
                    Id = rec.Id,
                    Username = rec.Username,
                    Role = rec.Role,
                    Salt = rec.Salt,
                    Password = rec.Password
                });
            });
            return userList;
        }
        public bool IsUserName(string userName)
        {
            bool checkUser = false;
            var query = (from a in _DbContext.Users select a).Distinct();
            query.ToList().ForEach(rec =>
            {
                if (userName == rec.Username)
                {
                    checkUser = true;
                } 
            });
            return checkUser;
        }
        public int getIdfromUserName(string userName)
        {
            int IdfromUser = 0;
            var query = (from a in _DbContext.Users select a).Distinct();
            query.ToList().ForEach(rec =>
            {
                if (userName == rec.Username)
                {
                    IdfromUser = rec.Id;
                }
            });
            return IdfromUser;
        }
        public bool AddNewUser(User user)
        {
            try
            {
                User usr = _DbContext.Users.Create();
                usr.Username = user.Username;
                usr.Password = user.Password;
                usr.Role = "user";
                usr.Salt = user.Salt;

                _DbContext.Users.Add(usr);
                _DbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new FaultException<string>("problema la adaugare "+ex.Message);
            }
            return true;
        }

        public bool DeleteUser(string UserId)
        {
            bool result = false;
            try
            {
                System.Diagnostics.Debug.WriteLine("DatabaseUsers DeleteUser cu id-ul : " + UserId);
                int User_Id = Convert.ToInt32(UserId);

                User utilizator = _DbContext.Users.Find(User_Id);
                _DbContext.Users.Remove(utilizator);
                _DbContext.SaveChanges();

                System.Diagnostics.Debug.WriteLine("dupa comanda savechanges");
            }
            catch (Exception ex)
            {
                MyError ErrLog = new MyError("eroare ", ex.Message);
                FaultException<MyError> fe = new FaultException<MyError>(ErrLog);
                throw fe;

            }
            return result;
        }

        public User GetUserDetails(string Id)
        {
            User user = new User();
            System.Diagnostics.Debug.WriteLine("apelez GetUserDetails cu Id: "+Id);
            try
            {
                int User_ID = Convert.ToInt32(Id);
                var query = (from a in _DbContext.Users
                             where a.Id.Equals(User_ID)
                             select a).Distinct().FirstOrDefault();

                user.Id = query.Id;
                user.Username = query.Username;
                user.Salt = query.Salt;
                user.Role = query.Role.Trim();
                user.Password = query.Password;
            }
            catch (Exception ex)
            {
                throw new FaultException<string>
                        (ex.Message);
            }
            return user;
        }

        public bool UpdateUser(User user)
        {
            try
            {
                var Id = user.Id;
                User usr = _DbContext.Users.Where(rec => rec.Id == Id).FirstOrDefault();
                usr.Username = (IsUserName(user.Username) == true )?usr.Username:user.Username; //nu schimb numele daca mai exista deja
                usr.Salt = user.Salt;
                usr.Role = user.Role;
                usr.Password = string.IsNullOrWhiteSpace(user.Password) ? usr.Password : Hash.Get(user.Password, user.Salt); //noua parola este nula daca nu se doreste schimbarea celei vechi

                _DbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new FaultException<string>
                        (ex.Message);
            }
            return true;
        }
    }
}