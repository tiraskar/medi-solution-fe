import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Popconfirm, Modal, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  fetchTests,
  addTest,
  updateTest,
  deleteTest,
} from "../../api/test.api"; // Your API functions
import CreateTestForm from "../../components/form/CreateTestForm";
import { updatePagination, updateSearchFilter } from "../../store/slices/testSlice";
import useDynamicTableScroll from "../../hook/useDynamicTableScroll";
import { tableComponent } from "../../components/report/VehicleExpiryReport";

const { Search } = Input;

export default function TestList() {
  const dispatch = useDispatch();
  const { tests, loading, pagination, searchFilter } = useSelector((state) => state.test);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [testDetails, setTestDetails] = useState(null);

  const scroll = useDynamicTableScroll();

  const testData = Array.isArray(tests) ? tests : tests?.data || [];

  // Fetch tests on page/limit change
  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch, pagination.page, pagination.limit]);

  const handleEdit = (test) => {
    setSelectedTest(test);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteTest(id)).then(() => {
      dispatch(fetchTests({ page: pagination.page, limit: pagination.limit }));
    });
  };

  const handleSubmit = async (formData, id = null) => {
    if (id) {
      await dispatch(updateTest({ id, data: formData }));
    } else {
      await dispatch(addTest(formData));
    }
    setIsModalVisible(false);
    setSelectedTest(null);
    dispatch(fetchTests({ page: pagination.page, limit: pagination.limit }));
  };

  const handleSearch = () => {
    dispatch(
      fetchTests({
        keyword: searchFilter.keyword,
        page: 1,
        limit: pagination.limit,
      })
    );
    dispatch(updatePagination({ page: 1 }));
  };

  const columns = [
    { title: "Test Name", dataIndex: "test_name", key: "test_name" },
    { title: "Parameters", dataIndex: "parameters", key: "parameters" },
    { title: "Low Range", dataIndex: "low_range", key: "low_range" },
    { title: "Top Range", dataIndex: "top_range", key: "top_range" },
    { title: "Rate", dataIndex: "rate", key: "rate" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    { title: "Actions", key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Are you sure to delete this test?"
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
      <div className="flex justify-between items-center mb-4">
        <Search
          placeholder="Search by test name, email, or mobile"
          allowClear
          enterButton={<SearchOutlined />}
          value={searchFilter?.keyword || ""}
          onChange={(e) => {
            const value = e.target.value;
            dispatch(updateSearchFilter({ name: "keyword", value }));
            if (value === "") dispatch(fetchTests());
          }}
          onSearch={handleSearch}
          style={{ width: 400 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedTest(null);
            setIsModalVisible(true);
          }}
        >
          Create Test
        </Button>
      </div>

      <Table
        dataSource={testData}
        columns={columns}
        scroll={scroll}
        loading={loading}
        components={tableComponent}
        rowKey="id"
        pagination={{
          current: pagination?.page,
          pageSize: pagination?.limit,
          total: pagination?.total,
          showSizeChanger: true,
          showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} entries`,
          onChange:(page,limit) => {
            dispatch(updatePagination({  page,  limit }));
            dispatch(fetchTests());
          }
        }}
      />

<Modal
  open={isModalVisible}
  footer={null}
  onCancel={() => setIsModalVisible(false)}
  width={700}
  centered
  bodyStyle={{
    maxHeight: "90vh",       // limit modal height
    // overflowY: "auto",       // enable vertical scroll
    // paddingRight: "10px",    // prevent scrollbar overlap
  }}
  style={{
    zIndex: 1000,
  }}
>
  <CreateTestForm onSubmit={handleSubmit} selectedTest={selectedTest} />
</Modal>

      <Modal
        open={detailModalVisible}
        footer={null}
        onCancel={() => setDetailModalVisible(false)}
        width={600}
        title="Test Details"
      >
        {testDetails && (
          <div>
            <p><strong>Test Name:</strong> {testDetails.test_name}</p>
            <p><strong>Parameters:</strong> {testDetails.parameters}</p>
            <p><strong>Low Range:</strong> {testDetails.low_range}</p>
            <p><strong>Top Range:</strong> {testDetails.top_range}</p>
            <p><strong>Rate:</strong> {testDetails.rate}</p>
            <p><strong>Gender:</strong> {testDetails.gender}</p>
            <p><strong>Email:</strong> {testDetails.email}</p>
            <p><strong>Mobile:</strong> {testDetails.mobile}</p>
            <p><strong>Address:</strong> {testDetails.address}</p>
            <p><strong>Qualification:</strong> {testDetails.qualification}</p>
            <p><strong>Bio:</strong> {testDetails.bio}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
