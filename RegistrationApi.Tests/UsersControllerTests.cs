using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using RegistrationApi.Controllers;
using RegistrationApi.Models;
using RegistrationApi.Services;

namespace RegistrationApi.Tests
{
    public class UsersControllerTests
    {


        [Fact]
        public void GetUsers_ShouldReturnOk_WithUsers()
        {
            //Arrange
            var users = new List<User> { new User { Name = "John", Email = "john@gmail.com", Gender = "Male", Phone = "9876543210" }, new User { Name = "Jane", Email = "jane@gmail.com", Gender = "Female", Phone = "9876543211" } };

            var mockService = new Mock<IUserService>();
            mockService.Setup(x => x.GetUsers()).Returns(users);

            var controller = new UsersController(mockService.Object);

            // Act
            IActionResult result = controller.GetUsers();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedUsers = Assert.IsType<List<User>>(okResult.Value);
            Assert.Equal(2, returnedUsers.Count);
            Assert.Equal("John", returnedUsers[0].Name);
            Assert.Equal("jane@gmail.com", returnedUsers[1].Email);
            mockService.Verify(x => x.GetUsers(), Times.Once);



        }

        [Fact]
        public void AddUser_ShouldReturnOk_WhenUserIsValid()
        {
            //Arrange

            var user = new User
            {
                Name = "John",
                Email = "john@gmail.com",
                Gender = "Male",
                Phone = "8887776665"
            };

            var mockService = new Mock<IUserService>();

            mockService.Setup(x => x.GetUsers()).Returns(new List<User>());

            mockService.Setup(x => x.AddUser(user)).Returns(user);

            var controller = new UsersController(mockService.Object);

            //Act

            IActionResult result = controller.AddUser(user);

            //Assert

            var okResult = Assert.IsType<OkObjectResult>(result);

            var returnedUser = Assert.IsType<User>(okResult.Value);

            Assert.Equal("John", returnedUser.Name);
            Assert.Equal("john@gmail.com", returnedUser.Email);



        }

        [Fact]
        public void AddUser_ShouldReturnConflict_WhenEmailAlreadyExists()
        {
            //Arrange
            var existingUser = new User
            {
                Name = "John",
                Email = "john@gmail.com",
                Gender = "Male",
                Phone = "8887776665"
            };

            var newUser = new User
            {
                Name = "John",
                Email = "john@gmail.com",
                Gender = "Male",
                Phone = "8887776665"
            };

            var mockService = new Mock<IUserService>();

            mockService.Setup(x => x.GetUsers()).Returns(new List<User> { existingUser });

            var controller = new UsersController(mockService.Object);

            //Act

            IActionResult result = controller.AddUser(newUser);

            //Assert

            var conflictResult = Assert.IsType<ConflictObjectResult>(result);


            Assert.Equal("Email ID already exists.", conflictResult.Value);

            mockService.Verify(x => x.AddUser(It.IsAny<User>()), Times.Never);
        }

    
    }
}
