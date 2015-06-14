using System.ComponentModel.DataAnnotations;

namespace Angular_MVC.Models.Binding
{
    public class RegisterExternalBindingModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }
}