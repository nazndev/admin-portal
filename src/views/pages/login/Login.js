import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { login } from "../../../services/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    try {
      // Call the login API
      const response = await login(username, password);
      console.log("Login API Response:", response); // Debugging log
  
      // Validate API response
      if (response.success && response.data) {
        const { token, username, roles, permissions } = response.data; // Adjust destructuring
  
        // Check for required fields
        if (token && Array.isArray(roles) && Array.isArray(permissions) && username) {
          // Update localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("username", username);
          localStorage.setItem("roles", JSON.stringify(roles));
          localStorage.setItem("permissions", JSON.stringify(permissions));
  
          console.log("Login successful. Data stored in localStorage.");
  
          // Clear error (if any) and redirect
          setError(""); // Clear any error
          navigate("/dashboard"); // Redirect to the dashboard
        } else {
          console.error("Incomplete data received from API:", response.data);
          setError("Incomplete data received. Please try again.");
        }
      } else {
        console.error("API Error Response:", response);
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      // Network or unexpected errors
      console.error("Login error:", err);
      setError("An error occurred. Please check your credentials and try again.");
    }
  };
  
  
  
    
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              {/* Left Card for Form */}
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* Right Card for Branding */}
              <CCard
                className="text-white bg-primary py-5 d-none d-lg-flex align-items-center justify-content-center"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <h2>Farm2Go Admin</h2>
                  <p>
                    Welcome to Farm2Go Admin Portal. Please sign in to manage the application.
                  </p>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
