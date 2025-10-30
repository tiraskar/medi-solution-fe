import { Form, Input, Button, Typography, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { PATH } from "../utils/path";
// import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../api/auth.api";
// import { useEffect } from "react";
import { organization } from "../constant/organization";

const { Title } = Typography;

const Login = () => {
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    // const { isLoggedIn, loading } = useSelector((state) => state.auth);

    const onFinish = async (values) => {
        await dispatch(loginUser(values)).unwrap();
    };

    // useEffect(() => {
    //     if (isLoggedIn) {
    //         navigate(PATH.DASHBOARD);
    //     }
    // }, [isLoggedIn, navigate]);

    return (
        <div className="flex justify-center items-center h-[100vh] bg-gray-100">
            <Card className="w-full max-w-md shadow-lg rounded-xl">
                {/* Organization Header */}
                <div className="flex flex-col items-center mb-6 text-center">
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="w-16 h-16 rounded-full mb-4"
                    />
                    <Title level={4} className="!mb-1">
                        {organization.name}
                    </Title>
                </div>
                <Title level={4} className="!mb-1">
                    Admin Login
                </Title>

                {/* Login Form */}
                <Form
                    name="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: "Please input your username!" }]}
                    >
                        <Input
                            autoFocus
                            autoComplete="username"
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password
                            autoComplete="current-password"
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full"
                        // loading={loading}
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
