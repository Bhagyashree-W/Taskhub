import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const Private = () => {
 
  if (localStorage.getItem('id') != "") {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};
export default Private;
