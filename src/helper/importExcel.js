// import { useDispatch } from "react-redux";
// import { addTest } from "../api/test.api";

// export const handleSaveToDB = (excelData) => {
//   const dispatch = useDispatch();
//   const rows = excelData.slice(1).map((row) => ({
//     test_name: row[0]?.value,
//     parameters: row[1]?.value,
//     low_range: row[2]?.value,
//     top_range: row[3]?.value,
//     rate: row[4]?.value,
//     gender: row[5]?.value,
//     email: row[6]?.value,
//     mobile: row[7]?.value,
//     address: row[8]?.value,
//     qualification: row[9]?.value,
//     bio: row[10]?.value,
//   }));

//   console.log("Saving to DB:", rows);
//   // Example API call (you can make batch save)
//   rows.forEach((r) => dispatch(addTest(r)));

//   setExcelModalVisible(false);
// };
