import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Popconfirm, Avatar, Modal, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  getAllPatients,
  deletePatient,
  addPatient,
  updatePatient,
  getSearchPatients,
} from "../../api/patient.api";

import CreatePatientForm from "../../components/form/PatientForm";
import { tableComponent } from "../../components/report/VehicleExpiryReport";
import useDynamicTableScroll from "../../hook/useDynamicTableScroll";
import { updateSearchFilter, updatePagination } from "../../store/slices/patientSlice";
// import { updatePagination } from "../../store/slices/doctorSlice";

const { Search } = Input;

export default function PatientList() {
  const dispatch = useDispatch();
  const {
    patients: patientsData,
    loading,
    pagination,
    searchFilter,
  } = useSelector((state) => state.patient) || {};

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patients = Array.isArray(patientsData)
    ? patientsData
    : patientsData?.data || [];

    // console.log(pagination);
    
  const scroll = useDynamicTableScroll();

  // Fetch all patients whenever pagination changes
  useEffect(() => {
    dispatch(
      getAllPatients({ page: pagination.page, limit: pagination.limit })
    );
  }, [dispatch, pagination.page, pagination.limit]);

  const handleEdit = (patient) => {
    // dispatch(updatePatient(patient))
    setIsModalVisible(true);
    setSelectedPatient(patient);
  };

  const handleDelete = (id) => {
    dispatch(deletePatient(id)).then(() => {
      dispatch(
        getAllPatients({ page: pagination.page, limit: pagination.limit })
      );
    });
  };

  const handleSubmit = async (formData, id = null) => {
    if (id) {
      await dispatch(updatePatient({ id, data: formData }));
    } else {
      await dispatch(addPatient(formData));
    }
    setIsModalVisible(false);
    setSelectedPatient(null);
    dispatch(
      getAllPatients({ page: pagination.page, limit: pagination.limit })
    );
  };

  const handleSearch = () => {
    dispatch(
      getSearchPatients({
        keyword: searchFilter.keyword,
        page: 1,
        limit: pagination.limit,
      })
    );
    dispatch(updatePagination({ page: 1 }));
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (first_name, record) => (
        <span
          style={{ cursor: "pointer", color: "#1677ff", fontWeight: 500 }}
          onClick={() => {
            setPatientDetails(record);
            setIsDetailModalVisible(true);
          }}
        >
          {first_name} {record.last_name}
        </span>
      ),
    },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    { title: "Disease", dataIndex: "disease", key: "disease" },
    { title: "Doctor", dataIndex: "doctor_name", key: "doctor_name" },
    {
      title: "Appointment Date",
      dataIndex: "appointment_date",
      key: "appointment_date",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this patient?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-2 pt-0 overflow-auto hide-scrollbar">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Patient List</h2>
      </div>

      {/* Search + Create */}
      <div className="flex justify-between items-center mb-4">
      <Search
  placeholder="Search patient by First_name, disease, or doctor_name"
  allowClear
  enterButton={<SearchOutlined />}
  value={searchFilter?.keyword || ""}
  onChange={(e) => {
    const value = e.target.value; // the current input value
    dispatch(updateSearchFilter({ name: "keyword", value }));

    // If input is cleared (cross button), immediately search for all patients
    if (value === "") {
      console.log(true);
      
      handleSearch(""); // pass empty string to reset search
    }
  }}
  onSearch={() => handleSearch()} // Enter key or search button
  style={{ width: 400 }}
/>



        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedPatient(null);
            setIsModalVisible(true);
          }}
        >
          Create Patient
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={patients}
        columns={columns}
        scroll={scroll}
        components={tableComponent}
        loading={loading}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `Showing ${range[0]}–${range[1]} of ${total} entries`,
        }}
        onChange={(pag) => {
          // console.log( pag.size);
          
          dispatch(
            updatePagination({ page: pag.current, limit: pag.pageSize })
          );
          dispatch(getAllPatients({ page: pag.current, limit: pag.pageSize }));
        }}
      />

      {/* Detail Modal */}
      <Modal
        open={isDetailModalVisible}
        footer={null}
        onCancel={() => setIsDetailModalVisible(false)}
        width={650}
        title={
          <span style={{ fontWeight: "700", color: "#1677ff" }}>
            Patient Details
          </span>
        }
      >
        {patientDetails && (
          <div
            style={{
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <tbody>
                {[
                  [
                    "Full Name",
                    `${patientDetails.first_name} ${patientDetails.last_name}`,
                  ],
                  ["Age", patientDetails.age],
                  ["Gender", patientDetails.gender],
                  ["Contact", patientDetails.contact],
                  ["Disease", patientDetails.disease],
                  ["Doctor", patientDetails.doctor_name],
                  ["Appointment Date", patientDetails.appointment_date],
                ].map(([label, value], index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      height: "35px",
                    }}
                  >
                    <td
                      style={{
                        fontWeight: "600",
                        padding: "6px 10px",
                        color: "#333",
                        width: "40%",
                      }}
                    >
                      {label}:
                    </td>
                    <td style={{ padding: "6px 10px", color: "#555" }}>
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width={850}
        bodyStyle={{ padding: 0, background: "transparent" }} // remove default padding
        centered
      >
        <div className="">
          <CreatePatientForm
            onSubmit={handleSubmit}
            selectedPatient={selectedPatient}
          />
        </div>
      </Modal>
    </div>
  );
}
