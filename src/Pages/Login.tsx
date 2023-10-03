import React, { useEffect } from "react";
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
import "../css/Login.css";
import { toast } from "react-toastify";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

export default function Login() {
  const [visibleLg, setVisibleLg] = useState(false);
  const [validated, setValidated] = useState(false);
  const [validatedM, setValidatedM] = useState(false);
  const navigate = useNavigate();
  const [data, setdata] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (credentialResponse: any) => {
    var obj = jwtDecode(credentialResponse.credential);
    var dt = JSON.stringify(obj);
    console.log(dt);
    var parsedData = JSON.parse(dt);
    const data1 = {
      id: 0,
      email: parsedData.email,
      name: parsedData.name,
      roleId: "3",
      username: parsedData.name,
    };

    console.log(data1);

    axios
      .post("https://localhost:7282/api/AuthorizedUser", data1)
      .then((result) => {
        //alert("logged in");
        console.log(result.data.token);
        console.log(result.data.userData.value);
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("id", result.data.userData.value.id);
        localStorage.setItem("roleId", result.data.userData.value.roleId);
        localStorage.setItem("Email", result.data.userData.value.email);
        localStorage.setItem("Name", result.data.userData.value.name);

        navigate("/ToDo");
      })
      .catch((error) => {
        alert(error);
      });
  };

  //  const [sdata, setsdata] = useState({
  //   name: "",
  //   email: "",
  //   username: "",
  //   dob: "",
  //   password: "",
  // });

  const handleChange = (e: any) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  // const handleChangeM = (e: any) => {
  //   setsdata({ ...sdata, [e.target.name]: e.target.value });
  // };

  const LoginSubmit = (e: any) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    axios
      .post("https://localhost:7282/api/User/login", data)
      .then((result) => {
        //alert("logged in");
        setdata({ email: "", password: "" });
        console.log(result.data.token);
        console.log(result.data.userFromDb.value);
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("id", result.data.userFromDb.value.id);
        localStorage.setItem("roleId", result.data.userFromDb.value.roleId);
        localStorage.setItem("Email", result.data.userFromDb.value.email);
        localStorage.setItem("Name", result.data.userFromDb.value.name);

        navigate("/ToDo");
      })
      .catch((error) => {
        alert(error);
      });
  };

  // const SignupSubmit = (e: any) => {
  //   e.preventDefault();
  //   const form = e.currentTarget;
  //   if (form.checkValidity() === false) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }
  //   setValidated(true);
  //   const url = "https://localhost:7014/api/User";
  //   const d = {
  //     name: sdata.name,
  //     email: sdata.email,
  //     username: sdata.username,
  //     dob: sdata.dob,
  //     password: sdata.password,
  //   };
  //   if (
  //     (d.name != "" && d.email != "" && d.username != "" && d.password != "") ||
  //     d.dob != ""
  //   ) {
  //     axios
  //       .post(url, d)
  //       .then((result) => {
  //         setsdata({
  //           name: "",
  //           email: "",
  //           username: "",
  //           dob: "",
  //           password: "",
  //         });
  //         navigate("/");
  //         console.log(result);
  //       })
  //       .catch((error) => {
  //         alert(error);
  //       });
  //   }
  // };

  return (
    <>
      <GoogleOAuthProvider clientId="1059079915292-1mpibo2n320gqrdjiehkpsvlpmdqhcnj.apps.googleusercontent.com">
        <div className="Login">
          <div className="loginImg">
            <img src="src\images\login page image.png"></img>
          </div>
          <div className="logform">
            <h1>Login</h1>

            <CForm
              className="row  needs-validation "
              noValidate
              validated={validated}
              onSubmit={LoginSubmit}
            >
              <CCol>
                <CFormInput
                  type="text"
                  placeholder="Email address"
                  feedbackInvalid="Please enter your email address"
                  id="email"
                  className="loginput"
                  name="email"
                  onChange={handleChange}
                  value={data.email}
                  required
                />
                <CFormInput
                  type="password"
                  placeholder="Password"
                  feedbackInvalid="Please enter your password"
                  id="password"
                  className="loginput"
                  name="password"
                  onChange={handleChange}
                  value={data.password}
                  required
                />
                
                <CButton color="primary" type="submit" className="logbutton">
                  Log In
                </CButton>
              </CCol>
            </CForm>
            <div style={{marginLeft:"80px"}}> <GoogleLogin onSuccess={handleLogin} /></div>
           
            {/* <div className="loginLink">
            To <button onClick={() => setVisibleLg(!visibleLg)}>Signup</button>
          </div>
          <CModal
            size="xl"
            visible={visibleLg}
            onClose={() => setVisibleLg(false)}
          >
            <CModalHeader>
              <CModalTitle>Sign In</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {" "}
              <CForm
                className="row  needs-validation signupModal "
                noValidate
                validated={validated}
                onSubmit={SignupSubmit}
              >
                <CCol>
                  <CFormInput
                    type="text"
                    placeholder="Full Name"
                    feedbackInvalid="Enter Name"
                    id="name"
                    className="signinput"
                    name="name"
                    onChange={handleChangeM}
                    value={sdata.name}
                    required
                  />

                  <CFormInput
                    type="text"
                    placeholder="Username"
                    feedbackInvalid="Enter Username"
                    id="username"
                    className="signinput"
                    name="username"
                    onChange={handleChangeM}
                    value={sdata.username}
                    required
                  />

                  <CFormInput
                    type="email"
                    placeholder="Email Address"
                    feedbackInvalid="Enter Email"
                    id="validationCustom02"
                    className="signinput"
                    name="email"
                    onChange={handleChangeM}
                    value={sdata.email}
                    required
                  />

                  <CInputGroup className="has-validation">
                    <input
                      type="date"
                      id="birthday"
                      name="dob"
                      className="signinput"
                      placeholder="Daate"
                      onChange={handleChangeM}
                      value={sdata.dob}
                    ></input>
                  </CInputGroup>

                  <CFormInput
                    type="password"
                    placeholder="Password"
                    feedbackInvalid="Enter Password"
                    id="password"
                    name="password"
                    className="signinput"
                    onChange={handleChangeM}
                    value={sdata.password}
                    required
                  />

                  <CButton color="primary" className="signinput" type="submit">
                    Sign In
                  </CButton>
                </CCol>
              </CForm>
            </CModalBody>
          </CModal> */}
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
}
