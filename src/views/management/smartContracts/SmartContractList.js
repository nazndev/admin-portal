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
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import {
  fetchSmartContracts,
  createSmartContract,
  updateSmartContractStatus,
} from "../../../services/smartContractService";

const SmartContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContract, setNewContract] = useState({
    buyerId: "",
    sellerId: "",
    productId: "",
    agreedPrice: 0,
    deliveryDate: "",
  });

  const loadSmartContracts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchSmartContracts();
      setContracts(response.data || []);
    } catch (err) {
      setError("Failed to load smart contracts.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSmartContract = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await createSmartContract(newContract);
      setSuccess("Smart Contract created successfully.");
      setNewContract({
        buyerId: "",
        sellerId: "",
        productId: "",
        agreedPrice: 0,
        deliveryDate: "",
      });
      loadSmartContracts();
      setShowCreateModal(false);
    } catch (err) {
      setError("Failed to create smart contract.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContractStatus = async (contractId, status) => {
    setLoading(true);
    setError("");
    try {
      await updateSmartContractStatus(contractId, status);
      loadSmartContracts();
    } catch (err) {
      setError("Failed to update smart contract status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSmartContracts();
  }, []);

  return (
    <CCard>
      <CCardBody>
        <h3>Smart Contracts</h3>
        {error && <CAlert color="danger">{error}</CAlert>}
        {success && <CAlert color="success">{success}</CAlert>}
        <div className="d-flex justify-content-end mb-3">
          <CButton color="primary" onClick={() => setShowCreateModal(true)}>
            Create Smart Contract
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
                <CTableHeaderCell>Buyer</CTableHeaderCell>
                <CTableHeaderCell>Seller</CTableHeaderCell>
                <CTableHeaderCell>Product</CTableHeaderCell>
                <CTableHeaderCell>Price</CTableHeaderCell>
                <CTableHeaderCell>Delivery Date</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {contracts.map((contract, index) => (
                <CTableRow key={contract.id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{contract.buyerId}</CTableDataCell>
                  <CTableDataCell>{contract.sellerId}</CTableDataCell>
                  <CTableDataCell>{contract.productId}</CTableDataCell>
                  <CTableDataCell>{contract.agreedPrice}</CTableDataCell>
                  <CTableDataCell>{contract.deliveryDate}</CTableDataCell>
                  <CTableDataCell>{contract.status}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="success"
                      size="sm"
                      onClick={() =>
                        handleUpdateContractStatus(contract.id, "APPROVED")
                      }
                    >
                      Approve
                    </CButton>{" "}
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() =>
                        handleUpdateContractStatus(contract.id, "REJECTED")
                      }
                    >
                      Reject
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      <CModal visible={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <CModalHeader>Create Smart Contract</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="Buyer ID"
              value={newContract.buyerId}
              onChange={(e) =>
                setNewContract({ ...newContract, buyerId: e.target.value })
              }
              required
            />
            <CFormInput
              label="Seller ID"
              value={newContract.sellerId}
              onChange={(e) =>
                setNewContract({ ...newContract, sellerId: e.target.value })
              }
              required
            />
            <CFormInput
              label="Product ID"
              value={newContract.productId}
              onChange={(e) =>
                setNewContract({ ...newContract, productId: e.target.value })
              }
              required
            />
            <CFormInput
              label="Agreed Price"
              type="number"
              value={newContract.agreedPrice}
              onChange={(e) =>
                setNewContract({
                  ...newContract,
                  agreedPrice: parseFloat(e.target.value),
                })
              }
              required
            />
            <CFormInput
              label="Delivery Date"
              type="date"
              value={newContract.deliveryDate}
              onChange={(e) =>
                setNewContract({ ...newContract, deliveryDate: e.target.value })
              }
              required
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleCreateSmartContract}>
            Create Contract
          </CButton>{" "}
          <CButton color="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default SmartContractList;
