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
import AddUsers from "./AddUsers";
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

  const handleEdit = (id: any) => {
    //alert(id)
    // handleShow();
    axios
      .get(`https://localhost:7282/api/User?id=${id}`)
      .then((result) => {
        msetuser({
          id: id,
          name: result.data.name,
          email: result.data.email,
          roleId: result.data.roleId,
          username: result.data.username,
          password: result.data.password,
        });
      })
      .catch((error) => {
        showAlert("danger", "User cannot be updated");
      });
    //handleShow(id);
    setVisible(true);
    setid(id);
  };

  const handleDel = (delid: any) => {
    axios
      .delete(`https://localhost:7282/api/User/${delid}`)
      .then((result) => {
        // showAlert('success', 'User deleted successfully');
        getData();
        dsetVisible(false);
        notify();
      })
      .catch((error) => {
        //showAlert('danger', 'User cannot be deleted');
        error();
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

  const handleChangeM = (e: any) => {
    e.preventDefault();
    setuser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getrole();
  }, []);

  const adduser = (e: any) => {
    e.preventDefault();
    setuser({ ...user, [e.target.name]: e.target.value });
    const t = {
      name: user.Name,
      roleId: user.Role,
      email: user.Email,
      username: user.Username,
      password: user.Password,
    };
    console.log(t);
    axios
      .post("https://localhost:7282/api/User", t)
      .then((result) => {
        console.log(t);
        getData();
        showAlert("success", "User added successfully");
      })
      .catch((error) => {
        console.log(error);
        showAlert("danger", "User addes successfully");
      });
    setuser({
      Name: "",
      Role: "",
      Email: "",
      Username: "",
      Password: "",
    });
    setaddtaskbutton(!addtaskbutton);
  };

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
          <div className="maincontent">
            <button
              onClick={() => setaddtaskbutton(!addtaskbutton)}
              className="addnewtask"
            >
              <IoMdAdd /> Add New User
            </button>
            <hr></hr>
            <CModal visible={visible} onClose={() => setVisible(false)}>
              <CModalHeader onClick={() => setVisible(false)}>
                <CModalTitle>Edit Data</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <form className="form-container" action="">
                  <div className="input-addon">
                    <button className="input-addon-item">
                      <span>
                        <BiSolidUser size={25} />
                      </span>
                    </button>
                    <input
                      className="form-element input-field"
                      placeholder="Name"
                      type="text"
                      name="name"
                      onChange={handleChange}
                      value={muser.name}
                    />
                  </div>
                  <div className="input-addon">
                    <button className="input-addon-item">
                      <span>
                        <AiTwotoneMail size={25} />
                      </span>
                    </button>
                    <input
                      className="form-element input-field"
                      placeholder="Email"
                      type="email"
                      name="email"
                      onChange={handleChange}
                      value={muser.email}
                    />
                  </div>

                  <div className="input-addon">
                    <button className="input-addon-item">
                      <span>
                        <RiAdminFill size={25} />
                      </span>
                    </button>
                    <select
                      name="roleId"
                      onChange={handleChange}
                      value={muser.roleId}
                      className="form-element input-field"
                    >
                      {role && role.length > 0
                        ? role.map((item: any, index: any) => {
                            return (
                              <option value={item.id}>{item.roleName}</option>
                            );
                          })
                        : "Loading"}
                    </select>
                  </div>
                  <div className="input-addon">
                    <button className="input-addon-item">
                      <span>
                        <FaUserCheck size={25} />
                      </span>
                    </button>

                    <input
                      className="form-element input-field"
                      placeholder="UserName"
                      type="text"
                      name="username"
                      onChange={handleChange}
                      value={muser.username}
                    />
                  </div>

                  <input
                    className="form-element is-submit taskButton"
                    type="submit"
                    value="Edit User"
                    onClick={submit}
                  />
                </form>
              </CModalBody>
            </CModal>

            <table className="Usertable">
              <tbody>
                <tr>
                  <td>Sr.No</td>
                  <td>Id</td>
                  <td>Name</td>
                  <td>Email</td>
                  <td>Username</td>
                  <td>Role</td>
                  <td>Action</td>
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
                          <td>
                            {item.roleId === "1"
                              ? "Admin"
                              : item.roleId === "2"
                              ? "Manager"
                              : item.roleId === "3"
                              ? "Employee"
                              : ""}
                          </td>

                          <td colSpan={2}>
                            <button
                              onClick={(e: any) => {
                                handleEdit(item.id);
                              }}
                              className="addnewtask"
                            >
                              <BiEditAlt />
                            </button>

                            <button
                              onClick={(e: any) => {
                                dsetVisible(!dvisible);
                                console.log(e);
                                setdelid(item.id);
                              }}
                              className="addnewtask"
                            >
                              <MdDeleteOutline />
                            </button>
                            <CModal
                              backdrop="static"
                              visible={dvisible}
                              onClose={() => setVisible(false)}
                            >
                              <CModalBody>
                                Do you want to delete data for Id:{delid}
                              </CModalBody>
                              <CModalFooter>
                                <CButton
                                  color="secondary"
                                  onClick={() => dsetVisible(false)}
                                >
                                  Close
                                </CButton>
                                <CButton
                                  color="primary"
                                  className="taskButton"
                                  onClick={() => handleDel(delid)}
                                >
                                  Yes
                                </CButton>
                              </CModalFooter>
                            </CModal>
                          </td>
                        </tr>
                      );
                    })
                  : "Loading..."}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CModal
        alignment="center"
        visible={addtaskbutton}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredExample"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Add New User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form className="form-container" action="">
            <div className="input-addon">
              <input
                name="Name"
                className="form-element input-field"
                placeholder="Name"
                type="text"
                onChange={handleChangeM}
                value={user.Name}
                required
              />
            </div>
            <div className="input-addon">
              <input
                name="Email"
                className="form-element input-field"
                placeholder="Email"
                type="email"
                onChange={handleChangeM}
                value={user.Email}
                required
              />
            </div>

            <div className="input-addon">
              <select
                className="form-element input-field"
                name="Role"
                onChange={handleChangeM}
                value={user.Role}
              >
                {role && role.length > 0
                  ? role.map((item: any, index: any) => {
                      return <option value={item.id}>{item.roleName}</option>;
                    })
                  : "Loading"}
              </select>
            </div>
            <div className="input-addon">
              <input
                name="Username"
                className="form-element input-field"
                placeholder="UserName"
                type="text"
                onChange={handleChangeM}
                value={user.Username}
                required
              />
            </div>
            <div className="input-addon">
              <input
                name="Password"
                className="form-element input-field"
                placeholder="Password"
                type="password"
                onChange={handleChangeM}
                value={user.Password}
                required
              />
            </div>
            <input
              className="form-element is-submit taskButton"
              type="submit"
              value="Create User"
              onClick={adduser}
            />
          </form>
        </CModalBody>
      </CModal>
      <ToastContainer />
    </>
  );
}
