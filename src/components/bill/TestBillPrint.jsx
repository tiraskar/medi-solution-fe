import React, { useRef, useEffect } from 'react';

const PRIMARY_COLOR_CLASS = 'text-blue-700';
const MIDI_SOLUTION_LOGO_URL = '/src/assets/medi-solution.png'; // adjust path if needed

export default function PrintBill({ billData, onClose }) {
  const printRef = useRef();

  const handlePrintAndClose = () => {
    window.print();
    setTimeout(() => onClose(), 500); // give time for print dialog
  };

  useEffect(() => {
    const timer = setTimeout(handlePrintAndClose, 200);
    return () => clearTimeout(timer);
  }, []);

  const {
    voucher_number,
    date_of_issue,
    patient_info,
    tests_billed,
    total_amount,
    discount_amount,
    net_payable,
    payment_method,
    bank_name
  } = billData;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2
    }).format(amount).replace('NPR', 'Rs.');

  return (
    <div 
    id='print-area'
    className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans print-wrapper print-area">
      <div
        ref={printRef}
        className="print-receipt bg-white mx-auto p-8 border border-gray-200 shadow-lg max-w-3xl"
      >
        {/* Header */}
        <header className="flex justify-between items-center mb-6 border-b-4 border-dashed border-gray-300 pb-4">
          <div className="flex items-center gap-4">
            <img
              src={MIDI_SOLUTION_LOGO_URL}
              alt="Logo"
              className="h-20 w-20 object-cover rounded-full border border-gray-200"
            />
            <div className="flex flex-col">
              <div className="text-3xl font-extrabold font-serif">Medi Solution</div>
              <p className="text-sm text-gray-500">Your Reliable Diagnostic Partner</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mt-1">Invoice: <span className="font-mono">{voucher_number}</span></p>
            <p className="text-sm text-gray-600">Date: {date_of_issue}</p>
          </div>
        </header>

        {/* Patient Info */}
        <section className="flex justify-between mb-6 text-sm">
          <div>
            <h2 className={`font-semibold mb-2 ${PRIMARY_COLOR_CLASS}`}>Patient Info</h2>
            <div className="flex space-x-6 text-gray-900">
              <span><span className="font-medium">Name:</span> {patient_info?.name}</span>
              <span><span className="font-medium">Age:</span> {patient_info?.age}</span>
              <span><span className="font-medium">Gender:</span> {patient_info?.gender}</span>
            </div>
          </div>
        </section>

        {/* Tests Table */}
        <h2 className={`text-lg font-semibold mb-2 ${PRIMARY_COLOR_CLASS}`}>Tests</h2>
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="p-1 border border-gray-300 w-8 text-center">#</th>
              <th className="p-1 border border-gray-300 text-left">Description</th>
              <th className="p-1 border border-gray-300 w-12 text-center">Qty</th>
              <th className="p-1 border border-gray-300 w-20 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {tests_billed.map((t, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-1 text-center">{idx + 1}</td>
                <td className="border border-gray-300 p-1">{t.test_name}</td>
                <td className="border border-gray-300 p-1 text-center">{t.qty}</td>
                <td className="border border-gray-300 p-1 text-right">{formatCurrency(t.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end mt-4">
          <div className="w-full max-w-xs space-y-2 text-base">
            <div className="flex justify-between border-b pb-1 text-gray-700">
              <span>Subtotal:</span>
              <span>{formatCurrency(total_amount)}</span>
            </div>
            <div className="flex justify-between border-b pb-1 text-red-600">
              <span>Discount:</span>
              <span>{formatCurrency(discount_amount)}</span>
            </div>
            <div className={`flex justify-between pt-2 text-xl font-bold ${PRIMARY_COLOR_CLASS}`}>
              <span>Net Payable:</span>
              <span>{formatCurrency(net_payable)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-sm text-gray-600">
              <span>Payment:</span>
              <span>{bank_name ? `${bank_name} (Bank Transfer)` : payment_method}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 mt-10 border-t border-dashed border-gray-300">
          <p className="text-xs mt-2 text-gray-500">For any queries, please contact us. Midi Solution</p>
        </footer>
      </div>
    </div>
  );
}
