import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import axios from "axios";
import "../css/EditUser.css";

export default function EditUser() {
  const id = localStorage.getItem("id");

  const [muser, msetuser] = useState({
    id: 0,
    name: "",
    email: "",
    roleId: "1",
    username: "",
    password: "",
  });
  const [role, setrole] = useState([]);

  useEffect(() => {
    getrole();
    getdata();
  }, []);

  const getdata = () => {
    axios
      .get(`https://localhost:7282/api/User?id=${id}`)
      .then((result) => {
        msetuser({
          id: result.data.id,
          name: result.data.name,
          email: result.data.email,
          roleId: result.data.roleId,
          username: result.data.username,
          password: result.data.password,
        });
      })
      .catch((error) => {
        alert("danger User cannot be updated");
      });
  };

  const getrole = () => {
    axios
      .get("https://localhost:7282/api/Role")
      .then((r) => {
        setrole(r.data);
      })
      .catch((error) => {});
  };

  const handleChange = (e: any) => {
    e.preventDefault();
    msetuser({ ...muser, [e.target.name]: e.target.value });
  };

  const edit = () => {
    const f = {
      id: muser.id,
      name: muser.name,
      email: muser.email,
      roleId: muser.roleId,
      username: muser.username,
      password: muser.password,
    };
    axios
      .put(`https://localhost:7282/api/User/${id}`, f)
      .then((result) => {
        //setVisible(false);

        alert("success User updated successfully");
      })
      .catch((error) => {
        alert("cannot update");
      });
  };
  return (
    <>
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="mainpage">
          <h1 className="heading">Edit </h1>
          <div className="maincontent editpage">
            <div></div>
            <div className="container ">
              <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 edit_information">
                <form action="" method="POST">
                  <h3 className="text-center">Edit Personal Information</h3>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <label className="profile_details_text">
                          First Name:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          onChange={handleChange}
                          value={muser.name}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <label className="profile_details_text">
                          Email Address:
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          onChange={handleChange}
                          value={muser.email}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <label className="profile_details_text">
                          UserName:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          onChange={handleChange}
                          value={muser.username}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <label className="profile_details_text">Role:</label>

                        <select
                          name="roleId"
                          onChange={handleChange}
                          value={muser.roleId}
                          className="form-control"
                        >
                          {role && role.length > 0
                            ? role.map((item: any, index: any) => {
                                return (
                                  <option value={item.id}>
                                    {item.roleName}
                                  </option>
                                );
                              })
                            : "Loading"}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <label className="profile_details_text">
                          Password:
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          onChange={handleChange}
                          value={muser.password}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 submit">
                      <div className="form-group">
                        <input
                          type="submit"
                          className="btn btn-success taskButton"
                          value="Edit User"
                          onClick={edit}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
