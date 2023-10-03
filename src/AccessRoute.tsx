import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AccessRoute= () => {
 const id=localStorage.getItem('roleId')
 console.log(id)
  if (id=='1' || id=='2' ) {
    return <Outlet />;
  } else {
    return <Navigate to="/Home" />;
  }
};
export default AccessRoute;
