import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import { MdAddTask, MdWidthFull } from "react-icons/md";
import { CCard } from "@coreui/react";
import "../css/TaskCategory.css";
import { GrAdd } from "react-icons/gr";
import { BsPersonFillAdd, BsCalendarDateFill } from "react-icons/bs";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CModalBody,
  CFormTextarea,
} from "@coreui/react";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineUsers } from "react-icons/hi";

export default function TaskCategory(props: any) {
  const id = localStorage.getItem("id");
  const location = useLocation();
  const { state } = location;
  const projname = state ? state.name : "";
  const projectId = state ? state.id : "";
  const [task, setTask] = useState({
    id: 0,
    assignedBy: id,
    assignedTo: 1,
    task: "",
    dateTime: new Date(),
    status: "Todo",
    taskL: 0,
    projectId: 0,
  });
  const [d, setd] = useState([]);
  const [projId, setprojId] = useState(0);
  const [inputBoxes, setInputBoxes] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [taskC, settaskC] = useState("");
  const [tc, settc] = useState([]);
  const [tskL, settskL] = useState([]);
  const [check, setcheck] = useState(false);

  useEffect(() => {
    getData();
    getdata();
    getTask();
  }, []);
  const [showAddCard, setShowAddCard] = useState(Array(tc.length).fill(false));

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
    axios
      .get(`https://localhost:7282/api/Project/GetProjectId/${projname}`)
      .then((result) => {
        const projId = result.data;
        setprojId(projId);

        // Now that you have projId, make the second request
        axios
          .get(`https://localhost:7282/api/TaskType/${projId}`)
          .then((result) => {
            settc(result.data);
            setprojId(projId);
            // Use taskData as needed
          })
          .catch((error) => {
            console.log("Error occurred while fetching project tasks:", error);
          });

        axios
          .get(`https://localhost:7282/api/Task/MyProjectTask/${projId}`)
          .then((result) => {
            settskL(result.data);
            console.log(result.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log("Error occurred while fetching project ID:", error);
      });
  };

  const getdata = () => {
    axios
      .get("https://localhost:7282/api/User/ListofUser")
      .then((result: any) => {
        setd(result.data);
        //console.log(result.data);
      })
      .catch((error: any) => {
        //console.log(error);
      });
    axios
      .get(`https://localhost:7282/api/TaskType/${projectId}`)
      .then((result) => {
        settc(result.data);
        // setprojId(projId)
        // Use taskData as needed
      })
      .catch((error) => {
        console.log("Error occurred while fetching project tasks:", error);
      });

    axios
      .get(`https://localhost:7282/api/Task/MyProjectTask/${projectId}`)
      .then((result) => {
        settskL(result.data);
        console.log(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getTaskC = () => {
    axios
      .get(`https://localhost:7282/api/TaskType/${projId}`)
      .then((result) => {
        settc(result.data);
      })
      .catch((error) => {
        console.log("error occured");
      });
  };

  const getTask = () => {
    axios
      .get(`https://localhost:7282/api/Task/MyProjectTask/${projId}`)
      .then((result) => {
        settskL(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleChange = (e: any) => {
    e.preventDefault();
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleAddInputBox = (e: any) => {
    e.preventDefault();
    setTask({
      id: 0,
      assignedBy: id,
      assignedTo: 0,
      task: "",
      dateTime: new Date(),
      status: "",
      taskL: 0,
      projectId: projId,
    });
    setInputBoxes([...inputBoxes, ""]);
    /* setInputBoxes([...inputBoxes, ""]);
    const t={
      
        id: 0,
        assignedBy: 3,
        assignedTo: 0,
        task: "",
        dateTime: new Date(),
        status: "",
        taskL: task.taskL,
        projectId: String(projId),
      
    }
    axios.post("https://localhost:7282/api/Task",t)
    .then((result)=>{
      console.log("category added")
      setShowCard(true);
    }).catch((error)=>{
      console.log("error occured while addding task Category")
    })*/
  };

  const toggleButton = () => {
    setIsButtonVisible(!isButtonVisible);
  };

  const handleTaskC = (e: any) => {
    setShowCard(true);
    const t = {
      id: 0,
      taskType: taskC,
      projectId: projId,
    };

    axios
      .post("https://localhost:7282/api/TaskType", t)
      .then((result) => {
        console.log("done adding category");
        getTaskC();
        axios
          .get(
            `https://localhost:7282/api/TaskType/GetTaskCatId/${taskC}/${projId}`
          )
          .then((result) => {
            setTask({ ...task, taskL: result.data });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    setIsButtonVisible(!isButtonVisible);
    settaskC("");
  };

  const AddTask = (item: any, index: any) => {
    console.log(item);
    const newShowAddCard = [...showAddCard];
    newShowAddCard[index] = !newShowAddCard[index];
    setShowAddCard(newShowAddCard);

    setTask({
      ...task,
      taskL: item.id,
      projectId: item.projectId,
    });
  };

  const submit = (index: any) => {
    console.log(task);
    const t = {
      id: 0,
      assignedBy: task.assignedBy,
      assignedTo: task.assignedTo,
      task: task.task,
      dateTime: task.dateTime,
      status: task.status,
      taskL: task.taskL,
      projectId: task.projectId,
    };
    axios
      .post("https://localhost:7282/api/Task", t)
      .then((result) => {
        getData();
        getTask();
      })
      .catch((error) => {
        console.log("error while submit");
      });
    const newShowAddCard = [...showAddCard];
    newShowAddCard[index] = false;
    setShowAddCard(newShowAddCard);
    setTask({
      id: 0,
      assignedBy: id,
      assignedTo: 1,
      task: "",
      dateTime: new Date(),
      status: "Todo",
      taskL: 0,
      projectId: 0,
    });
  };

  const handlestatus = (id: any) => {
    const newStatus = "Done"; // Assuming your new status is "Done" as an example

    axios
      .put(`https://localhost:7282/api/Task/${id}/UpdateStatus`, newStatus, {
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      })
      .then((result) => {
        setcheck(!check);
        getData();
      })
      .catch((error) => {
        alert(error);
      });
  };

  function getUsernameById(userId: any) {
    const user = d.find((item) => item.id === userId);
    return user ? user.username : ""; // Return the username or an empty string if not found
  }
  function formatDate(dateTime: any) {
    const options = { day: "numeric", month: "short" }; // Use 'short' for abbreviated month name
    const formattedDate = new Date(dateTime).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }

  return (
    <>
      <div className="taskList-page wrapper">
        <Navbar />
        <Sidebar />
        <div className="tasklistcontent mainpage">
          <div style={{ display: "flex" }}>
            <Link to="/Project">
              {" "}
              <IoIosArrowBack
                size={32}
                style={{ marginTop: "14px" }}
                color="022b3a"
                className="taskpageIcons"
              />
            </Link>
            <h1 style={{ marginLeft: "15px" }}>{projname}</h1>
          </div>
          {/*<h1 style={{marginLeft:"300px"}}>{projId}</h1>*/}
          {/*  <input type="text" name="taskL" onChange={handleChange} value={task.taskL}/>
   <button onClick={()=>setv(!v)}>Add taskCategory</button>
   {v && (<><input type="text" name="taskL" onChange={handleChange} value={task.taskL}/>
   <button onClick={()=>setv(!v)}>Add taskCategory</button></>)}
   

  <input type="text" name="taskL" onChange={handleChange} value={task.taskL}/>
        <form onSubmit={submitTask} style={{ marginTop: "100px" }}>
          <input
            type="text"
            placeholder="Enter taskCategory"
            name="taskL"
            onChange={handleChange}
            value={task.taskL}
          />
        </form>
        {inputBoxes.map((input, index) => (
          <input
            key={index}
            type="text"
            placeholder="Enter taskCategory"
            name="taskL"
            onChange={handleChange}
            value={task.taskL}
          />
        ))}
        <button onClick={handleAddInputBox}>Add TaskCategory</button>
        {v && (
          <div>
            Add Task:
            <input
              type="text"
              name="Task"
              onChange={handleChange}
              value={task.task}
            ></input>
            Assign To{" "}
            <select
              name="AssignedTo"
              onChange={handleChange}
              value={task.assignedTo}
            >
              {d.map((item: any, index: any) => {
                return <option value={item.id}>{item.name}</option>;
              })}
            </select>
            <select name="Status" onChange={handleChange} value={task.status}>
              <option value="Active">Active</option>
              <option value="Progress">Progress</option>
              <option value="Done">Done</option>
            </select>
            <button onClick={submitTask}>Submit</button>
          </div>
        )}*/}
          <div className="taskCategoryPage maincontent">
            {tc && tc.length > 0
              ? tc.map((item: any, index: any) => {
                  const filteritem = tskL.filter(
                    (i: any) => i.taskL === item.id
                  );

                  return (
                    <React.Fragment key={index}>
                      <div className="tasklist">
                        <table>
                          <thead>
                            <tr>
                              <td className="taskListNames">
                                {item.taskType}
                                <button onClick={() => AddTask(item, index)}>
                                  <GrAdd />
                                </button>
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {showAddCard[index] && (
                                  <div className="addtaskbox">
                                    <CCard>
                                      <CFormTextarea
                                        placeholder="Task"
                                        floatingLabel="Task"
                                        name="task"
                                        onChange={handleChange}
                                        value={task.task}
                                      ></CFormTextarea>
                                      <div>
                                        <BsPersonFillAdd
                                          for="assignedTo"
                                          size={25}
                                          style={{ marginRight: "10px" }}
                                          color="grey"
                                        />
                                        <select
                                          name="assignedTo"
                                          onChange={handleChange}
                                          value={task.assignedTo}
                                        >
                                          {d.map((item: any, index: any) => {
                                            return (
                                              <option value={item.id}>
                                                {item.name}
                                              </option>
                                            );
                                          })}
                                        </select>
                                      </div>
                                      <div>
                                        <BsCalendarDateFill
                                          for="dateTime"
                                          size={25}
                                          style={{ marginRight: "10px" }}
                                          color="grey"
                                        />
                                        <input
                                          type="date"
                                          name="dateTime"
                                          onChange={handleChange}
                                        />
                                      </div>

                                      <button onClick={() => submit(index)}>
                                        Create
                                      </button>
                                    </CCard>
                                  </div>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                {filteritem.map((task: any, taskIndex: any) => (
                                  <span key={taskIndex}>
                                    <div className="taskbox">
                                      <b>{task.task}</b>
                                      <br></br>
                                      <span>
                                        <BsCalendarDateFill
                                          size={15}
                                          style={{ marginRight: "10px" }}
                                          color="grey"
                                        />
                                        Due on{" "}
                                        <b
                                          style={{
                                            color: "rgb(106, 206, 206)",
                                          }}
                                        >
                                          {formatDate(task.dateTime)}
                                        </b>
                                      </span>
                                      <hr></hr>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        {/* <span>
                                        <input
                                          type="checkbox"
                                          checked={task.status == "Done"}
                                          name="status"
                                          onChange={() =>
                                            handlestatus(task.id)
                                          }
                                        />
                                      </span> */}
                                        <label className="checkbox">
                                          <input
                                            type="checkbox"
                                            className="checkbox__input"
                                            checked={task.status == "Done"}
                                            name="status"
                                            onChange={() =>
                                              handlestatus(task.id)
                                            }
                                          />
                                          <span className="checkbox__inner"></span>
                                        </label>
                                        <span>
                                          {getUsernameById(task.assignedTo)}
                                        </span>
                                      </div>
                                    </div>
                                  </span>
                                ))}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </React.Fragment>
                  );
                })
              : ""}

            {isButtonVisible ? (
              <div>
                <button className="addtasklistbutton" onClick={toggleButton}>
                  <GrAdd className="addicon" />
                  Create a new tasklist
                </button>
              </div>
            ) : (
              <div
                className="addtasklistbutton"
                style={{ backgroundColor: "#1f5c87" }}
              >
                <input
                  style={{
                    margin: "10px",
                    borderRadius: "7px",
                    padding: "4px",
                  }}
                  type="text"
                  name="taskC"
                  onChange={(e: any) => {
                    settaskC(e.target.value);
                  }}
                  value={taskC}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTaskC(e);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
