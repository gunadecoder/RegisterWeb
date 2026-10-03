using System.Text.Json;
using RegistrationApi.Models;
namespace RegistrationApi.Services
{
    public class UserService : IUserService
    {
        private readonly string filePath = "Data/users.json";
        
        public List<User> GetUsers()
        {
            if(!File.Exists(filePath))
            {
                return new List<User>();
            }

            string json = File.ReadAllText(filePath);

            if(string.IsNullOrWhiteSpace(json))
            {
                return new List<User>();
            }


            return JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
            
        }


        public User AddUser(User user)
        {
            List<User> Users= GetUsers();

            Users.Add(user);

            string json = JsonSerializer.Serialize(
                Users,
                new JsonSerializerOptions
                {
                    WriteIndented = true
                }
                );

            File.WriteAllText(filePath, json);

            return user;
        }
    }
}
