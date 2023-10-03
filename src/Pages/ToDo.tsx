import React, { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import {
  CButton,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CCard,
  CCardBody,
  CCardSubtitle,
  CCardText,
} from "@coreui/react";
import axios from "axios";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../css/ToDo.css";
import { IoMdAdd } from "react-icons/io";
import { BsCalendarDateFill } from "react-icons/bs";

export default function ToDo() {
  const id = localStorage.getItem("id");
  const [todo, settodo] = useState([]);
  const [visible, setVisible] = useState(false);
  const [task, settask] = useState("");
  const [dvisible, dsetVisible] = useState(false);
  const [evisible, esetVisible] = useState(false);
  const [editid, seteditid] = useState(0);
  const [edittask, setedittask] = useState("");
  const [delid, setdelid] = useState(0);
  const [check, setcheck] = useState(false);
  const [filterDate, setfilterDate] = useState(new Date());
  const [etask, setetask] = useState({
    id: 10,
    assignedBy: id,
    assignedTo: id,
    task: "",
    dateTime: new Date(),
    status: "",
    taskL: 0,
    projectId: 0,
  });
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(`https://localhost:7282/api/Task/MyTodo/${id}`)
      .then((result: any) => {
        settodo(result.data);
        //console.log(result.data)
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const AddTodo = (e: any) => {
    e.preventDefault();
    const t = {
      id: 0,
      assignedBy: id,
      assignedTo: id,
      task: task,
      dateTime: new Date(),
      status: "ToDo",
      taskL: 0,
      projectId: 0,
    };
    console.log(t);
    axios
      .post("https://localhost:7282/api/Task", t)
      .then((result) => {
        console.log(t);
        getData();
      })
      .catch((error) => {
        alert(error);
        console.log(t);
      });
    setVisible(false);
  };

  const editTask = (id: any) => {
    console.log(id);
    axios
      .get(`https://localhost:7282/api/Task/${id}`)
      .then((result) => {
        setedittask(result.data.task);
        setetask(result.data);
      })
      .catch((error) => {
        alert("error occured");
      });
    esetVisible(!evisible);
  };
  const delTask = (id: any) => {
    axios
      .delete(`https://localhost:7282/api/Task/${id}`)
      .then((result) => {
        getData();
        dsetVisible(false);
      })
      .catch((error) => {
        alert(error);
      });
  };
  const savetask = (e: any) => {
    e.preventDefault();
    //  console.log(etask);
    const t = { ...etask, task: edittask };
    // console.log(t)
    axios
      .put(`https://localhost:7282/api/Task/${editid}`, t)
      .then((result) => {
        getData();
      })
      .catch((error) => {
        console.log(error);
      });
    esetVisible(!evisible);
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

  return (
    <>
      <div className=" wrapper">
        <Navbar />
        <Sidebar />
        <div className="mainpage">
          <h1>My ToDo</h1>
          <div className=" maincontent">
            <button onClick={() => setVisible(!visible)} className="addnewtask">
              <IoMdAdd /> AddTask
            </button>
            <hr></hr>
            <div className="taskCardTable">
              <h5>{filterDate.toDateString()}</h5>
              <input
                type="date"
                name="dateTime"
                value={filterDate.toISOString().split("T")[0]}
                onChange={(e) => setfilterDate(new Date(e.target.value))}
              />
              {/* {todo && todo.length > 0
                ? todo.map((item: any, index: any) => {
                    return (
                      <div key={index}>
                        <CCard
                          style={{
                            backgroundColor: "transparent",
                            border: "0px",
                          }}
                        >
                          <CCardBody className="cardtodo">
                            <div>
                              <input type="checkbox" />
                              {item.task}
                            </div>
                            <div>
                              <button
                                onClick={(e: any) => {
                                  editTask(item.id);
                                  seteditid(item.id);
                                }}
                              >
                                <BiEditAlt size={20} color="233d4d" />
                              </button>
                              <button
                                onClick={(e: any) => {
                                  dsetVisible(!dvisible);
                                  setdelid(item.id);
                                }}
                              >
                                <RiDeleteBin5Line size={20} color="233d4d" />
                              </button>
                            </div>
                          </CCardBody>
                        </CCard>
                      </div>
                    );
                  })
                : "No task"} */}
              {todo && todo.length > 0
                ? todo
                    .filter((item) => {
                      return (
                        new Date(item.dateTime).toDateString() ===
                        filterDate.toDateString()
                      );
                    })
                    .map((item: any, index: any) => {
                      return (
                        <div key={index}>
                          <CCard
                            style={{
                              backgroundColor: "transparent",
                              border: "0px",
                            }}
                          >
                            <CCardBody className="cardtodo">
                              <div>
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
                                <button
                                  onClick={(e: any) => {
                                    editTask(item.id);
                                    seteditid(item.id);
                                  }}
                                >
                                  <BiEditAlt size={20} color="233d4d" />
                                </button>
                                <button
                                  onClick={(e: any) => {
                                    dsetVisible(!dvisible);
                                    setdelid(item.id);
                                  }}
                                >
                                  <RiDeleteBin5Line size={20} color="233d4d" />
                                </button>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      );
                      return (
                        <div key={index}>
                          <CCard className="taskCard">
                            <CCardBody
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <CCardSubtitle className="mb-2 text-medium-emphasis"></CCardSubtitle>
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
                                  <button
                                    onClick={(e: any) => {
                                      editTask(item.id);
                                      seteditid(item.id);
                                    }}
                                  >
                                    <BiEditAlt size={20} color="233d4d" />
                                  </button>
                                  <button
                                    onClick={(e: any) => {
                                      dsetVisible(!dvisible);
                                      setdelid(item.id);
                                    }}
                                  >
                                    <RiDeleteBin5Line
                                      size={20}
                                      color="233d4d"
                                    />
                                  </button>
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
                : "No task"}
            </div>
          </div>

          <CModal
            alignment="center"
            visible={visible}
            onClose={() => setVisible(false)}
          >
            <CModalHeader>
              <CModalTitle>New Task</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CFormTextarea
                id="floatingInputValid"
                floatingClassName="mb-3"
                floatingLabel="Task"
                placeholder="Task"
                style={{ height: "100px" }}
                onChange={(e) => settask(e.target.value)}
              />
            </CModalBody>
            <CModalFooter>
              <CButton className="taskButton" onClick={AddTodo}>
                Add Task
              </CButton>
            </CModalFooter>
          </CModal>
          <CModal
            backdrop="static"
            visible={dvisible}
            onClose={() => setVisible(false)}
          >
            <CModalBody>Do you want to delete task</CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => dsetVisible(false)}>
                Close
              </CButton>
              <CButton color="primary" onClick={() => delTask(delid)}>
                Yes
              </CButton>
            </CModalFooter>
          </CModal>
          <CModal
            alignment="center"
            visible={evisible}
            onClose={() => esetVisible(false)}
          >
            <CModalHeader>
              <CModalTitle>Edit Task</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CFormTextarea
                id="floatingInputValid"
                floatingClassName="mb-3"
                floatingLabel="Task"
                style={{ height: "100px" }}
                onChange={(e) => setedittask(e.target.value)}
                value={edittask}
              />
            </CModalBody>
            <CModalFooter>
              <CButton className="taskButton" onClick={savetask}>
                Edit Task
              </CButton>
            </CModalFooter>
          </CModal>
        </div>
      </div>
    </>
  );
}
