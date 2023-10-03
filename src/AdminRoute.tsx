import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
 
  if (localStorage.getItem('roleId') == "1") {
    return <Outlet />;
  } else {
    return <Navigate to="/Home" />;
  }
};
export default AdminRoute;
