import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const  ManagerRoute = () => {
 
  if (localStorage.getItem('roleId') == "2") {
    return <Outlet />;
  } else {
    return <Navigate to="/Home" />;
  }
};
export default ManagerRoute ;
