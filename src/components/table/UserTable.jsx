import { message, Modal, Table, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useDynamicTableScroll from '../../hook/useDynamicTableScroll';
import { toggleSelectedUser, updatePagination } from '../../store/slices/usersSlice';
import { deleteUser, getAllUserList } from '../../api/user.api';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { tableComponent } from '../report/VehicleExpiryReport';
import { parseUntilNotString } from '../../utils/array';
// import { tableHeadRowComponent } from '../tableHeadRowComponent';

const UserTable = () => {
    const { usersList, pagination } = useSelector(state => state.users);
    const dispatch = useDispatch();

    const handleEdit = (record) => {
        dispatch(toggleSelectedUser(record));
    };

    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this user?',
            icon: <ExclamationCircleOutlined />,
            content: `User: ${record.username}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteUser(record));
            },
        });
    };

    const scroll = useDynamicTableScroll();

    const columns = [
        {
            title: 'SN',
            key: 'sn',
            width: 80,
            fixed: 'left',
            render: (text, record, index) => {
                // Calculate global SN if pagination is used
                const currentPage = pagination?.page || 1;
                const pageSize = pagination?.limit || 10;
                return (currentPage - 1) * pageSize + index + 1;
            },
        },
        {
            title: 'Full name',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 150
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
            width: 150
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 150
        },
        {
            title: 'Branch',
            dataIndex: 'branch',
            key: 'branch',
            width: 200,
            render: (_, record) => {
                const branches = record?.UserBranchInfos?.map(
                    (b) => b.BranchInfo?.name
                ).filter(Boolean) || [];

                if (branches.length <= 2) {
                    return branches.join(', ');
                }

                const firstTwo = branches.slice(0, 2).join(', ');
                const remaining = branches.slice(2).join(', ');

                return (
                    <div className="flex flex-row gap-1">
                        <span>{firstTwo},</span>
                        <Tooltip title={remaining}>
                            <span className="cursor-pointer text-blue-500">
                                +{branches.length - 2} more
                            </span>
                        </Tooltip>
                    </div>
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                return (
                    <span>{status === 1 ? 'Active' : 'Inactive'}</span>
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <span style={{ display: 'flex', gap: '12px' }}>
                    {(permission?.user?.includes('update') || userInfo?.user_type == 'admin') && <EditOutlined
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering onRow click
                            handleEdit(record);
                        }}
                        className='!bg-blue-500 p-2 rounded-md !text-white'
                    />}
                    {(permission?.user?.includes('delete') || userInfo?.user_type == 'admin') && <DeleteOutlined
                        style={{ color: '#ff4d4f', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (record.user_id == 1) {
                                message.error('You cannot delete this user');
                            } else {
                                handleDelete(record);
                            }
                        }}
                        className='!bg-red-500 p-2 rounded-md !text-white'
                    />}
                </span>
            ),
        },
    ];

    return <Table
        columns={columns}
        dataSource={usersList}
        components={tableComponent}
        rowKey="id"
        onRow={(record) => {
            return {
                onClick: () => {
                    dispatch(toggleSelectedUser(record));
                },
            };
        }}
        scroll={scroll}
        pagination={{
            showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} entries`,
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (page, limit) => {
                dispatch(updatePagination({ page, limit }));
                dispatch(getAllUserList());
            },
        }}
        size="small"

    />;
};

export default UserTable;
