import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Select, Table, Card, Spin, message, Button } from "antd";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { fetchTestRatesApi } from "../../api/testRate.api";
import { fetchTestGroups } from "../../api/testgroup.api";
import { exportTestBillingToExcel } from "../../utils/excelExport";

const { Option } = Select;

export default function TestBilling() {
  const dispatch = useDispatch();

  const {
    testRates: apiResponse = {},
    loading = false,
    isError = false,
    message: errorMessage = "",
  } = useSelector((state) => state.testRates || {});

  // console.log(apiResponse);
  
  const { testGroups = [] } = useSelector((state) => state.testGroup || {});
  const testRates = Array.isArray(apiResponse.data) ? apiResponse.data : [];

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [manualTests, setManualTests] = useState([]);
  const [billingTests, setBillingTests] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchTestRatesApi());
    dispatch(fetchTestGroups());
  }, [dispatch]);

  // Utility: remove duplicate tests by test_id
  const getUniqueTests = (tests) => {
    return tests.filter(
      (t, i, arr) => arr.findIndex((x) => x.test_id === t.test_id) === i
    );
  };

  // Recompute billingTests whenever tests or groups change
  const recomputeBillingTests = (manual = manualTests, groups = selectedGroups) => {
    const groupTests = groups.flatMap((g) => g.tests || []);
    // console.log(...manual);
    
    const merged = [...manual, ...groupTests];
    setBillingTests(getUniqueTests(merged));
  };

  // Handle test selection
  const  handleChange = (name, selectedIds) => {
    if (name === "tests") {
      const selectedObjects = apiResponse?.data?.filter((test) =>
        selectedIds.includes(test.test_id)
      );
      // console.log(selectedObjects);
      
      setManualTests(selectedObjects);
      recomputeBillingTests(selectedObjects, selectedGroups);
    }
  };

  // Handle group selection
  const handleGroupTestChange = (selectedGroupIds) => {
    const groupsArr = testGroups?.[0] ?? [];
    const selectedGroupObjs = groupsArr.filter((g) =>
      selectedGroupIds.includes(g.group_id)
    );
    // console.log(selectedGroupObjs);
    setSelectedGroups(selectedGroupObjs);
    recomputeBillingTests(manualTests, selectedGroupObjs);
  };

  // Remove test
  const handleRemoveItem = (id) => {
    setBillingTests((prev) => prev.filter((item) => item.test_id !== id));
    message.success("Item removed successfully");
  };

  // Export to Excel
  const handleExportToExcel = () => {
    if (!billingTests.length) {
      message.warning("No data to export");
      return;
    }
    try {
      const totalRate = billingTests.reduce(
        (sum, item) => sum + (parseFloat(item.rate) || 0),
        0
      );
      exportTestBillingToExcel(billingTests, totalRate);
      message.success("Data exported to Excel successfully!");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Failed to export data to Excel");
    }
  };

  // Table columns
  const columns = [
    { title: "Test Name", dataIndex: "test_name", key: "test_name" },
    { title: "Parameters", dataIndex: "parameters", key: "parameters" },
    { title: "Rate (Rs)", dataIndex: "rate", key: "rate" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.test_id)}
          style={{
            backgroundColor: "red",
            border: "2px solid white",
            color: "white",
          }}
        />
      ),
    },
  ];

  // Total rate
  const totalRate = billingTests.reduce(
    (sum, item) => sum + (parseFloat(item.rate) || 0),
    0
  );

  // Error handler
  useEffect(() => {
    if (isError) message.error(errorMessage || "Failed to fetch test rates");
  }, [isError, errorMessage]);

  // Loading screen
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-black-600">
        🧾 Billing Dashboard
      </h2>

      <Card className="rounded-2xl shadow-lg border border-gray-200">
        <div className="grid bg-[#3279a8] grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4">
          {/* Test */}
          <div>
            <div className="text-white font-semibold text-center py-2 rounded-md mb-1">
              Test
            </div>
            <Select
              mode="multiple"
              placeholder="Select Test"
              value={manualTests.map((t) => t.test_id)}
              onChange={(data) => handleChange("tests", data)}
              allowClear
              style={{ width: "100%" }}
            >
              {apiResponse?.data?.map((data) => (
                <Option key={data.test_id} value={data.test_id}>
                  {data.test_name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Test Group */}
          <div>
            <div className="text-white font-semibold text-center py-2 rounded-md mb-1">
              Test Group
            </div>
            <Select
              mode="multiple"
              placeholder="Select Group"
              value={selectedGroups.map((g) => g.group_id)}
              onChange={handleGroupTestChange}
              allowClear
              style={{ width: "100%" }}
            >
              {testGroups[0]
                ?.filter(
                  (g, index, self) =>
                    self.findIndex((t) => t.group_id === g.group_id) === index
                )
                .map((g) => (
                  <Option key={g.group_id} value={g.group_id}>
                    {g.group_name}
                  </Option>
                ))}
            </Select>
          </div>

          {/* Agent */}
          <div>
            <div className="text-white font-semibold text-center py-2 rounded-md mb-1">
              Agent
            </div>
            <Select
              placeholder="Select Agent"
              value={selectedAgent}
              onChange={setSelectedAgent}
              allowClear
              style={{ width: "100%" }}
            >
              {["Agent A", "Agent B", "Agent C"].map((a) => (
                <Option key={a} value={a}>
                  {a}
                </Option>
              ))}
            </Select>
          </div>

          {/* Doctor */}
          <div>
            <div className="text-white font-semibold text-center py-2 rounded-md mb-1">
              Doctor
            </div>
            <Select
              placeholder="Select Doctor"
              value={selectedDoctor}
              onChange={setSelectedDoctor}
              allowClear
              style={{ width: "100%" }}
            >
              {["Dr. Smith", "Dr. Johnson", "Dr. Lee"].map((d) => (
                <Option key={d} value={d}>
                  {d}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <Table
            dataSource={billingTests}
            columns={columns}
            rowKey="test_id"
            locale={{ emptyText: "Select Test or Test Group to show items" }}
            pagination={billingTests.length > 10 ? { pageSize: 10 } : false}
          />
        </div>

        {billingTests.length > 0 && (
          <div className="mt-6 flex justify-center items-center gap-6">
            <div className="bg-gray-100 border border-gray-400 rounded-lg px-6 py-2 shadow-md text-center w-56 h-20">
              <h3 className="text-sm text-gray-700 font-medium">Total Rate</h3>
              <p className="text-2xl font-bold text-black">
                Rs {totalRate.toLocaleString()}
              </p>
            </div>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportToExcel}
              size="middle"
              style={{
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
                height: "50px",
              }}
            >
              Export to Excel
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
