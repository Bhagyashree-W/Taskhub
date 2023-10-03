import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  CForm,
  CCol,
  CFormInput,
  CButton,
  CInputGroup,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import { useNavigate } from "react-router-dom";
import "../css/Prac.css";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";

export default function Prac() {
  const [visibleLg, setVisibleLg] = useState(false);
  const [validated, setValidated] = useState(false);
  const [validatedM, setValidatedM] = useState(false);
  const navigate = useNavigate();
  const [data, setdata] = useState({
    email: "",
    password: "",
  });

  const [sdata, setsdata] = useState({
    name: "",
    email: "",
    username: "",
    dob: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  const handleChangeM = (e: any) => {
    setsdata({ ...sdata, [e.target.name]: e.target.value });
  };

  

  const [containerClass, setContainerClass] = useState('');
 


  const handleSignInClick = () => {
    setContainerClass('');
  };
const handleSignUpClick = () => {
    setContainerClass('right-panel-active');
  };


  return (
    <>
    <Navbar/>
 <Sidebar/>
<div className={`container ${containerClass}`} id="container">
	<div className="form-container sign-up-container">
		<form action="#">
			<h3>Create Account</h3>
		
			<input type="text" placeholder="Name" />
			<input type="email" placeholder="Email" />
			<input type="password" placeholder="Password" />
			<button onClick={handleSignUpClick}>Sign Up</button>
		</form>
	</div>
	<div className="form-container sign-in-container">
		<form action="#">
			<h1>Sign in</h1>
			
			<span>or use your account</span>
			<input type="email" placeholder="Email" />
			<input type="password" placeholder="Password" />
			<a href="#">Forgot your password?</a>
			<button onClick={handleSignInClick}>Sign In</button>
		</form>
	</div>
	<div className="overlay-container">
		<div className="overlay">
			<div className="overlay-panel overlay-left">
				<h1>Welcome Back!</h1>
				<p>To keep connected with us please login with your personal info</p>
				<button className="ghost" id="signIn" onClick={handleSignInClick }>Sign In</button>
			</div>
			<div className="overlay-panel overlay-right">
				<h1>Hello, Friend!</h1>
				<p>Enter your personal details and start journey with us</p>
				<button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
			</div>
		</div>
	</div>
</div>


    </>
  );
}
