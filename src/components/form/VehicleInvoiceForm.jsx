import { Form, Input, Button, Select, Space, InputNumber } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createVehicleInvoice, updateVehicleInvoice } from '../../api/vehicleInvoice.api';
import { getBranchList } from '../../api/master.api';

const { Option } = Select;

const VehicleInvoiceForm = ({ form }) => {
    const dispatch = useDispatch();
    const { branchList } = useSelector(state => state.master);
    const { selectedInvoice, loading } = useSelector(state => state.vehicleInvoice);
    const { economicYear, userInfo } = useSelector(state => state.auth);

    const onFinish = async (values) => {
        try {
            if (selectedInvoice) {
                await dispatch(
                    updateVehicleInvoice({ ...values, id: selectedInvoice.id })
                ).unwrap();
            } else {
                await dispatch(
                    createVehicleInvoice({
                        ...values,
                        functional_year_id: economicYear?.functional_year_id,
                        created_by: userInfo?.user_id,
                    })
                ).unwrap();
            }

            // ✅ Reset form only on success
            form.resetFields();
        } catch (error) {
            console.error("Failed to save vehicle invoice:", error);
        }
    };


    useEffect(() => {
        dispatch(getBranchList());
    }, [dispatch]);

    useEffect(() => {
        form.resetFields();
        if (selectedInvoice) {
            form.setFieldsValue({
                vehicle_id: selectedInvoice.vehicle_id,
                invoice_no: selectedInvoice.invoice_no,
                total_amount: selectedInvoice.total_amount,
                branch_id: selectedInvoice.branch_id,
                status: selectedInvoice.status,
            });
        }
    }, [selectedInvoice, form]);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="tight-form space-y-3 w-full"
            initialValues={{ status: 1, branch_id: null, total_amount: 0 }}
        >
            <div className="grid md:grid-cols-2 gap-4">
                <Form.Item label="Vehicle ID" name="vehicle_id" rules={[{ required: true, message: 'Please enter vehicle ID' }]}>
                    <InputNumber placeholder="Enter vehicle ID" className="!w-full" />
                </Form.Item>

                <Form.Item label="Invoice No" name="invoice_no">
                    <Input placeholder="Enter invoice number" />
                </Form.Item>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <Form.Item label="Total Amount" name="total_amount" rules={[{ required: true, message: 'Please enter total amount' }]}>
                    <InputNumber min={0} step={0.01} className="!w-full" />
                </Form.Item>

                <Form.Item label="Branch" name="branch_id" rules={[{ required: true, message: 'Please select a branch' }]}>
                    <Select placeholder="Select branch" allowClear>
                        {branchList.map(branch => (
                            <Option key={branch.branch_id} value={branch.branch_id}>{branch.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>

            <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select status' }]}>
                <Select>
                    <Option value={1}>Active</Option>
                    <Option value={0}>Inactive</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Space className="w-full justify-start mt-4 flex">
                    <Button type="primary" htmlType="submit">
                        {loading ? 'Saving...' : selectedInvoice ? 'Update' : 'Create'}
                    </Button>
                    <Button danger htmlType="button" onClick={() => form.resetFields()}>Cancel</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default VehicleInvoiceForm;
