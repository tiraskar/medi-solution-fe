import { useEffect } from 'react';
import { Card, Form, Input, Button, Select, Space, Spin, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { tableComponent } from './VehicleExpiryReport';
import { Table } from 'antd';
import { getIndividualLedgerReport } from '../../api/vehicleExpiryReport.api';
import { adDateToCustomDate } from '../../api';
import { getAllLedgerList } from '../../api/accounting.api';

const { Option } = Select;

const IndividualReport = () => {
    const dispatch = useDispatch();
    const { individualReport, loading } = useSelector((state) => state.vehicleExpiryReport);
    const { ledgerOptions } = useSelector((state) => state.accounting);

    const [form] = Form.useForm();


    // On mount, set default values for form inputs
    useEffect(() => {
        getTodayDate();
        dispatch(getAllLedgerList());
    }, [form, dispatch]);

    const getTodayDate = () => {
        const today = dayjs().format('YYYY-MM-DD');
        return dispatch(adDateToCustomDate(today))
            .unwrap()
            .then((response) => {
                form.setFieldsValue({ fromDate: response, toDate: response });
                // dispatch(getIndividualLedgerReport({ fromDate: response, toDate: response }));
            });
    };

    // Table columns (adjust keys based on actual data shape)
    const columns = [
        {
            title: 'Voucher No',
            dataIndex: 'voucher',
            key: 'voucher',
            width: 180,
        },
        {
            title: 'Voucher Date (BS)',
            dataIndex: 'voucher_date_bs',
            key: 'voucher_date_bs',
            width: 150,
        },
        {
            title: 'Ledger Name',
            dataIndex: 'ledgername',
            key: 'ledgername',
            width: 200,
        },
        {
            title: 'Ledger Type',
            dataIndex: 'ledger_type',
            key: 'ledger_type',
            width: 150,
        },
        {
            title: 'Ledger Group',
            dataIndex: 'ledger_group_name',
            key: 'ledger_group_name',
            width: 180,
        },
        {
            title: 'Debit',
            dataIndex: 'debit',
            key: 'debit',
            width: 120,
            render: (val) => (val ? val.toLocaleString() : 0),
        },
        {
            title: 'Credit',
            dataIndex: 'credit',
            key: 'credit',
            width: 120,
            render: (val) => (val ? val.toLocaleString() : 0),
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            width: 150,
            render: (val) => (
                <span className={val >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {val.toLocaleString()}
                </span>
            ),
        },
    ];


    const onFinish = async (values) => {
        const { ledgerId, fromDate, toDate } = values;

        if (!fromDate || !toDate) {
            message.error('Please select valid from and to dates.');
            return;
        }

        try {
            await dispatch(
                getIndividualLedgerReport({
                    ledgerId,
                    fromDate,
                    toDate,
                }),
            ).unwrap();
        } catch (error) {
            console.error('Failed to fetch report:', error);
            message.error('Failed to fetch report.');
        }
    };

    // Date input handler with BS format validation and formatting
    const handleBSInputChange = (fieldName, e) => {
        let raw = e.target.value.replace(/\D/g, '').slice(0, 8); // only digits max 8

        let year = raw.slice(0, 4);
        let month = raw.slice(4, 6);
        let day = raw.slice(6, 8);

        if (month && parseInt(month) > 12) month = '12';
        if (day && parseInt(day) > 32) day = '32';

        let formatted = year;
        if (month) formatted += `-${month}`;
        if (day) formatted += `-${day}`;

        form.setFieldsValue({ [fieldName]: formatted });
    };

    return (
        <Card title="Individual Report" bordered={false}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    ledgerId: null,
                    fromDate: dayjs().format('YYYY-MM-DD'),
                    toDate: dayjs().format('YYYY-MM-DD'),
                    functional_year_start_bs: '',
                    functional_year_end_bs: '',
                }}
            >
                <Space wrap size="large" style={{ marginBottom: 16 }}>
                    <Form.Item
                        label="Ledger"
                        name="ledgerId"
                        rules={[{ required: true, message: 'Please select a ledger' }]}
                        style={{ minWidth: 240 }}
                    >
                        <Select placeholder="Select ledger" allowClear>
                            {ledgerOptions?.length === 0 ? (
                                <Option value={null} disabled>

                                </Option>
                            ) : (
                                ledgerOptions?.map((ledger) => (
                                    <Option key={ledger.id} value={ledger.id}>
                                        {ledger.ledgername}
                                    </Option>
                                ))
                            )}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="From Date (BS)"
                        name="fromDate"
                        rules={[
                            { required: false },
                            {
                                pattern: /^\d{4}-\d{2}-\d{2}$/,
                                message: 'Date must be in YYYY-MM-DD format',
                            },
                        ]}
                    >
                        <Input
                            placeholder="e.g., 2081-12-30"
                            maxLength={10}
                            onChange={(e) => handleBSInputChange('functional_year_start_bs', e)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="To Date (BS)"
                        name="toDate"
                        rules={[
                            { required: false },
                            {
                                pattern: /^\d{4}-\d{2}-\d{2}$/,
                                message: 'Date must be in YYYY-MM-DD format',
                            },
                        ]}
                    >
                        <Input
                            placeholder="e.g., 2081-12-30"
                            maxLength={10}
                            onChange={(e) => handleBSInputChange('functional_year_end_bs', e)}
                        />
                    </Form.Item>

                    <Form.Item className='!mt-7'>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Search
                            </Button>
                            <Button
                                onClick={() => {
                                    form.resetFields();
                                    getTodayDate();
                                }}
                            >
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Space>
            </Form>

            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={individualReport}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    bordered
                    rowKey="id" // or other unique key
                    components={tableComponent}
                    scroll={{ x: 1200 }}
                />
            </Spin>
        </Card>
    );
};

export default IndividualReport;
