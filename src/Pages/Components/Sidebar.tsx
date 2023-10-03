import React from "react";
import { HiOutlineUsers } from "react-icons/hi";
import { GoTasklist } from "react-icons/go";
import { GrAddCircle } from "react-icons/gr";
import { AiOutlineFolderAdd } from "react-icons/ai";
import axios from "axios";
import "../../css/Sidebar.css";
import { useState, useEffect } from "react";
import {
  BsPersonFillAdd,
  BsCalendarDateFill,
  BsFolderPlus,
} from "react-icons/bs";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CModalBody,
  CFormTextarea,
} from "@coreui/react";
import AddUser from "../Users";
import Prac from "../Prac";

import { Link } from "react-router-dom";
import { BiCategory, BiTask } from "react-icons/bi";
import { RiTaskLine } from "react-icons/ri";
export default function Sidebar() {
  const roleId = localStorage.getItem("roleId");
  const [vm, setvm] = useState(false);
  const id = localStorage.getItem("id");
  const [d, setd] = useState([]);
  const [proj, setproj] = useState([]);
  const [taskl, settaskl] = useState([]);

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
    getD();
    gettaskl();
    getproject();
  }, []);

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
  const getproject = () => {
    axios
      .get("https://localhost:7282/api/Project")
      .then((result) => {
        setproj(result.data);
        console.log(result.data);
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

  const handleChange = (e: any) => {
    e.preventDefault();
    setu({ ...u, [e.target.name]: e.target.value });
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
      })
      .catch((error) => {
        alert(error);
      });
    console.log(t);
    setvm(false);
  };

  return (
    <>
      <div className="sidenav">
        {(roleId === "2" || roleId === "1") && (
          <>
            <a
              onClick={() => {
                setvm(!vm);
              }}
            >
              <GrAddCircle size={32} color="022b3a" className="taskpageIcons" />
            </a>
            <Link to="/Project">
              <AiOutlineFolderAdd
                size={32}
                color="233d4d"
                className="taskpageIcons"
              />
            </Link>
            <Link to="/Task">
              <BiTask size={32} color="022b3a" className="taskpageIcons" />
            </Link>
          </>
        )}
        <Link to="/ToDo">
          <GoTasklist size={32} color="022b3a" className="taskpageIcons" />
        </Link>
        <Link to="/MyTask">
          <RiTaskLine size={32} color="022b3a" className="taskpageIcons" />
        </Link>
        {roleId === "1" && (
          <Link to="/CrudUsers">
            {" "}
            <HiOutlineUsers
              size={32}
              color="022b3a"
              className="taskpageIcons"
            />
          </Link>
        )}
        {roleId === "2" && (
          <Link to="/Users">
            {" "}
            <HiOutlineUsers
              size={32}
              color="022b3a"
              className="taskpageIcons"
            />
          </Link>
        )}
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
