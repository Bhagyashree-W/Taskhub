using System.ComponentModel.DataAnnotations;

namespace test1.Model
{
    public class UserTable
    {


        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string RoleId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class AuthorizedUser
    {


        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string RoleId { get; set; }
        public string Username { get; set; }

    }

    public class TaskList
    {
        public int Id { get; set; }
        public int AssignedBy { get; set; }
        public int AssignedTo { get; set; }

        public string Task { get; set; }
        public DateTime DateTime { get; set; }
        public string Status { get; set; }
        public int TaskL { get; set; }
        public int ProjectId { get; set; }
    }

    public class Role
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
    }

    public class Project
    {
        public int Id { get; set; }

        public string ProjectName { get; set; }
    }

    public class TaskCategory
    {
        public int Id { get; set; }
        public string TaskType { get; set; }
        public int ProjectId { get; set; }
    }

    public class task
    {
        public int Id { get; set; }

        public string Manager { get; set; }
        public string Task { get; set; }

        public DateTime DateTime { get; set; }

        public string Status { get; set; }
        public string TaskLName { get; set; }
        public string ProjectName { get; set; }

    }

    public class LoginRequestModel
    {

        public string Email { get; set; }


        public string Password { get; set; }
    }



    public class taskListWithName
    {

        public int Id { get; set; }

        public string Manager { get; set; }

        public string AssignTo { get; set; }
        public string Task { get; set; }

        public DateTime DateTime { get; set; }

        public string Status { get; set; }
        public string TaskLName { get; set; }
        public string ProjectName { get; set; }
    }

    public class UserUpdateModel
    {
        public UserTable User { get; set; }
        public AuthorizedUser AuthUser { get; set; }
    }
}