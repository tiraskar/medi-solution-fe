import React, { useRef } from 'react';
import { Button } from 'antd';
import { PrinterOutlined, CloseOutlined } from '@ant-design/icons';

// Define the primary brand color for the receipt theme
const PRIMARY_COLOR_CLASS = 'text-blue-700'; // Modern, professional blue
const BG_COLOR_CLASS = 'bg-blue-50'; // Very light background

const MIDI_SOLUTION_LOGO_URL = '/src/assets/medi-solution.png';

export default function PrintView({ billData, onClose }) {
  const printRef = useRef();

  const handlePrint = () => {
    // You could optionally use printRef here for targeted printing, 
    // but window.print() is often simplest with the CSS media query
    window.print();
  };

  const {
    invoice_number,
    date_of_issue,
    patient_info,
    tests_billed,
    total_amount,
    discount_amount,
    net_payable,
    payment_mode,
  } = billData;

  // Use Intl.NumberFormat for standardized currency display
  const formatCurrency = (amount) => {
    // Assuming Nepali Rupee (NPR) as per "Rs." prefix
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2,
    }).format(amount).replace('NPR', 'Rs.');
  };


  const services = tests_billed.map((t, index) => ({
    no: index + 1,
    description: t.test_name,
    qty: t.qty,
    total: t.rate, // Assuming rate is the total for a single test/item
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      
      {/* Control Buttons – hide in print */}
      <div className="no-print flex justify-end gap-3 mb-4">
        <Button
          onClick={handlePrint}
          type="primary"
          icon={<PrinterOutlined />}
          className="font-bold"
        >
          Print Receipt
        </Button>

        <Button
          onClick={onClose}
          icon={<CloseOutlined />}
          className="font-bold"
        >
          Close & New Bill
        </Button>
      </div>

      {/* Receipt Paper: Refined Design */}
      <div
        ref={printRef}
        className="print-receipt bg-white mx-auto p-8 border border-gray-200 shadow-lg max-w-3xl"
      >
        
        {/* Header Section: Logo + Title */}
        <header className="text-center pb-6 mb-6 border-b-4 border-double border-gray-300">
          <div className="flex flex-col items-center">
            {/* Logo */}
            <img
              src={MIDI_SOLUTION_LOGO_URL}
              alt="Midi Solution Logo"
              className="h-20 w-20 mb-3 object-cover rounded-full border border-gray-200"
            />
            {/* Company Name */}
            <div className={`text-4xl font-extrabold font-serif tracking-wide ${PRIMARY_COLOR_CLASS}`}>
              Midi Solution
            </div>
            {/* Tagline/Subtitle */}
            <p className="text-sm text-gray-500 mt-1">
              Your Reliable Diagnostic Partner
            </p>
          </div>
          {/* Main Title */}
          <h1 className="text-2xl font-bold mt-4 text-gray-800">
            BILL RECEIPT
          </h1>
        </header>

        {/* Transaction & Patient Information Grid */}
        <section className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm mb-8">
          {/* Column 1: Transaction Details */}
          <div className="col-span-1">
            <h2 className={`text-base font-semibold mb-2 border-b border-blue-200 pb-1 ${PRIMARY_COLOR_CLASS}`}>
              Transaction Details
            </h2>
            <p className="mb-1">
              <span className="font-medium">Invoice No:</span> <span className="text-gray-900 font-mono ml-1">{invoice_number}</span>
            </p>
            <p className="mb-1">
              <span className="font-medium">Date of Issue:</span> <span className="text-gray-900 ml-1">{date_of_issue}</span>
            </p>
          </div>

          {/* Column 2: Patient's Information */}
          <div className="col-span-1">
            <h2 className={`text-base font-semibold mb-2 border-b border-blue-200 pb-1 ${PRIMARY_COLOR_CLASS}`}>
              Patient's Information
            </h2>
            <p>
              <span className="font-medium">Name:</span> {patient_info?.name}
            </p>
            <p>
              <span className="font-medium">Age:</span> {patient_info?.age}
            </p>
            <p>
              <span className="font-medium">Gender:</span> {patient_info?.gender}
            </p>
          </div>
        </section>

        {/* Services Table */}
        <h2 className={`text-xl font-semibold mb-3 ${PRIMARY_COLOR_CLASS}`}>
          Billed Services
        </h2>
        <table className="w-full border-collapse text-sm mb-8">
          <thead className={`text-left text-white ${BG_COLOR_CLASS.replace('bg-', 'bg-')}`}>
            <tr className={`${BG_COLOR_CLASS}`}>
              <th className={`p-3 w-12 border ${PRIMARY_COLOR_CLASS} border-blue-200`}>#</th>
              <th className={`p-3 border ${PRIMARY_COLOR_CLASS} border-blue-200`}>Test Description</th>
              <th className={`p-3 w-16 text-center border ${PRIMARY_COLOR_CLASS} border-blue-200`}>Qty</th>
              <th className={`p-3 w-24 text-right border ${PRIMARY_COLOR_CLASS} border-blue-200`}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {services.map((item) => (
              <tr key={item.no} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3">{item.no}</td>
                <td className="border border-gray-200 p-3">{item.description}</td>
                <td className="border border-gray-200 p-3 text-center">{item.qty}</td>
                <td className="border border-gray-200 p-3 text-right">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Summary & Payment */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-base">
            <div className="flex justify-between border-b pb-1 text-gray-700">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold">{formatCurrency(total_amount)}</span>
            </div>
            <div className="flex justify-between border-b pb-1 text-red-600">
              <span className="font-medium">Discount:</span>
              <span className="font-semibold">- {formatCurrency(discount_amount)}</span>
            </div>
            
            {/* Net Payable - Highlighted */}
            <div className={`flex justify-between border-t-2 pt-2 text-xl font-bold ${PRIMARY_COLOR_CLASS}`}>
              <span>Net Payable:</span>
              <span>{formatCurrency(net_payable)}</span>
            </div>

            {/* Payment Mode */}
            <div className="flex justify-between border-t pt-2 text-sm text-gray-600">
              <span className="font-medium">Payment Mode:</span>
              <span className="font-semibold">{billData.bank_name ? ` ${billData.bank_name} (Bank Transfer)` : payment_mode}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 mt-10 border-t border-dashed border-gray-300">
          <p className={`text-lg font-semibold ${PRIMARY_COLOR_CLASS}`}>
            *** THANK YOU! ***
          </p>
          <p className="text-xs mt-2 text-gray-500">
            For any queries, please contact us.Medi Solution
          </p>
        </footer>

      </div>

      {/* Print-specific Styles */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .print-receipt { 
                border: none !important; 
                box-shadow: none !important; 
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0.5in; /* Standard print margin */
                font-size: 10pt; /* Smaller font for print economy */
            }
            .print-receipt h1 { font-size: 18pt !important; }
            .print-receipt h2 { font-size: 12pt !important; }
          }
        `}
      </style>

    </div>
  );
}