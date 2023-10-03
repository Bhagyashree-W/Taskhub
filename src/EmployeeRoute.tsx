import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const Private = () => {
 
  if (localStorage.getItem('roleId') == "3") {
    return <Outlet />;
  } else {
    return <Navigate to="/Home" />;
  }
};
export default Private;
