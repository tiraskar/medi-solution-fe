import { Form, Input, Button, Typography, Space, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createBranch, updateBranch } from '../../api/master.api';
import { useEffect } from 'react';
import { toggleCreateUpdateBranchModel, toggleSelectedBranch } from '../../store/slices/masterSlice';
import toast from 'react-hot-toast';


const BranchForm = ({ form }) => {
    const dispatch = useDispatch();

    const { loading, selectedBranch, branchList } = useSelector(state => state.master);
    const onFinish = async (values) => {
        const branchData = {
            ...values,
            status: values.status === 'Active' ? 1 : 0,
        };

        if (selectedBranch && branchList.length == 1 && values.status == 'Inactive') {
            return toast.error("At least one branch should be active");
        }
        try {
            if (selectedBranch) {
                await dispatch(updateBranch(branchData)).unwrap();
            } else {
                await dispatch(createBranch(branchData)).unwrap();
            }

            // ✅ Reset only if success
            form.resetFields();
        } catch (error) {
            console.error("Error saving branch:", error);
        }
    };


    const onCancel = () => {
        form.resetFields();
        dispatch(toggleCreateUpdateBranchModel(true));
        dispatch(toggleSelectedBranch(null))
    };

    useEffect(() => {
        form.resetFields();
        if (selectedBranch) {
            form.setFieldsValue({
                status: selectedBranch.status === 1 ? 'Active' : 'Inactive',
                name: selectedBranch.name
            });
        }
    }, [selectedBranch, form])

    return (

        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className='tight-form !space-y-2'
            initialValues={{ status: 'Active' }}
        >

            <Form.Item
                label="Branch Name"
                name="name"
                rules={[{ required: true, message: 'Please enter branch name' }]}
            >
                <Input
                    placeholder="Enter branch name"
                />
            </Form.Item>

            <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select the status' }]}>
                <Select>
                    <Option value="Active">Active</Option>
                    <Option value="Inactive">Inactive</Option>
                </Select>
            </Form.Item>

            <div className='mt-2'>
                <Form.Item >
                    <Space className="w-full justify-start flex mt-2">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            {loading ? 'Saving...' : selectedBranch ? 'Update' : 'Save'}
                        </Button>
                        <Button htmlType="button" onClick={onCancel} danger>
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </div>
        </Form>
    );
};

export default BranchForm;
