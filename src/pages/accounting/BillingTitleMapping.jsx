import { useEffect } from 'react';
import { BillingTitleMappingForm, BillingTitleMappingTable, UserTable } from '../../components';
import { Button, Typography, Modal, Select, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCreateModelOpen, toggleSelectedBillingTitleMapping, updateSearchFilter } from '../../store/slices/billingTitleSlice';
import { getAllBillingTitleList, getAllLabelList, getBillingTitleMappingList } from '../../api/billingTitle.api';

const BillingTitleMapping = () => {

    const { selectedBillingTitleMapping, searchFilter, isCreateModelOpen } = useSelector((state) => state.billingTitle);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const handleOpen = () => dispatch(toggleCreateModelOpen(true));
    const handleClose = () => {
        form.resetFields();
        dispatch(toggleCreateModelOpen(false));
        dispatch(toggleSelectedBillingTitleMapping(null));
    };

    useEffect(() => {
        dispatch(getBillingTitleMappingList());
        dispatch(getAllBillingTitleList());
        dispatch(getAllLabelList())
    }, [dispatch]);



    const handleChange = (name, value) => {
        dispatch(updateSearchFilter({ name: name, value: value }));
        dispatch(getBillingTitleMappingList());
    };

    return (
        <div>
            <div className='flex justify-between items-center mb-4'>
                <Typography.Title level={2} className='!text-xl'>Billing Title mapping list</Typography.Title>
                <Button type="primary" onClick={handleOpen}>
                    Create billing title mapping
                </Button>
            </div>
            <div className='flex justify-end items-center  gap-2'>
                <label className='text-sm font-medium'>Status:</label>
                <Select
                    value={searchFilter?.searchStatus}
                    onChange={(value) => handleChange('searchStatus', value)}
                    className={`transition-all duration-200 `}
                    dropdownMatchSelectWidth={false} // Optional: prevent dropdown from matching trigger width
                >
                    <Option value={1}>Active</Option>
                    <Option value={0}>Inactive</Option>
                </Select>
            </div>
            {/* Category Table Always Visible */}
            <BillingTitleMappingTable />

            {/* Modal for Form */}
            <Modal
                open={isCreateModelOpen || selectedBillingTitleMapping}
                title={selectedBillingTitleMapping ? 'Update Billing tile mapping' : 'Create billing title mapping'}
                onCancel={handleClose}
                footer={null}
                className='md:!min-w-[50vw]'
            >
                <BillingTitleMappingForm form={form} />
            </Modal>
        </div>
    );
};

export default BillingTitleMapping;
