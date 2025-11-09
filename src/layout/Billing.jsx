import React, { useState, useEffect } from "react";
import { Card, Table, InputNumber, Button, message,Input } from "antd";
import axios from "axios";

const Billing = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/patients");
      setPatients(res.data);
      setFilteredPatients(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle charge change
  const handleChargeChange = (value, record) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === record.id ? { ...p, charge: value } : p))
    );
    setFilteredPatients((prev) =>
      prev.map((p) => (p.id === record.id ? { ...p, charge: value } : p))
    );
  };

  // Handle search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value) {
      setFilteredPatients(patients);
      setShowDropdown(false);
    } else {
      const filtered = patients.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        p.doctor.toLowerCase().includes(value.toLowerCase()) ||
        p.disease.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPatients(filtered);
      setShowDropdown(true);
    }
  };

  // Handle selecting from dropdown
  const handleSelectDropdown = (value) => {
    setSearchText(value);
    setShowDropdown(false);

    const filtered = patients.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase()) ||
      p.doctor.toLowerCase().includes(value.toLowerCase()) ||
      p.disease.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  // Clear search
  const clearSearch = () => {
    setSearchText("");
    setFilteredPatients(patients);
    setShowDropdown(false);
  };

  const totalBill = filteredPatients.reduce(
    (sum, p) => sum + (p.charge || 0),
    0
  );

  const handleSubmitBilling = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/billing", { patients });
      message.success("Billing submitted successfully!");
    } catch (err) {
      console.log(err);
      message.error("Failed to submit billing");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    { title: "Disease", dataIndex: "disease", key: "disease" },
    { title: "Doctor", dataIndex: "doctor", key: "doctor" },
    {
      title: "Appointment Date",
      dataIndex: "appointment_date",
      key: "appointment_date",
    },
    {
      title: "Charge ($)",
      dataIndex: "charge",
      key: "charge",
      render: (value, record) => (
        <InputNumber
          min={0}
          value={value}
          onChange={(val) => handleChargeChange(val, record)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col mt-8 items-center min-h-screen bg-gray-100 p-6 gap-8">
      <Card title="💰 Billing" className="w-full max-w-6xl shadow-2xl rounded-2xl">
        {/* Search Input */}
        <div className="relative w-[500px] mb-4">
          <Input
            placeholder="Search by Name, Doctor, or Disease"
            value={searchText}
            onChange={handleSearchChange}
            className="w-full h-[50px] text-lg"
            allowClear
            onClear={clearSearch}
          />
{/* Dropdown-like search results */}
{showDropdown && filteredPatients.length > 0 && (
  <div
    className="absolute top-[52px] left-0 right-0 bg-white shadow-lg max-h-60 overflow-auto z-50 border border-gray-300 rounded-md"
    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
  >
    {filteredPatients.map((p) => (
      <div
        key={p.id}
        className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800"
        onClick={() => handleSelectDropdown(p.name)}
      >
        <span className="font-medium">{p.name}</span> 
      </div>
    ))}
  </div>
)}

        </div>

        {/* Billing Table */}
        <Table
          columns={columns}
          dataSource={filteredPatients}
          pagination={{ pageSize: 5 }}
          footer={() => (
            <div className="flex justify-between items-center">
              <h2>Total Bill: ${totalBill}</h2>
              <Button type="primary" onClick={handleSubmitBilling} loading={loading}>
                Submit Billing
              </Button>
            </div>
          )}
        />
      </Card>
    </div>
  );
};

export default Billing;
