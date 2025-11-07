import { useEffect } from 'react';
import { CreateUserForm, UserTable } from '../../components';
import { Button, Typography, Modal, Select, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSelectedUser, toggleUserCreateModelOpen, updateUserSearchFilter } from '../../store/slices/usersSlice';
import { getAllUserList } from '../../api/user.api';
import { parseUntilNotString } from '../../utils/array';

const { Option } = Select;

const Users = () => {
    const { selectedUser, searchFilter, isCreateModelOpen } = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};

    const handleOpen = () => {
        dispatch(toggleUserCreateModelOpen(true));
        dispatch(toggleSelectedUser(null));
    };

    const handleClose = () => {
        form.resetFields();
        dispatch(toggleUserCreateModelOpen(false));
        dispatch(toggleSelectedUser(null));
    };

    useEffect(() => {
        dispatch(getAllUserList());
    }, [dispatch]);

    const handleChange = (name, value) => {
        dispatch(updateUserSearchFilter({ name, value }));
        dispatch(getAllUserList());
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Typography.Title level={2} className="!text-xl !m-0">
                    Users List
                </Typography.Title>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Status:</label>
                        <Select
                            value={searchFilter?.searchStatus}
                            onChange={(value) => handleChange('searchStatus', value)}
                            className="w-36"
                            dropdownMatchSelectWidth={false}
                        >
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </div>
                    {
                        (permission?.user?.includes('create') || userInfo?.user_type == 'admin') && <Button type="primary" onClick={handleOpen} className="mt-2 sm:mt-0">
                        Create user
                        </Button>}
                </div>
            </div>


            {/* User Table */}
            {
                (permission?.category?.includes('view') || userInfo?.user_type == 'admin') && <div className="bg-white rounded-xl shadow-md p-4">
                <UserTable />
                </div>}

            {/* Modal for Form */}
            <Modal
                open={isCreateModelOpen || selectedUser}
                title={selectedUser ? 'Update User' : 'Create User'}
                onCancel={handleClose}
                footer={null}
                className="rounded-xl md:!min-w-[50vw]"
                bodyStyle={{ padding: '24px' }}
            >
                <CreateUserForm form={form} />
            </Modal>
        </div>
    );
};

export default Users;
