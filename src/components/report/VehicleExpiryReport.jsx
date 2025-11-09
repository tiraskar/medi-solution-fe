import React, { useEffect } from 'react';
import { Table, Card, Button, Space, Spin, Form, Input, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { adDateToCustomDate, getVehicleExpiryReport } from '../../api';
import dayjs from 'dayjs';

const VehicleExpiryReport = () => {
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state.vehicleExpiryReport);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Vehicle No',
            dataIndex: 'vehicleNo',
            key: 'vehicleNo',
            width: 150,
        },
        {
            title: 'Owner Name',
            dataIndex: 'ownerName',
            key: 'ownerName',
            width: 200,
        },
        {
            title: 'Billing Title',
            dataIndex: 'billingTitle',
            key: 'billingTitle',
            width: 150,
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            width: 120,
            render: (date) => (date ? moment(date).format('YYYY-MM-DD') : 'N/A'),
        },
        {
            title: 'Expiry Date (BS)',
            dataIndex: 'expiryDateBS',
            key: 'expiryDateBS',
            width: 120,
        },
        {
            title: 'Last Renew Date',
            dataIndex: 'lastRenewDate',
            key: 'lastRenewDate',
            width: 120,
            render: (date) => (date ? moment(date).format('YYYY-MM-DD') : 'N/A'),
        },
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     key: 'status',
        //     width: 100,
        //     render: (status) => (
        //         <span
        //             className={`px-2 py-1 rounded text-xs font-medium ${status === 'paid'
        //                 ? 'bg-green-100 text-green-800'
        //                 : status === 'pending'
        //                     ? 'bg-yellow-100 text-yellow-800'
        //                     : status === 'overdue'
        //                         ? 'bg-red-100 text-red-800'
        //                         : 'bg-gray-100 text-gray-800'
        //                 }`}
        //         >
        //             {status?.toUpperCase() || 'N/A'}
        //         </span>
        //     ),
        // },
    ];

    // Load data on mount with today's date
    useEffect(() => {
        getTodayDate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        try {
            const toDate = form.getFieldValue('toDate');

            if (!toDate) {
                message.warning('Please enter a valid To Date.');
                return;
            }

            // Ensure correct format YYYY-MM-DD
            const formattedDate = dayjs(toDate, 'YYYY-MM-DD', true);
            if (!formattedDate.isValid()) {
                message.error('Invalid date format. Use YYYY-MM-DD.');
                return;
            }

            await dispatch(
                getVehicleExpiryReport({ toDate: formattedDate.format('YYYY-MM-DD') })
            ).unwrap();
        } catch (error) {
            console.error('Failed to fetch vehicle expiry report:', error);
        }
    };

    const handleDateChange = (e) => {
        let raw = e.target.value.replace(/\D/g, '').slice(0, 8);
        let year = raw.slice(0, 4);
        let month = raw.slice(4, 6);
        let day = raw.slice(6, 8);

        if (month && parseInt(month) > 12) month = '12';
        if (day && parseInt(day) > 32) day = '32';

        let formatted = year;
        if (month) formatted += `-${month}`;
        if (day) formatted += `-${day}`;

        form.setFieldsValue({ toDate: formatted });
    };

    const getTodayDate = () => {
        const today = dayjs().format('YYYY-MM-DD');
        return dispatch(adDateToCustomDate(today))
            .unwrap()
            .then((response) => {
                form.setFieldsValue({ toDate: response });
                fetchData();
            });
    };

    return (
        <Card title="Vehicle Expiry Report" bordered={false}>
            <div className="mb-4">
                <Space wrap>
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="To Date (BS)"
                            name="toDate"
                            rules={[
                                { required: true, message: 'Please enter Date BS.' },
                                {
                                    pattern: /^\d{4}-\d{2}-\d{2}$/,
                                    message: 'Date must be in YYYY-MM-DD format',
                                },
                            ]}
                        >
                            <Input
                                maxLength={10}
                                placeholder="e.g., 2081-12-30"
                                onChange={handleDateChange}
                            />
                        </Form.Item>
                    </Form>

                    <div className="flex items-center mt-2">
                        <Space>
                            <Button type="primary" onClick={fetchData} loading={loading}>
                                Search
                            </Button>
                            <Button onClick={getTodayDate}>Today</Button>
                        </Space>
                    </div>
                </Space>
            </div>

            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    bordered
                    rowKey="key"
                    components={tableComponent}
                    onRow={(record, index) => ({
                        'data-row-index': index,
                    })}
                    scroll={{ x: 1200 }}
                />
            </Spin>
        </Card>
    );
};

export default VehicleExpiryReport;

//eslint-disable-next-line
export const tableComponent = {
    header: {
        cell: (props) => {
            return (
                <th
                    {...props}
                    className="px-4 !py-2 font-semibold !text-white whitespace-nowrap border-b border-gray-200 text-sm text-start uppercase !bg-[#28648a]"
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
        },
    },
};
