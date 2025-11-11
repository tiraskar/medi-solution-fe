// import React, { useState, useEffect } from "react";
// import { Select, Table, Card } from "antd";

// const { Option } = Select;

// export default function TestRateDashboard() {
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [selectedItems, setSelectedItems] = useState([]);

//   const tests = ["Blood Test", "Urine Test", "X-Ray"];
//   const groups = ["Basic", "Advanced", "Full Body"];
  
//   const allItems = [
//     { id: 1, name: "Hemoglobin", test: "Blood Test", group: "Basic", rate: 200 },
//     { id: 2, name: "Sugar", test: "Blood Test", group: "Advanced", rate: 150 },
//     { id: 3, name: "Cholesterol", test: "Blood Test", group: "Full Body", rate: 300 },
//     { id: 4, name: "Urine Analysis", test: "Urine Test", group: "Basic", rate: 250 },
//     { id: 5, name: "Protein Test", test: "Urine Test", group: "Advanced", rate: 200 },
//     { id: 6, name: "X-Ray Chest", test: "X-Ray", group: "Basic", rate: 500 },
//     { id: 7, name: "X-Ray Hand", test: "X-Ray", group: "Full Body", rate: 300 },
//   ];

//   const columns = [
//     { title: "Test Name", dataIndex: "name", key: "name" },
//     { title: "Rate (Rs)", dataIndex: "rate", key: "rate" },
//   ];

//   const totalRate = selectedItems.reduce((sum, item) => sum + item.rate, 0);

//   // Show items only when both Test and Test Group are selected
//   useEffect(() => {
//     if (selectedTest && selectedGroup) {
//       const filtered = allItems.filter(
//         (item) => item.test === selectedTest && item.group === selectedGroup
//       );
//       setSelectedItems(filtered);
//     } else {
//       setSelectedItems([]);
//     }
//   }, [selectedTest, selectedGroup]);

//   return (
//      <Card className="rounded-2xl shadow-lg border border-gray-200">
//           <h2 className="text-2xl font-semibold mb-6 text-blue-600 text-center">
//             🧾 Billing Dashboard
//           </h2>

//           {/* --- Selection Row --- */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             {/* Test */}
//             <div>
//               <div className="bg-[#3279a8] text-white font-semibold text-center py-2 rounded-md mb-1">
//                 Test
//               </div>
//               <Select
//                 placeholder="Select Test"
//                 style={{ width: "100%" }}
//                 value={selectedTest}
//                 onChange={(val) => setSelectedTest(val)}
//                 allowClear
//               >
//                 {tests.map((t) => (
//                   <Option key={t} value={t}>
//                     {t}
//                   </Option>
//                 ))}
//               </Select>
//             </div>

//             {/* Test Group */}
//             <div>
//               <div className="bg-[#3279a8] text-white font-semibold text-center py-2 rounded-md mb-1">
//                 Test Group
//               </div>
//               <Select
//                 placeholder="Select Group"
//                 style={{ width: "100%" }}
//                 value={selectedGroup}
//                 onChange={(val) => setSelectedGroup(val)}
//                 allowClear
//               >
//                 {groups.map((g) => (
//                   <Option key={g} value={g}>
//                     {g}
//                   </Option>
//                 ))}
//               </Select>
//             </div>

//             {/* Agent */}
//             <div>
//               <div className="bg-[#3279a8] text-white font-semibold text-center py-2 rounded-md">
//                 Agent
//               </div>
//             </div>

//             {/* Doctor */}
//             <div>
//               <div className="bg-[#3279a8] text-white font-semibold text-center py-2 rounded-md">
//                 Doctor
//               </div>
//             </div>
//           </div>

//           {/* --- Selected Items Table --- */}
//           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//             <Table
//               dataSource={selectedItems}
//               columns={columns}
//               pagination={false}
//               rowKey="id"
//               locale={{ emptyText: "Select both Test and Test Group to show items" }}
//             />
//           </div>
//                   {selectedItems.length > 0 && (
//         <div className="mt-6 bg-blue-100 border border-blue-400 rounded-lg px-8 py-3 shadow-md text-center w-56">
//           <p className="text-sm text-gray-700 font-medium">Total Rate</p>
//           <p className="text-2xl font-bold text-blue-700">
//             Rs {totalRate.toLocaleString()}
//           </p>
//         </div>
//       )}
//         </Card>
    
    
    
//   );
// }