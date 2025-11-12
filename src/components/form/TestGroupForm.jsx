import React, { useEffect } from 'react';
import { Form, Input, Button, Select, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTests } from '../../api/test.api';
import { addTestGroup, updateTestGroup } from '../../api/testgroup.api';

const { Option } = Select;

const TestGroupForm = ({ form, selectedGroup }) => {
    const dispatch = useDispatch();
    const { tests, isModalOpen } = useSelector(state => state.test);
    // const {  selectedGroup  } = useSelector(state => state.testGroup);

    useEffect(() => {
        dispatch(fetchTests()); // fetch all tests for selection
    }, [dispatch]);

    // console.log(selectedGroup);
    

    useEffect(() => {
        if (selectedGroup) {
            form.setFieldsValue({
                group_name: selectedGroup.group_name,
                test_ids: selectedGroup.tests?.map(t => t.test_id),
                status: selectedGroup.status === 1,
            });
        } else {
            form.resetFields();
        }
    }, [selectedGroup, form]);

    const onFinish = (values) => {
        const payload = {
            group_name: values.group_name,
            test_ids: values.test_ids,
            status: values.status ? 1 : 0,
        };

        if (selectedGroup) {
            dispatch(updateTestGroup({ id: selectedGroup.group_id, data: payload }));
            dispatch(isModalOpen(false))
        } else {
            dispatch(addTestGroup(payload));
            dispatch(isModalOpen(false))

        }
        form.resetFields();
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ status: true }}
        >
            <Form.Item
                label="Group Name"
                name="group_name"
                rules={[{ required: true, message: 'Please enter group name' }]}
            >
                <Input placeholder="Enter test group name" />
            </Form.Item>

            <Form.Item
                label="Select Tests"
                name="test_ids"
                rules={[{ required: true, message: 'Please select at least one test' }]}
            >
                <Select
                    mode="multiple"
                    placeholder="Select tests"
                    allowClear
                >
                    {tests?.map(test => (
                        <Option key={test.test_id} value={test.test_id}>
                            {test.test_name} ({test.parameters})
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Status"
                name="status"
                valuePropName="checked"
            >
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {selectedGroup ? 'Update Group' : 'Create Group'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default TestGroupForm;
