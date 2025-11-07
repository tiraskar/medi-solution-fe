import { Form, Input, InputNumber, Button, Space, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { saveLedgerMapping } from "../../api/accounting.api";

const LedgerMappingForm = ({ form }) => {
    const dispatch = useDispatch();
    const { selectedLedgerMapping, loading, ledgerOptions } = useSelector(state => state.accounting);

    const onFinish = async (values) => {
        try {
            await dispatch(
                saveLedgerMapping({
                    id: selectedLedgerMapping.id,
                    ledger_id: values.ledger_id,
                })
            ).unwrap();

            // ✅ Reset only if success
            form.resetFields();
        } catch (error) {
            console.error("Ledger mapping save failed:", error);
        }
    };


    useEffect(() => {
        form.resetFields();
        if (selectedLedgerMapping) {
            form.setFieldsValue({
                label: selectedLedgerMapping.label || "",
                ledger_id: selectedLedgerMapping.ledger_id || "",
            });
        }
    }, [selectedLedgerMapping]);

    return (
        <Form
            onFinish={onFinish}
            form={form}
            layout="vertical"
            className="tight-form !space-y-3 w-full"
        >
            <div className="grid gap-3 lg:grid-cols-2">
                {/* Label */}
                <Form.Item

                    label="Label"
                    name="label"
                    rules={[{ required: true, message: "Please enter a label" }]}
                >
                    <Input disabled={true} placeholder="Enter label" />
                </Form.Item>

                {/* Ledger ID */}
                <Form.Item
                    label="Ledger"
                    name="ledger_id"
                    rules={[{ required: true, message: "Please select ledger" }]}
                >
                    <Select placeholder="Select a a ledger" allowClear>
                        {ledgerOptions?.map((ledger) => (
                            <Select.Option
                                key={ledger.id}
                                value={ledger.id}
                            >
                                {ledger.ledgername}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>

            {/* Submit & Cancel */}
            <Form.Item>
                <Space className="w-full justify-start mt-4 flex">
                    <Button type="primary" htmlType="submit">
                        {loading ? "Saving..." : selectedLedgerMapping ? "Update" : "Create"}
                    </Button>
                    <Button danger htmlType="button" onClick={() => form.resetFields()}>
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default LedgerMappingForm;
