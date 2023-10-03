using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using test1.Context;
using test1.Model;

namespace test1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {

        public IConfiguration _configuration;
        private readonly TestContext _taskContext;

        public TaskController(IConfiguration configuration, TestContext taskContext)
        {
            _taskContext = taskContext;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<ActionResult<TaskList>> PostTask(TaskList task)
        {
            _taskContext.TaskList.Add(task);
            await _taskContext.SaveChangesAsync();

            return Ok("dine");
        }

        [HttpGet("GetTaskList")]
        public ActionResult<IEnumerable<TaskList>> GetTask()
        {
            try
            {
                var task = _taskContext.TaskList.ToList(); // Retrieve roles from the database

                // Return the list of roles with a 200 OK status code
                return Ok(task);
            }
            catch (Exception ex)
            {
                // Handle any exceptions that may occur during the database operation

                // Return a 500 Internal Server Error status code with an error message
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { StatusCode = StatusCodes.Status500InternalServerError, StatusMessage = "Internal server error: " + ex.Message });
            }

        }


        // Helper method to retrieve a user from the second database
        [HttpGet("TaskListWithName")]
        public async Task<ActionResult<IEnumerable<taskListWithName>>> GetTaskListwithName()
        {
            var tasksWithProjectAndType = await (
                from task in _taskContext.TaskList
                join project in _taskContext.Project on task.ProjectId equals project.Id into projectJoin
                from project in projectJoin.DefaultIfEmpty()
                join category in _taskContext.TaskCategory on task.TaskL equals category.Id into categoryJoin
                from category in categoryJoin.DefaultIfEmpty()
                join user in _taskContext.UserTable on task.AssignedBy equals user.Id into userJoin
                from user in userJoin.DefaultIfEmpty()
                join user1 in _taskContext.UserTable on task.AssignedTo equals user1.Id into user1Join
                from user1 in user1Join.DefaultIfEmpty()
                where task.AssignedBy != task.AssignedTo
                select new
                {
                    task.Id,
                    AssignedBy = task.AssignedBy,
                    AssignedTo = task.AssignedTo,
                    Manager = user.Username,
                    AssignTo = user1.Username,
                    task.Task,
                    task.DateTime,
                    task.Status,
                    category.TaskType,
                    project.ProjectName
                })
                .ToListAsync();

            if (tasksWithProjectAndType == null)
            {
                return NotFound();
            }

            var taskListWithName = new List<taskListWithName>();

            foreach (var task in tasksWithProjectAndType)
            {
                var manager = _taskContext.UserTable.FirstOrDefault(p => p.Id == task.AssignedBy)?.Username;
                var assignTo = _taskContext.UserTable.FirstOrDefault(tc => tc.Id == task.AssignedTo)?.Username;
                if (manager == null && assignTo==null)
                {

                    manager = GetUserFromOtherDatabase(task.AssignedBy)?.Username;
                    assignTo = GetUserFromOtherDatabase(task.AssignedTo)?.Username;

                }
                else if(manager == null)
                {

                    manager = GetUserFromOtherDatabase(task.AssignedBy)?.Username;
                   

                }
                else if(assignTo == null)
                {
                    assignTo = GetUserFromOtherDatabase(task.AssignedTo)?.Username;
                }


                var project = _taskContext.Project.FirstOrDefault(p => p.ProjectName == task.ProjectName)?.ProjectName;
                var taskCategory = _taskContext.TaskCategory.FirstOrDefault(tc => tc.TaskType == task.TaskType)?.TaskType;

                taskListWithName.Add(new taskListWithName
                {
                    Id = task.Id,
                    Manager = manager,
                    AssignTo = assignTo,
                    Task = task.Task,
                    DateTime = task.DateTime,
                    Status = task.Status,
                    TaskLName = taskCategory, 
                    ProjectName = project // Assign project name
                });
            }

            return Ok(taskListWithName);
        }


