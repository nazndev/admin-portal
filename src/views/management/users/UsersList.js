import React, { useEffect, useState } from "react";
import { fetchUsers, fetchUserById, deleteUser } from "../../../services/authService";
import CreateUserForm from "./CreateUserForm";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CPagination,
  CCard,
  CCardBody,
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // State for Create User Modal
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async (currentPage) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchUsers(currentPage);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleUserCreated = () => {
    loadUsers(page); // Reload the current page to fetch updated data
    setShowCreateModal(false); // Close the Create User Modal
  };

  const handleViewUser = async (userId) => {
    setLoading(true); // Show loading spinner while fetching details
    setError("");
    try {
      const response = await fetchUserById(userId); // Call the API to fetch user details
      setViewUser(response.data); // Set the fetched user data
      setShowViewModal(true); // Show the modal
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      setError("Failed to load user details. Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };


  useEffect(() => {
    loadUsers(page);
  }, [page]);

  return (
    <CCard>
      <CCardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Users</h3>
          <CButton
            color="primary"
            onClick={() => setShowCreateModal(true)} // Open Create User Modal
          >
            Create User
          </CButton>
        </div>
        {error && <CAlert color="danger">{error}</CAlert>}
        {loading ? (
          <div className="text-center">
            <CSpinner color="primary" />
          </div>
        ) : (
          <>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Username</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users.map((user) => (
                  <CTableRow key={user.id}>
                    <CTableDataCell>{user.username}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>
                      {user.active ? "Active" : "Inactive"}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        onClick={() =>
                          alert(`Viewing user: ${user.username}`)
                        }
                      >
                        View
                      </CButton>{" "}
                      <CButton
                        color="warning"
                        size="sm"
                        onClick={() =>
                          alert(`Editing user: ${user.username}`)
                        }
                      >
                        Edit
                      </CButton>{" "}
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CPagination
              pages={totalPages}
              activePage={page + 1}
              onActivePageChange={(i) => setPage(i - 1)}
              className="justify-content-center mt-3"
            />
          </>
        )}
      </CCardBody>

      <CModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <CModalHeader>Confirm Delete</CModalHeader>
        <CModalBody>
          Are you sure you want to delete user{" "}
          <strong>{selectedUser?.username}</strong>?
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => handleDeleteUser(selectedUser.id)}>
            Confirm
          </CButton>{" "}
          <CButton
            color="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        size="lg"
      >
        <CModalHeader>Create User</CModalHeader>
        <CModalBody>
          <CreateUserForm onUserCreated={handleUserCreated} />
        </CModalBody>
      </CModal>

      <CModal
        visible={showViewModal}
        onClose={() => setShowViewModal(false)}
        size="lg"
      >
        <CModalHeader>User Details</CModalHeader>
        <CModalBody>
          {loading ? (
            <CSpinner color="primary" />
          ) : viewUser ? (
            <div>
              <p><strong>Username:</strong> {viewUser.username}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Status:</strong> {viewUser.active ? "Active" : "Inactive"}</p>
              <p><strong>Roles:</strong> {viewUser.roles.map((role) => role.name).join(", ")}</p>
              {viewUser.roles.length > 0 && (
                <div>
                  <strong>Permissions:</strong>
                  <ul>
                    {viewUser.roles
                      .flatMap((role) => role.permissions) // Flatten permissions
                      .map((permission) => (
                        <li key={permission.id}>{permission.name}</li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p>No user details available.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>


    </CCard>
  );
};

export default UsersList;
