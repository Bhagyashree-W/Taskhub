import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import { GrAdd } from "react-icons/gr";
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardLink,
  CCardSubtitle,
  CModal,
  CCardText,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormTextarea,
} from "@coreui/react";
import {} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import "../css/Project.css";
export default function Project() {
  // const [project, setproject] = useState({
  //   Id: 0,
  //   AssignedBy: 0,
  //   AssignedTo: 0,
  //   Task: "",
  //   Status: "",
  //   TaskL: 0,
  //   ProjectId: 0,
  // });
  const [projId, setprojId] = useState(0);

  const [visible, setvisible] = useState(false);
  // const [vt, setvt] = useState(false);
  const [d, setd] = useState([]);
  const [projN, setprojN] = useState([]);
  const [projectName, setprojectName] = useState("");
  const [task, settask] = useState([]);
  const [addProjM, setaddProjM] = useState(false);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  useEffect(() => {
    getData();
    getProject();
  }, []);

  const getData = () => {
    axios
      .get("https://localhost:7282/api/User/ListofUser")
      .then((result: any) => {
        setd(result.data);
        //console.log(result.data);
      })
      .catch((error: any) => {
        //console.log(error);
      });
  };

  const getProject = () => {
    axios
      .get("https://localhost:7282/api/Project")
      .then((result: any) => {
        setprojN(result.data);
      })
      .catch((error) => {
        alert("cannot load projectName");
      });
  };

  // const handleChange = (e: any) => {
  //   e.preventDefault();
  //   setproject({ ...project, [e.target.name]: e.target.value });
  // };

  // const submitProject = (e: any) => {
  //   e.preventDefault();
  //   const w = {
  //     id: 0,
  //     assignedBy: 3,
  //     assignedTo: Number(project.AssignedTo),
  //     task: project.Task,
  //     dateTime: new Date(),
  //     status: project.Status,
  //     taskL: Number(project.TaskL),
  //     projectId: Number(project.ProjectId),
  //   };
  //   //console.log(w);
  //   axios
  //     .post("https://localhost:7282/api/Task", w)
  //     .then((result) => {
  //       console.log("Project is added");
  //       getProject();
  //     })
  //     .catch((error) => alert(error));
  //   // console.log(t);
  //   setvisible(false);
  //   setvt(false);
  //   setproject({
  //     Id: 0,
  //     AssignedBy: 0,
  //     AssignedTo: 0,
  //     Task: "",
  //     Status: "",
  //     TaskL: 0,
  //     ProjectId: 0,
  //   });
  // };

  const importtask = (id: any) => {
    axios
      .get(`https://localhost:7282/api/Task/MyProjectTask/${id}`)
      .then((result) => {
        // console.log("importtask");
        settask(result.data);
        //console.log(task);
      })
      .catch((error) => {
        console.log("error loding task");
      });
  };

  const addproject = () => {
    const projname = projectName;
    axios
      .post("https://localhost:7282/api/Project", {
        projectName: projectName,
      })
      .then((result) => {
        //alert("successfully added project");
        axios
          .get(`https://localhost:7282/api/Project/GetProjectId/${projname}`)
          .then((result) => {
            setprojId(result.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <>
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="mainpage">
          <h1>Project</h1>
          <div className="maincontent">
            <table>
              {projN.map((item: any, index: any) => {
                return (
                  <>
                    <button
                      className="projectCard"
                      onClick={() => {
                        importtask(item.id);
                        navigate("/TaskCategory", {
                          state: { name: item.projectName },
                        });
                      }}
                      value={item.id}
                    >
                      {" "}
                      <h5>{item.projectName}</h5>
                    </button>
                  </>
                );
              })}
              <button
                className="AddprojectCard"
                onClick={() => setaddProjM(true)}
              >
                <GrAdd size={32} className="addicon" />
              </button>
            </table>
          </div>
          <CModal
            alignment="center"
            visible={addProjM}
            onClose={() => setaddProjM(false)}
            aria-labelledby="VerticallyCenteredExample"
          >
            <CModalHeader>
              <CModalTitle id="VerticallyCenteredExample">
                Add Project
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CFormTextarea
                name="projectName"
                floatingClassName="mb-3"
                floatingLabel="Project Name"
                placeholder="Project Name"
                style={{ height: "100px" }}
                onChange={(e: any) => setprojectName(e.target.value)}
                value={projectName}
                feedbackInvalid="Please provide a valid zip."
                required
              />
            </CModalBody>

            <CModalFooter>
              <CButton
                className="taskButton"
                onClick={(e: any) => {
                  const form = e.currentTarget;
                  if (form.checkValidity() === false) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                  setValidated(true);
                  if (validated != true) {
                    addproject();
                  }

                  setvisible(true);

                  console.log(projectName);

                  setvisible(true);
                  navigate("/TaskCategory", {
                    state: { name: projectName, id: projId },
                  });
                }}
              >
                Add Project
              </CButton>
            </CModalFooter>
          </CModal>

          {/* <h5 style={{ marginLeft: "300px" }}>Task</h5>
        <table style={{ marginLeft: "300px" }}>
          {task && task.length > 0
            ? task.map((item: any, index: any) => {
              return (
                <tr>
                  <td>{item.taskL}</td>
                  <td>{item.task}</td>
                </tr>
              );
            })
            : ""}
        </table>
<form onSubmit={ProjectSubmit}>
        Add Project:{" "}
        <input
          type="text"
          name="Project"
          onChange={handleChange}
          value={project.Project}
        />
        <button
          onClick={() => {
            setvisible(true);
          }}
        >
          <MdAddCircle size={32} color="blue" />
        </button>
        {visible && (
          <div>
            Add Task Category:{" "}
            <input
              type="text"
              name="TaskL"
              onChange={handleChange}
              value={project.TaskL}
            />
            <button type="submit">Submit</button>
          </div>
        )}
      </form>

      {vt && (
        <form onSubmit={taskSubmit}>
          <textarea
            name="Task"
            onChange={handleChange}
            value={project.Task}
          ></textarea>
          <select
            name="AssignedTo"
            onChange={handleChange}
            value={project.AssignedTo}
          >
            {d.map((item: any, index: any) => {
              return <option value={item.id}>{item.name}</option>;
            })}
          </select>
          <select name="Status" onChange={handleChange} value={project.Status}>
            <option value="Active">Active</option>
            <option value="Progress">Progress</option>
            <option value="Done">Done</option>
          </select>
          <button type="submit">Submit</button>
        </form>
        )}
        <div style={{ margin: "200px" }}>
          Add Project:
          <input
            type="text"
            name="projectName"
            onChange={(e: any) => setprojectName(e.target.value)}
            value={projectName}
          ></input>
          <button
            onClick={() => {
              setvisible(true);
              axios
                .post("https://localhost:7282/api/Project", {
                  projectName: projectName,
                })
                .then((result) => {
                  alert("successfully added project");
                })
                .catch((error) => {
                  alert(error);
                });
              axios
                .get(
                  `https://localhost:7282/api/Project/GetProjectId/${projectName}`
                )
                .then((result) => {
                  setproject({ ...project, ProjectId: result.data });
                })
                .catch((error) => {
                  alert("eror");
                });
            }}
          >
            <GrAdd size={32} color="blue" />
          </button>


          {visible && (
            <div>
              Add Task Category:
              <input
                type="text"
                name="TaskL"
                onChange={handleChange}
                value={project.TaskL}
              ></input>
              <button
                onClick={() => {
                  setvt(true);
                }}
              >
                <GrAdd size={32} color="blue" />
              </button>
            </div>
          )}
          {vt && (
            <div>
              Add Task:
              <input
                type="text"
                name="Task"
                onChange={handleChange}
                value={project.Task}
              ></input>
              Assign To{" "}
              <select
                name="AssignedTo"
                onChange={handleChange}
                value={project.AssignedTo}
              >
                {d.map((item: any, index: any) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
              </select>
              <select
                name="Status"
                onChange={handleChange}
                value={project.Status}
              >
                <option value="Active">Active</option>
                <option value="Progress">Progress</option>
                <option value="Done">Done</option>
              </select>
              <button onClick={submitProject}>Submit</button>
            </div>
          )}
        </div>*/}
        </div>
      </div>
    </>
  );
}
