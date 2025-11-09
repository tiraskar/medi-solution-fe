import { useEffect } from 'react';
import { BranchForm, BranchTable } from '../../components';
import { Button, Typography, Modal, Select, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCreateUpdateBranchModel, toggleSelectedBranch, updateSearchFilter } from '../../store/slices/masterSlice';
import { getBranchList } from '../../api/master.api';
import { parseUntilNotString } from '../../utils/array';

const { Option } = Select;

const Branch = () => {
    const { selectedBranch, searchFilter, isOpenCreateBranchModel } = useSelector((state) => state.master);
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};

    const handleOpen = () => {
        dispatch(toggleCreateUpdateBranchModel(true));
        dispatch(toggleSelectedBranch(null));
    };

    const handleClose = () => {
        form.resetFields();
        dispatch(toggleCreateUpdateBranchModel(false));
        dispatch(toggleSelectedBranch(null));
    };

    useEffect(() => {
        dispatch(getBranchList());
    }, [dispatch]);

    const handleChange = (name, value) => {
        dispatch(updateSearchFilter({ name, value }));
        dispatch(getBranchList());
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Typography.Title level={2} className="!text-xl !m-0">
                    Branch List
                </Typography.Title>
                <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center'>
                    <div className="flex justify-end items-center gap-2">
                        <label className="text-sm font-medium">Status:</label>
                        <Select
                            value={searchFilter?.searchStatus}
                            onChange={(value) => handleChange('searchStatus', value)}
                            className="transition-all duration-200"
                            dropdownMatchSelectWidth={false}
                        >
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </div>
                    {(permission?.branch?.includes('create') || userInfo?.user_type == 'admin') && <Button type="primary" onClick={handleOpen} className="mt-2 md:mt-0">
                        Create Branch
                    </Button>}
                </div>

            </div>

            {/* Filters */}


            {/* Table */}
            {(permission?.branch?.includes('view') || userInfo?.user_type == 'admin') && <div className="bg-white rounded-xl shadow-md p-4">
                <BranchTable />
            </div>}


            {/* Modal for Form */}
            <Modal
                open={isOpenCreateBranchModel || selectedBranch}
                title={selectedBranch ? 'Update Branch' : 'Create Branch'}
                onCancel={handleClose}
                footer={null}
                className="rounded-xl"
                bodyStyle={{ padding: '24px' }}
            >
                <BranchForm form={form} />
            </Modal>
        </div>
    );
};

export default Branch;
