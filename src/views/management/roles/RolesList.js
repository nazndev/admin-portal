import React, { useEffect, useState } from "react";
import { fetchRoles } from "../../../services/authService";
import { CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CButton } from "@coreui/react";

const RolesList = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const loadRoles = async () => {
      const response = await fetchRoles();
      setRoles(response.data.roles);
    };
    loadRoles();
  }, []);

  return (
    <div>
      <h3>Roles</h3>
      <CButton color="success" className="mb-3">
        Create Role
      </CButton>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Role Name</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {roles.map((role) => (
            <CTableRow key={role.id}>
              <CTableDataCell>{role.name}</CTableDataCell>
              <CTableDataCell>
                <CButton color="info" size="sm">
                  View
                </CButton>{" "}
                <CButton color="warning" size="sm">
                  Edit
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default RolesList;
