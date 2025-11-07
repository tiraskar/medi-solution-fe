import { Form, Input, Button, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../api/master.api";
import { useEffect } from "react";

const ChangePasswordForm = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const { settingActiveTab } = useSelector(state => state.master);

    const onFinish = async (values) => {
    // eslint-disable-next-line
        const { confirmPassword, ...rest } = values;

        try {
            await dispatch(changePassword(rest)).unwrap();

            // ✅ Only reset on success
            form.resetFields();
        } catch (error) {
            console.error("Failed to change password:", error);
        }
    };

    useEffect(() => {
        form.resetFields();
    }, [settingActiveTab]);

    return (
        <Card title="Change Password" style={{ maxWidth: 400, margin: "auto" }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                {/* Current Password */}
                <Form.Item
                    label="Current Password"
                    name="oldPassword"
                    rules={[{ required: true, message: "Please enter your current password" }]}
                >
                    <Input.Password placeholder="Enter current password" />
                </Form.Item>

                {/* New Password */}
                <Form.Item
                    label="New Password"
                    name="newPassword"
                    dependencies={["oldPassword"]}
                    rules={[
                        { required: true, message: "Please enter a new password" },
                        {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                            message:
                                "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("oldPassword") !== value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("New password cannot be the same as the current password")
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Enter new password" />
                </Form.Item>

                {/* Confirm New Password */}
                <Form.Item
                    label="Confirm New Password"
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    rules={[
                        { required: true, message: "Please confirm your new password" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("newPassword") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords do not match!"));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirm new password" />
                </Form.Item>

                {/* Submit */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ChangePasswordForm;
