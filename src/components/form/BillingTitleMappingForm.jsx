import { Form, InputNumber, Button, Select, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createBillingTitleMapping, updateBillingTitleMapping } from "../../api/billingTitle.api";
import { useEffect } from "react";
import { getBranchList } from "../../api/master.api";

const { Option } = Select;

const BillingTitleMappingForm = ({ form }) => {

    const dispatch = useDispatch();
    const { branchList } = useSelector(state => state.master);
    const { selectedBillingTitleMapping, loading, billingTitleOptions, labelOptions } = useSelector(state => state.billingTitle);
    const { userInfo } = useSelector(state => state.auth);
    
    // FIX: Add proper null checking
    const userBranch = userInfo?.branchInfo?.branch_id;

    const onFinish = async (values) => {
        try {
            if (selectedBillingTitleMapping) {
                await dispatch(updateBillingTitleMapping(values)).unwrap();
            } else {
                await dispatch(
                    createBillingTitleMapping({
                        ...values,
                        created_by: userInfo?.user_id, // FIX: Also added optional chaining here
                    })
                ).unwrap();
            }

            // ✅ Only reset if request is successful
            form.resetFields();
        } catch (error) {
            // ❌ Don't reset on error
            console.error("Error saving billing title mapping:", error);
        }
    };

    useEffect(() => {
        dispatch(getBranchList())
            .unwrap().then(() => {
                // FIX: Check if userBranch exists before setting form value
                if (userBranch) {
                    form.setFieldsValue({ branch_id: userBranch });
                }
            }).catch(error => {
                console.error("Failed to fetch branch list:", error);
            });
    }, [dispatch, form, userBranch]); // FIX: Added dependencies

    useEffect(() => {
        if (selectedBillingTitleMapping) {
            form.setFieldsValue({
                billing_title_id: selectedBillingTitleMapping.billing_title_id,
                label_id: selectedBillingTitleMapping.label_id,
                status: selectedBillingTitleMapping.status == true ? 1 : 0,
                branch_id: selectedBillingTitleMapping.branch_id
            });
        }
    }, [selectedBillingTitleMapping, form]) // FIX: Added form dependency

    return (

        <Form
            onFinish={onFinish}
            form={form}
            layout="vertical"
            initialValues={{
                status: 1,
            }}
            className="tight-form !space-y-3 w-full "
        >
            <div className="grid gap-3 lg:grid-cols-2">
                {/* Billing Title ID */}
                <Form.Item
                    label="Billing Title"
                    name="billing_title_id"
                    rules={[{ required: true, message: 'Please select a billing title' }]}
                >
                    <Select placeholder="Select billing title" allowClear>
                        {billingTitleOptions?.map((billing) => ( // FIX: Added optional chaining
                            <Option key={billing.billing_title_id} value={billing.billing_title_id}>
                                {billing.billing_title}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Label ID */}
                <Form.Item
                    label="Label"
                    name="label_id"
                    rules={[{ required: true, message: 'Please select a label' }]}
                >
                    <Select placeholder="Select branch" allowClear>
                        {labelOptions?.map((label) => ( // FIX: Added optional chaining
                            <Option key={label.label_id} value={label.label_id}>
                                {label.label_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Branch ID */}
                <Form.Item
                    label="Branch"
                    name="branch_id"
                    rules={[{ required: true, message: 'Please select a branch' }]}
                >
                    <Select placeholder="Select branch" allowClear>
                        {branchList?.map((branch) => ( // FIX: Added optional chaining
                            <Option key={branch.branch_id} value={branch.branch_id}>
                                {branch.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Status */}
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



            {/* Submit Button */}
            <Form.Item>
                <Space className="w-full justify-start mt-4 flex">
                    <Button type="primary" htmlType="submit" disabled={loading}>
                        {loading ? 'Saving...' : selectedBillingTitleMapping ? 'Update' : 'Create'}
                    </Button>
                    <Button danger htmlType="button" onClick={() => form.resetFields()}>
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default BillingTitleMappingForm;