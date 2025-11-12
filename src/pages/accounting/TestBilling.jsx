import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Select, Table, Card, Spin, message, Button } from "antd";
import { fetchTestRatesApi } from "../../api/testRate.api";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
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

  const testRates = Array.isArray(apiResponse.data) ? apiResponse.data : [];

  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // All unique tests and groups
  const allTests = useMemo(
    () => [...new Set(testRates.map((item) => item.test_name).filter(Boolean))],
    [testRates]
  );
  const allGroups = useMemo(
    () => [...new Set(testRates.map((item) => item.parameters).filter(Boolean))],
    [testRates]
  );

  // Filter tests based on selected groups
  const filteredTests = useMemo(() => {
    if (!selectedGroups.length) return allTests;
    return testRates
      .filter((item) => selectedGroups.includes(item.parameters))
      .map((item) => item.test_name)
      .filter((v, i, a) => a.indexOf(v) === i); // unique
  }, [selectedGroups, testRates, allTests]);

  // Filter groups based on selected tests
  const filteredGroups = useMemo(() => {
    if (!selectedTests.length) return allGroups;
    return testRates
      .filter((item) => selectedTests.includes(item.test_name))
      .map((item) => item.parameters)
      .filter((v, i, a) => a.indexOf(v) === i); // unique
  }, [selectedTests, testRates, allGroups]);

  // Filter items based on selections
  const selectedItems = useMemo(() => {
    if (!selectedTests.length && !selectedGroups.length) return [];
    return testRates.filter((item) => {
      const matchTest = selectedTests.length ? selectedTests.includes(item.test_name) : true;
      const matchGroup = selectedGroups.length ? selectedGroups.includes(item.parameters) : true;
      return matchTest && matchGroup;
    });
  }, [selectedTests, selectedGroups, testRates]);

  const [displayedItems, setDisplayedItems] = useState([]);

  useEffect(() => {
    setDisplayedItems(selectedItems);
  }, [selectedItems]);

  // Remove single item
  const handleRemoveItem = (id) => {
    setDisplayedItems((prev) => prev.filter((item) => item.test_id !== id));
    message.success("Item removed successfully");
  };

  // Export to Excel
  const handleExportToExcel = () => {
    if (!displayedItems.length) {
      message.warning("No data to export");
      return;
    }
    try {
      const totalRate = displayedItems.reduce(
        (sum, item) => sum + (parseFloat(item.rate) || 0),
        0
      );
      exportTestBillingToExcel(displayedItems, totalRate);
      message.success("Data exported to Excel successfully!");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Failed to export data to Excel");
    }
  };

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
          style={{ backgroundColor: "red", border: "2px solid white", color: "white" }}
        />
      ),
    },
  ];

  const totalRate = displayedItems.reduce(
    (sum, item) => sum + (parseFloat(item.rate) || 0),
    0
  );

  useEffect(() => {
    dispatch(fetchTestRatesApi());
  }, [dispatch]);

  useEffect(() => {
    if (isError) message.error(errorMessage || "Failed to fetch test rates");
  }, [isError, errorMessage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-black-600">🧾 Billing Dashboard</h2>

      <Card className="rounded-2xl shadow-lg border border-gray-200">
        <div className="grid bg-[#3279a8] grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4">
          {/* Test */}
          <div>
            <div className="text-white font-semibold text-center py-2 rounded-md mb-1">Test</div>
            <Select
              mode="multiple"
              placeholder="Select Test"
              value={selectedTests}
              onChange={setSelectedTests}
              allowClear
              style={{ width: "100%" }}
            >
              {filteredTests.map((t) => (
                <Option key={t} value={t}>
                  {t}
                </Option>
              ))}
            </Select>
          </div>
{/* Test Group */}
<div>
  <div className="text-white font-semibold text-center py-2 rounded-md mb-1">Test Group</div>
  <Select
    placeholder="Select Group"
    value={selectedGroups[0] || null} // only single selection
    onChange={(value) => {
      setSelectedGroups(value ? [value] : []); // store as array for consistency
      // Auto-select tests belonging to this group
      if (value) {
        const testsForGroup = testRates
          .filter((item) => item.parameters === value)
          .map((item) => item.test_name);
        setSelectedTests(testsForGroup);
      } else {
        setSelectedTests([]);
      }
    }}
    allowClear
    style={{ width: "100%" }}
  >
    {allGroups.map((g) => (
      <Option key={g} value={g}>
        {g}
      </Option>
    ))}
  </Select>
</div>


          {/* Agent */}
          <div>
            <div className="text-white font-semibold text-center py-2 rounded-md mb-1">Agent</div>
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
            <div className="text-white font-semibold text-center py-2 rounded-md mb-1">Doctor</div>
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
            dataSource={displayedItems}
            columns={columns}
            rowKey="test_id"
            locale={{ emptyText: "Select Test or Test Group to show items" }}
            pagination={displayedItems.length > 10 ? { pageSize: 10 } : false}
          />
        </div>

        {displayedItems.length > 0 && (
          <div className="mt-6 flex justify-center items-center gap-200">
            <div className="bg-gray-100 border border-gray-400 rounded-lg px-6 py-2 shadow-md text-center w-56 h-20">
              <h3 className="text-sm text-gray-700 font-medium">Total Rate</h3>
              <p className="text-2xl font-bold text-black">Rs {totalRate.toLocaleString()}</p>
            </div>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportToExcel}
              size="middle"
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", height: "50px" }}
            >
              Export to Excel
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
