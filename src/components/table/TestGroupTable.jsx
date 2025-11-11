import { Modal, Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useDynamicTableScroll from '../../hook/useDynamicTableScroll';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteTestGroup, fetchTestGroupPagination, fetchTestGroups } from '../../api/testgroup.api';
import { toggleSelectedGroup, updatePagination } from '../../store/slices/testGroupSlice';
import { tableComponent } from './TableHeader';

const TestGroupTable = () => {
    const { testGroups, pagination } = useSelector(state => state.testGroup);
    const dispatch = useDispatch();
    const scroll = useDynamicTableScroll();

    // console.log(testGroups[0]);
    

    const handleEdit = (record) => {
        dispatch(toggleSelectedGroup(record));
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this test group?',
            icon: <ExclamationCircleOutlined />,
            content: `Group Name: ${record.group_name}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteTestGroup(record.group_id));
                dispatch(fetchTestGroups())
            },
        });
    };

    const columns = [
        {
            title: 'SN',
            key: 'sn',
            width: 70,
            align: 'center',
            render: (_, __, index) =>
                (pagination.page - 1) * pagination.limit + index + 1,
        },
        {
            title: 'Group Name',
            dataIndex: 'group_name',
            key: 'group_name',
            width: 250,
            sorter: true,
        },
        {
            title: 'Tests',
            dataIndex: 'tests',
            key: 'tests',
            render: (tests) => tests?.map(t => t.test_name).join(', '),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <Tag color={status === 1 ? 'green' : 'red'}>
                    {status === 1 ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <span style={{ display: 'flex', gap: '12px' }}>
                    <EditOutlined
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(record);
                        }}
                        className="!bg-blue-500 p-2 rounded-md !text-white"
                    />
                    <DeleteOutlined
                        style={{ color: '#ff4d4f', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record);
                        }}
                        className="!bg-red-500 p-2 rounded-md !text-white"
                    />
                </span>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={testGroups[0] || []}
            components={tableComponent}
            rowKey="group_id"
            pagination={{
                showTotal: (total, range) =>
                    `Showing ${range[0]}–${range[1]} of ${total} entries`,
                current: pagination.page,
                pageSize: pagination.limit,
                total: pagination.total,
                showSizeChanger: true,
                onChange: (page, limit) => {
                    dispatch(updatePagination({ page, limit }));
                    dispatch(fetchTestGroupPagination());
                },
            }}
            onRow={(record) => ({
                onClick: () => handleEdit(record),
            })}
            size="small"
            scroll={scroll}
        />
    );
};

export default TestGroupTable;
