import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Popconfirm, Modal, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  fetchTests,
  addTest,
  updateTest,
  deleteTest,
} from "../../api/test.api"; // Your API functions
import CreateTestForm from "../../components/form/CreateTestForm";
import {
  updatePagination,
  updateSearchFilter,
} from "../../store/slices/testSlice";
import useDynamicTableScroll from "../../hook/useDynamicTableScroll";
import { tableComponent } from "../../components/report/VehicleExpiryReport";
import * as XLSX from "xlsx";
// import Spreadsheet from "react-spreadsheet";
import ExcelForm from "../../components/form/ExcelForm";
// import { handleSaveToDB } from "../../helper/importExcel";

const { Search } = Input;

export default function TestList() {
  const dispatch = useDispatch();
  const { tests, loading, pagination, searchFilter } = useSelector(
    (state) => state.test
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [testDetails, setTestDetails] = useState(null);
  const [excelModalVisible, setExcelModalVisible] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const fileInputRef = useRef(null);

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

  // const handleDelete = (id) => {
  //   dispatch(deleteTest(id)).then(() => {
  //     dispatch(fetchTests({ page: pagination.page, limit: pagination.limit }));
  //   });
  // };
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this test group?",
      icon: <ExclamationCircleOutlined />,
      content: `Group Name: ${record.test_name}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        dispatch(deleteTest(record.test_id)).then(() => {
          dispatch(
            fetchTests({ page: pagination.page, limit: pagination.limit })
          );
        });
      },
    });
  };

  const handleSubmit = async (formData, id = null) => {
    console.log(formData);

    if (id) {
      await dispatch(updateTest({ id, data: formData }));
    } else {
      await dispatch(addTest(formData));
    }
    setIsModalVisible(false);
    setSelectedTest(null);
    dispatch(fetchTests({ page: pagination.page, limit: pagination.limit }));
  };

  //  When Excel is selected
  const handleFileUpload = async (event) => {
    // const file = event.target.files[0];
    // if (!file) return;

    // const reader = new FileReader();

    // reader.onload = (e) => {
    //   const data = new Uint8Array(e.target.result);

    //   const workbook = XLSX.read(data, { type: "array" });
    //   // const sheetName = workbook.SheetNames[0];
    //   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    //   const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const file = event.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    //  Define headers
    const headers = [
      "Test Name",
      "Parameters",
      "Low Range",
      "Top Range",
      "Rate",
      "Gender",
      "Email",
      "Mobile",
      "Address",
      "Qualification",
      "Bio",
    ];

    //  Add header row if missing
    const formatted =
      json.length > 0 && json[0][0] === "Test Name" ? json : [headers, ...json];

    const spreadsheetData = formatted.map((row) =>
      row.map((cell) => ({ value: cell || "" }))
    );

    setExcelData(spreadsheetData);
    setExcelModalVisible(true);

    event.target.value = null;
  };


  // 💾 Save to DB
const handleSaveToDB = (updatedRows) => {
  const rows = updatedRows.slice(1).map((row) => ({
    test_name: row.test_name || row[0]?.value,
    parameters: row.parameters || row[1]?.value,
    low_range: row.low_range || row[2]?.value,
    top_range: row.top_range || row[3]?.value,
    rate: row.rate || row[4]?.value,
    gender: row.gender || row[5]?.value,
    email: row.email || row[6]?.value,
    mobile: row.mobile || row[7]?.value,
    address: row.address || row[8]?.value,
    qualification: row.qualification || row[9]?.value,
    bio: row.bio || row[10]?.value,
  }));

  rows.forEach((r) => dispatch(addTest(r)));

  setExcelModalVisible(false);
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
    {
      title: "Low Range",
      dataIndex: "low_range",
      width: 120,
      align: "center",
      key: "low_range",
    },
    {
      title: "Top Range",
      dataIndex: "top_range",
      width: 120,
      align: "center",
      key: "top_range",
    },
    { title: "Rate", dataIndex: "rate", key: "rate" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    {
      title: "Actions",
      key: "actions",
      align: "center", // centers header text
      width: 100,
      render: (_, record) => (
        <span
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center", // centers horizontally
            alignItems: "center", // centers vertically
          }}
        >
          <EditOutlined
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
            className="!bg-blue-500 p-2 rounded-md !text-white"
          />
          <DeleteOutlined
            style={{ color: "#ff4d4f", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record);
            }}
            className="!bg-red-500 p-2 rounded-md !text-white"
          />
        </span>
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
        <div className="flex gap-2">
          {/* <Button
  type="primary"
  onClick={() => exportToExcel(testDetails)}
>
  Export to Excel
</Button> */}

          <Button
            type="primary"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Open Excel Sheet
          </Button>

          <input
            type="file"
            accept=".xlsx, .xls"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
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
          showTotal: (total, range) =>
            `Showing ${range[0]}–${range[1]} of ${total} entries`,
          onChange: (page, limit) => {
            dispatch(updatePagination({ page, limit }));
            dispatch(fetchTests());
          },
        }}
      />

      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        centered
        bodyStyle={{
          maxHeight: "90vh", // limit modal height
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
        open={excelModalVisible}
        title="Edit Excel Data"
        width={1400}
        onCancel={() => setExcelModalVisible(false)}
        footer={null}
        // footer={[
        //   <Button key="cancel" onClick={() => setExcelModalVisible(false)}>
        //     Cancel
        //   </Button>,
        //   <Button
        //     key="save"
        //     type="primary"
        //     onClick={() =>      handleSaveToDB(updatedRows)}
        //   >
        //     Save
        //   </Button>,
        // ]}
      >
        {/* <Spreadsheet data={excelData} onChange={setExcelData} /> */}

         <ExcelForm
    excelData={excelData}
    // onSave={(updatedRows) => {
    //   updatedRows.forEach((row) => dispatch(addTest(row)));
    //   setExcelModalVisible(false);
    // }}
    onSave={(updatedRows) => {
      // setExcelData(updatedRows);
     handleSaveToDB(updatedRows);
    }}
  />
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
            <p>
              <strong>Test Name:</strong> {testDetails.test_name}
            </p>
            <p>
              <strong>Parameters:</strong> {testDetails.parameters}
            </p>
            <p>
              <strong>Low Range:</strong> {testDetails.low_range}
            </p>
            <p>
              <strong>Top Range:</strong> {testDetails.top_range}
            </p>
            <p>
              <strong>Rate:</strong> {testDetails.rate}
            </p>
            <p>
              <strong>Gender:</strong> {testDetails.gender}
            </p>
            <p>
              <strong>Email:</strong> {testDetails.email}
            </p>
            <p>
              <strong>Mobile:</strong> {testDetails.mobile}
            </p>
            <p>
              <strong>Address:</strong> {testDetails.address}
            </p>
            <p>
              <strong>Qualification:</strong> {testDetails.qualification}
            </p>
            <p>
              <strong>Bio:</strong> {testDetails.bio}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
