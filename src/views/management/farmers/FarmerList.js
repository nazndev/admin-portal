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
  fetchFarmers,
  createFarmer,
  deleteFarmer,
} from "../../../services/farmerService";
import { fetchAggregationCenters } from "../../../services/aggregationCenterService";

const FarmerList = () => {
  const [farmers, setFarmers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFarmer, setNewFarmer] = useState({
    name: "",
    contactNumber: "",
    aggregationCenterId: "",
  });

  const loadFarmers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchFarmers();
      setFarmers(response.data || []);
    } catch (err) {
      setError("Failed to load farmers.");
    } finally {
      setLoading(false);
    }
  };

  const loadCenters = async () => {
    try {
      const response = await fetchAggregationCenters();
      setCenters(response.data || []);
    } catch (err) {
      console.error("Failed to fetch aggregation centers:", err);
    }
  };

  const handleCreateFarmer = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await createFarmer(newFarmer);
      setSuccess("Farmer created successfully.");
      setNewFarmer({ name: "", contactNumber: "", aggregationCenterId: "" });
      loadFarmers();
      setShowCreateModal(false);
    } catch (err) {
      setError("Failed to create farmer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFarmer = async (farmerId) => {
    setLoading(true);
    try {
      await deleteFarmer(farmerId);
      setFarmers(farmers.filter((farmer) => farmer.id !== farmerId));
    } catch (err) {
      setError("Failed to delete farmer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
    loadCenters();
  }, []);

  return (
    <CCard>
      <CCardBody>
        <h3>Farmers</h3>
        {error && <CAlert color="danger">{error}</CAlert>}
        {success && <CAlert color="success">{success}</CAlert>}
        <div className="d-flex justify-content-end mb-3">
          <CButton color="primary" onClick={() => setShowCreateModal(true)}>
            Register Farmer
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
                <CTableHeaderCell>Contact Number</CTableHeaderCell>
                <CTableHeaderCell>Aggregation Center</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {farmers.map((farmer, index) => (
                <CTableRow key={farmer.id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{farmer.name}</CTableDataCell>
                  <CTableDataCell>{farmer.contactNumber}</CTableDataCell>
                  <CTableDataCell>{farmer.aggregationCenter.name}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteFarmer(farmer.id)}
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
        <CModalHeader>Register Farmer</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="Name"
              value={newFarmer.name}
              onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
              required
            />
            <CFormInput
              label="Contact Number"
              value={newFarmer.contactNumber}
              onChange={(e) =>
                setNewFarmer({ ...newFarmer, contactNumber: e.target.value })
              }
              required
            />
            <CFormSelect
              label="Aggregation Center"
              value={newFarmer.aggregationCenterId}
              onChange={(e) =>
                setNewFarmer({ ...newFarmer, aggregationCenterId: e.target.value })
              }
              required
            >
              <option value="" disabled>
                Select an aggregation center
              </option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </CFormSelect>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleCreateFarmer}>
            Register
          </CButton>{" "}
          <CButton color="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default FarmerList;
