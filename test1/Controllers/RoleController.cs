using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using test1.Model;
using test1.Context;

namespace test1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        public IConfiguration _configuration;
        private readonly TestContext _roleContext;


        public RoleController(IConfiguration configuration, TestContext roleContext)
        {
            _roleContext = roleContext;
            _configuration = configuration;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetRole(int id)
        {
            if (_roleContext.Role == null)
            {
                return NotFound();
            }
            var u = await _roleContext.Role.FindAsync(id);
            if (u == null)
            {
                return NotFound();
            }
            return u;
        }




        [HttpPost]
        public async Task<ActionResult<Response>> PostRole(Role role)
        {
            var response = new Response(); 
            try
            {
                _roleContext.Role.Add(role);
                await _roleContext.SaveChangesAsync();

                response.StatusCode = StatusCodes.Status200OK;
                response.StatusMessage = "Role added successfully";
            }
            catch (Exception ex)
            {
               
                response.StatusCode = StatusCodes.Status500InternalServerError;
                response.StatusMessage = "Internal server error: " + ex.Message;
            }

            return response;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Role>> GetRoles()
        {
            try
            {
                var roles = _roleContext.Role.ToList();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { StatusCode = StatusCodes.Status500InternalServerError, StatusMessage = "Internal server error: " + ex.Message });
            }

        }
    }

}
