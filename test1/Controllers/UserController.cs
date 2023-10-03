using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using test1.Context;
using test1.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace test1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public IConfiguration _configuration;
        private readonly TestContext _userContext;

        public UserController(IConfiguration configuration, TestContext userContext)
        {
            _userContext = userContext;
            _configuration = configuration;
        }


        [HttpGet]
        public async Task<ActionResult<object>> GetUser(int id)
        {
            try
            {
                var user = await _userContext.UserTable.FindAsync(id);
                if (user != null)
                {
                    return user;
                }

                var authorizedUser = await _userContext.AuthorizedUser.FindAsync(id);
                if (authorizedUser != null)
                {
                    return authorizedUser;
                }

                return NotFound("User not found.");
            }
            catch (Exception ex)
               
            { 
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
            }
        }


        [HttpGet("ListofUser")]
        public async Task<ActionResult<IEnumerable<object>>> GetUserList()
        {
            if (_userContext.UserTable == null)
            {
                return null;
            }

            var u = await _userContext.UserTable.ToListAsync();
            var v = await _userContext.AuthorizedUser.ToListAsync();

            var combinedList = u.Cast<object>().Concat(v.Cast<object>());

            return Ok(combinedList);
        }





        [HttpPost]
        public async Task<ActionResult<UserTable>> PostUser(UserTable user)
        {
            if (user != null)
            {
                var userData = await GetUserByEmailAndPassword(user.Email, user.Password);

                if (userData != null)
                {
                    return Ok("already exist");
                }
                var authuser= await _userContext.AuthorizedUser.FirstOrDefaultAsync(u => u.Email == user.Email);
                if (authuser != null)
                {
                    return Ok("already exist");
                }
            }

            _userContext.UserTable.Add(user);
            await _userContext.SaveChangesAsync();

            return Ok("done");
        }

        [HttpGet("{email}/{password}")]
        public async Task<ActionResult<UserTable>> GetUserByEmailAndPassword(string email, string password)
        {
            var u = await _userContext.UserTable.FirstOrDefaultAsync(u => u.Email == email && u.Password == password);
            if (u == null)
            {
                return null;
            }
            else
            {
                return u;
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutEmployee(int id, [FromBody] UserUpdateModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid model data.");
            }

            var userExists = await _userContext.UserTable.AnyAsync(u => u.Id == id);
            var authUserExists = await _userContext.AuthorizedUser.AnyAsync(u => u.Id == id);

            if (!userExists && !authUserExists)
            {
                return NotFound("User or AuthorizedUser not found with the provided ID.");
            }

            if (userExists)
            {
                _userContext.Entry(model.User).State = EntityState.Modified;
            }
            else
            {
                _userContext.Entry(model.AuthUser).State = EntityState.Modified;
            }

            try
            {
                await _userContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok();
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
          
            var userToDelete = await _userContext.UserTable.FindAsync(id);

          
            if (userToDelete == null)
            {
                var authUserToDelete = await _userContext.AuthorizedUser.FindAsync(id);

            
                if (authUserToDelete == null)
                {
                    return NotFound("User or AuthorizedUser not found with the provided ID.");
                }

                _userContext.AuthorizedUser.Remove(authUserToDelete);
            }
            else
            {
               
                _userContext.UserTable.Remove(userToDelete);
            }
              await _userContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequestModel user)
        {
            var userFromDb = await GetUserByEmailAndPassword(user.Email, user.Password);

            if (userFromDb == null)
            {
                return Unauthorized();
            }

            var claims = new[]
            {

         new Claim(JwtRegisteredClaimNames.Sub,_configuration["Jwt:Subject"]) ,
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),

                    new Claim("email", user.Email),
                    new Claim("password", user.Password)
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddMinutes(20),
                SigningCredentials = signIn,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);




            return Ok(new { Token = tokenString, userFromDb });
        }

    }
}