import React, { useEffect } from 'react';
import { Button, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestGroups } from '../../api/testgroup.api';
import TestGroupTable from '../../components/table/TestGroupTable';
import TestGroupForm from '../../components/form/TestGroupForm';
import { toggleCreateModal, toggleSelectedGroup } from '../../store/slices/testGroupSlice';

const TestGroupList = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { isModalOpen, selectedGroup  } = useSelector(state => state.testGroup);

    console.log(selectedGroup);
    
    useEffect(() => {
        dispatch(fetchTestGroups());
    }, [dispatch]);

    const handleCancel = () => {
        form.resetFields();
        dispatch(toggleCreateModal(false));
        dispatch(toggleSelectedGroup(null));
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Test Group Management</h1>
                <p className="text-gray-600 mt-2">Manage test groups and their included tests</p>
            </div>

            <div className="flex justify-end pb-2">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => dispatch(toggleCreateModal(true))}
                >
                    Add New Test Group
                </Button>
            </div>

            <TestGroupTable />

            <Modal
                title={selectedGroup ? 'Edit Test Group' : 'Add New Test Group'}
                open={isModalOpen || selectedGroup}
                onCancel={handleCancel}
                footer={null}
                width={700}
            >
                <TestGroupForm form={form} selectedGroup={selectedGroup} />
            </Modal>
        </div>
    );
};

export default TestGroupList;
