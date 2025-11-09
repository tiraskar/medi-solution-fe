import { Table, Button, Tag, Input, Select, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PrinterOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCashInvoiceList, deleteCashInvoice, getCashInvoiceById } from '../../api/cashInvoice.api';
import { toggleSelectedCashInvoice, updateSearchFilter, updatePagination } from '../../store/slices/cashInvoiceSlice';
import { tableComponent } from '../report/VehicleExpiryReport';
import { parseUntilNotString } from '../../utils/array';
const { Option } = Select;
const confirm = Modal.confirm;
const CashInvoiceTable = () => {
    const dispatch = useDispatch();
    const { cashInvoices, loading, pagination, searchFilter } = useSelector(state => state.cashInvoice);
    const [searchText, setSearchText] = useState('');
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};


    useEffect(() => {
        dispatch(fetchCashInvoiceList({
            page: pagination.page,
            limit: pagination.limit,
            ...searchFilter
        }));
    }, [dispatch, pagination.page, pagination.limit, searchFilter]);

    const handleEdit = (record) => {
        dispatch(toggleSelectedCashInvoice(record));
    };

    const handleDelete = (record) => {
        console.log('record', record);

        confirm({
            title: 'Are you sure you want to delete this invoice?',
            okText: 'Yes',
            cancelText: 'No',
            onOk() {
                dispatch(deleteCashInvoice(record.id));
            },
        });

    };


    const handleSearch = () => {
        dispatch(updateSearchFilter({ name: 'search', value: searchText }));
    };

    const handlePaymentMethodFilter = (value) => {
        dispatch(updateSearchFilter({ name: 'payment_method', value }));
    };

    const handleStatusFilter = (value) => {
        dispatch(updateSearchFilter({ name: 'searchStatus', value }));
    };

    const handleTableChange = (pagination) => {
        dispatch(updatePagination({
            page: pagination.current,
            limit: pagination.pageSize
        }));
    };

    const handlePrint = (id) => {
        dispatch(getCashInvoiceById(id));
    }   

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
            title: 'Vehicle',
            key: 'vehicle',
            width: 120,
            render: (_, record) => record?.vehicle?.vehicleNo
        },
        {
            title: 'Bill Date',
            dataIndex: 'bill_date_bs',
            key: 'bill_date_bs',
            width: 120,
        },
        {
            title: 'Payment Method',
            dataIndex: 'payment_method',
            key: 'payment_method',
            width: 120,
            render: (method) => (
                <Tag color={method === 'cash' ? 'green' : 'blue'}>
                    {method?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 100,
            render: (amount) => `Rs. ${amount?.toLocaleString()}`,
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            ellipsis: true,
            width: 150,
            render: (remarks) => remarks || '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            fixed: 'right',
            render: (status) => (
                <Tag color={status === 1 ? 'green' : 'red'}>
                    {status === 1 ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <span style={{ display: 'flex', gap: '12px' }}>
                    {(permission?.cashInvoice?.includes('update') || userInfo?.user_type == 'admin') && <EditOutlined
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering onRow click
                            handleEdit(record);
                        }}
                        className='!bg-blue-500 p-2 rounded-md !text-white'
                    />}
                    {(permission?.cashInvoice?.includes('delete') || userInfo?.user_type == 'admin') && <DeleteOutlined
                        style={{ color: '#ff4d4f', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record);
                        }}
                        className='!bg-red-500 p-2 rounded-md !text-white'
                    />}
                    <PrinterOutlined
                        style={{ cursor: 'pointer' }}
                        onClick={e => { e.stopPropagation(); handlePrint(record.id); }}
                        className="!bg-green-500 p-2 rounded-md !text-white"
                    />
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-end">
                <div className="flex flex-wrap gap-2 items-center">
                    <div className='flex flex-col space-y-1'>
                        <label htmlFor="search">Vehicle No</label>
                        <Input
                            placeholder="Search by vehicleno..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={handleSearch}
                            style={{ width: 200 }}
                            prefix={<SearchOutlined />}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <div className='flex flex-col space-y-1'>
                        <label htmlFor="search">Payment Method</label>
                        <Select
                            placeholder="Payment Method"
                            value={searchFilter.payment_method}
                            onChange={handlePaymentMethodFilter}
                            allowClear
                            style={{ width: 150 }}
                        >
                            <Option value="cash">Cash</Option>
                            <Option value="online">Online</Option>
                        </Select>
                    </div>

                    <div className='flex flex-col space-y-1'>
                        <label htmlFor="search">Status</label>
                        <Select
                            placeholder="Status"
                            value={searchFilter.searchStatus}
                            onChange={handleStatusFilter}
                            style={{ width: 120 }}
                        >
                            <Option value={1}>Active</Option>
                            <Option value={0}>Inactive</Option>
                        </Select>
                    </div>
                    <Button type="primary" className='!mt-6' onClick={handleSearch}>
                        Search
                    </Button>
                </div>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={cashInvoices}
                components={tableComponent}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: pagination.page,
                    pageSize: pagination.limit,
                    total: pagination.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`,
                }}
                onChange={handleTableChange}
                scroll={{ x: 1200 }}
                className="custom-table"
            />
        </div>
    );
};

export default CashInvoiceTable;