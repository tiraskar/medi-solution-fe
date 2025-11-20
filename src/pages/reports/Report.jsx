import React, { useState, useMemo } from "react";
import { Card, Table, Button, Select, message } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAgentReport, getDoctorReport } from "../../api/report.api";
import { exportToExcel } from "../../utils/excelExport";

const { Option } = Select;

const Report = () => {
  const dispatch = useDispatch();
  const { agentReport = [], doctorReport = [], loading = false } = useSelector(
    (state) => state.report || {}
  );

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleSearch = () => {
    if (!fromDate || !toDate) return message.warning("Please select both dates.");
    if (new Date(fromDate) > new Date(toDate)) return message.error("Start Date cannot be after End Date.");

    const payload = { fromDate, toDate };
    if (selectedType === "doctor") dispatch(getDoctorReport(payload));
    else if (selectedType === "agent") dispatch(getAgentReport(payload));
    else {
      dispatch(getDoctorReport(payload));
      dispatch(getAgentReport(payload));
    }
  };

  const handleExport = () => {
    let dataToExport = [];
    if (selectedType === "doctor") dataToExport = doctorReport;
    else if (selectedType === "agent") dataToExport = agentReport;
    else dataToExport = [...doctorReport, ...agentReport];

    if (!dataToExport.length) return message.warning("No data to export");
    exportToExcel(dataToExport, "MediSolution_Report");
  };

  const baseColumns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Patient Name", dataIndex: "patientName", key: "patientName" },
    { title: "Service Type", dataIndex: "serviceType", key: "serviceType" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ];

  const specificColumn = selectedType === "agent" 
    ? { title: "Agent Name", dataIndex: "agentName", key: "agentName" }
    : { title: "Doctor Name", dataIndex: "doctorName", key: "doctorName" };

  const columns = selectedType ? [baseColumns[0], specificColumn, ...baseColumns.slice(1)] : [];
  
  const data = useMemo(() => {
    if (selectedType === "agent") return agentReport;
    if (selectedType === "doctor") return doctorReport;
    return [];
  }, [selectedType, agentReport, doctorReport]);

  return (
    <Card
      className="rounded-xl  shadow-lg border border-gray-200 bg-white"
      style={{ minHeight: 450 }}
    >
      {/* Filters */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 20, alignItems: 'flex-end' }}>
        
        <FilterInput label="Start Date" value={fromDate} onChange={setFromDate} />
        <FilterInput label="End Date" value={toDate} onChange={setToDate} />

        <div style={{ flexGrow: 1 }}>
          <Select
            placeholder="Select Report Type"
            value={selectedType}
            onChange={setSelectedType}
            allowClear
            size="large"
            style={{
              width: '80%',
              fontWeight: 500,
              borderRadius: 8,
              background: '#f9f9f9',
              color: '#000',
            }}
          >
            <Option value="doctor">Doctor</Option>
            <Option value="agent">Agent</Option>
          </Select>
        </div>

        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          loading={loading}
          size="large"
          style={{
            backgroundColor: '#4B7CF3',
            borderColor: '#4B7CF3',
            borderRadius: 8,
            fontWeight: 500,
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
        >
          Search
        </Button>
      </div>

      {/* Table */}
      {selectedType ? (
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(r, i) => i}
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="rounded-lg"
          scroll={{ x: 'max-content' }}
        />
      ) : (
        <div style={{ padding: 50, textAlign: 'center', color: '#999' }}>
          Please select a <b>Report Type</b> and <b>Date Range</b> to view the report.
        </div>
      )}

      {/* Export Button Bottom Right */}
      <div style={{ textAlign: 'right', marginTop: 20 }}>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport}
          size="large"
          style={{
            backgroundColor: '#34C759',
            borderColor: '#34C759',
            borderRadius: 8,
            fontWeight: 500,
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          Export Report
        </Button>
      </div>
    </Card>
  );
};

// FilterInput Component for reusable input
const FilterInput = ({ label, value, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', flex: '0 0 200px' }}>
    <label style={{ marginBottom: 6, fontSize: 13, color: '#555', fontWeight: 500 }}>{label}</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '10px 14px',
        border: '1px solid #d9d9d9',
        borderRadius: 10,
        fontSize: 14,
        outline: 'none',
        width: '100%',
        transition: '0.2s all',
        background: '#f9f9f9',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
      onFocus={e => e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)'}
      onBlur={e => e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
    />
  </div>
);

export default Report;
