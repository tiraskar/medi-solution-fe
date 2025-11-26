// src/pages/billing/BillHistory.js

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Card, Spin, Modal, Button, Tag, Empty } from "antd";
import { HistoryOutlined, PrinterOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchAllTestBillsApi } from "../../api/testBill.api";
import TestBilling from "./TestBilling";
import PrintBill from "../../components/bill/TestBillPrint";
import { useLocation } from "react-router-dom";

/**
 * BillHistory
 * - Groups per-test history rows by voucher_number
 * - Shows one row per voucher in table
 * - Expand row to show tests and metadata
 * - Print button reconstructs full bill and opens PrintBill component
 */

export default function BillHistory() {
  const dispatch = useDispatch();
  const location = useLocation();

  const billHistoryState = useSelector((state) => state.billHistory || {});
  const { bills = [], loading = false } = billHistoryState;

  const initialShowCreateBill = location.state?.showCreateBill ?? false;
  const [showCreateBill, setShowCreateBill] = useState(initialShowCreateBill);

  // bill selected for print/view (full reconstructed bill)
  const [billToView, setBillToView] = useState(null);

  useEffect(() => {
    if (location.state) {
      window.history.replaceState({}, document.title, location.pathname);
    }

    if (!showCreateBill) {
      dispatch(fetchAllTestBillsApi());
    }
  }, [dispatch, showCreateBill, location.state, location.pathname]);

  // Helper: merge raw per-test rows into grouped bills by voucher_number
  const mergedBills = useMemo(() => {
    if (!Array.isArray(bills) || bills.length === 0) return [];

    const map = new Map();

    bills.forEach((item) => {
      // Prefer voucher_number; if missing fall back to id or combination
      const voucher = item.voucher_number || `VN-${item.id || Math.random().toString(36).slice(2, 9)}`;

      if (!map.has(voucher)) {
        map.set(voucher, {
          voucher_number: voucher,
          patient_id: item.patient_id,
          patient_name: item.patient_name || "Unknown",
          created_at: item.created_at || item.bill_date || null,
          created_by: item.created_by || null,
          transaction_id: item.transaction_id || null,
          group_id: item.group_id || (item.groups_used && item.groups_used[0]?.group_id) || null,
          payment_method: item.payment_method || null,
          discount_amount: parseFloat(item.discount_amount ?? item.discount ?? 0) || 0,
          bank_ledger_id: item.bank_ledger_id || null,
          tests_billed: [],
          total_amount: 0,
        });
      }

      const grouped = map.get(voucher);

      // Each raw row could represent a test (with test_id, test_name, rate)
      const rate = parseFloat(item.rate || item.test_rate || item.amount || 0) || 0;
      const qty = parseInt(item.qty || item.quantity || 1, 10) || 1;

      grouped.tests_billed.push({
        test_id: item.test_id ?? null,
        test_name: item.test_name ?? item.test ?? "Unknown Test",
        rate,
        qty,
      });

      grouped.total_amount = parseFloat((grouped.total_amount || 0) + rate * qty);
    });

    // Compute net_payable (use discount_amount if present)
    const result = Array.from(map.values()).map((g) => {
      const discount = parseFloat(g.discount_amount || 0) || 0;
      return {
        ...g,
        discount_amount: discount,
        net_payable: parseFloat((g.total_amount || 0) - discount),
      };
    });

    return result;
  }, [bills]);

  // Build a full bill object (what PrintBill expects) from a merged bill
  const buildFullBillFromMerged = (merged) => {
    if (!merged) return null;
     const billDate = merged.created_at || merged.bill_date || new Date().toISOString();


    return {
      voucher_number: merged.voucher_number,
       bill_date: billDate,
    created_at: billDate,
    date_of_issue: new Date(billDate).toLocaleDateString('en-GB'), // dd/mm/yyyy

      bill_date: merged.created_at,
      created_at: merged.created_at,
      created_by: merged.created_by,
      transaction_id: merged.transaction_id,
      bank_ledger_id: merged.bank_ledger_id,
      payment_method: merged.payment_method || "Cash",
      patient_info: {
        id: merged.patient_id,
        name: merged.patient_name,
      },
      tests_billed: merged.tests_billed.map((t) => ({
        test_id: t.test_id,
        test_name: t.test_name,
        rate: t.rate,
        qty: t.qty,
      })),
      total_amount: merged.total_amount || 0,
      discount_amount: merged.discount_amount || 0,
      net_payable: merged.net_payable || (merged.total_amount || 0) - (merged.discount_amount || 0),
      groups_used: merged.group_id ? [{ group_id: merged.group_id, group_name: "" }] : [],
    };
  };

  // When print button clicked from table row
  const handleViewBill = (record) => {
    // record here is the merged row (since we'll use mergedBills as dataSource)
    const fullBill = buildFullBillFromMerged(record);
    setBillToView(fullBill);
  };

  const handleClosePrintView = () => setBillToView(null);

  // Table columns (show summarized info)
  const columns = [
    {
      title: "Voucher",
      dataIndex: "voucher_number",
      key: "voucher_number",
      width: 180,
      render: (v) => <span className="font-medium">{v}</span>,
    },
    {
      title: "Patient",
      dataIndex: "patient_name",
      key: "patient_name",
      render: (p) => p || "Unknown",
    },
    {
      title: "Tests",
      dataIndex: "tests_billed",
      key: "tests_billed",
      width: 120,
      render: (tests) => <span>{Array.isArray(tests) ? tests.length : 0}</span>,
    },
    {
      title: "Total (Rs)",
      dataIndex: "total_amount",
      key: "total_amount",
      align: "right",
      width: 120,
      render: (amt) => Number(amt || 0).toLocaleString(),
      sorter: (a, b) => (a.total_amount || 0) - (b.total_amount || 0),
    },
    {
      title: "Discount (Rs)",
      dataIndex: "discount_amount",
      key: "discount_amount",
      align: "right",
      width: 120,
      render: (d) => Number(d || 0).toLocaleString(),
    },
    {
      title: "Net Payable (Rs)",
      dataIndex: "net_payable",
      key: "net_payable",
      align: "right",
      width: 140,
      render: (n) => Number(n || 0).toLocaleString(),
      sorter: (a, b) => (a.net_payable || 0) - (b.net_payable || 0),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      render: (d) => (d ? new Date(d).toLocaleDateString() : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      width: 110,
      align: "center",
      render: (_, record) => (
        <Button
          icon={<PrinterOutlined />}
          size="small"
          onClick={() => handleViewBill(record)}
        >
          Print
        </Button>
      ),
    },
  ];

  // Expanded content: show test list and some metadata
  const expandedRowRender = (record) => {
    const tests = record.tests_billed || [];
    return (
      <div className="p-3 bg-gray-50 rounded border border-gray-200">
        <div className="flex flex-wrap gap-6 mb-3">
          <div><strong>Patient ID:</strong> {record.patient_id ?? "N/A"}</div>
          <div><strong>Voucher No:</strong> {record.voucher_number}</div>
          <div><strong>Payment:</strong> {record.payment_method ?? "N/A"}</div>
        </div>

        {tests.length === 0 ? (
          <Empty description="No tests found for this voucher" />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #eaeaea" }}>
                <th style={{ padding: "8px" }}>#</th>
                <th style={{ padding: "8px" }}>Test Name</th>
                <th style={{ padding: "8px", textAlign: "right" }}>Rate (Rs)</th>
                <th style={{ padding: "8px", textAlign: "right" }}>Qty</th>
                <th style={{ padding: "8px", textAlign: "right" }}>Subtotal (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f3f3f3" }}>
                  <td style={{ padding: "8px", verticalAlign: "top" }}>{idx + 1}</td>
                  <td style={{ padding: "8px", verticalAlign: "top" }}>{t.test_name}</td>
                  <td style={{ padding: "8px", verticalAlign: "top", textAlign: "right" }}>{Number(t.rate || 0).toLocaleString()}</td>
                  <td style={{ padding: "8px", verticalAlign: "top", textAlign: "right" }}>{t.qty || 1}</td>
                  <td style={{ padding: "8px", verticalAlign: "top", textAlign: "right" }}>{Number((t.rate || 0) * (t.qty || 1)).toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} style={{ padding: "8px", textAlign: "right", fontWeight: "600" }}>Total</td>
                <td style={{ padding: "8px", textAlign: "right", fontWeight: "600" }}>{Number(record.total_amount || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan={4} style={{ padding: "8px", textAlign: "right" }}>Discount</td>
                <td style={{ padding: "8px", textAlign: "right" }}>{Number(record.discount_amount || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan={4} style={{ padding: "8px", textAlign: "right", fontWeight: "700" }}>Net Payable</td>
                <td style={{ padding: "8px", textAlign: "right", fontWeight: "700" }}>{Number(record.net_payable || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold flex items-center">
              <HistoryOutlined className="mr-2" /> Test Bill History
            </span>

            <div className="flex items-center gap-3">
              {/* <Tag color="blue"> Info: {bills.length} rows</Tag> */}
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowCreateBill(true)}
              >
                Create Bill
              </Button>
            </div>
          </div>
        }
        className="rounded-xl shadow-xl"
      >
        {loading ? (
          <div className="text-center py-8">
            <Spin size="large" tip="Fetching Bill History..." />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={mergedBills}
              rowKey={(rec) => rec.voucher_number}
              pagination={{ pageSize: 15 }}
              size="small"
              scroll={{ x: "max-content" }}
              expandable={{
                expandedRowRender,
                rowExpandable: () => true,
              }}
              locale={{ emptyText: "No bill history data available" }}
            />
          </>
        )}
      </Card>

      {/* Create Bill Modal */}
      <Modal
        title="Create Test Bill"
        open={showCreateBill}
        onCancel={() => setShowCreateBill(false)}
        footer={null}
        width={1200}
        destroyOnClose
        style={{marginRight:60, marginTop:-60}}
        bodyStyle={{ padding: 0, maxHeight: "85vh", overflowY: "auto" }}
      >
        <TestBilling onClose={() => setShowCreateBill(false)} />
      </Modal>

      {/* Print View */}
      {/* <Modal
        open={!!billToView}
        onCancel={handleClosePrintView}
        footer={null}
        width={800}
        
        bodyStyle={{ padding: 0 }}
        destroyOnClose
      >
        {billToView ? (
        ) : null}
      </Modal> */}
      <div className="absolute bottom-0 z-[-10]">
        {billToView ? (
        <PrintBill billData={billToView} onClose={handleClosePrintView} />
        ) : null}
      </div>
    </div>
  );
}
