import { Form, Input, Button, Typography, Select, Space, InputNumber } from 'antd';
import { useEffect } from 'react';
import { getBranchList } from '../../api/master.api';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, updateUser } from '../../api/user.api';

const { Option } = Select;

const CreateUserForm = ({ form }) => {

    const dispatch = useDispatch();
    const { branchList } = useSelector(state => state.master);
    const { selectedUser, loading, } = useSelector(state => state.users);

    const onFinish = async (values) => {
    // eslint-disable-next-line
        const { confirmPassword, ...rest } = values;

        try {
            if (selectedUser) {
                await dispatch(updateUser(rest)).unwrap();
            } else {
                await dispatch(createUser(rest)).unwrap();
            }
            // ✅ Only reset when success
            form.resetFields();
        } catch (error) {
            console.error("User save failed:", error);
        }
    };


    useEffect(() => {
        dispatch(getBranchList());
    }, [dispatch]);

    useEffect(() => {
        form.resetFields();
        if (selectedUser) {
            form.setFieldsValue({
                name: selectedUser.name,
                username: selectedUser.username,
                status: selectedUser.status,
                address: selectedUser.address,
                contact: selectedUser.contact,
                branch: selectedUser.UserBranchInfos?.map(b => b.branch_id) || [],
                password: null,
                confirmPassword: null
            });
        }
    }, [selectedUser, form]);

    return (

        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off" className='tight-form space-y-3 w-full '
            initialValues={{
                status: 1,
                branch: [],
                address: null,
                contact: null,
                password: null,
            }}
        >
            <div className='grid md:grid-cols-2 gap-4'>
                <Form.Item
                    label="Full name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter full name' }]}
                >
                    <Input placeholder="Enter full name" />
                </Form.Item>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please enter username' }]}
                >
                    <Input placeholder="Enter username" />
                </Form.Item>
            </div>


            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: false, message: 'Please enter address' }]}
                >
                    <Input placeholder="Enter address" />
                </Form.Item>
                <Form.Item
                    label="Contact"
                    name="contact"
                    rules={[{ required: false, message: 'Please enter contact' }]}
                >
                    <InputNumber placeholder="Enter contact number" className='!w-full' />
                </Form.Item>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
                <Form.Item
                    label="Branch"
                    name="branch"
                    rules={[{ required: true, message: 'Please select at least one branch' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select branch(es)"
                        allowClear
                    >
                        {branchList.map((branch) => (
                            <Option key={branch.branch_id} value={branch.branch_id}>
                                {branch.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: !selectedUser, message: 'Please enter a password' },
                        {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                            message:
                                'Min 8 chars, number, uppercase, lowercase & special character',
                        },
                    ]}
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: !selectedUser, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirm password" />
                </Form.Item>
            </div>


            <Form.Item>
                <Space className="w-full justify-start mt-4 flex">
                    <Button type="primary" htmlType="submit">
                        {loading ? 'Saving...' : selectedUser ? 'Update' : 'Create'}
                    </Button>
                    <Button danger htmlType="button" onClick={() => form.resetFields()}>
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default CreateUserForm;
