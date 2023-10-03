import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./Pages/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import Signup from "./Pages/SignUp";
import Home from "./Pages/Home";
import Prac from "./Pages/Prac";
import Users from "./Pages/Users";
import ToDo from "./Pages/ToDo";
import Project from "./Pages/Project";
import AddUsers from "./Pages/AddUsers";
import CrudUsers from "./Pages/CrudUsers";
import TaskCategory from "./Pages/TaskCategory";
import Task from "./Pages/Task";
import Private from "./Private";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";
import EmployeeRoute from "./EmployeeRoute";
import AccessRoute from "./AccessRoute";
import EditUser from "./Pages/EditUser";
import Mytask from "./Pages/MyTask";
import React, { useEffect } from 'react';




function App() {
  
  return (
    <>
      <Router>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/SignUp" element={<Signup />} />
          <Route path="/Home" element={<Home />} />
          <Route element={<Private />}>
            {/* <Route path="/Prac" element={<Prac />} /> */}
            <Route path="/Users" element={<Users />} />
            <Route element={<AdminRoute />}>
              <Route path="/AddUsers" element={<AddUsers />} />
              <Route path="/CrudUsers" element={<CrudUsers />} />
            </Route>
            <Route element={<AccessRoute />}>
              <Route path="/Project" element={<Project />} />
              <Route path="/Users" element={<Users />} />
              <Route path="/TaskCategory" element={<TaskCategory />} />
              <Route path="/Task" element={<Task />} />

            </Route>

            <Route path="/ToDo" element={<ToDo />} />
            <Route path="/EditUser" element={<EditUser/>}/>
            <Route path="/MyTask" element={<Mytask />} />

          
          </Route>


        </Routes>
      </Router>
    </>
  );
}

export default App;
