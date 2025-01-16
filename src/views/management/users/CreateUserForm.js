import React, { useEffect, useState } from "react";
import {
  CButton,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CFormSelect,
  CFormCheck,
  CAlert,
} from "@coreui/react";
import { createUser, fetchRoles } from "../../../services/authService";

const CreateUserForm = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    active: true,
    roles: [], // Selected role IDs
  });
  const [roles, setRoles] = useState([]); // Available roles
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await fetchRoles();
        setRoles(response.data.roles || []);
      } catch (err) {
        console.error("Failed to fetch roles:", err);
        setError("Failed to load roles. Please try again.");
      }
    };
    loadRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRoleChange = (e) => {
    const selectedRoleId = parseInt(e.target.value, 10);
    if (!formData.roles.includes(selectedRoleId)) {
      setFormData({
        ...formData,
        roles: [...formData.roles, selectedRoleId],
      });
    }
  };

  const handleRemoveRole = (roleId) => {
    setFormData({
      ...formData,
      roles: formData.roles.filter((id) => id !== roleId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.roles.length === 0) {
      setError("At least one role must be selected.");
      return;
    }

    try {
      const newUser = await createUser(formData); // API call
      setSuccess("User created successfully.");
      onUserCreated(newUser.data); // Callback to parent
      setFormData({
        username: "",
        email: "",
        password: "",
        active: true,
        roles: [],
      }); // Reset form
    } catch (err) {
      console.error("Failed to create user:", err.message);
      setError("Failed to create user. Please try again.");
    }
  };

  return (
    <div>
      <h1>Create User</h1>
      {error && <CAlert color="danger">{error}</CAlert>}
      {success && <CAlert color="success">{success}</CAlert>}
      <CForm onSubmit={handleSubmit}>
        <CRow className="mb-3">
          <CCol md="6">
            <CFormInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </CCol>
          <CCol md="6">
            <CFormInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md="6">
            <CFormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </CCol>
          <CCol md="6" className="d-flex align-items-center">
            <CFormCheck
              label="Active"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
            />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md="6">
            <CFormSelect label="Assign Roles" onChange={handleRoleChange} value="">
              <option value="" disabled>
                Select a role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol md="6">
            <ul>
              {formData.roles.map((roleId) => {
                const role = roles.find((r) => r.id === roleId);
                return (
                  <li key={roleId}>
                    {role?.name || "Unknown Role"}{" "}
                    <CButton
                      size="sm"
                      color="danger"
                      onClick={() => handleRemoveRole(roleId)}
                    >
                      Remove
                    </CButton>
                  </li>
                );
              })}
            </ul>
          </CCol>
        </CRow>
        <CButton type="submit" color="primary">
          Create User
        </CButton>
      </CForm>
    </div>
  );
};

export default CreateUserForm;
