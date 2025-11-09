import { Form, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { LedgerMappingForm, LedgerMappingTable } from '../../components';
import { toggleCreateModelOpen, toggleSelectedLedgerMapping } from '../../store/slices/accountingSlice';
import { useEffect } from 'react';
import { fetchLedgerMappingPagination, getAllLedgerList } from '../../api/accounting.api';

const LedgerMapping = () => {

    const { isCreateModelOpen, selectedLedgerMapping } = useSelector(state => state.accounting)

    const dispatch = useDispatch();

    const handleCancel = () => {
        dispatch(toggleSelectedLedgerMapping(null));
        dispatch(toggleCreateModelOpen(false));
    }

    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchLedgerMappingPagination());
        dispatch(getAllLedgerList());
    }, [dispatch])


    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">Ledger Mapping</h1>
            </div>

            <LedgerMappingTable />

            <Modal
                title={'Edit Ledger Mapping'}
                open={isCreateModelOpen || selectedLedgerMapping}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <LedgerMappingForm form={form} />
            </Modal>
        </div>
    );
};

export default LedgerMapping;
