using Microsoft.AspNetCore.Mvc;
using RegistrationApi.Models;
using RegistrationApi.Services;
using System.Reflection.Metadata.Ecma335;
using System.Text.Json;

namespace RegistrationApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService userService;

        public UsersController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            List<User> users = userService.GetUsers();

            return Ok(users);
        }

        [HttpPost]
        public IActionResult AddUser(User user)
        {

            List<User> users = userService.GetUsers();

            bool emailExist = users.Any(x => x.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase));

            if (emailExist)
            {
                return Conflict("Email ID already exists.");
            }

            User newUser = userService.AddUser(user);

            return Ok(user);
        }

        //private readonly string filePath = "data\\users.json";

        //[HttpPost]
        //public IActionResult CreateUser(User user)
        //{
        //    //Check whether file exists
        //    if (!System.IO.File.Exists(filePath))
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, "User file not found");

        //    }

        //    //Read existing users

        //    string json = System.IO.File.ReadAllText(filePath);
        //    List<User> users;


        //    if (string.IsNullOrWhiteSpace(json)) {
        //        users = new List<User>();
        //    }
        //    else
        //    {
        //        users = JsonSerializer.Deserialize<List<User>>(json)?? new List<User>();
        //    }


        //    //Check duplicate email
        //    bool emailExists = users.Any(x => x.Email.ToLower().Equals(user.Email.ToLower(), StringComparison.OrdinalIgnoreCase));

        //    if(emailExists)
        //    {
        //        return Conflict("Email ID already exists");
        //    }

        //    //Add new user
        //    users.Add(user);


        //    //Convert users to JSON
        //    string updatedJSON = JsonSerializer.Serialize(users, 
        //        new JsonSerializerOptions
        //        {
        //            WriteIndented = true
        //        });

        //    //Save JSON file
        //    System.IO.File.WriteAllText(filePath, updatedJSON);

        //    return Ok(user);
        //}
    }
}
