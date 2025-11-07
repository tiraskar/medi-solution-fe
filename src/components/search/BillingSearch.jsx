import { Button, Select, Form, Input, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearchFilter } from '../../store/slices/vehicleInvoiceSlice';
import { fetchVehicleInvoiceList } from '../../api/vehicleInvoice.api';

const { Option } = Select;

const BillingSearch = () => {
    const { searchFilter } = useSelector((state) => state.vehicleInvoice);
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const initialFilter = {
        searchStatus: 1,
        fromDate: '',
        toDate: '',
    };

    const handleChange = (name, value) => {
        dispatch(updateSearchFilter({ name, value }));
    };

    const formatBSDate = (value) => {
        let raw = value.replace(/\D/g, '').slice(0, 8);
        let year = raw.slice(0, 4);
        let month = raw.slice(4, 6);
        let day = raw.slice(6, 8);

        if (month && parseInt(month) > 12) month = '12';
        if (day && parseInt(day) > 32) day = '32';

        let formatted = year;
        if (month) formatted += `-${month}`;
        if (day) formatted += `-${day}`;

        return formatted;
    };

    const isValidBSDate = (dateStr) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateStr)) return false;

        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    };
    const handleSearch = () => {
        form.validateFields()
            .then(() => {
        // Only called if validation passes
                dispatch(fetchVehicleInvoiceList());
            })
            .catch((errorInfo) => {
                // Validation failed, do not dispatch
                console.log('Validation failed:', errorInfo);
            });
    };
    const handleReset = () => {
        form.resetFields();
        dispatch(updateSearchFilter(initialFilter));
    };

    return (
        <Form form={form} layout="vertical" initialValues={initialFilter} className='!flex  !gap-4'>
            {/* Status */}
            <Form.Item
                label="Status"
                name="searchStatus"
                rules={[{ required: true, message: 'Please select status' }]}
                className='!w-48'
            >
                <Select
                    placeholder="Select Status"
                    onChange={(value) => handleChange('searchStatus', value)}
                    allowClear
                >
                    <Option value={1}>Active</Option>
                    <Option value={0}>Inactive</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="From Date (BS)"
                name="fromDate"
                rules={[
                    {
                        validator: (_, value) => {
                            const toDate = form.getFieldValue('toDate');
                            if (value && !isValidBSDate(value)) {
                                return Promise.reject('From Date must be in YYYY-MM-DD format');
                            }
                            if (!value && toDate) {
                                return Promise.reject('From Date is required if To Date is filled');
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <Input
                    maxLength={10}
                    placeholder="e.g., 2081-12-30"
                    value={searchFilter.fromDate}
                    onChange={(e) => {
                        handleChange('fromDate', formatBSDate(e.target.value));
                        // trigger validation of To Date dynamically
                        form.validateFields(['toDate']);
                    }}
                />
            </Form.Item>

            <Form.Item
                label="To Date (BS)"
                name="toDate"
                rules={[
                    {
                        validator: (_, value) => {
                            const fromDate = form.getFieldValue('fromDate');
                            if (value && !isValidBSDate(value)) {
                                return Promise.reject('To Date must be in YYYY-MM-DD format');
                            }
                            if (value && !fromDate) {
                                return Promise.reject('From Date is required if To Date is filled');
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <Input
                    maxLength={10}
                    placeholder="e.g., 2081-12-30"
                    value={searchFilter.toDate}
                    onChange={(e) => {
                        handleChange('toDate', formatBSDate(e.target.value));
                        // trigger validation of From Date dynamically
                        form.validateFields(['fromDate']);
                    }}
                />
            </Form.Item>

            {/* Buttons */}
            <Form.Item className='!mt-7'>
                <Space>
                    <Button type="primary" onClick={handleSearch}>
                        Search
                    </Button>
                    <Button onClick={handleReset}>
                        Reset
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default BillingSearch;
