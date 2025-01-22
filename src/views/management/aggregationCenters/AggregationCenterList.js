import React, { useEffect, useState } from "react";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CSpinner,
  CAlert,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import {
  fetchAggregationCenters,
  createAggregationCenter,
  deleteAggregationCenter,
} from "../../../services/managementService";
import { fetchLocations } from "../../../services/locationService";

const AggregationCenterList = () => {
  const [centers, setCenters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCenter, setNewCenter] = useState({
    name: "",
    contactPerson: "",
    contactNumber: "",
    locationId: "",
  });

  const loadCenters = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchAggregationCenters();
      setCenters(response.data || []);
    } catch (err) {
      setError("Failed to load aggregation centers.");
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await fetchLocations();
      setLocations(response.data || []);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };

  const handleCreateCenter = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await createAggregationCenter(newCenter);
      setSuccess("Aggregation center created successfully.");
      setNewCenter({ name: "", contactPerson: "", contactNumber: "", locationId: "" });
      loadCenters();
      setShowCreateModal(false);
    } catch (err) {
      setError("Failed to create aggregation center.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCenter = async (centerId) => {
    setLoading(true);
    try {
      await deleteAggregationCenter(centerId);
      setCenters(centers.filter((center) => center.id !== centerId));
    } catch (err) {
      setError("Failed to delete aggregation center.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCenters();
    loadLocations();
  }, []);

  return (
    <CCard>
      <CCardBody>
        <h3>Aggregation Centers</h3>
        {error && <CAlert color="danger">{error}</CAlert>}
        {success && <CAlert color="success">{success}</CAlert>}
        <div className="d-flex justify-content-end mb-3">
          <CButton color="primary" onClick={() => setShowCreateModal(true)}>
            Create Aggregation Center
          </CButton>
        </div>
        {loading ? (
          <div className="text-center">
            <CSpinner color="primary" />
          </div>
        ) : (
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Contact Person</CTableHeaderCell>
                <CTableHeaderCell>Contact Number</CTableHeaderCell>
                <CTableHeaderCell>Location</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {centers.map((center, index) => (
                <CTableRow key={center.id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{center.name}</CTableDataCell>
                  <CTableDataCell>{center.contactPerson}</CTableDataCell>
                  <CTableDataCell>{center.contactNumber}</CTableDataCell>
                  <CTableDataCell>{center.location.name}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteCenter(center.id)}
                    >
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      <CModal visible={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <CModalHeader>Create Aggregation Center</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="Name"
              value={newCenter.name}
              onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
              required
            />
            <CFormInput
              label="Contact Person"
              value={newCenter.contactPerson}
              onChange={(e) => setNewCenter({ ...newCenter, contactPerson: e.target.value })}
              required
            />
            <CFormInput
              label="Contact Number"
              value={newCenter.contactNumber}
              onChange={(e) => setNewCenter({ ...newCenter, contactNumber: e.target.value })}
              required
            />
            <CFormSelect
              label="Location"
              value={newCenter.locationId}
              onChange={(e) => setNewCenter({ ...newCenter, locationId: e.target.value })}
              required
            >
              <option value="" disabled>
                Select a location
              </option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </CFormSelect>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleCreateCenter}>
            Create
          </CButton>{" "}
          <CButton color="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default AggregationCenterList;
