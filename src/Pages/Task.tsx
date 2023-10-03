import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import {
  CButton,
  CCard,
  CCardBody,
  CCardLink,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import axios from "axios";
import "../css/Task.css";
import { Button, Offcanvas } from "react-bootstrap";
import {
  BsCalendarDateFill,
  BsFolderPlus,
  BsPersonFillAdd,
} from "react-icons/bs";
import { renderToStaticMarkup } from "react-dom/server";
import { BiBorderRadius, BiCategory, BiSearchAlt2 } from "react-icons/bi";

export default function Mytask() {
  const id = localStorage.getItem("id");
  // const [task, settask] = useState([]);
  // const [data, setdata] = useState([]);
  const [check, setcheck] = useState(false);
  const [status, setstatus] = useState("all");
  const [t, sett] = useState([]);
  const [d, setd] = useState([]);
  const [assignto, setassignto] = useState("");
  const [manager, setmanager] = useState("");
  const [proj, setproj] = useState([]);
  const [taskl, settaskl] = useState([]);
  const [filterDate, setfilterDate] = useState("");
  const [vm, setvm] = useState(false);
  const [search, setsearch] = useState("");
  const [filterproj, setfilterproj] = useState("");
  const [sort, setsort] = useState(false);

  const [editt, seteditt] = useState({
    id: 0,
    assignedBy: 0,
    assignedTo: 0,
    task: "",
    dateTime: "",
    status: "",
    taskL: 0,
    projectId: 0,
  });

  const [u, setu] = useState({
    id: 0,
    assignedBy: 0,
    assignedTo: 0,
    task: "",
    dateTime: "",
    status: "",
    taskL: 0,
    projectId: 0,
  });
  useEffect(() => {
    // gettask();
    gett();
    getD();
    getproject();
    gettaskl();
  }, []);

  const getproject = () => {
    axios
      .get("https://localhost:7282/api/Project")
      .then((result) => {
        setproj(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const gettaskl = () => {
    axios
      .get("https://localhost:7282/api/TaskType")
      .then((result) => {
        settaskl(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getD = () => {
    axios
      .get("https://localhost:7282/api/User/ListofUser")
      .then((result: any) => {
        setd(result.data);
        // console.log(result.data)
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => {
    setShowOffcanvas(false);
  };
  const handleShow = (item: any) => {
    setShowOffcanvas(true);
    const t = {
      id: item.id,
      assignedBy: d.find((manager) => manager.username === item.manager)?.id,
      assignedTo: d.find((manager) => manager.username === item.assignTo)?.id,
      task: item.task,
      dateTime: item.dateTime,
      status: item.status,
      taskL: taskl.find((taskC) => taskC.taskType === item.taskLName)?.id,
      projectId: proj.find(
        (project) => project.projectName === item.projectName
      )?.id,
    };
    console.log(t);
    console.log(item);
    console.log(taskl);
    seteditt({
      id: item.id,
      assignedBy: Number(
        d.find((manager: any) => manager.username === item.manager)?.id
      ),
      assignedTo: Number(
        d.find((manager: any) => manager.username === item.assignTo)?.id
      ),
      task: item.task,
      dateTime: item.dateTime,
      status: item.status,
      taskL: taskl.find((t: any) => t.taskType === item.taskLName)?.id,
      projectId: proj.find(
        (project) => project.projectName === item.projectName
      )?.id,
    });
  };

  const gett = () => {
    axios
      .get(`https://localhost:7282/api/Task/TaskListWithName`)
      .then((result) => {
        sett(result.data);
        console.log(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const gettask = () => {
  //   axios
  //     .get(`https://localhost:7282/api/Task/MyTaskWithName/${id}`)
  //     .then((result) => {
  //       settask(result.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
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
        gett();
      })
      .catch((error) => {
        alert(error);
      });
  };

  const delTask = (id: any) => {
    axios
      .delete(`https://localhost:7282/api/Task/${id}`)
      .then((result) => {
        gett();
        setShowOffcanvas(!showOffcanvas);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const filterStatus = (e: any) => {
    setstatus(e.target.value);
  };
  const handleChange = (e: any) => {
    e.preventDefault();
    setu({ ...u, [e.target.name]: e.target.value });
  };
  const edittask = (e: any) => {
    e.preventDefault();
    console.log(editt);
    const t = {
      id: editt.id,
      assignedBy: Number(editt.assignedBy),
      assignedTo: Number(editt.assignedTo),
      task: editt.task,
      dateTime: new Date(editt.dateTime),
      status: editt.status,
      taskL: Number(editt.taskL),
      projectId: Number(editt.projectId),
    };
    axios
      .put(`https://localhost:7282/api/Task/${t.id}`, t)
      .then((result) => {
        gett();
        setShowOffcanvas(!showOffcanvas);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const assignTask = (e: any) => {
    e.preventDefault();
    const t = {
      id: 0,
      assignedBy: id,
      assignedTo: u.assignedTo,
      task: u.task,
      dateTime: u.dateTime,
      status: "ToDo",
      taskL: u.taskL,
      projectId: u.projectId,
    };
    axios
      .post("https://localhost:7282/api/Task", t)
      .then((result) => {
        console.log("success");
        getD();
      })
      .catch((error) => {
        alert(error);
      });
    console.log(t);
    setvm(false);
  };
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
      <div className="wrapper">
        <Navbar />
        <Sidebar />

        <div className="mainpage">
          <h1>Task</h1>
          <div className="taskPage maincontentT">
            <div className="taskFilter">
              <div>
                <h6 style={{ fontWeight: "bold", margin: "8px 2px 8px 2px" }}>
                  Status
                </h6>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <div>
                    <input
                      type="radio"
                      name="status"
                      onChange={filterStatus}
                      value="active"
                    />
                    Active
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="status"
                      onChange={filterStatus}
                      value="complete"
                    />
                    Completed
                  </div>
                  <div>
                    <input
                      checked
                      type="radio"
                      name="status"
                      onChange={filterStatus}
                      value="all"
                    />
                    All
                  </div>
                </div>
              </div>
              <div>
                <h6>Assigned To</h6>
                {/* <select
                  name="assignto"
                  onChange={(e: any) => {
                    setassignto(e.target.value);
                  }}
                  style={{ marginRight: "25px" }}
                >
                  <option value="">--select--</option>
                  {d.map((item: any, index: any) => {
                    return (
                      <option value={item.username}>{item.username}</option>
                    );
                  })}
                </select> */}

                <div className="input-addon" style={{ width: "70%" }}>
                  <select
                    className="form-element input-field "
                    name="assignto"
                    onChange={(e: any) => {
                      setassignto(e.target.value);
                    }}
                  >
                    <option value="">--select--</option>
                    {d.map((item: any, index: any) => {
                      return (
                        <option value={item.username}>{item.username}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div>
                <h6>Created by </h6>
                <div className="input-addon" style={{ width: "70%" }}>
                  <select
                    className="form-element input-field "
                    name="manager"
                    onChange={(e: any) => {
                      setmanager(e.target.value);
                    }}
                  >
                    <option value="">--select--</option>
                    {d.map((item: any, index: any) => {
                      return (
                        <option value={item.username}>{item.username}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div>
                <h6>Date</h6>
                <div className="input-addon" style={{ width: "70%" }}>
                  <input
                    className="form-element input-field "
                    type="date"
                    onChange={(e: any) => setfilterDate(e.target.value)}
                    value={filterDate}
                  />
                </div>
              </div>

              <div>
                <h6>Project</h6>
                <div className="input-addon" style={{ width: "70%" }}>
                  <select
                    className="form-element input-field "
                    name="filterproj"
                    onChange={(e: any) => {
                      setfilterproj(e.target.value);
                    }}
                  >
                    <option value="">--select--</option>
                    {proj.map((item: any, index: any) => {
                      return (
                        <option value={item.projectName}>
                          {item.projectName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            {/* <div className="taskCard">
              {task && task.length > 0
                ? task.map((item: any, index: any) => {
                    return (
                      <div key={index}>
                        <CCard style={{ width: "18rem" }} onClick={() => handleShow(item)}>
                          <CCardBody>
                            <CCardSubtitle className="mb-2 text-medium-emphasis">
                              <span>
                                {item.projectName} &gt; {item.taskLName}
                              </span>
                            </CCardSubtitle>
                            <CCardText>
                            <input type="checkbox" checked={item.status=='Done'} name="status" onChange={()=>handlestatus(item.id)}/> {item.task}
                            </CCardText>
                          </CCardBody>
                        </CCard>
                      </div>
                    );
                  })
                : "No task"}

              
            </div> */}

            <div className="taskGrpCard">
              <div className="addbtn">
                <button
                  className="taskButton "
                  onClick={() => {
                    setvm(true);
                    console.log("hee");
                  }}
                >
                  Add Task
                </button>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="search"
                    value={search}
                    onChange={(e) => setsearch(e.target.value)}
                    placeholder="Search task"
                    className="search-input"
                  />
                  <div className="search-icon">
                    <BiSearchAlt2 />
                  </div>
                </div>
                <div className=" input-wrapper sort">
                  <select
                    className="search-input"
                    style={{ height: "1.5rem" }}
                    name="filterproj"
                    onChange={(e: any) => {
                      const selectedOption = e.target.value;
                      if (selectedOption === "sort") {
                        setsort(true);
                      } else {
                        setsort(false);
                      }
                    }}
                  >
                    <option value="create">By Creation</option>
                    <option value="sort">By Date</option>
                  </select>
                </div>
              </div>
              {status == "active" && t.length > 0
                ? (sort
                    ? t.slice().sort((a: any, b: any) => {
                        const dateA = new Date(a.dateTime);
                        const dateB = new Date(b.dateTime);
                        if (dateA < dateB) return -1;
                        if (dateA > dateB) return 1;
                        return 0;
                      })
                    : t
                  )
                    .filter((item: any) => {
                      return (
                        item.status != "Done" &&
                        (assignto === "" || assignto === item.assignTo) &&
                        (manager === "" || manager === item.manager) &&
                        (filterDate === "" ||
                          new Date(filterDate).toDateString() ===
                            new Date(item.dateTime).toDateString()) &&
                        (filterproj === "" ||
                          filterproj === item.projectName) &&
                        (search === "" || search === item.task)
                      );
                    })

                    .map((item: any, index: any) => {
                      return (
                        <div key={index}>
                          <CCard
                            className="taskCard"
                            onDoubleClick={() => handleShow(item)}
                          >
                            <CCardBody
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
                                  <span>
                                    {item.projectName} &gt; {item.taskLName}
                                  </span>
                                </CCardSubtitle>
                                <CCardText className="taskname">
                                  <label className="checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox__input"
                                      checked={item.status == "Done"}
                                      name="status"
                                      onChange={() => handlestatus(item.id)}
                                    />
                                    <span className="checkbox__inner"></span>
                                  </label>
                                  <div>{item.task}</div>
                                </CCardText>
                              </div>
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
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
                                      {formatDate(item.dateTime)}
                                    </b>
                                  </span>
                                </CCardSubtitle>
                                <CCardText>
                                  <span>{item.assignTo}</span>
                                </CCardText>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      );
                    })
                : null}
              {status == "complete" && t.length > 0
                ? (sort
                    ? t.slice().sort((a: any, b: any) => {
                        const dateA = new Date(a.dateTime);
                        const dateB = new Date(b.dateTime);
                        if (dateA < dateB) return -1;
                        if (dateA > dateB) return 1;
                        return 0;
                      })
                    : t
                  )
                    .filter((item: any) => {
                      return (
                        item.status == "Done" &&
                        (assignto === "" || assignto === item.assignTo) &&
                        (manager === "" || manager === item.manager) &&
                        (filterDate === "" ||
                          new Date(filterDate).toDateString() ===
                            new Date(item.dateTime).toDateString()) &&
                        (filterproj === "" ||
                          filterproj === item.projectName) &&
                        (search === "" || search === item.task)
                      );
                    })

                    .map((item: any, index: any) => {
                      return (
                        <div key={index}>
                          <CCard
                            className="taskCard"
                            onDoubleClick={() => handleShow(item)}
                          >
                            <CCardBody
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
                                  <span>
                                    {item.projectName} &gt; {item.taskLName}
                                  </span>
                                </CCardSubtitle>
                                <CCardText className="taskname">
                                  <label className="checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox__input"
                                      checked={item.status == "Done"}
                                      name="status"
                                      onChange={() => handlestatus(item.id)}
                                    />
                                    <span className="checkbox__inner"></span>
                                  </label>
                                  <span>{item.task}</span>
                                </CCardText>
                              </div>
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
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
                                      {formatDate(item.dateTime)}
                                    </b>
                                  </span>
                                </CCardSubtitle>
                                <CCardText>
                                  <span>{item.assignTo}</span>
                                </CCardText>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      );
                    })
                : null}
              {status == "all" && t.length > 0
                ? (sort
                    ? t.slice().sort((a: any, b: any) => {
                        const dateA = new Date(a.dateTime);
                        const dateB = new Date(b.dateTime);
                        if (dateA < dateB) return -1;
                        if (dateA > dateB) return 1;
                        return 0;
                      })
                    : t
                  )
                    .filter((item: any) => {
                      return (
                        (assignto === "" || assignto === item.assignTo) &&
                        (manager === "" || manager === item.manager) &&
                        (filterDate === "" ||
                          new Date(filterDate).toDateString() ===
                            new Date(item.dateTime).toDateString()) &&
                        (filterproj === "" ||
                          filterproj === item.projectName) &&
                        (search === "" || search === item.task)
                      );
                    })
                    .map((item: any, index: any) => {
                      return (
                        <div key={index}>
                          <CCard
                            className="taskCard"
                            onDoubleClick={() => handleShow(item)}
                          >
                            <CCardBody
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
                                  <span>
                                    {item.projectName} &gt; {item.taskLName}
                                  </span>
                                </CCardSubtitle>
                                <CCardText className="taskname">
                                  <label className="checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox__input"
                                      checked={item.status == "Done"}
                                      name="status"
                                      onChange={() => handlestatus(item.id)}
                                    />
                                    <span className="checkbox__inner"></span>
                                  </label>
                                  <span>{item.task}</span>
                                </CCardText>
                              </div>
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
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
                                      {formatDate(item.dateTime)}
                                    </b>
                                  </span>
                                </CCardSubtitle>
                                <CCardText>
                                  <span>{item.assignTo}</span>
                                </CCardText>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      );
                    })
                : null}

              {/* {status == "active" && t.length > 0
                ? t
                    .filter((item: any) => {
                      return (
                        item.status != "Done" &&
                        assignto == item.assignTo &&
                        manager == ""
                      );
                    })
                    .map((item: any, index: any) => {
                      return (
                        <div key={index}>
                          <CCard
                            className="taskCard"
                            onDoubleClick={() => handleShow(item)}
                          >
                            <CCardBody
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
                                  <span>
                                    {item.projectName} &gt; {item.taskLName}
                                  </span>
                                </CCardSubtitle>
                                <CCardText className="taskname">
                                  <label className="checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox__input"
                                      checked={item.status == "Done"}
                                      name="status"
                                      onChange={() => handlestatus(item.id)}
                                    />
                                    <span className="checkbox__inner"></span>
                                  </label>
                                  <span>{item.task}</span>
                                </CCardText>
                              </div>
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
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
                                      {formatDate(item.dateTime)}
                                    </b>
                                  </span>
                                </CCardSubtitle>
                                <CCardText>
                                  <span>{item.assignTo}</span>
                                </CCardText>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      );
                    })
                : null}
              {status == "complete" && t.length > 0
                ? t
                    .filter((item: any) => {
                      return (
                        item.status == "Done" &&
                        assignto == item.assignTo &&
                        manager == ""
                      );
                    })
                    .map((item: any, index: any) => {
                      return (
                        <div key={index}>
                          <CCard
                            className="taskCard"
                            onDoubleClick={() => handleShow(item)}
                          >
                            <CCardBody
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
                                  <span>
                                    {item.projectName} &gt; {item.taskLName}
                                  </span>
                                </CCardSubtitle>
                                <CCardText className="taskname">
                                  <label className="checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox__input"
                                      checked={item.status == "Done"}
                                      name="status"
                                      onChange={() => handlestatus(item.id)}
                                    />
                                    <span className="checkbox__inner"></span>
                                  </label>
                                  <span>{item.task}</span>
                                </CCardText>
                              </div>
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
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
                                      {formatDate(item.dateTime)}
                                    </b>
                                  </span>
                                </CCardSubtitle>
                                <CCardText>
                                  <span>{item.assignTo}</span>
                                </CCardText>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      );
                    })
                : null}
              {status == "all" && t.length > 0
                ? t
                    .filter((item: any) => {
                      return assignto == item.assignTo && manager == "";
                    })
                    .map((item: any, index: any) => {
                      return (
                        <div key={index}>
                          <CCard
                            className="taskCard"
                            onDoubleClick={() => handleShow(item)}
                          >
                            <CCardBody
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
                                  <span>
                                    {item.projectName} &gt; {item.taskLName}
                                  </span>
                                </CCardSubtitle>
                                <CCardText className="taskname">
                                  <label className="checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox__input"
                                      checked={item.status == "Done"}
                                      name="status"
                                      onChange={() => handlestatus(item.id)}
                                    />
                                    <span className="checkbox__inner"></span>
                                  </label>
                                  <span>{item.task}</span>
                                </CCardText>
                              </div>
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
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
                                      {formatDate(item.dateTime)}
                                    </b>
                                  </span>
                                </CCardSubtitle>
                                <CCardText>
                                  <span>{item.assignTo}</span>
                                </CCardText>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      );
                    })
                : null}

              {status == "active" && t.length > 0
                ? t
                    .filter((item: any) => {
                      return (
                        item.status != "Done" &&
                        assignto == item.assignTo &&
                        manager == item.manager
                      );
                    })
                    .map((item: any, index: any) => {
                      return (
                        <div key={index}>
                          <CCard
                            className="taskCard"
                            onDoubleClick={() => handleShow(item)}
                          >
                            <CCardBody
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
                                  <span>
                                    {item.projectName} &gt; {item.taskLName}
                                  </span>
                                </CCardSubtitle>
                                <CCardText className="taskname">
                                  <label className="checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox__input"
                                      checked={item.status == "Done"}
                                      name="status"
                                      onChange={() => handlestatus(item.id)}
                                    />
                                    <span className="checkbox__inner"></span>
                                  </label>
                                  <span>{item.task}</span>
                                </CCardText>
                              </div>
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
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
                                      {formatDate(item.dateTime)}
                                    </b>
                                  </span>
                                </CCardSubtitle>
                                <CCardText>
                                  <span>{item.assignTo}</span>
                                </CCardText>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      );
                    })
                : null}
              {status == "complete" && t.length > 0
                ? t
                    .filter((item: any) => {
                      return (
                        item.status == "Done" &&
                        assignto == item.assignTo &&
                        manager == item.manager
                      );
                    })
                    .map((item: any, index: any) => {
                      return (
                        <div key={index}>
                          <CCard
                            className="taskCard"
                            onDoubleClick={() => handleShow(item)}
                          >
                            <CCardBody
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
                                  <span>
                                    {item.projectName} &gt; {item.taskLName}
                                  </span>
                                </CCardSubtitle>
                                <CCardText className="taskname">
                                  <label className="checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox__input"
                                      checked={item.status == "Done"}
                                      name="status"
                                      onChange={() => handlestatus(item.id)}
                                    />
                                    <span className="checkbox__inner"></span>
                                  </label>
                                  <span>{item.task}</span>
                                </CCardText>
                              </div>
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
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
                                      {formatDate(item.dateTime)}
                                    </b>
                                  </span>
                                </CCardSubtitle>
                                <CCardText>
                                  <span>{item.assignTo}</span>
                                </CCardText>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      );
                    })
                : null}
              {status == "all" && t.length > 0
                ? t
                    .filter((item: any) => {
                      return (
                        assignto == item.assignTo && manager == item.manager
                      );
                    })
                    .map((item: any, index: any) => {
                      return (
                        <div key={index}>
                          <CCard
                            className="taskCard"
                            onDoubleClick={() => handleShow(item)}
                          >
                            <CCardBody
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
                                  <span>
                                    {item.projectName} &gt; {item.taskLName}
                                  </span>
                                </CCardSubtitle>
                                <CCardText className="taskname">
                                  <label className="checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox__input"
                                      checked={item.status == "Done"}
                                      name="status"
                                      onChange={() => handlestatus(item.id)}
                                    />
                                    <span className="checkbox__inner"></span>
                                  </label>
                                  <span>{item.task}</span>
                                </CCardText>
                              </div>
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
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
                                      {formatDate(item.dateTime)}
                                    </b>
                                  </span>
                                </CCardSubtitle>
                                <CCardText>
                                  <span>{item.assignTo}</span>
                                </CCardText>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      );
                    })
                : null}

              {status == "active" && t.length > 0
                ? t
                    .filter((item: any) => {
                      return (
                        item.status != "Done" &&
                        assignto == "" &&
                        manager == item.manager
                      );
                    })
                    .map((item: any, index: any) => {
                      return (
                        <div key={index}>
                          <CCard
                            className="taskCard"
                            onDoubleClick={() => handleShow(item)}
                          >
                            <CCardBody
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
                                  <span>
                                    {item.projectName} &gt; {item.taskLName}
                                  </span>
                                </CCardSubtitle>
                                <CCardText>
                                  <label className="checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox__input"
                                      checked={item.status == "Done"}
                                      name="status"
                                      onChange={() => handlestatus(item.id)}
                                    />
                                    <span className="checkbox__inner"></span>
                                  </label>
                                  <span>{item.task}</span>
                                </CCardText>
                              </div>
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
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
                                      {formatDate(item.dateTime)}
                                    </b>
                                  </span>
                                </CCardSubtitle>
                                <CCardText>
                                  <span>{item.assignTo}</span>
                                </CCardText>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      );
                    })
                : null}
              {status == "all" && t.length > 0
                ? t
                    .filter((item: any) => {
                      return assignto == "" && manager == item.manager;
                    })
                    .map((item: any, index: any) => {
                      return (
                        <div key={index}>
                          <CCard
                            className="taskCard"
                            onDoubleClick={() => handleShow(item)}
                          >
                            <CCardBody
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
                                  <span>
                                    {item.projectName} &gt; {item.taskLName}
                                  </span>
                                </CCardSubtitle>
                                <CCardText className="taskname">
                                  <label className="checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox__input"
                                      checked={item.status == "Done"}
                                      name="status"
                                      onChange={() => handlestatus(item.id)}
                                    />
                                    <span className="checkbox__inner"></span>
                                  </label>
                                  <span>{item.task}</span>
                                </CCardText>
                              </div>
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis">
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
                                      {formatDate(item.dateTime)}
                                    </b>
                                  </span>
                                </CCardSubtitle>
                                <CCardText>
                                  <span>{item.assignTo}</span>
                                </CCardText>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      );
                    })
                : null} */}
            </div>
          </div>

          <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Task Details</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="taskdetail">
                {/* <div
                  style={{ display: "flex", flexDirection: "row", gap: "15px" }}
                >
                  <span>Manager:</span>
                  <span>
                    {" "}
                    <select
                      name="assignedBy"
                      onChange={(e: any) => {
                        seteditt({ ...editt, [e.target.name]: e.target.value });
                      }}
                      style={{ marginRight: "25px" }}
                      value={editt.assignedBy}
                    >
                      {d.map((item: any, index: any) => {
                        return <option value={item.id}>{item.username}</option>;
                      })}
                    </select>
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "15px" }}
                >
                  Assigned to:
                  <select
                    name="assignedTo"
                    onChange={(e: any) => {
                      seteditt({ ...editt, [e.target.name]: e.target.value });
                    }}
                    style={{ marginRight: "25px" }}
                    value={editt.assignedTo}
                  >
                    {d.map((item: any, index: any) => {
                      return <option value={item.id}>{item.username}</option>;
                    })}
                  </select>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "15px" }}
                >
                  Project:
                  <select
                    name="projectId"
                    onChange={(e: any) => {
                      seteditt({ ...editt, [e.target.name]: e.target.value });
                    }}
                    style={{ marginRight: "25px" }}
                    value={editt.projectId}
                  >
                    {proj.map((item: any, index: any) => {
                      return (
                        <option value={item.id}>{item.projectName}</option>
                      );
                    })}
                  </select>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "15px" }}
                >
                  TaskCategory:
                  <select
                    name="taskL"
                    onChange={(e: any) => {
                      seteditt({ ...editt, [e.target.name]: e.target.value });
                    }}
                    style={{ marginRight: "25px" }}
                    value={editt.taskL}
                  >
                    {taskl.map((item: any, index: any) => {
                      return <option value={item.id}>{item.taskType}</option>;
                    })}
                  </select>
                </div>
                <div>
                  Task:
                  <input
                    type="text"
                    name="task"
                    value={editt.task}
                    onChange={(e: any) => {
                      seteditt({ ...editt, [e.target.name]: e.target.value });
                    }}
                  />
                </div>
                <div>
                  Date:
                  <input
                    type="date"
                    name="dateTime"
                    value={editt.dateTime}
                    onChange={(e: any) => {
                      seteditt({ ...editt, [e.target.name]: e.target.value });
                    }}
                  />
                </div>
                <div>
                  Status:
                  <input
                    type="text"
                    name="status"
                    value={editt.status}
                    onChange={(e: any) => {
                      seteditt({ ...editt, [e.target.name]: e.target.value });
                    }}
                  />
                </div>*/}
              </div>
              <div className="taskFilter">
                {/* <div>
                <h6 style={{ fontWeight: "bold", margin: "8px 2px 8px 2px" }}>
                  Status
                </h6>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <div>
                    <input
                      type="radio"
                      name="status"
                      onChange={filterStatus}
                      value="active"
                    />
                    Active
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="status"
                      onChange={filterStatus}
                      value="complete"
                    />
                    Completed
                  </div>
                  <div>
                    <input
                      checked
                      type="radio"
                      name="status"
                      onChange={filterStatus}
                      value="all"
                    />
                    All
                  </div>
                </div>
              </div> */}
                <div>
                  <h6>Manager</h6>

                  <div className="input-addon" style={{ width: "70%" }}>
                    <select
                      className="form-element input-field "
                      name="assignedBy"
                      onChange={(e: any) => {
                        seteditt({ ...editt, [e.target.name]: e.target.value });
                      }}
                    >
                      {" "}
                      {d.map((item: any, index: any) => {
                        return <option value={item.id}>{item.username}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div>
                  <h6>Assigned To </h6>
                  <div className="input-addon" style={{ width: "70%" }}>
                    <select
                      className="form-element input-field "
                      name="assignedTo"
                      onChange={(e: any) => {
                        seteditt({ ...editt, [e.target.name]: e.target.value });
                      }}
                      value={editt.assignedTo}
                    >
                      {d.map((item: any, index: any) => {
                        return <option value={item.id}>{item.username}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div>
                  <h6>Task</h6>
                  <div className="input-addon" style={{ width: "70%" }}>
                    <input
                      className="form-element input-field "
                      type="text"
                      name="task"
                      value={editt.task}
                      onChange={(e: any) => {
                        seteditt({ ...editt, [e.target.name]: e.target.value });
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h6>Task Category</h6>
                  <div className="input-addon" style={{ width: "70%" }}>
                    <select
                      className="form-element input-field "
                      name="taskL"
                      onChange={(e: any) => {
                        seteditt({ ...editt, [e.target.name]: e.target.value });
                      }}
                      value={editt.taskL}
                    >
                      {taskl.map((item: any, index: any) => {
                        return <option value={item.id}>{item.taskType}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div>
                  <h6>Date</h6>
                  <div className="input-addon" style={{ width: "70%" }}>
                    <input
                      className="form-element input-field "
                      type="date"
                      name="dateTime"
                      value={editt.dateTime}
                      onChange={(e: any) => {
                        seteditt({ ...editt, [e.target.name]: e.target.value });
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h6>Status</h6>
                  <div className="input-addon" style={{ width: "70%" }}>
                    <input
                      className="form-element input-field "
                      type="text"
                      name="status"
                      value={editt.status}
                      onChange={(e: any) => {
                        seteditt({ ...editt, [e.target.name]: e.target.value });
                      }}
                    />
                  </div>
                </div>
              </div>
            </Offcanvas.Body>
            <div className="offcanvasfooter">
              <button onClick={edittask} className="taskButton">
                Edit Task
              </button>
              <button onClick={() => delTask(editt.id)} className="taskdel">
                Delete Task
              </button>
            </div>
          </Offcanvas>
        </div>
      </div>
      <CModal alignment="center" visible={vm} onClose={() => setvm(false)}>
        <CModalHeader>
          <CModalTitle>New Task</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormTextarea
            name="task"
            floatingClassName="mb-3"
            floatingLabel="Task"
            placeholder="Task"
            style={{ height: "100px" }}
            onChange={handleChange}
            value={u.task}
          />
          <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div className="input-wrapper">
                <BiCategory
                  for="taskL"
                  size={25}
                  color="grey"
                  className="search-icon"
                />
                <select
                  name="taskL"
                  onChange={handleChange}
                  style={{ width: "12rem", height: "2rem" }}
                  value={u.taskL}
                  className="search-input"
                >
                  {taskl.map((item: any, index: any) => {
                    return <option value={item.id}>{item.taskType}</option>;
                  })}
                </select>
              </div>

              <div className="input-wrapper">
                <BsFolderPlus
                  className="search-icon"
                  size={25}
                  style={{ marginRight: "10px" }}
                  color="grey"
                />
                <select
                  name="projectId"
                  onChange={handleChange}
                  className="search-input"
                  style={{ width: "12rem", height: "2rem" }}
                >
                  {proj.map((item: any, index: any) => {
                    return <option value={item.id}>{item.projectName}</option>;
                  })}
                </select>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div className="input-wrapper">
                <BsPersonFillAdd
                  for="assignedTo"
                  className="search-icon"
                  size={25}
                  style={{ marginRight: "10px" }}
                  color="grey"
                />
                <select
                  name="assignedTo"
                  onChange={handleChange}
                  value={u.assignedTo}
                  className="search-input"
                  style={{ width: "12rem", height: "2rem" }}
                >
                  {d.map((item: any, index: any) => {
                    return <option value={item.id}>{item.name}</option>;
                  })}
                </select>
              </div>
              <div className="input-wrapper">
                <BsCalendarDateFill
                  className="search-icon"
                  size={25}
                  style={{ marginRight: "10px" }}
                  color="grey"
                />
                <input
                  type="date"
                  name="dateTime"
                  value={u.dateTime}
                  onChange={handleChange}
                  className="search-input"
                  style={{ width: "12rem", height: "2rem" }}
                />
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton className="taskButton" onClick={assignTask}>
            Add Task
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}
