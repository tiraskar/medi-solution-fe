import { useEffect } from 'react';
import { CashInvoiceForm, CashInvoiceTable } from '../../components';
import { Form, Card, message, } from 'antd';
import { useDispatch, useSelector, } from 'react-redux';
import { fetchCashInvoiceList } from '../../api/cashInvoice.api';
import { toggleCreateModalOpen, toggleSelectedCashInvoice } from '../../store/slices/cashInvoiceSlice';
import { getAllVehicleList } from '../../api/vehicle.api';
import { getBranchList } from '../../api/master.api';
import { PATH } from '../../utils/path';
import { useNavigate } from 'react-router-dom';

const CashInvoice = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { ledgerMapped } = useSelector((state) => state.auth);
    const navigation = useNavigate();

    const handleClose = () => {
        form.resetFields();
        dispatch(toggleCreateModalOpen(false));
        dispatch(toggleSelectedCashInvoice(null));
    };


    useEffect(() => {
        if (ledgerMapped !== 'All') {
            message.error(`Please do ledger mapping for Ledger: ${ledgerMapped}`);
            setTimeout(() => {
                navigation(PATH.LEDGER_MAPPING);
            }, 500);
        }
        dispatch(getAllVehicleList());
        dispatch(getBranchList());
        dispatch(fetchCashInvoiceList());
    }, [dispatch, ledgerMapped]);


    return (
        <div className="gap-4">

            <Card title="Cash Invoice" className="shadow-sm">
                <CashInvoiceForm form={form} onClose={handleClose} />
            </Card>
            {/* Cash Invoice List */}
            <Card title="Cash Invoice List" className="shadow-sm">
                <CashInvoiceTable />
            </Card>
        </div>
    );
};

export default CashInvoice;
