using System.ComponentModel.DataAnnotations;

namespace RegistrationApi.Models
{
    public class User
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        [RegularExpression(@"^\d{10}$")]
        public string Phone { get; set; }

    }
}
