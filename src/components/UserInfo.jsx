import { useSelector } from "react-redux";
import { Card, Avatar, Typography, Divider, Tag, Collapse, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
// import { parseUntilNotString } from "../utils/array";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const UserInfo = () => {
    const { userInfo } = useSelector((state) => state.auth);

    // const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};

    return (
        <div className="p-6">
            <Row gutter={24} justify="center">
                {/* Left side - User Info */}
                <Col xs={24} md={10}>
                    <Card
                        className="rounded-2xl shadow-lg border border-gray-100"
                        bodyStyle={{ padding: "24px" }}
                    >
                        <div className="flex flex-col items-center text-center">
                            <Avatar
                                size={100}
                                icon={<UserOutlined />}
                                className="bg-blue-500 mb-4"
                            />
                            <Title level={4} className="!mb-0">
                                {userInfo?.name}
                            </Title>
                            <Text type="secondary">@{userInfo?.username}</Text>
                            <Divider />
                            <div className="text-left w-full space-y-2">
                                <Text strong>Contact:</Text>
                                <Text className="block">{userInfo?.contact}</Text>

                                <Text strong>Address:</Text>
                                <Text className="block">{userInfo?.address}</Text>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Right side - Permissions */}
                {/* <Col xs={24} md={14}>
                    <Card
                        className="rounded-2xl shadow-lg border border-gray-100 max-h-[500px] overflow-scroll"
                        bodyStyle={{ padding: "24px" }}
                    >
                        <Title level={5}>Permissions</Title>
                        <Collapse
                            bordered={false}
                            ghost
                            expandIconPosition="end"
                            className="bg-white"
                        >
                            {Object.entries(permission || {}).map(
                                ([module, perms]) => (
                                    <Panel
                                        header={<span className="font-medium capitalize">{module}</span>}
                                        key={module}
                                    >
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(perms)
                                                ? perms.map((p, i) => (
                                                    <Tag key={i} color="blue" className="!capitalize">
                                                        {p}
                                                    </Tag>
                                                ))
                                                : <Tag color="red">Invalid permission format</Tag>}
                                        </div>
                                    </Panel>
                                )
                            )}
                        </Collapse>
                    </Card>
                </Col> */}
            </Row>
        </div>
    );
};

export default UserInfo;
