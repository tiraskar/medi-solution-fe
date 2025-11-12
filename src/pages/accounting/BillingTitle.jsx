import { useEffect } from 'react';
import {  BillingTitleTable } from '../../components';
import { Button, Typography, Modal, Select, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getBillingTitleList } from '../../api/billingTitle.api';
import { toggleCreateModelOpen, toggleSelectedBillingTitle, updateSearchFilter } from '../../store/slices/billingTitleSlice';

const BillingTitle = () => {

    const { selectedBillingTitle, searchFilter, isCreateModelOpen } = useSelector((state) => state.billingTitle);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const handleOpen = () => dispatch(toggleCreateModelOpen(true));
    const handleClose = () => {
        form.resetFields();
        dispatch(toggleCreateModelOpen(false));
        dispatch(toggleSelectedBillingTitle(null));
    };

    useEffect(() => {
        dispatch(getBillingTitleList());
    }, [dispatch]);


    const handleChange = (name, value) => {
        dispatch(updateSearchFilter({ name: name, value: value }));
        dispatch(getBillingTitleList());
    };

    return (
        <div>
            <div className='flex justify-between items-center mb-4'>
                <Typography.Title level={2} className='!text-xl'>Billing Title List</Typography.Title>
                <Button type="primary" onClick={handleOpen}>
                    Create Billing Title
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
            <BillingTitleTable />

            {/* Modal for Form */}
            <Modal
                open={isCreateModelOpen || selectedBillingTitle}
                title={selectedBillingTitle ? 'Update Billing Title' : 'Create Billing Title'}
                onCancel={handleClose}
                footer={null}
                className='md:!min-w-[40vw]'
            >
                {/* <BillingTitleForm form={form} /> */}
            </Modal>
        </div>
    );
};

export default BillingTitle;
