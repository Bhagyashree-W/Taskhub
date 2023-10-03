import React, { useState } from "react";
import "../css/SignUp.css";
import {
  CForm,
  CCol,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormCheck,
  CFormFeedback,
  CFormSelect,
  CButton,
  CFormText,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  const [data, setdata] = useState({
    id: 0,
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  const SignupSubmit = (e: any) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    const url = "https://localhost:7282/api/User";
    const d = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
    };
    if ((d.name != "" && d.email != "" && d.password != "") || d.phone != "") {
      axios
        .post(url, d)
        .then((result) => {
          setdata({
            id: 0,
            name: "",
            email: "",
            phone: "",
            password: "",
          });
          navigate("/");
          console.log(result);
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <>
      <div className="Signup">
        <h1>Register</h1>
        <div>
          <CForm
            className="row  needs-validation "
            noValidate
            validated={validated}
            onSubmit={SignupSubmit}
          >
            <CCol>
              <CFormInput
                type="text"
                placeholder="Enter your Name"
                feedbackInvalid="Enter Name"
                id="name"
                className="signinput"
                name="name"
                onChange={handleChange}
                value={data.name}
                required
              />

              <CFormInput
                type="email"
                placeholder="Enter your email"
                feedbackInvalid="Enter Email"
                id="validationCustom02"
                className="signinput"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
              />

              <CInputGroup className="has-validation">
                <input
                  type="date"
                  id="birthday"
                  name="dob"
                  className="signinput"
                  placeholder="Daate"
                  onChange={handleChange}
                  value={data.phone}
                ></input>
              </CInputGroup>

              <CFormInput
                type="password"
                placeholder="Enter your Password"
                feedbackInvalid="Enter Password"
                id="password"
                name="password"
                className="signinput"
                onChange={handleChange}
                value={data.password}
                required
              />

              <CButton color="primary" className="signinput" type="submit">
                Submit form
              </CButton>
            </CCol>
          </CForm>
        </div>
      </div>
    </>
  );
}
