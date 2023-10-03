using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test1.Context;
using test1.Model;

namespace test1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        public IConfiguration _configuration;
        private readonly TestContext _projectContext;


        public ProjectController(IConfiguration configuration, TestContext projectContext)
        {
            _projectContext = projectContext;
            _configuration = configuration;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            if (_projectContext.Project == null)
            {
                return NotFound();
            }
            var u = await _projectContext.Project.FindAsync(id);
            if (u == null)
            {
                return NotFound();
            }
            return u;
        }




        [HttpPost]
        public async Task<ActionResult<Response>> PostRole(Project proj)
        {
            var response = new Response(); // Create a Response object

            try
            {
                // Check if the project already exists in the database
                var existingProject = await _projectContext.Project.FirstOrDefaultAsync(p => p.ProjectName == proj.ProjectName);

                if (existingProject != null)
                {
                    // Project with the same ID already exists, return an appropriate response
                    response.StatusCode = StatusCodes.Status409Conflict; // Conflict status code
                    response.StatusMessage = "Project already exists";
                }
                else
                {
                    // Project does not exist, so add it to the database
                    _projectContext.Project.Add(proj);
                    await _projectContext.SaveChangesAsync();

                    // Set the response properties for success
                    response.StatusCode = StatusCodes.Status201Created; // Created status code
                    response.StatusMessage = "Project added successfully";
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that may occur during the database operation

                // Set the response properties for failure
                response.StatusCode = StatusCodes.Status500InternalServerError;
                response.StatusMessage = "Internal server error: " + ex.Message;
            }

            return response;
        }


        [HttpGet]
        public ActionResult<IEnumerable<Project>> GetProject()
        {
            try
            {
                var proj = _projectContext.Project.ToList(); // Retrieve roles from the database

                // Return the list of roles with a 200 OK status code
                return Ok(proj);
            }
            catch (Exception ex)
            {
                // Handle any exceptions that may occur during the database operation

                // Return a 500 Internal Server Error status code with an error message
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { StatusCode = StatusCodes.Status500InternalServerError, StatusMessage = "Internal server error: " + ex.Message });
            }

        }


        [HttpGet("GetProjectId/{projectName}")]
        public async Task<ActionResult<int>> GetProjectIdByName(string projectName)
        {
            try
            {
                var project = await _projectContext.Project.FirstOrDefaultAsync(p => p.ProjectName == projectName);

                if (project == null)

                {
                    return NotFound(); 
                }

                return Ok(project.Id); // Return a 200 OK response with the project ID if found.
            }
            catch (Exception ex)
            {
                // Handle any exceptions that may occur during the database operation.
                // Log the error, and return an error response.
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error: " + ex.Message);
            }
        }





    }

}