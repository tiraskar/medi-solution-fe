import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Button, Radio, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchLedgerGroupList, fetchLedgerSubGroupList, saveLedger, updateLedger } from "../../api/accounting.api";
import { toggleCreateModelOpen, toggleSelectedLedger } from "../../store/slices/accountingSlice";
import { getBranchList } from "../../api/master.api";

const { Option } = Select;

const LedgerForm = ({ form }) => {
    const dispatch = useDispatch();
    const { ledgerGroups, ledgerSubGroups, selectedLedger, loading } = useSelector(state => state.accounting);
    const { branchList } = useSelector((state) => state.master);
    const { economicYear, userInfo } = useSelector((state) => state.auth);
    const userBranch = userInfo.branchInfo?.branch_id;
    const onFinish = async (values) => {
        const data = {
            ...values,
            functional_year_id: economicYear.functional_year_id,
        };
        try {
            if (selectedLedger) {
                await dispatch(
                    updateLedger({
                        ...data,
                        ledger_id: selectedLedger.id,
                    })
                ).unwrap();
            } else {
                await dispatch(saveLedger(data)).unwrap();
            }

            // ✅ Reset only if success
            form.resetFields();
        } catch (error) {
            console.error("Ledger save failed:", error);
        }
    };


    useEffect(() => {
        form.resetFields();
        if (selectedLedger) {
            form.setFieldsValue({
                ledgername: selectedLedger.ledgername,
                master_ledger_group_id: selectedLedger.master_ledger_group_id,
                ledger_sub_group_id: selectedLedger.ledger_sub_group_id,
                status: selectedLedger.status,
                transaction_type: selectedLedger.transaction_type || 'Debit',
                contact: selectedLedger.contact,
                address: selectedLedger.address,
                opening_balance_date_bs: selectedLedger.opening_balance_date,
                branch_id: selectedLedger.branch_id,
                opening_balance: selectedLedger.opening_balance,
                remarks: selectedLedger.remarks || '' 
            });
        }
    }, [selectedLedger]);

    useEffect(() => {
        dispatch(fetchLedgerGroupList());
        dispatch(fetchLedgerSubGroupList());
        dispatch(getBranchList()).unwrap().then(() => {
            userBranch && form.setFieldsValue({ branch_id: userBranch });
        });
    }, [dispatch])



    return (
        <Form
            onFinish={onFinish}
            form={form}
            layout="vertical"
            initialValues={{
                status: 1,
                transaction_type: 'Debit',
                contact: '',
                address: '',
                ledgername: '',

            }}
            className="tight-form !space-y-3 w-full "
        >
            <div className="grid gap-3 lg:grid-cols-2">
                <Form.Item
                    label="Ledger Name"
                    name="ledgername"
                    rules={[{ required: true, message: "Please enter Ledger Name" }]}
                >
                    <Input placeholder="Enter ledger name" />
                </Form.Item>


                {/* Master Ledger Group */}
                <Form.Item
                    label="Master Ledger Group"
                    name="master_ledger_group_id"
                    rules={[{ required: true, message: "Please select master group" }]}
                >
                    <Select placeholder="Select a Master ledger group" allowClear>
                        {ledgerGroups?.map((master) => (
                            <Select.Option
                                key={master.ledger_group_id}
                                value={master.ledger_group_id}
                            >
                                {master.ledger_group_name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Ledger Sub Group */}
                <Form.Item
                    label="Sub Ledger Group"
                    name="ledger_sub_group_id"
                    rules={[{ required: true, message: "Please select sub group" }]}
                >
                    <Select showSearch placeholder="Select a Master ledger group" allowClear>
                        {ledgerSubGroups?.map((sub) => (
                            <Select.Option
                                key={sub.ledger_sub_group_id}
                                value={sub.ledger_sub_group_id}
                            >
                                {sub.sub_group_name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Address */}
                <Form.Item label="Address" name="address">
                    <Input placeholder="Enter address" />
                </Form.Item>

                {/* Contact */}
                <Form.Item
                    rules={[{ required: false, }, { pattern: /^\d+$/, message: 'Contact must be a number' }]}
                    label="Contact" name="contact">
                    <Input placeholder="Enter contact number" />
                </Form.Item>

                {/* Opening Balance */}
                <Form.Item
                    rules={[{ required: true, message: 'Please enter opening balance' }, { pattern: /^\d+$/, message: 'Opening balance must be a number' }]}
                    label="Opening Balance" name="opening_balance">
                    <InputNumber

                        placeholder="Enter opening balance"
                        style={{ width: "100%" }}
                    />
                </Form.Item>

                {/* Opening Balance Date */}
                <Form.Item
                    label="Opening Balance Date (BS)"
                    name="opening_balance_date_bs"
                    rules={[
                        { required: true, message: 'Please enter Date bs.' },
                        {
                            pattern: /^\d{4}-\d{2}-\d{2}$/,
                            message: 'Date must be in YYYY-MM-DD format',
                        },
                    ]}
                >
                    <Input
                        maxLength={10}
                        placeholder="e.g., 2081-12-30"
                        onChange={(e) => {
                            let raw = e.target.value.replace(/\D/g, "").slice(0, 8); // only digits, max 8

                            let year = raw.slice(0, 4);
                            let month = raw.slice(4, 6);
                            let day = raw.slice(6, 8);

                            // Apply validation constraints
                            if (month && parseInt(month) > 12) month = "12";
                            if (day && parseInt(day) > 32) day = "32";

                            let formatted = year;
                            if (month) formatted += `-${month}`;
                            if (day) formatted += `-${day}`;

                            form.setFieldsValue({ opening_balance_date_bs: formatted });
                        }} />
                </Form.Item>


                {/* Branch */}
                <Form.Item
                    label="Branch"
                    name="branch_id"
                    rules={[{ required: true, message: "Please select branch" }]}
                >
                    <Select placeholder="Select a branch" allowClear>
                        {branchList?.map((branch) => (
                            <Select.Option
                                key={branch.branch_id}
                                value={branch.branch_id}
                            >
                                {branch.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {/* Transaction Type */}


                {/* Status */}
                <Form.Item label="Status" name="status" initialValue={1}>
                    <Select>
                        <Option value={1}>Active</Option>
                        <Option value={0}>Inactive</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Transaction Type"
                    name="transaction_type"
                    initialValue="Debit"
                    rules={[{ required: true, message: 'Please select transaction type' }]}
                >
                    <Radio.Group>
                        <Radio value="Debit">Debit</Radio>
                        <Radio value="Credit">Credit</Radio>
                    </Radio.Group>
                </Form.Item>

                {selectedLedger && (
                    <Form.Item
                        label="Remarks"
                        name="remarks"
                        className="!col-span-2"
                        rules={[{ required: true, message: "Please enter remarks" }]}
                    >
                        <Input.TextArea placeholder="Write remarks here..." rows={3} />
                    </Form.Item>
                )}

            </div>

            {/* Submit */}
            <Form.Item className="!mt-4 ">
                <Button
                    disabled={loading}
                    type="primary"
                    htmlType="submit"
                >
                    {loading ? <Spin /> : selectedLedger ? 'Update' : 'Create'}
                </Button>
                <Button
                    disabled={loading}
                    htmlType="button"
                    onClick={() => {
                        form.resetFields();
                        dispatch(toggleSelectedLedger(null));
                        dispatch(toggleCreateModelOpen(true));
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
