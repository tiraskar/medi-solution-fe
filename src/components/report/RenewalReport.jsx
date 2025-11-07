import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Spin, message, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getRenewalReminders } from '../../api';
import { tableComponent } from './VehicleExpiryReport';

const VehicleRenewalReport = () => {
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state.renewalReminder);
    const [days, setDays] = useState('7');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const numericDays = Number(days) || 0;
        try {
            await dispatch(getRenewalReminders({ days: numericDays })).unwrap();
        } catch (error) {
            console.error('Failed to fetch renewal reminders:', error);
        }
    };

    const handleSearch = () => {
        const numericDays = Number(days);
        if (!days || numericDays <= 0) {
            message.error('Please select a valid number of days');
            return;
        }
        fetchData();
    };

    const handleReset = () => {
        setDays('7');
        fetchData(); // Optional: fetch default data again
    };

    const columns = [
        {
            title: 'Vehicle No',
            dataIndex: ['vehicleInfo', 'vehicleNo'],
            key: 'vehicleNo',
            width: 150,
        },
        {
            title: 'Owner Name',
            dataIndex: ['vehicleInfo', 'ownerName'],
            key: 'ownerName',
            width: 200,
        },
        {
            title: 'Billing Title',
            dataIndex: ['billingInfo', 'billing_title'],
            key: 'billingTitle',
            width: 180,
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiry_date',
            key: 'expiry_date',
            width: 150,
            render: (date) => (date ? moment(date).format('YYYY-MM-DD') : 'N/A'),
        },
        {
            title: 'Amount',
            dataIndex: ['billingInfo', 'rate'],
            key: 'amount',
            width: 120,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : status === 'overdue'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {status || 'N/A'}
                </span>
            ),
        },
    ];

    return (
        <Card title="Renewal Reminder Report" bordered={false}>
            <div className="mb-4">
                <Space wrap>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Show invoices expiring within (days):
                        </label>
                        <Select
                            value={days}
                            onChange={(value) => setDays(value)}
                            style={{ width: 120 }}
                            showSearch
                            optionFilterProp="label"
                            placeholder="Select days"
                            options={Array.from({ length: 90 }, (_, i) => ({
                                label: `${i + 1} days`,
                                value: String(i + 1),
                            }))}
                        />
                    </div>
                    <div className="flex items-center mt-6">
                        <Space>
                            <Button type="primary" onClick={handleSearch} loading={loading}>
                                Search
                            </Button>
                            <Button onClick={handleReset}>Reset</Button>
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
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    bordered
                    rowKey="id"
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

export default VehicleRenewalReport;
