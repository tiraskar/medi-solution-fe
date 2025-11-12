import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the Excel file
 * @param {string} sheetName - Name of the worksheet
 * @param {Array} columns - Column configuration (optional)
 */
export const exportToExcel = (data, fileName, sheetName = 'Sheet1', columns = null) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  try {
    // Prepare data for Excel
    let excelData;
    
    if (columns) {
      // If custom columns are provided
      excelData = data.map((item, index) => {
        const row = { 'S.N.': index + 1 };
        columns.forEach(col => {
          row[col.title] = item[col.dataIndex] || '';
        });
        return row;
      });
    } else {
      // Use all object properties
      excelData = data.map((item, index) => ({
        'S.N.': index + 1,
        ...item
      }));
    }

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData, { skipHeader: false });

    // Set column widths (you can customize this)
    const colWidths = [
      { wch: 5 },  // S.N.
      { wch: 30 }, // Test Name
      { wch: 30 }, // Parameters
      { wch: 15 }, // Rate
    ];
    ws['!cols'] = colWidths;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate file name
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFileName = `${fileName}_${timestamp}.xlsx`;

    // Export to Excel
    XLSX.writeFile(wb, finalFileName);
    
    return true;
  } catch (error) {
    console.error('Excel export error:', error);
    throw new Error('Failed to export data to Excel');
  }
};

/**
 * Specialized function for test billing data
 * @param {Array} selectedItems - Selected test items
 * @param {number} totalRate - Total rate amount
 */
export const exportTestBillingToExcel = (selectedItems, totalRate) => {
  if (!selectedItems || selectedItems.length === 0) {
    throw new Error('No data to export');
  }

  const excelData = selectedItems.map((item, index) => ({
    'S.N.': index + 1,
    'Test Name': item.test_name || 'N/A',
    'Parameters': item.parameters || 'N/A',
    'Rate (Rs)': parseFloat(item.rate) || 0,
  }));

  // Add total row
  excelData.push({
    'S.N.': '',
    'Test Name': '',
    'Parameters': 'TOTAL',
    'Rate (Rs)': totalRate,
  });

  return exportToExcel(excelData, 'Test_Billing', 'Test Billing');
};