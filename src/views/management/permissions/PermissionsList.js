import React, { useEffect, useState } from "react";
import { fetchPermissions } from "../../../services/authService";
import { CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CButton } from "@coreui/react";

const PermissionsList = () => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const loadPermissions = async () => {
      const response = await fetchPermissions();
      setPermissions(response.data.permissions);
    };
    loadPermissions();
  }, []);

  return (
    <div>
      <h3>Permissions</h3>
      <CButton color="success" className="mb-3">
        Create Permission
      </CButton>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Permission Name</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {permissions.map((permission) => (
            <CTableRow key={permission.id}>
              <CTableDataCell>{permission.name}</CTableDataCell>
              <CTableDataCell>
                <CButton color="warning" size="sm">
                  Edit
                </CButton>{" "}
                <CButton color="danger" size="sm">
                  Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default PermissionsList;
