import { Form, Input, Button, DatePicker, Select, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setupEconomicYear } from '../../api/master.api';
import { useEffect } from 'react';
import { parseUntilNotString } from '../../utils/array';

const { Option } = Select;

const EconomicYearForm = ({ onFinishCallback }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { loading, isSuccess, economicYears } = useSelector(state => state.master);
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};


    useEffect(() => {
        if (isSuccess) {
            form.resetFields();
            if (onFinishCallback) onFinishCallback();
        }
    }, [isSuccess, form, onFinishCallback]);

    const onFinish = (values) => {
        // Convert dates to proper format
        const economicYearData = {
            functional_year: values.functional_year,
            functional_year_start_bs: values.functional_year_start_bs,
            functional_year_end_bs: values.functional_year_end_bs,
        };

        dispatch(setupEconomicYear(economicYearData));
    };

    return (
        <div className=" rounded-xl min-w-2xl  max-w-3xl mx-auto space-y-6">
            {/* Current Economic Year Overview */}
            <div className="border border-gray-200 p-5 rounded-md bg-gray-50">
                <Typography.Title level={4} className="!mb-2">Current Economic Year</Typography.Title>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div >
                        <p className="text-sm text-gray-500">Year</p>
                        <p className="font-medium text-gray-800">{economicYears?.[0]?.functional_year || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Start Date (BS)</p>
                        <p className="font-medium text-gray-800">{economicYears?.[0]?.functional_year_start_bs || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">End Date (BS)</p>
                        <p className="font-medium text-gray-800">{economicYears?.[0]?.functional_year_end_bs || 'N/A'}</p>
                    </div>
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-6">Setup Economic Year</h2>
            <Form 
                form={form} 
                layout="vertical" 
                onFinish={onFinish} 
                initialValues={{ status: 'active' }}
                className="max-w-2xl"
            >
                <Form.Item
                    label="Functional Year"
                    name="functional_year"
                    rules={[{ required: true, message: 'Please enter functional year' }]}
                >
                    <Input placeholder="e.g., 2024-2025" />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <Form.Item
                        label="Start Date (BS)"
                        name="functional_year_start_bs"
                        rules={[
                            { required: true, message: 'Please enter BS start date' },
                            {
                                pattern: /^\d{4}-\d{2}-\d{2}$/,
                                message: 'Date must be in YYYY-MM-DD format',
                            },
                        ]}
                    >
                        <Input
                            maxLength={10}
                            placeholder="e.g., 2081-12-30"
                            onChange={(e) => {
                                let raw = e.target.value.replace(/\D/g, "").slice(0, 8); // only digits, max 8

                                let year = raw.slice(0, 4);
                                let month = raw.slice(4, 6);
                                let day = raw.slice(6, 8);

                                // Apply validation constraints
                                if (month && parseInt(month) > 12) month = "12";
                                if (day && parseInt(day) > 32) day = "32";

                                let formatted = year;
                                if (month) formatted += `-${month}`;
                                if (day) formatted += `-${day}`;

                                form.setFieldsValue({ functional_year_start_bs: formatted });
                            }} />
                    </Form.Item>

                    <Form.Item
                        label="End Date (BS)"
                        name="functional_year_end_bs"
                        rules={[
                            { required: true, message: 'Please enter BS end date' },
                            {
                                pattern: /^\d{4}-\d{2}-\d{2}$/,
                                message: 'Date must be in YYYY-MM-DD format',
                            },
                        ]}
                    >
                        <Input
                            maxLength={10}
                            placeholder="e.g., 2081-12-30"
                            onChange={(e) => {
                                let raw = e.target.value.replace(/\D/g, "").slice(0, 8); // only digits, max 8

                                let year = raw.slice(0, 4);
                                let month = raw.slice(4, 6);
                                let day = raw.slice(6, 8);

                                // Apply validation constraints
                                if (month && parseInt(month) > 12) month = "12";
                                if (day && parseInt(day) > 32) day = "32";

                                let formatted = year;
                                if (month) formatted += `-${month}`;
                                if (day) formatted += `-${day}`;

                                form.setFieldsValue({ functional_year_end_bs: formatted });
                            }} />
                    </Form.Item>

                </div>


                {(userInfo?.user_type == 'admin' || permission?.economicYear?.includes("create") ||
                    permission?.economicYear?.includes("update")) && (
                    <Form.Item className="text-left">
                        <Button
                            disabled={loading}
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                        <Button
                            disabled={loading}
                            htmlType="button"
                            onClick={() => form.resetFields()}
                            className="!ml-2"
                            danger
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                    )}

            </Form>
        </div>
    );
};

export default EconomicYearForm;
