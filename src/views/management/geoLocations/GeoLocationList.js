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
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import {
  fetchGeoLocations,
  createGeoLocation,
  deleteGeoLocation,
} from "../../../services/geoLocationService";

const GeoLocationList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLocation, setNewLocation] = useState({
    division: "",
    district: "",
    upazila: "",
    union: "",
    village: "",
    parentId: "",
  });

  const loadGeoLocations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchGeoLocations();
      setLocations(response.data || []);
    } catch (err) {
      setError("Failed to load geo locations.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGeoLocation = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await createGeoLocation(newLocation);
      setSuccess("Geo Location created successfully.");
      setNewLocation({
        division: "",
        district: "",
        upazila: "",
        union: "",
        village: "",
        parentId: "",
      });
      loadGeoLocations();
      setShowCreateModal(false);
    } catch (err) {
      setError("Failed to create geo location.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGeoLocation = async (locationId) => {
    setLoading(true);
    try {
      await deleteGeoLocation(locationId);
      setLocations(locations.filter((location) => location.id !== locationId));
    } catch (err) {
      setError("Failed to delete geo location.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGeoLocations();
  }, []);

  return (
    <CCard>
      <CCardBody>
        <h3>Geo Locations</h3>
        {error && <CAlert color="danger">{error}</CAlert>}
        {success && <CAlert color="success">{success}</CAlert>}
        <div className="d-flex justify-content-end mb-3">
          <CButton color="primary" onClick={() => setShowCreateModal(true)}>
            Add Geo Location
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
                <CTableHeaderCell>Division</CTableHeaderCell>
                <CTableHeaderCell>District</CTableHeaderCell>
                <CTableHeaderCell>Upazila</CTableHeaderCell>
                <CTableHeaderCell>Union</CTableHeaderCell>
                <CTableHeaderCell>Village</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {locations.map((location, index) => (
                <CTableRow key={location.id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{location.division}</CTableDataCell>
                  <CTableDataCell>{location.district}</CTableDataCell>
                  <CTableDataCell>{location.upazila}</CTableDataCell>
                  <CTableDataCell>{location.union}</CTableDataCell>
                  <CTableDataCell>{location.village}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteGeoLocation(location.id)}
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
        <CModalHeader>Add Geo Location</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="Division"
              value={newLocation.division}
              onChange={(e) => setNewLocation({ ...newLocation, division: e.target.value })}
              required
            />
            <CFormInput
              label="District"
              value={newLocation.district}
              onChange={(e) => setNewLocation({ ...newLocation, district: e.target.value })}
              required
            />
            <CFormInput
              label="Upazila"
              value={newLocation.upazila}
              onChange={(e) => setNewLocation({ ...newLocation, upazila: e.target.value })}
              required
            />
            <CFormInput
              label="Union"
              value={newLocation.union}
              onChange={(e) => setNewLocation({ ...newLocation, union: e.target.value })}
            />
            <CFormInput
              label="Village"
              value={newLocation.village}
              onChange={(e) => setNewLocation({ ...newLocation, village: e.target.value })}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleCreateGeoLocation}>
            Add Location
          </CButton>{" "}
          <CButton color="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default GeoLocationList;
