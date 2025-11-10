import React, { useEffect } from 'react';
import { Button, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { LedgerForm } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLedger, fetchLedgerPagination } from '../../api/accounting.api';
import LedgerTable from '../../components/table/LedgerTable';
import { toggleCreateModelOpen, toggleSelectedLedger } from '../../store/slices/accountingSlice';

const Ledger = () => {

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { isCreateModelOpen, selectedLedger } = useSelector(state => state.accounting)


    useEffect(() => {
        dispatch(fetchLedgerPagination());
        // dispatch(fetchLedger())
        
    }, [dispatch])

    const handleCancel = () => {
        form.resetFields();
        dispatch(toggleCreateModelOpen(false));
        dispatch(toggleSelectedLedger(null));
    };



    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Ledger Management</h1>
                <p className="text-gray-600 mt-2">Manage accounting ledgers and their configurations</p>
            </div>

            <div className="flex  justify-end pb-2">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => dispatch(toggleCreateModelOpen(true))}
                >
                    Add New Ledger
                </Button>
            </div>

            <LedgerTable />

            <Modal
                title={selectedLedger ? 'Edit Ledger' : 'Add New Ledger'}
                open={isCreateModelOpen || selectedLedger}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <LedgerForm form={form} />
            </Modal>
        </div>
    );
};

export default Ledger;