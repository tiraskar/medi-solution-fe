import { useDispatch, useSelector } from "react-redux";
import { Modal, Table, Tag } from "antd";
import { setActiveTab, toggleEditVehicle, toggleSelectedVehicle, updatePagination } from "../../store/slices/vehicleSlice";
import { deleteVehicleRegistration, getAllVehicleRegistration } from "../../api/vehicle.api";
import useDynamicTableScroll from "../../hook/useDynamicTableScroll";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { tableComponent } from "../report/VehicleExpiryReport";
import { parseUntilNotString } from "../../utils/array";
// import { tableHeadRowComponent } from "../tableHeadRowComponent";

const RegisteredVehicleTable = () => {
    const { vehiclesList, pagination } = useSelector((state) => state.vehicle);
    const dispatch = useDispatch();
    const scroll = useDynamicTableScroll();

    const handleEdit = (record) => {
        dispatch(setActiveTab('create'));
        dispatch(toggleEditVehicle(record));
    };
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this vehicle registration?',
            icon: <ExclamationCircleOutlined />,
            content: `Owner: ${record.ownerName}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteVehicleRegistration(record));
            },
        });
    };

    const columns = [
        {
            title: 'SN',
            key: 'sn',
            width: 40,
            fixed: 'left',
            render: (text, record, index) => {
                // Calculate global SN if pagination is used
                const currentPage = pagination?.page || 1;
                const pageSize = pagination?.limit || 10;
                return (currentPage - 1) * pageSize + index + 1;
            },
        },
        {
            title: "Vehicle No",
            dataIndex: "vehicleNo",
            key: "vehicleNo",
            width: 150,
        },
        {
            title: "Owner Name",
            dataIndex: "ownerName",
            key: "ownerName",
            width: 150,
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            width: 150,
        },
        {
            title: "Contact",
            dataIndex: "contact",
            key: "contact",
            width: 150,
        },
        {
            title: "Pan No",
            dataIndex: "panNo",
            key: "panNo",
            width: 150,
        },
        {
            title: "Registration Date",
            dataIndex: "registrationDate",
            key: "registrationDate",
            render: (date) => (date ? date.split('T')[0].split('-').reverse().join('-') : "-"),
            width: 150,
        },
        {
            title: "Mem. No",
            dataIndex: "membershipNo",
            key: "membershipNo",
            width: 150,
        },

        {
            title: "Drivers",
            dataIndex: "drivers",
            key: "drivers",
            render: (drivers) =>
                drivers?.length > 0 ? drivers.map((d) => d.driverName).join(", ") : <Tag>N/A</Tag>,
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (value, record) => (
                <span style={{ display: 'flex', gap: '12px' }}>
                    {(permission?.vehicleRegistration?.includes('update') || userInfo?.user_type == 'admin') && <EditOutlined
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering onRow click
                            handleEdit(record);
                        }}
                        className='!bg-blue-500 p-2 rounded-md !text-white'
                    />}
                    {(permission?.vehicleRegistration?.includes('delete') || userInfo?.user_type == 'admin') && <DeleteOutlined
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

    // const expandedRowRender = (record) => {
    //     const driverColumns = [
    //         {
    //             title: "Driver Name",
    //             dataIndex: "driverName",
    //             key: "driverName",
    //         },
    //         {
    //             title: "License No",
    //             dataIndex: "licenseNo",
    //             key: "licenseNo",
    //         },
    //         {
    //             title: "PAN No",
    //             dataIndex: "panNo",
    //             key: "panNo",
    //         },
    //         {
    //             title: "Address",
    //             dataIndex: "address",
    //             key: "address",
    //         },
    //     ];

    //     return (
    //         <Table
    //             columns={driverColumns}
    //             dataSource={record.drivers || []}
    //             rowKey='id'
    //             pagination={false}
    //             size="small"
    //         />
    //     );
    // };


    return (
        <Table
            rowKey="id"
            dataSource={vehiclesList || []}
            columns={columns}
            scroll={scroll}
            components={tableComponent}
            // expandable={{
            //     expandedRowRender,
            //     rowExpandable: (record) => record.drivers && record.drivers.length > 0,
            // }}
            pagination={{
                showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} entries`,
                current: pagination.page,
                pageSize: pagination.limit,
                total: pagination.total,
                showSizeChanger: true,
                onChange: (page, limit) => {
                    dispatch(updatePagination({ page, limit }));
                    dispatch(getAllVehicleRegistration());
                },
            }}
            onRow={(record) => {
                return {
                    onClick: () => {
                        dispatch(toggleSelectedVehicle(record));
                    },
                };
            }}

            size="small"
        />
    );
};

export default RegisteredVehicleTable;
