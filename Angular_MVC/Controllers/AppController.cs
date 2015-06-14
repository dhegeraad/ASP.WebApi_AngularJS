using System.Web.Mvc;

namespace Angular_MVC.Controllers
{
    public class AppController : Controller
    {
        public ActionResult Home()
        {
            return PartialView();
        }

        public ActionResult Register()
        {
            return PartialView();
        }

        public ActionResult SignIn()
        {
            return PartialView();
        }
    }
}
