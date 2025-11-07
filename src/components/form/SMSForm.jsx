import { Form, Input, Button, InputNumber } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { upsertSmsSetting, fetchSmsSetting } from '../../api/master.api';
import { useEffect, useState } from 'react';
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { parseUntilNotString } from '../../utils/array';

const SMSForm = ({ onFinishCallback }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { loading, isSuccess, smsSetting } = useSelector(state => state.master);
    const [isDisabled, setIsDisabled] = useState(true);
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};


    useEffect(() => {
        dispatch(fetchSmsSetting());
    }, [dispatch]);

    useEffect(() => {
        if (smsSetting) {
            setIsDisabled(true)
            form.setFieldsValue({
                api_url: smsSetting.api_url,
                api_key: smsSetting.api_key,
                sender_id: smsSetting.sender_id,
                route_id: smsSetting.route_id,
                campaign_id: smsSetting.campaign_id
            });
        } else {
            setIsDisabled(false)
        }
    }, [smsSetting, form]);

    useEffect(() => {
        if (isSuccess) {
            if (onFinishCallback) onFinishCallback();
        }
    }, [isSuccess, onFinishCallback]);

    const onFinish = async (values) => {
        const smsData = {
            ...values,
            created_by: userInfo?.user_id,
            created_in: new Date().toISOString(),
        };

        try {
            await dispatch(upsertSmsSetting(smsData)).unwrap();

            // ✅ Only reset if success
            form.resetFields();
        } catch (error) {
            console.error("Failed to save SMS setting:", error);
        }
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
            {smsSetting && (permission?.sms?.includes('update') || userInfo?.user_type == 'admin') && <div className=' flex justify-end'>
                <button onClick={() => {
                    setIsDisabled(!isDisabled);
                }}
                    className='!text-xl'
                >
                    {isDisabled ? <EditOutlined className='!text-blue-500' /> :
                        <CloseCircleOutlined className='!text-red-500' />}
                </button>
            </div>}
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="max-w-2xl"
                disabled={isDisabled}
            >
                <Form.Item
                    label="API URL"
                    name="api_url"
                    rules={[{ required: true, message: 'Please enter API URL' }]}
                >
                    <Input placeholder="https://api.example.com/sms" />
                </Form.Item>

                <Form.Item
                    label="API Key"
                    name="api_key"
                    rules={[{ required: true, message: 'Please enter API key' }]}
                >
                    <Input.Password placeholder="Enter your API key" />
                </Form.Item>

                <Form.Item
                    label="Sender ID"
                    name="sender_id"
                    rules={[{ required: true, message: 'Please enter sender ID' }]}
                >
                    <Input placeholder="e.g., YATAYAT" maxLength={10} />
                </Form.Item>

                <div className="flex flex-row gap-4">
                    <Form.Item
                        label="Route ID"
                        name="route_id"
                        rules={[{ required: true, message: 'Please enter route ID' }]}
                    >
                        <InputNumber
                            className="w-full"
                            placeholder="Enter route ID"
                            min={1}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Campaign ID"
                        name="campaign_id"
                        rules={[{ required: true, message: 'Please enter campaign ID' }]}
                    >
                        <InputNumber
                            className="w-full"
                            placeholder="Enter campaign ID"
                            min={1}
                        />
                    </Form.Item>
                </div>

                {
                    (permission?.sms?.includes('create') || userInfo?.user_type == 'admin') && <Form.Item className="text-left  ">
                    <Button
                        disabled={loading || isDisabled}
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {loading ? 'Saving...' : 'Save Settings'}
                    </Button>
                    <Button
                        disabled={loading || isDisabled}
                        htmlType="button"
                        onClick={() => form.resetFields()}
                        className='!ml-4'
                    >
                        Reset
                    </Button>

                    </Form.Item>}
            </Form>
        </div>
    );
};

export default SMSForm;
