import { Button, Modal, Popconfirm, Space, Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useDynamicTableScroll from '../../hook/useDynamicTableScroll';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteLedger, fetchLedgerPagination } from '../../api/accounting.api';
import { toggleSelectedLedger, updatePagination } from '../../store/slices/accountingSlice';
import { parseUntilNotString } from '../../utils/array';
// import { tableHeadRowComponent } from '../tableHeadRowComponent';

const LedgerTable = () => {
    const { ledgers, pagination } = useSelector(state => state.accounting);
    const dispatch = useDispatch();
    const scroll = useDynamicTableScroll();
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};
    const handleEdit = (record) => {
        dispatch(toggleSelectedLedger(record));
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this ledger?',
            icon: <ExclamationCircleOutlined />,
            content: `Ledger: ${record.ledgername}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteLedger(record));
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
            title: 'Ledger Name',
            dataIndex: 'ledgername',
            key: 'ledgername',
            width: 200,
            sorter: true,
        },
        {
            title: 'Ledger Group',
            dataIndex: 'group_name',
            key: 'group_name',
            width: 200,
            render: (value, record) => {
                return <div>{record?.ledgerGroup?.ledger_group_name}</div>;
            }
        },
        {
            title: 'Sub Group',
            dataIndex: 'sub_group_name',
            key: 'sub_group_name',
            width: 200,
            render: (value, record) => {
                return <div>{record?.ledgerSubGroup?.sub_group_name}</div>;
            }
        },
        {
            title: 'Opening Balance',
            dataIndex: 'opening_balance',
            key: 'opening_balance',
            width: 150,
            render: (balance) => `रु ${balance?.toFixed(2) || '0.00'}`,
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
                    {(permission?.ledger?.includes('update') || userInfo?.user_type == 'admin') && <EditOutlined
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering onRow click
                            handleEdit(record);
                        }}
                        className='!bg-blue-500 p-2 rounded-md !text-white'
                    />}
                    {(permission?.ledger?.includes('delete') || userInfo?.user_type == 'admin') && <DeleteOutlined
                        style={{ color: '#ff4d4f', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record);
                        }}
                        className='!bg-red-500 p-2 rounded-md !text-white'
                    />}
                </span>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={ledgers || []}
            rowKey="id"
            // components={tableHeadRowComponent}
            pagination={{
                showTotal: (total, range) =>
                    `Showing ${range[0]}–${range[1]} of ${total} entries`,
                current: pagination.page,
                pageSize: pagination.limit,
                total: pagination.total,
                showSizeChanger: true,
                onChange: (page, limit) => {
                    dispatch(updatePagination({ page, limit }));
                    dispatch(fetchLedgerPagination());
                },
            }}
            onRow={(record) => {
                return {
                    onClick: () => {
                        handleEdit(record);
                    },
                };
            }}
            size="small"
            scroll={scroll}
        />
    );
};

export default LedgerTable;
