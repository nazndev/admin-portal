import React, { useEffect, useState } from "react";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CForm,
  CFormInput,
  CAlert,
} from "@coreui/react";
import { fetchProductTypes, createProductType } from "../../../services/managementService";

const ProductTypeList = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [newTypeName, setNewTypeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProductTypes = async () => {
    setLoading(true);
    try {
      const response = await fetchProductTypes();
      setProductTypes(response.data || []);
    } catch (err) {
      setError("Failed to load product types.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateType = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createProductType({ name: newTypeName });
      setSuccess("Product type created successfully.");
      setNewTypeName("");
      loadProductTypes();
    } catch (err) {
      setError("Failed to create product type.");
    }
  };

  useEffect(() => {
    loadProductTypes();
  }, []);

  return (
    <div>
      <h3>Product Types</h3>
      {error && <CAlert color="danger">{error}</CAlert>}
      {success && <CAlert color="success">{success}</CAlert>}
      <CForm onSubmit={handleCreateType} className="mb-4">
        <CFormInput
          placeholder="Enter new product type"
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          required
        />
        <CButton type="submit" color="primary" className="mt-2">
          Create Product Type
        </CButton>
      </CForm>
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {productTypes.map((type, index) => (
            <CTableRow key={type.id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{type.name}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default ProductTypeList;
