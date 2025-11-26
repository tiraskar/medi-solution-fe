
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Select, Table, Card, Spin, message, Radio, Button, Input, Divider, Tag, DatePicker } from "antd";
import { DeleteOutlined, SaveOutlined, CalculatorOutlined, ClearOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { fetchTestRatesApi } from "../../api/testRate.api";
import { createTestBillApi } from "../../api/testBill.api";

import { fetchTestGroups } from "../../api/testgroup.api";
import { fetchBanksApi } from "../../api/getBank.api";
import { getAllPatients } from "../../api/patient.api";
import PrintBill from "../../components/bill/TestBillPrint";



const { Option } = Select;

export default function TestBilling({onClose}) {
  const dispatch = useDispatch();

  // --- Redux State Selectors ---
  const {
    testRates: apiResponse = {},
    loading: dataLoading = false,
    isError = false,
    message: errorMessage = "",
  } = useSelector((state) => state.testRates || {});

  const { testGroups = [] } = useSelector((state) => state.testGroup || {});
  const { banks = [], loading: bankLoading } = useSelector((state) => state.bank || {});

  const { 
     patients = [], 
    loading: patientLoading = false 
  } = useSelector((state) => state.patient || {});
  
  const testRates = Array.isArray(apiResponse.data) ? apiResponse.data : [];

  // --- Component States ---
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [manualTests, setManualTests] = useState([]);
  const [billingTests, setBillingTests] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [discountInput, setDiscountInput] = useState('');
  const [paymentMode, setPaymentMode] = useState("cash");
  const [selectedBank, setSelectedBank] = useState(null);
  
  const [patientInfo, setPatientInfo] = useState(null); // Full Selected Patient Object
  const [selectedPatientId, setSelectedPatientId] = useState(null); // For Select value
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to today

  const [isSaving, setIsSaving] = useState(false);
  const [billToPrint, setBillToPrint] = useState(null);
const [showPrintModal, setShowPrintModal] = useState(false);
  // --- Data Fetching Effect ---
  useEffect(() => {
    dispatch(fetchTestRatesApi());
    dispatch(fetchTestGroups());
    dispatch(fetchBanksApi());
    dispatch(getAllPatients()); 
    
  }, [dispatch]);
  console.log(patients);

  useEffect(() => {
    if (isError) message.error(errorMessage || "Failed to fetch necessary data.");
  }, [isError, errorMessage]);

  // 💡 Patient Select handler
  const handlePatientChange = (id) => {
    setSelectedPatientId(id);
    const patient = patients.find(p => p.id === id); 
    setPatientInfo(patient || null);
    if (!patient) message.error("Selected patient data not found in store.");
  };
  
  const getUniqueTests = (tests) =>
    tests.filter((t, i, arr) => arr.findIndex((x) => x.test_id === t.test_id) === i);

  const recomputeBillingTests = (manual = manualTests, groups = selectedGroups) => {
    const groupTests = groups.flatMap((g) => g.tests || []);
    setBillingTests(getUniqueTests([...manual, ...groupTests]));
  };

  const handleChange = (name, selectedIds) => {
    if (name === "tests") {
      const selectedObjects = testRates.filter((test) =>
        selectedIds.includes(test.test_id)
      );

      const newlySelected = selectedObjects.filter(
        t => !manualTests.find(m => m.test_id === t.test_id)
      );

      if (newlySelected.length > 0) {
        newlySelected.forEach(t => {
          message.success(`Test Selected: ${t.test_name}`);
        });
      }

      setManualTests(selectedObjects);
      recomputeBillingTests(selectedObjects, selectedGroups);
    }
  };

  const handleGroupTestChange = (selectedGroupIds) => {
    const groupsArr = testGroups?.[0] ?? [];
    const selectedGroupObjs = groupsArr.filter((g) =>
      selectedGroupIds.includes(g.group_id)
    );

    const newlySelectedGroups = selectedGroupObjs.filter(
      g => !selectedGroups.find(sg => sg.group_id === g.group_id)
    );

    if (newlySelectedGroups.length > 0) {
      newlySelectedGroups.forEach(g => {
        message.success(`Test Group Selected: ${g.group_name}`);
      });
    }

    setSelectedGroups(selectedGroupObjs);
    recomputeBillingTests(manualTests, selectedGroupObjs);
  };

  const handleRemoveItem = (id) => {
    setBillingTests(prev => prev.filter(item => item.test_id !== id));
    setManualTests(prev => prev.filter(item => item.test_id !== id));
    message.success("Item removed successfully");
  };

  const handleRemoveSourceItem = (id, type) => {
    if (type === 'test') {
      const newManualTests = manualTests.filter(t => t.test_id !== id);
      setManualTests(newManualTests);
      recomputeBillingTests(newManualTests, selectedGroups);
    } else if (type === 'group') {
      const newSelectedGroups = selectedGroups.filter(g => g.group_id !== id);
      setSelectedGroups(newSelectedGroups);
      recomputeBillingTests(manualTests, newSelectedGroups);
    }
    message.success("Item removed successfully");
  };

  const handleClear = () => {
    setManualTests([]);
    setSelectedGroups([]);
    setBillingTests([]);
    setSelectedAgent(null);
    setSelectedDoctor(null);
    setDiscountInput('');
    setPaymentMode("cash");
    setSelectedBank(null);
    setSelectedPatientId(null);
    setPatientInfo(null);
    setSelectedDate(dayjs());
    message.info("Billing selections cleared.");
  };

  // Render tags without duplicates (Same as before)
  const renderSelectedTags = () => {
    const groupTestIds = selectedGroups.flatMap(g => (g.tests || []).map(t => t.test_id));
    const filteredManualTests = manualTests.filter(test => !groupTestIds.includes(test.test_id));

    const testTags = filteredManualTests.map(test => (
      <Tag
        key={`test-${test.test_id}`}
        color="blue"
        closable
        onClose={() => handleRemoveSourceItem(test.test_id, 'test')}
        style={{ height: '28px', lineHeight: '28px', margin: '4px 8px 4px 0', flexShrink: 0 }}
      >
        {test.test_name}
      </Tag>
    ));

    const groupTags = selectedGroups.map(group => (
      <Tag
        key={`group-${group.group_id}`}
        color="purple"
        closable
        onClose={() => handleRemoveSourceItem(group.group_id, 'group')}
        style={{ height: '28px', lineHeight: '28px', margin: '4px 8px 4px 0', flexShrink: 0 }}
      >
        {group.group_name} (Group)
      </Tag>
    ));

    const combinedTags = [...testTags, ...groupTags];

    if (combinedTags.length === 0) {
      return <span className="text-gray-500 italic text-sm py-1">No tests or groups selected.</span>;
    }

    return combinedTags;
  };

  const columns = [
    { title: "Test Name", dataIndex: "test_name", key: "test_name", ellipsis: true, sorter: (a, b) => a.test_name.localeCompare(b.test_name) },
    { title: "Parameters", dataIndex: "parameters", key: "parameters", ellipsis: true },
    { title: "Rate (Rs)", dataIndex: "rate", key: "rate", width: 100, align: "right", render: (rate) => parseFloat(rate || 0).toLocaleString(), sorter: (a, b) => parseFloat(a.rate || 0) - parseFloat(b.rate || 0) },
    { title: "Action", key: "action", width: 70, align: "center", render: (_, record) => <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemoveItem(record.test_id)} style={{ width: "24px", height: "24px", padding: 0 }} /> },
  ];

  const discountAmount = parseFloat(discountInput.replace(/[^0-9.]/g, '')) || 0;
  const totalRate = billingTests.reduce((sum, item) => sum + (parseFloat(item.rate) || 0), 0);
  const finalRate = Math.max(0, totalRate - discountAmount);

  const loading = dataLoading || isSaving || bankLoading || patientLoading;

  const handleSaveBill = async () => {
    if (billingTests.length === 0) {
      message.warning("Cannot save an empty bill. Please select at least one test.");
 setBillToPrint(printData);
  setShowPrintModal(true); // open modal instead of direct return
      return;
    }
    
    // 💡 Patient and Date Validation
    if (!selectedPatientId || !patientInfo) {
        message.warning("Please select a Patient from the list.");
        return;
    }
    if (!selectedDate) {
        message.warning("Please select a Bill Date.");
        return;
    }

    if (paymentMode === "bank" && !selectedBank) {
      message.warning("Please select a Bank Ledger for the Bank Payment mode.");
      return;
    }
const tempVoucherNumber = 'VN-' + Date.now();
    const billPayload = {
      // 💡 Patient info now comes from the selected patient object
      patient_info: { 
          id: patientInfo.id, 
          name: `${patientInfo.first_name || ''} ${patientInfo.last_name || ''}`.trim(), 
          address: patientInfo.address || "", 
          email: patientInfo.email || "", 
          age: patientInfo.age || 'N/A', 
          gender: patientInfo.gender || 'N/A', 
      },
      bill_date: selectedDate.toISOString(), 
      tests_billed: billingTests.map(test => ({ test_id: test.test_id, test_name: test.test_name, rate: parseFloat(test.rate) || 0, qty: 1 })),
      groups_used: selectedGroups.map(g => ({ group_id: g.group_id, group_name: g.group_name })),
      total_amount: totalRate,
      discount_amount: discountAmount,
      net_payable: finalRate,
      payment_method: paymentMode,
voucher_number: tempVoucherNumber, 
      bank_ledger_id: paymentMode === "bank" ? selectedBank : null, // Pass ledger ID
      agent_id: selectedAgent,
      doctor_id: selectedDoctor,
      created_at: new Date().toISOString(),
      created_by: 1,
    };

    setIsSaving(true);
    try {
      const resultAction = await dispatch(createTestBillApi(billPayload));
      if (createTestBillApi.fulfilled.match(resultAction)) {
        const newBillId = resultAction.payload?.bill_id || 'B-' + Math.floor(Math.random() * 10000);

        const printData = {
          ...billPayload,
          invoice_number: newBillId,
          date_of_issue: selectedDate.format('DD/MM/YYYY'), // dayjs format
          // Find the bank name for printing purpose
          bank_name: paymentMode === "bank" ? banks.find(b => b.ledger_id === selectedBank)?.ledgername : null,
        };

        setBillToPrint(printData);
      } else {
        message.error(`Failed to save bill: ${resultAction.payload || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      message.error("An unexpected error occurred while processing the bill.");
    } finally { setIsSaving(false); }
  };

 
const handleClosePrint = () => {
  setBillToPrint(null);
  handleClear();  
     // clear form data
};


 if (billToPrint)
  return (
    <div className="absolute bottom-0 z-[-50]">
      <PrintBill billData={billToPrint} onClose={handleClosePrint} />
    </div>
  );
  return (
  
    <div className="w-full h-150 bg-gray-50">
  

      <style>
        {`
            /* Styles for compact dropdown list items */
            .compact-select-dropdown .ant-select-item {
                padding: 0 8px !important;
            }
            .compact-select-dropdown .ant-select-item-option-content {
                padding-top: 4px;
                padding-bottom: 4px;
                font-size: 12px;
            }

            /* New Style: Hide the internal tags within the Select input */
            .internal-tag-hider .ant-select-selector .ant-select-selection-item {
                display: none !important;
            }
            /* Custom style for search input when tags are hidden, to vertically center placeholder/input */
            .internal-tag-hider .ant-select-selector .ant-select-selection-placeholder {
                line-height: 40px;
            }
            `}
      </style>
   <Card
  className="rounded-none shadow-none border-none"
  bodyStyle={{ padding: '20px' }} 
>      {loading && <div className="absolute inset-0 z-20 flex justify-center items-center bg-white/70 rounded-xl"><Spin size="large" tip={isSaving ? "Saving Bill..." : "Loading data..."} /></div>}

        <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-md flex-shrink-0">
          
          {/* Patient Select and Date Picker */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/*  Patient Selector (uses Redux data) */}
            <div className='lg:col-span-2'>
              <label className="block text-gray-800 font-bold text-sm uppercase mb-1 flex items-center"><UserOutlined className="mr-2" /> Select Patient <span className="text-red-500 ml-1">*</span></label>
              <Select
                showSearch
                value={selectedPatientId}
                onChange={handlePatientChange}
                placeholder={patientLoading ? "Loading patients..." : "Search Patient by Name/ID"}
                optionFilterProp="children"
                className="w-full"
                size="large"
                allowClear
                disabled={loading}
                filterOption={(input, option) =>
                    // Ensure option.children is a string before calling toLowerCase
                    (option?.children ?? '').toString().toLowerCase().includes(input.toLowerCase())
                }
              >
                {/* 💡 Patient list maps from Redux state */}
                {patients.map(p => (
                    <Option key={p.id} value={p.id}>{`${p.first_name} ${p.last_name}`}</Option>
                ))}
              </Select>
            </div>

            {/* 💡 Bill Date Picker */}
            <div>
              <label className="block text-gray-800 font-bold text-sm uppercase mb-1 flex items-center"><CalendarOutlined className="mr-2" /> Bill Date <span className="text-red-500 ml-1">*</span></label>
              <DatePicker 
                value={selectedDate} 
                onChange={setSelectedDate} 
                className="w-full" 
                size="large" 
                disabled={loading}
              />
            </div>
            
     
          </div>
          <Divider className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Test Selector (Unchanged) */}
            <div>
              <label className="block text-gray-800 font-bold text-sm uppercase mb-1">Select Test</label>
              <Select
                mode="multiple"
                placeholder="Search and add individual tests"
                value={manualTests.map(t => t.test_id)}
                onChange={data => handleChange("tests", data)}
                allowClear
                dropdownClassName="compact-select-dropdown"
                className="w-full internal-tag-hider"
                disabled={loading}
                size="large"
                maxTagCount={0}
              >
                {testRates.map(data => <Option key={data.test_id} value={data.test_id}>{data.test_name}</Option>)}
              </Select>
            </div>

            {/* Test Group Selector (Unchanged) */}
            <div>
              <label className="block text-gray-800 font-bold text-sm uppercase mb-1">Select Test Group</label>
              <Select
                mode="multiple"
                placeholder="Add predefined test groups"
                value={selectedGroups.map(g => g.group_id)}
                onChange={handleGroupTestChange}
                allowClear
                dropdownClassName="compact-select-dropdown"
                className="w-full internal-tag-hider"
                disabled={loading}
                size="large"
                maxTagCount={0} 
              >
                {testGroups[0]?.map(g => <Option key={g.group_id} value={g.group_id}>{g.group_name}</Option>)}
              </Select>
            </div>

            {/* Agent Selector (Unchanged) */}
            <div>
              <label className="block text-gray-800 font-bold text-sm uppercase mb-1">Agent/Referral</label>
              <Select placeholder="Select Agent" value={selectedAgent} onChange={setSelectedAgent} allowClear className="w-full" disabled={loading} size="large">
                {["Agent A", "Agent B", "Agent C"].map(a => <Option key={a} value={a}>{a}</Option>)}
              </Select>
            </div>

            {/* Doctor Selector (Unchanged) */}
            <div>
              <label className="block text-gray-800 font-bold text-sm uppercase mb-1">Referring Doctor</label>
              <Select placeholder="Select Doctor" value={selectedDoctor} onChange={setSelectedDoctor} allowClear className="w-full" disabled={loading} size="large">
                {["Dr. Smith", "Dr. Johnson", "Dr. Lee"].map(d => <Option key={d} value={d}>{d}</Option>)}
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-start flex-shrink-0 mb-6">
          <div className="bg-white px-2 py mb-6 rounded-lg border border-gray-300 shadow-sm inline-flex items-center min-h-[40px] overflow-x-auto" style={{ opacity: loading ? 0.7 : 1 }}>
            <span className="text-gray-600 font-medium text-sm ml-2 mr-3 flex-shrink-0">Selected:</span>
            <div className="flex flex-nowrap items-center">{renderSelectedTags()}</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-grow overflow-hidden">
          {/* Left Panel (Unchanged) */}
          <div className="flex flex-col gap-5 w-full lg:w-[320px] xl:w-[350px] flex-shrink-0">
            <Card title={<span className="text-base font-bold text-gray-700"><CalculatorOutlined className="mr-2" /> Calculation Summary</span>} bordered={false} className="shadow-lg rounded-xl border border-gray-100" bodyStyle={{ padding: "16px 20px" }}>
              <div className="flex justify-between items-center mb-3"><span className="text-gray-600 font-medium">Test Subtotal:</span><span className="text-lg font-semibold text-gray-800">Rs {totalRate.toLocaleString()}</span></div>
              <Divider className="my-3" />
              <label className="block text-gray-800 font-bold text-base mb-2">Payment Method</label>
              <Radio.Group onChange={(e) => setPaymentMode(e.target.value)} value={paymentMode} className="mb-4">
                <Radio value="cash">Cash</Radio>
                <Radio value="credit">Credit</Radio>
                <Radio value="bank">Bank</Radio>
              </Radio.Group>
              {paymentMode === "bank" &&
                <div className="mb-4">
                  <label className="block text-gray-800 font-bold text-sm mb-1">Select Bank</label>
                  <Select placeholder={bankLoading ? "Loading Banks..." : "Choose Bank"} value={selectedBank} size="large" className="w-full" onChange={setSelectedBank} disabled={bankLoading || loading}>
                    {banks.map(b => <Option key={b.ledger_id} value={b.ledger_id}>{b.ledgername}</Option>)}
                  </Select>
                </div>
              }
              <Divider className="my-3" />
              <label className="block text-gray-800 font-bold text-sm mb-1">Apply Discount (Rs)</label>
              <Input value={discountInput} onChange={e => setDiscountInput(e.target.value)} className="w-full mb-3" style={{ fontSize: "14px", height: "38px", padding: "6px 10px" }} disabled={loading} placeholder="Enter discount amount" />
              <div className="flex justify-between items-center p-2 mt-3 bg-gray-100 rounded-lg border border-green-200">
                <span className="text-sm font-bold text-green-700">Net Payable:</span>
                <span className="text-xl font-extrabold text-green-600">Rs {finalRate.toLocaleString()}</span>
              </div>
            </Card>

            <div className="flex gap-4 flex-shrink-0 action-button-group">
              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                className="font-bold px-4 h-10 text-base flex-1"
                disabled={loading || billingTests.length === 0 || (paymentMode === "bank" && !selectedBank) || !selectedPatientId || !selectedDate}
                onClick={handleSaveBill}
              >
                {isSaving ? "SAVING..." : "SAVE BILL"}
              </Button>
              <Button danger size="large" icon={<ClearOutlined />} className="font-bold px-4 h-10 flex-1" disabled={loading} onClick={handleClear}>Clear All</Button>
            </div>
          </div>

          {/* Right Panel (Unchanged) */}
          <div className="flex-1 overflow-y-auto flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-3 flex-shrink-0">Selected Tests and Rates ({billingTests.length} items)</h4>
            <div className="flex-grow overflow-auto">
              <Table
                columns={columns}
                dataSource={billingTests}
                rowKey="test_id"
                pagination={{ pageSize: 10 }}
                size="middle"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}