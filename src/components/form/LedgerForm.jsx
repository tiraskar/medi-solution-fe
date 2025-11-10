import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Button, Radio, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLedgerGroupList,
  fetchLedgerSubGroupList,
  saveLedger,
  updateLedger,
} from "../../api/accounting.api";
import {
  toggleCreateModelOpen,
  toggleSelectedLedger,
} from "../../store/slices/accountingSlice";
import { getBranchList } from "../../api/master.api";
import dayjs from "dayjs";

const { Option } = Select;

const LedgerForm = ({ form }) => {
  const dispatch = useDispatch();
  const { ledgerGroups, ledgerSubGroups, selectedLedger, loading } =
    useSelector((state) => state.accounting);
  const { branchList } = useSelector((state) => state.master);
  const { economicYear } = useSelector((state) => state.auth);

  const onFinish = async (values) => {
    const data = {
      ...values,
      functional_year_id: economicYear?.functional_year_id ?? 1,
    };
    try {
      if (selectedLedger) {
        await dispatch(
          updateLedger({ ...data, ledger_id: selectedLedger.id })
        ).unwrap();
      } else {
        await dispatch(saveLedger(data)).unwrap();
      }
      form.resetFields();
      dispatch(toggleSelectedLedger(null));
      dispatch(toggleCreateModelOpen(false));
    } catch (error) {
      console.error("Ledger save failed:", error);
    }
  };

  // Fetch dropdowns
  useEffect(() => {
    dispatch(fetchLedgerGroupList());
    dispatch(fetchLedgerSubGroupList());
    dispatch(getBranchList()).unwrap();
  }, [dispatch]);

  // Populate form when editing
  useEffect(() => {
    if (
      selectedLedger &&
      ledgerGroups.length > 0 &&
      ledgerSubGroups.length > 0
    ) {
      form.setFieldsValue({
        ledgername: selectedLedger.ledgername || "",
        master_ledger_group_id: selectedLedger.master_ledger_group_id || null,
        ledger_sub_group_id: selectedLedger.ledger_sub_group_id || null,
        status: selectedLedger.status ?? 1,
        transaction_type: selectedLedger.transaction_type || "Debit",
        contact: selectedLedger.contact || "",
        address: selectedLedger.address || "",
        opening_balance_date_bs: selectedLedger.opening_balance_date
          ? dayjs(selectedLedger.opening_balance_date).format("YYYY-MM-DD")
          : "",
        branch_id: selectedLedger.branch_id || null,
        opening_balance: selectedLedger.opening_balance || 0,
        remarks: selectedLedger.remarks || "",
      });
    } else {
      form.resetFields();
    }
  }, [selectedLedger, ledgerGroups, ledgerSubGroups, form]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="tight-form !space-y-3 w-full"
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <Form.Item
          label="Ledger Name"
          name="ledgername"
          rules={[{ required: true, message: "Please enter Ledger Name" }]}
        >
          <Input placeholder="Enter ledger name" />
        </Form.Item>

        <Form.Item
          label="Master Ledger Group"
          name="master_ledger_group_id"
          rules={[{ required: true, message: "Please select master group" }]}
        >
          <Select placeholder="Select a Master ledger group" allowClear>
            {ledgerGroups.map((master) => (
              <Option key={master.ledger_group_id} value={master.ledger_group_id}>
                {master.ledger_group_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Sub Ledger Group"
          name="ledger_sub_group_id"
          rules={[{ required: true, message: "Please select sub group" }]}
        >
          <Select placeholder="Select a Sub ledger group" allowClear>
            {ledgerSubGroups.map((sub) => (
              <Option key={sub.ledger_sub_group_id} value={sub.ledger_sub_group_id}>
                {sub.sub_group_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input placeholder="Enter address" />
        </Form.Item>

        <Form.Item
          label="Contact"
          name="contact"
          rules={[{ pattern: /^\d+$/, message: "Contact must be a number" }]}
        >
          <Input placeholder="Enter contact number" />
        </Form.Item>

        <Form.Item
          label="Opening Balance"
          name="opening_balance"
          rules={[{ required: true, message: "Please enter opening balance" }]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="Enter opening balance" />
        </Form.Item>

        <Form.Item
          label="Opening Balance Date (BS)"
          name="opening_balance_date_bs"
          rules={[
            { required: true, message: "Please enter Date BS" },
            { pattern: /^\d{4}-\d{2}-\d{2}$/, message: "Date must be in YYYY-MM-DD" },
          ]}
        >
          <Input maxLength={10} placeholder="e.g., 2081-12-30" />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select>
            <Option value={1}>Active</Option>
            <Option value={0}>Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Transaction Type" name="transaction_type">
          <Radio.Group>
            <Radio value="Debit">Debit</Radio>
            <Radio value="Credit">Credit</Radio>
          </Radio.Group>
        </Form.Item>

        {selectedLedger && (
          <Form.Item label="Remarks" name="remarks" className="!col-span-2">
            <Input.TextArea placeholder="Write remarks here..." rows={3} />
          </Form.Item>
        )}
      </div>

      <Form.Item className="!mt-4">
        <Button type="primary" htmlType="submit" disabled={loading}>
          {loading ? <Spin /> : selectedLedger ? "Update" : "Create"}
        </Button>
        <Button
          htmlType="button"
          onClick={() => {
            form.resetFields();
            dispatch(toggleSelectedLedger(null));
            dispatch(toggleCreateModelOpen(false));
          }}
          className="!ml-2"
          danger
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LedgerForm;