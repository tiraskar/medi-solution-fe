import { Table, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import useDynamicTableScroll from '../../hook/useDynamicTableScroll';
import { deleteBillingTitle, getBillingTitleList } from '../../api/billingTitle.api';
import { toggleSelectedBillingTitle, updatePagination } from '../../store/slices/billingTitleSlice';
import { tableComponent } from '../report/VehicleExpiryReport';
import { parseUntilNotString } from '../../utils/array';
// import { tableHeadRowComponent } from '../tableHeadRowComponent';

const BillingTitleTable = () => {
    const { billingTitles, pagination } = useSelector((state) => state.billingTitle);
    const dispatch = useDispatch();
    const scroll = useDynamicTableScroll();
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};
    const handleEdit = (record) => {
        dispatch(toggleSelectedBillingTitle(record));
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this billing title?',
            icon: <ExclamationCircleOutlined />,
            content: `Billing Title: ${record.billing_title}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteBillingTitle(record));
            },
        });
    };

    const columns = [
        {
            title: 'SN',
            key: 'sn',
            width: 80,
            render: (text, record, index) => {
                const currentPage = pagination?.page || 1;
                const pageSize = pagination?.limit || 10;
                return (currentPage - 1) * pageSize + index + 1;
            },
        },
        {
            title: 'Code',
            dataIndex: 'billing_title_code',
            key: 'billing_title_code',
        },
        {
            title: 'Billing Title',
            dataIndex: 'billing_title',
            key: 'billing_title',
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            render: (rate) => rate?.toFixed(2),
        },
        {
            title: 'Branch',
            dataIndex: 'branch_id',
            key: 'branch_id',
            render: (branch_id, record) =>
                record.branch?.name || branch_id, // show branch name if joined, else ID
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <span style={{ display: 'flex', gap: '12px' }}>
                    {(permission?.billingTitle?.includes('update') || userInfo?.user_type == 'admin') && <EditOutlined
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(record);
                        }}
                        className="!bg-blue-500 p-2 rounded-md !text-white"
                    />}
                    {(permission?.billingTitle?.includes('delete') || userInfo?.user_type == 'admin') && <DeleteOutlined
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record);
                        }}
                        className="!bg-red-500 p-2 rounded-md !text-white"
                    />}
                </span>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={billingTitles}
            components={tableComponent}
            rowKey="billing_title_id"
            onRow={(record) => {
                return {
                    onClick: () => {
                        dispatch(toggleSelectedBillingTitle(record));
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
                    dispatch(getBillingTitleList());
                },
            }}
            size="medium"
        />
    );
};

export default BillingTitleTable;
