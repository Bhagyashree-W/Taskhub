import React from "react";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import "../css/Home.css";

export default function Home() {
  return (
    <>
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="mainpage">
          <h1 className="heading">jnin</h1>
          <div className="maincontent"></div>
        </div>
      </div>
    </>
  );
}
