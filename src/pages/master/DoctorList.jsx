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
  getAllDoctors,
  deleteDoctor,
  addDoctor,
  updateDoctor,
  getSearchDoctors,
} from "../../api/doctor.api";
import CreateDoctorForm from "../../components/form/CreateDoctorForm";
import { tableComponent } from "../../components/report/VehicleExpiryReport";
import {
  updateSearchFilter,
  updatePagination,
} from "../../store/slices/doctorSlice";
import useDynamicTableScroll from "../../hook/useDynamicTableScroll";

const { Search } = Input;

export default function DoctorList() {
  const dispatch = useDispatch();
  const {
    doctors: doctorsData,
    loading,
    pagination,
    searchFilter,
  } = useSelector((state) => state.doctor) || {};

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = Array.isArray(doctorsData)
    ? doctorsData
    : doctorsData?.data || [];

  const scroll = useDynamicTableScroll();

  // Fetch doctors whenever page, limit, or search changes
  useEffect(() => {
    dispatch(getAllDoctors({ page: pagination.page, limit: pagination.limit }));
  }, [dispatch, pagination.page, pagination.limit]);

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteDoctor(id)).then(() => {
      dispatch(
        getAllDoctors({ page: pagination.page, limit: pagination.limit })
      );
    });
  };

  const handleSubmit = async (formData, id = null) => {
    if (id) {
      await dispatch(updateDoctor({ id, data: formData }));
    } else {
      await dispatch(addDoctor(formData));
    }
    setIsModalVisible(false);
    setSelectedDoctor(null);
    dispatch(getAllDoctors({ page: pagination.page, limit: pagination.limit }));
  };

  const handleSearch = () => {
    dispatch(
      getSearchDoctors({
        keyword: searchFilter.keyword,
        page: 1,
        limit: pagination.limit,
      })
    );
    dispatch(updatePagination({ page: 1 }));
  };

  const columns = [
    {
      dataIndex: "photo",
      key: "photo",
      render: (photo, record) => (
        <Avatar
          size={50}
          src={
            photo
              ? `https://kq6rzfx3-5000.inc1.devtunnels.ms/${photo.replace(
                  /\\/g,
                  "/"
                )}`
              : "/default-avatar.png"
          }
          style={{ cursor: "pointer" }}
          onClick={() => {
            setDoctorDetails(record);
            setIsDetailModalVisible(true);
          }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <span
          style={{ cursor: "pointer", color: "#1890ff" }}
          onClick={() => {
            setDoctorDetails(record);
            setIsDetailModalVisible(true);
          }}
        >
          {name}
        </span>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Are you sure to delete this doctor?"
            onConfirm={() => handleDelete(record.doctor_id)}
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
        <h2 className="text-xl font-bold">Doctor List</h2>
      </div>

      {/* Search + Create */}
      <div className="flex justify-between items-center mb-4">
<Search
  placeholder="Search doctor by name, email, or mobile"
  allowClear
  enterButton={<SearchOutlined />}
  value={searchFilter?.keyword || ""}
  onChange={(e) => {
    const value = e.target.value;
    dispatch(updateSearchFilter({ name: "keyword", value }));

    // If cleared, trigger search immediately
    if (value === "") {
      handleSearch(""); // pass empty string explicitly
    }
  }}
  onSearch={() => handleSearch()} // uses current searchFilter.keyword
  style={{ width: 400 }}
/>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedDoctor(null);
            setIsModalVisible(true);
          }}
        >
          Create Doctor
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={doctors}
        columns={columns}
        scroll={scroll}
        components={tableComponent}
        loading={loading}
        rowKey="doctor_id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `Showing ${range[0]}–${range[1]} of ${total} entries`,
        }}
        onChange={(pag) => {
          dispatch(
            updatePagination({ page: pag.current, limit: pag.pageSize })
          );
          dispatch(getAllDoctors({ page: pag.current, limit: pag.pageSize }));
        }}
      />

      {/* Detail Modal */}
      <Modal
        open={isDetailModalVisible}
        footer={null}
        onCancel={() => setIsDetailModalVisible(false)}
        width={750}
        title={
          <span style={{ fontWeight: "700", color: "#1677ff" }}>
            Doctor Profile
          </span>
        }
      >
        {doctorDetails && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "30px",
              alignItems: "flex-start",
              borderRadius: "12px",
              padding: "25px",
            }}
          >
            <div
              style={{
                flex: "0 0 220px",
                textAlign: "center",
                borderRadius: "12px",
                padding: "15px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <Avatar
                size={150}
                src={
                  doctorDetails.photo
                    ? `https://kq6rzfx3-5000.inc1.devtunnels.ms/${doctorDetails.photo.replace(
                        /\\/g,
                        "/"
                      )}`
                    : "/default-avatar.png"
                }
                style={{ marginBottom: "12px" }}
              />
              <h3
                style={{
                  fontWeight: "700",
                  color: "#1677ff",
                  fontSize: "18px",
                  marginBottom: "6px",
                }}
              >
                {doctorDetails.name}
              </h3>
              <p style={{ color: "#666", marginBottom: "6px" }}>
                {doctorDetails.specialization || "General Practitioner"}
              </p>
              <p style={{ fontSize: "14px", color: "#777" }}>
                {doctorDetails.gender}, {doctorDetails.nationality || "Unknown"}
              </p>
            </div>

            <div
              style={{
                flex: 1,
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                  color: "#333",
                  fontWeight: "600",
                  borderBottom: "2px solid #1677ff",
                  display: "inline-block",
                  paddingBottom: "4px",
                }}
              >
                Personal Information
              </h3>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <tbody>
                  {[
                    ["Email", doctorDetails.email],
                    ["Mobile", doctorDetails.mobile],
                    ["Date of Birth", doctorDetails.dob || "—"],
                    ["Address", doctorDetails.address || "—"],
                    ["Languages Known", doctorDetails.languagesKnown || "—"],
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
                          width: "35%",
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
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <CreateDoctorForm
          onSubmit={handleSubmit}
          selectedDoctor={selectedDoctor}
        />
      </Modal>
    </div>
  );
}
