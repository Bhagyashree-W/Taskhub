import React, { useState, useEffect } from "react";
import "@coreui/coreui/dist/css/coreui.min.css";
import {
  CButton,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CCard,
} from "@coreui/react";
import axios from "axios";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import "../../src/css/CrudUsers.css";

import { BiEditAlt, BiSolidUser } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import Alert from "./Components/Alerts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiTwotoneMail } from "react-icons/ai";
import { RiAdminFill } from "react-icons/ri";
import { FaUserCheck } from "react-icons/fa";
export default function Users() {
  const [data, setdata]: any = useState([]);
  const [visible, setVisible] = useState(false);
  const [dvisible, dsetVisible] = useState(false);

  const [muser, msetuser] = useState({
    id: "",
    name: "",
    email: "",
    roleId: "1",
    username: "",
    password: "",
  });
  const [sid, setid] = useState("");
  const [role, setrole] = useState([]);
  const [roleN, setroleN] = useState([]);
  const [addtaskbutton, setaddtaskbutton] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [alertvisible, setalertVisible] = useState(false);
  const [delid, setdelid] = useState(0);

  // ... Rest of the component ...

  // Function to show an alert
  const showAlert = (type: string, message: string) => {
    setAlert({ type, message });
    setalertVisible(true);

    // Hide the alert after 3 seconds
    setTimeout(() => {
      setalertVisible(false);
    }, 3000);
  };

  useEffect(() => {
    getData();
    getrole();
  }, []);

  const getrole = () => {
    axios
      .get("https://localhost:7282/api/Role")
      .then((r) => {
        setrole(r.data);
      })
      .catch((error) => {});
  };

  const getData = () => {
    axios
      .get("https://localhost:7282/api/User/ListofUser")
      .then((result: any) => {
        setdata(result.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const notify = () => toast.success("User deleted successfully!");
  const error = () => toast.error("User cannot be deleted!");

  const handleChange = (e: any) => {
    e.preventDefault();
    msetuser({ ...muser, [e.target.name]: e.target.value });
  };

  const submit = (e: any) => {
    e.preventDefault();
    console.log(muser);
    console.log(sid);
    axios
      .get(`https://localhost:7282/api/User?id=${sid}`)
      .then((result) => {
        console.log(result.data);
        const f = {
          id: sid,
          name: muser.name,
          email: muser.email,
          username: muser.username,
          roleId: muser.roleId,
          password: result.data.password,
        };

        axios
          .put(`https://localhost:7282/api/User/${sid}`, f)
          .then((result) => {
            //setVisible(false);
            getData();
            showAlert("success", "User updated successfully");
            msetuser({
              id: "",
              name: "",
              email: "",
              username: "",
              roleId: "",
              password: "",
            });
          })
          .catch((error) => {});
      })
      .catch((error) => {});
    setVisible(false);
  };

  const [user, setuser] = useState({
    Name: "",
    Role: "1",
    Email: "",
    Username: "",
    Password: "",
  });

  return (
    <>
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className=" mainpage">
          {" "}
          <h1>Users</h1>
          {/* Display the alert if visible */}
          {alertvisible && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setVisible(false)}
            />
          )}
          <div className="UsersPage maincontent">
            <table className="Usertable">
              <tbody>
                <tr>
                  <td>Sr.No</td>
                  <td>Id</td>
                  <td>Name</td>
                  <td>Email</td>
                  <td>Username</td>
                  <td>Role</td>
                </tr>

                {data && data.length > 0
                  ? data.map((item: any, index: any) => {
                      return (
                        <tr key={index} className="userrow">
                          <td>{index + 1}</td>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.username}</td>
                          <td>{item.roleId}</td>
                        </tr>
                      );
                    })
                  : "Loading..."}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
