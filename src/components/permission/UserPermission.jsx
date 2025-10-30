import { useEffect, useState } from "react";
import { Table, Checkbox, Spin, Button, Card, Row, Col, Divider, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUserPermission, getUsersList, saveUserPermission } from "../../api/master.api";
import { modulePermissions } from "../../utils/permissions";
import { tableComponent } from "../report/VehicleExpiryReport";
import { parseUntilNotString } from "../../utils/array";

const { Option } = Select;


const permissionLabels = {
    create: "Create",
    view: "View",
    update: "Edit",
    delete: "Delete",
};

function UserPermission() {
    const { usersList, userPermission, loading } = useSelector((state) => state.master);
    const { userInfo } = useSelector(state => state.auth);
    const [selectedUser, setSelectedUser] = useState("");
    const [permission, setPermission] = useState({});
    const dispatch = useDispatch();

    const handleCheckboxChange = (module, action, checked) => {
        setPermission((prev) => {
            const prevModule = prev[module] || [];
            return {
                ...prev,
                [module]: checked
                    ? [...new Set([...prevModule, action])]
                    : prevModule.filter((a) => a !== action),
            };
        });
    };

    const handleModuleSelectAll = (module, checked) => {
        setPermission((prev) => ({
            ...prev,
            [module]: checked ? modulePermissions[module] : [],
        }));
    };

    const handleGlobalSelectAll = (checked) => {
        if (checked) {
            const all = {};
            Object.keys(modulePermissions).forEach((m) => {
                all[m] = modulePermissions[m];
            });
            setPermission(all);
        } else {
            setPermission({});
        }
    };

    const handleSubmit = () => {
        if (!selectedUser) return;
        dispatch(saveUserPermission({ userId: selectedUser, data: { ...permission } }));
        // .unwrap().then(() => {
        //     window.location.reload();
        // })
    };

    useEffect(() => {
        if (userPermission) {
            const permission = parseUntilNotString(userPermission.permission);
            setPermission(permission);
        }
    }, [userPermission]);

    useEffect(() => {
        dispatch(getUsersList());
    }, [dispatch]);

    // Build table data
    const dataSource = Object.keys(modulePermissions).map((module) => ({
        key: module,
        module,
    }));

    // Build table columns dynamically
    const permissionTypes = Array.from(new Set(Object.values(modulePermissions).flat()));

    const columns = [
        {
            title: "Module",
            dataIndex: "module",
            key: "module",
            width: '20%',
            render: (text, record) => {
                const allSelected =
                    permission[record.module]?.length ===
                    modulePermissions[record.module].length;
                const indeterminate =
                    (permission[record.module]?.length || 0) > 0 && !allSelected;

                return (
                    <div className="flex items-center justify-between">
                        <span>{text.charAt(0).toUpperCase() + text.slice(1)}</span>
                        <Checkbox
                            disabled={!selectedUser}
                            checked={allSelected}
                            indeterminate={indeterminate}
                            onChange={(e) =>
                                handleModuleSelectAll(record.module, e.target.checked)
                            }
                        />
                    </div>
                );
            },
        },
        ...permissionTypes.map((perm) => ({
            title: permissionLabels[perm] || perm,
            dataIndex: perm,
            key: perm,
            align: "center",
            render: (_, record) => {
                if (!modulePermissions[record.module].includes(perm)) return null;

                return (
                    <Checkbox
                        disabled={!selectedUser}
                        checked={permission[record.module]?.includes(perm)}
                        onChange={(e) =>
                            handleCheckboxChange(record.module, perm, e.target.checked)
                        }
                    />
                );
            },
        })),
    ];

    return (
        <Spin spinning={loading}>
            <Card title="User Permission Management" className="m-3 shadow-lg">
                {/* User Selector */}
                <Row gutter={[16, 16]} align="middle" className="mb-4">
                    <Col span={6}>
                        <label>
                            <strong>Select User</strong>
                        </label>
                    </Col>
                    <Col span={12}>
                        <Select
                            disabled={userInfo?.user_type !== 'admin'}
                            style={{ width: "100%" }}
                            placeholder="Select a user"
                            value={selectedUser || undefined}
                            onChange={(value) => {
                                setSelectedUser(value);
                                setPermission({});
                                if (value) dispatch(getUserPermission(value));
                            }}
                            allowClear
                        >
                            {usersList.map((user) => (
                                <Option key={user.user_id} value={user.user_id}>
                                    {user.username}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>

                <Divider />

                {/* Global Select All */}
                <Row gutter={[16, 16]} className="mb-4">
                    <Col span={24}>
                        <Checkbox
                            disabled={!selectedUser}
                            checked={Object.keys(modulePermissions).every(
                                (m) => permission[m]?.length === modulePermissions[m].length
                            )}
                            indeterminate={Object.keys(modulePermissions).some(
                                (m) =>
                                    (permission[m]?.length || 0) > 0 &&
                                    permission[m]?.length < modulePermissions[m].length
                            )}
                            onChange={(e) => handleGlobalSelectAll(e.target.checked)}
                        >
                            Select All Permissions
                        </Checkbox>
                    </Col>
                </Row>

                {/* Permission Table */}
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    components={tableComponent}
                    pagination={false}
                    bordered
                />

                <Divider />

                {/* Save Button */}
                <Row justify="end">
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        disabled={!selectedUser}
                    >
                        Save Permissions
                    </Button>
                </Row>
            </Card>
        </Spin>
    );
}

export default UserPermission;
