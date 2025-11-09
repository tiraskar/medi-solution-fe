import { Table, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import useDynamicTableScroll from '../../hook/useDynamicTableScroll';
import { toggleSelectedInvoice } from '../../store/slices/vehicleInvoiceSlice';
import { deleteVehicleInvoice, fetchVehicleInvoiceList, getVehicleInvoiceById, } from '../../api/vehicleInvoice.api';
import { updatePagination } from '../../store/slices/vehicleSlice';
import { parseUntilNotString } from '../../utils/array';

const components = {
    header: {
        cell: (props) => {
            return (
                <th
                    {...props}
                    className=" px-4 !py-2 font-semibold !text-white whitespace-nowrap border-b border-gray-200 text-sm text-start uppercase !bg-[#28648a]"
                />
            );
        },
    },
    body: {
        cell: (props) => (
            <td
                {...props}
                className="font-onest px-3 !py-2 text-sm text-black"
            />
        ),
        row: (props) => {
            const rowIndex = props['data-row-index'];
            const isEven = rowIndex % 2 === 0;

            return (
                <tr
                    {...props}
                    className={`transition-all duration-300 ease-in-out border-b border-gray-200 hover:bg-[#f5f5ef] text-sm text-start ${isEven ? 'bg-white' : 'bg-[#f9f9f9]'
                        }`}
                />
            );
        }
    },
};

const VehicleInvoiceTable = () => {
    const { invoices, pagination } = useSelector(state => state.vehicleInvoice);
    const dispatch = useDispatch();
    const scroll = useDynamicTableScroll();
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};

    const handleEdit = (record) => dispatch(toggleSelectedInvoice(record));

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this invoice?',
            icon: <ExclamationCircleOutlined />,
            content: `Invoice No: ${record.invoice_number}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteVehicleInvoice(record));
            },
        });
    };

    const handlePrint = (id) => {
        dispatch(getVehicleInvoiceById(id));
    }   

    const columns = [
        {
            title: 'SN',
            key: 'sn',
            width: 60,
            render: (_, __, index) => {
                const currentPage = pagination?.page || 1;
                const pageSize = pagination?.limit || 10;
                return (currentPage - 1) * pageSize + index + 1;
            },
            fixed: 'left'
        },
        {
            title: 'Invoice No',
            dataIndex: 'invoice_number',
            key: 'invoice_number',
            width: 180
        },
        {
            title: 'Bill Date',
            dataIndex: 'invoice_date_bs',
            key: 'invoice_date_bs',
            width: 120,
        },
        {
            title: 'Vehicle',
            dataIndex: 'vehicleInfo',
            key: 'vehicleInfo',
            width: 150,
            render: (vehicleInfo) => vehicleInfo?.vehicleNo || '-',
        },
        {
            title: 'Billing Title',
            dataIndex: 'billingInfo',
            key: 'billingInfo',
            width: 150,
            render: (billingInfo) => billingInfo?.billing_title || '-',
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expire_date_bs',
            key: 'expire_date_bs',
            width: 120,
        },
        {
            title: 'Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            width: 120,
            render: val => Number(val).toFixed(2),
        },
        {
            title: 'Action',
            key: 'action',
            width: 80,
            fixed: 'right',
            render: (_, record) => (
                <span style={{ display: 'flex', gap: '12px' }}>
                    {(permission?.vehicleInvoice?.includes('update') || userInfo?.user_type == 'admin') && (
                        <EditOutlined
                            style={{ cursor: 'pointer' }}
                            onClick={e => { e.stopPropagation(); handleEdit(record); }}
                            className="!bg-blue-500 p-2 rounded-md !text-white"
                        />
                    )}
                    {(permission?.vehicleInvoice?.includes('delete') || userInfo?.user_type == 'admin') && (
                        <DeleteOutlined
                            style={{ cursor: 'pointer' }}
                            onClick={e => { e.stopPropagation(); handleDelete(record); }}
                            className="!bg-red-500 p-2 rounded-md !text-white"
                        />
                    )}
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
        <Table
            columns={columns}
            dataSource={invoices}
            components={components}
            rowKey="id"
            onRow={(record) => ({
                onClick: () => dispatch(toggleSelectedInvoice(record)),
            })}
            scroll={scroll}
            pagination={{
                showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} entries`,
                current: pagination.page,
                pageSize: pagination.limit,
                total: pagination.total,
                showSizeChanger: true,
                onChange: (page, limit) => {
                    dispatch(updatePagination({ page, limit }));
                    dispatch(fetchVehicleInvoiceList());
                },
            }}
        />
    );
};

export default VehicleInvoiceTable;
