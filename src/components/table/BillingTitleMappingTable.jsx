import { Table, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import useDynamicTableScroll from '../../hook/useDynamicTableScroll';
import { deleteBillingTitleMapping, getBillingTitleList } from '../../api/billingTitle.api';
import { toggleSelectedBillingTitle, toggleSelectedBillingTitleMapping, updatePagination } from '../../store/slices/billingTitleSlice';
import { tableComponent } from '../report/VehicleExpiryReport';
import { parseUntilNotString } from '../../utils/array';
// import { tableHeadRowComponent } from '../tableHeadRowComponent';

const BillingTitleMappingTable = () => {
    const { billingTitleMappingList, pagination, loading } = useSelector((state) => state.billingTitle);
    const dispatch = useDispatch();
    const scroll = useDynamicTableScroll();
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};

    const handleEdit = (record) => {
        dispatch(toggleSelectedBillingTitleMapping(record));
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this billing title mapping?',
            icon: <ExclamationCircleOutlined />,
            content: ``,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteBillingTitleMapping(record));
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
            title: 'Billing Title',
            dataIndex: 'billing_title',
            key: 'billing_title',
            width: 150,
            render: (billing_title, record) => {
                const value = record?.billingInfo?.billing_title || '-';
                return <div>{value}</div>;
            }

        },
        {
            title: 'Label',
            dataIndex: 'label',
            key: 'label',
            width: 150,
            render: (label, record) => {
                const value = record?.labelInfo?.label_name || '-';
                return <div>{value}</div>;
            }
        },
        {
            title: 'Branch',
            dataIndex: 'branch_id',
            key: 'branch_id',
            width: 150,
            render: (label, record) => {
                const value = record?.branchInfo?.name || '-';
                return <div>{value}</div>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <span style={{ display: 'flex', gap: '12px' }}>
                    {(permission?.billingTitleMapping?.includes('update') || userInfo?.user_type == 'admin') && <EditOutlined
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(record);
                        }}
                        className="!bg-blue-500 p-2 rounded-md !text-white"
                    />}
                    {(permission?.billingTitleMapping?.includes('delete') || userInfo?.user_type == 'admin') && <DeleteOutlined
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
            loading={loading}
            columns={columns}
            components={tableComponent}
            dataSource={billingTitleMappingList}
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

export default BillingTitleMappingTable;
