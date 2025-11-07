import { Table, } from 'antd';
import { EditOutlined, } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import useDynamicTableScroll from '../../hook/useDynamicTableScroll';
import { fetchLedgerMappingPagination } from '../../api/accounting.api';
import { toggleSelectedLedgerMapping, updatePagination } from '../../store/slices/accountingSlice';
import { parseUntilNotString } from '../../utils/array';

const LedgerMappingTable = () => {
    const dispatch = useDispatch();
    const { ledgerMappings, pagination, loading } = useSelector(state => state.accounting);
    const scroll = useDynamicTableScroll();

    const handleEdit = (record) => {
        dispatch(toggleSelectedLedgerMapping(record));
    };

    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};
    const columns = [
        {
            title: 'SN',
            key: 'sn',
            width: 80,
            render: (_, __, index) => {
                const currentPage = pagination?.page || 1;
                const pageSize = pagination?.limit || 10;
                return (currentPage - 1) * pageSize + index + 1;
            },
        },
        {
            title: 'Label',
            dataIndex: 'label',
            key: 'label',
            width: 200,
        },
        {
            title: 'Ledger',
            dataIndex: 'ledger_id',
            key: 'ledger_id',
            width: 200,
            render: (value, record) => {
                const ledger = record?.ledgerInfo;
                return ledger ? ledger.ledgername : '-';
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <span style={{ display: 'flex', gap: '12px' }}>
                    {(permission?.ledgerMapping?.includes('update') || userInfo?.user_type == 'admin') && <EditOutlined
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(record);
                        }}
                        className="!bg-blue-500 p-2 rounded-md !text-white"
                    />}

                </span>
            ),
        },
    ];

    return (
        <Table
            loading={loading}
            columns={columns}
            dataSource={ledgerMappings}
            // components={tableHeadRowComponent}
            rowKey="id"
            onRow={(record) => ({
                onClick: () => {
                    dispatch(toggleSelectedLedgerMapping(record));
                },
            })}
            scroll={scroll}
            pagination={{
                showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} entries`,
                current: pagination?.page,
                pageSize: pagination?.limit,
                total: pagination?.total,
                showSizeChanger: true,
                onChange: (page, limit) => {
                    dispatch(updatePagination({ page, limit }));
                    dispatch(fetchLedgerMappingPagination());
                },
            }}
            size="small"
        />
    );
};

export default LedgerMappingTable;
