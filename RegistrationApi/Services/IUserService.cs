using RegistrationApi.Models;

namespace RegistrationApi.Services
{
    public interface IUserService
    {
        List<User> GetUsers();
        User AddUser(User user);

    }
}