        // Helper method to retrieve a user from the second database
        private AuthorizedUser GetUserFromOtherDatabase(int userId)
        {
            var user = _taskContext.AuthorizedUser.FirstOrDefault(u => u.Id == userId);
            return user;
        }


        // Helper method to retrieve a user from the second database
        [HttpGet("TaskListWithName11/{AssignedTo}")]
        public async Task<ActionResult<IEnumerable<taskListWithName>>> GetMyTaskListwithName11(int AssignedTo)
        {
            var tasksWithProjectAndType = await (
                from task in _taskContext.TaskList
                join project in _taskContext.Project on task.ProjectId equals project.Id into projectJoin
                from project in projectJoin.DefaultIfEmpty()
                join category in _taskContext.TaskCategory on task.TaskL equals category.Id into categoryJoin
                from category in categoryJoin.DefaultIfEmpty()
                join user in _taskContext.UserTable on task.AssignedBy equals user.Id into userJoin
                from user in userJoin.DefaultIfEmpty()
                join user1 in _taskContext.UserTable on task.AssignedTo equals user1.Id into user1Join
                from user1 in user1Join.DefaultIfEmpty()
                where (task.AssignedBy != task.AssignedTo && task.AssignedTo == AssignedTo)
                select new
                {
                    task.Id,
                    AssignedBy = task.AssignedBy,
                    AssignedTo = task.AssignedTo,
                    Manager = user.Username,
                    AssignTo = user1.Username,
                    task.Task,
                    task.DateTime,
                    task.Status,
                    category.TaskType,
                    project.ProjectName
                })
                .ToListAsync();

            if (tasksWithProjectAndType == null)
            {
                return NotFound();
            }

            var taskListWithName = new List<taskListWithName>();

            foreach (var task in tasksWithProjectAndType)
            {
                var manager = _taskContext.UserTable.FirstOrDefault(p => p.Id == task.AssignedBy)?.Username;
                var assignTo = _taskContext.UserTable.FirstOrDefault(tc => tc.Id == task.AssignedTo)?.Username;
                if (manager == null && assignTo == null)
                {

                    manager = GetUserFromOtherDatabase(task.AssignedBy)?.Username;
                    assignTo = GetUserFromOtherDatabase(task.AssignedTo)?.Username;

                }
                else if (manager == null)
                {

                    manager = GetUserFromOtherDatabase(task.AssignedBy)?.Username;


                }
                else if (assignTo == null)
                {
                    assignTo = GetUserFromOtherDatabase(task.AssignedTo)?.Username;
                }


                var project = _taskContext.Project.FirstOrDefault(p => p.ProjectName == task.ProjectName)?.ProjectName;
                var taskCategory = _taskContext.TaskCategory.FirstOrDefault(tc => tc.TaskType == task.TaskType)?.TaskType;

                taskListWithName.Add(new taskListWithName
                {
                    Id = task.Id,
                    Manager = manager,
                    AssignTo = assignTo,
                    Task = task.Task,
                    DateTime = task.DateTime,
                    Status = task.Status,
                    TaskLName = taskCategory,
                    ProjectName = project // Assign project name
                });
            }

            return Ok(taskListWithName);
        }



        [HttpGet("MyTaskWithName/{AssignedTo}")]
        public async Task<ActionResult<IEnumerable<taskListWithName>>> GetMyTaskListwithName(int AssignedTo)
        {
            var tasksWithProjectAndType = await (
                from task in _taskContext.TaskList
                join project in _taskContext.Project on task.ProjectId equals project.Id into projectJoin
                from project in projectJoin.DefaultIfEmpty()
                join category in _taskContext.TaskCategory on task.TaskL equals category.Id into categoryJoin
                from category in categoryJoin.DefaultIfEmpty()
                join user in _taskContext.UserTable on task.AssignedBy equals user.Id into userJoin
                from user in userJoin.DefaultIfEmpty()
                join user1 in _taskContext.UserTable on task.AssignedTo equals user1.Id into user1Join
                from user1 in user1Join.DefaultIfEmpty()
                where (task.AssignedBy != task.AssignedTo && task.AssignedTo == AssignedTo)
                select new taskListWithName
                {
                    Id = task.Id,
                    Manager = user != null ? user.Username : null,
                    AssignTo = user1 != null ? user1.Username : null,
                    Task = task.Task,
                    DateTime = task.DateTime,
                    Status = task.Status,
                    TaskLName = category != null ? category.TaskType : null,
                    ProjectName = project != null ? project.ProjectName : null
                })
                .ToListAsync();

            if (tasksWithProjectAndType == null)
            {
                return NotFound();
            }

            return Ok(tasksWithProjectAndType);
        }




