import { Form, Input, Button, Select, Space, InputNumber } from 'antd';
import { useEffect } from 'react';
import { getBranchList } from '../../api/master.api';
import { useDispatch, useSelector } from 'react-redux';
import { createBillingTitle, updateBillingTitle } from '../../api/billingTitle.api';

const { Option } = Select;

const BillingTitleForm = ({ form }) => {

    const dispatch = useDispatch();
    const { branchList } = useSelector(state => state.master);
    const { selectedBillingTitle, loading } = useSelector(state => state.billingTitle);

    const { economicYear, userInfo } = useSelector(state => state.auth);
    const userBranch = userInfo.branchInfo?.branch_id;

    const onFinish = async (values) => {
        try {
            if (selectedBillingTitle) {
                await dispatch(
                    updateBillingTitle({
                        ...values,
                        functional_year_id: selectedBillingTitle?.functional_year_id,
                        created_by: selectedBillingTitle?.created_by,
                    })
                ).unwrap();
            } else {
                await dispatch(
                    createBillingTitle({
                        ...values,
                        functional_year_id: economicYear?.functional_year_id,
                        created_by: userInfo?.user_id,
                    })
                ).unwrap();
            }

            // ✅ Only reset if success
            form.resetFields();
        } catch (error) {
            console.error("Error saving billing title:", error);
        }
    };


    useEffect(() => {
        dispatch(getBranchList())
            .unwrap().then(() => {
                userBranch && form.setFieldsValue({ branch_id: userBranch });
            });
    }, [dispatch]);

    useEffect(() => {
        if (selectedBillingTitle) {
            form.setFieldsValue({
                billing_title_code: selectedBillingTitle.billing_title_code,
                billing_title: selectedBillingTitle.billing_title,
                rate: selectedBillingTitle.rate,
                branch_id: selectedBillingTitle.branch_id,
                functional_year_id: selectedBillingTitle.functional_year_id,
                status: selectedBillingTitle.status,
            });
        }
    }, [selectedBillingTitle, form]);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="tight-form space-y-3 w-full"
            initialValues={{
                status: 1,
                branch_id: null,
                rate: null,
            }}
        >
            <div className="grid md:grid-cols-2 gap-4">
                <Form.Item
                    label="Billing Title Code"
                    name="billing_title_code"
                    rules={[{ required: true, message: 'Please enter billing title code' }, { pattern: /^[0-9]+$/, message: 'Only numbers are allowed' }]}
                >
                    <InputNumber placeholder="Enter code" className="!w-full" />
                </Form.Item>

                <Form.Item
                    label="Billing Title"
                    name="billing_title"
                    rules={[{ required: true, message: 'Please enter billing title' }]}
                >
                    <Input placeholder="Enter billing title" />
                </Form.Item>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <Form.Item
                    label="Rate"
                    name="rate"
                    rules={[{ required: true, message: 'Please enter rate' }]}
                >
                    <InputNumber
                        placeholder="Enter rate"
                        className="!w-full"
                        min={0}
                        step={0.01}
                    />
                </Form.Item>

                <Form.Item
                    label="Branch"
                    name="branch_id"
                    rules={[{ required: true, message: 'Please select a branch' }]}
                >
                    <Select placeholder="Select branch" allowClear>
                        {branchList.map((branch) => (
                            <Option key={branch.branch_id} value={branch.branch_id}>
                                {branch.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>

            <div className="grid md:grid-cols-2 gap-4">


                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Please select status' }]}
                >
                    <Select placeholder="Select status">
                        <Option value={1}>Active</Option>
                        <Option value={0}>Inactive</Option>
                    </Select>
                </Form.Item>
            </div>

            <Form.Item>
                <Space className="w-full justify-start mt-4 flex">
                    <Button type="primary" htmlType="submit">
                        {loading ? 'Saving...' : selectedBillingTitle ? 'Update' : 'Create'}
                    </Button>
                    <Button danger htmlType="button" onClick={() => form.resetFields()}>
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default BillingTitleForm;