        [HttpGet("TaskTable/{AssignedById}")]
        public async Task<ActionResult<IEnumerable<TaskList>>> GetTask(int AssignedById)
        {
            var task = await _taskContext.TaskList.Where(e => e.AssignedBy == AssignedById).ToListAsync();

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        [HttpGet("AssignedTask/{AssignedById}")]
        public async Task<ActionResult<IEnumerable<TaskList>>> GetAssignedTask(int AssignedBy)
        {
            var task = await _taskContext.TaskList.Where(e => e.AssignedBy == AssignedBy && e.AssignedTo != AssignedBy).ToListAsync();

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }


        [HttpGet("MyTask/{AssignedTo}")]
        public async Task<ActionResult<IEnumerable<TaskList>>> GetMyTask(int AssignedTo)
        {
            var task = await _taskContext.TaskList.Where(e => e.AssignedTo == AssignedTo).ToListAsync();

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        [HttpGet("MyTodo/{AssignedTo}")]
        public async Task<ActionResult<IEnumerable<TaskList>>> GetMyTodo(int AssignedTo)
        {
            var task = await _taskContext.TaskList.Where(e => e.AssignedTo == AssignedTo && e.AssignedBy == AssignedTo).ToListAsync();

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }


        [HttpGet("MyProjectTask/{ProjectId}")]
        public async Task<ActionResult<IEnumerable<TaskList>>> GetProjectTask(int ProjectId)
        {
            var task = await _taskContext.TaskList.Where(e => e.ProjectId == ProjectId).ToListAsync();

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        [HttpGet("MyProjectTask/{ProjectId}/{TaskL}")]
        public async Task<ActionResult<IEnumerable<TaskList>>> GetProjectTask(int ProjectId, int TaskL)
        {
            var task = await _taskContext.TaskList.Where(e => e.ProjectId == ProjectId && e.TaskL == TaskL).ToListAsync();

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            var taskToDelete = await _taskContext.TaskList.FindAsync(id);

            if (taskToDelete == null)
            {
                return NotFound(); // Task with the specified ID was not found.
            }

            _taskContext.TaskList.Remove(taskToDelete);
            await _taskContext.SaveChangesAsync();

            return Ok(); // Task with the specified ID was successfully deleted.
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskList>> GetTaskbyId(int id)
        {
            if (_taskContext.TaskList == null)
            {
                return NotFound();
            }
            var u = await _taskContext.TaskList.FindAsync(id);
            if (u == null)
            {
                return NotFound();
            }
            return u;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutTask(int id, TaskList task)
        {
            if (id != task.Id)
            {
                return NotFound();
            }
            _taskContext.Entry(task).State = EntityState.Modified;
            try
            {
                await _taskContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return Ok();
        }






        [HttpPut("{id}/UpdateStatus")]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] string newStatus)
        {
            try
            {
                var task = await _taskContext.TaskList.FirstOrDefaultAsync(t => t.Id == id);

                if (task == null)
                {
                    return NotFound(); // Task not found
                }

                // Update only the Status property
                task.Status = newStatus;

                _taskContext.TaskList.Update(task);
                await _taskContext.SaveChangesAsync();

                return Ok("Status updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}