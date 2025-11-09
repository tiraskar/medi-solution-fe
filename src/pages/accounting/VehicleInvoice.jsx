import { useEffect } from 'react';
import { VehicleInvoiceForm, VehicleInvoiceTable } from '../../components';
import { Modal, Select, Form, Card, message, } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicleInvoiceList } from '../../api/vehicleInvoice.api';
import { updateSearchFilter } from '../../store/slices/vehicleInvoiceSlice';
import BillingForm from '../../components/bill/BillForm';
import BillingSearch from '../../components/search/BillingSearch';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../utils/path';

const VehicleInvoice = () => {
    const { searchFilter } = useSelector((state) => state.vehicleInvoice);
    const { ledgerMapped } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigation = useNavigate();

    useEffect(() => {
        if (ledgerMapped !== 'All') {
            message.error(`Please do ledger mapping for Ledger: ${ledgerMapped}`);
            setTimeout(() => {
                navigation(PATH.LEDGER_MAPPING);
            }, 500);
        }
        dispatch(fetchVehicleInvoiceList());
    }, [dispatch, ledgerMapped]);

    const handleChange = (name, value) => {
        dispatch(updateSearchFilter({ name, value }));
    };

    return (
        <div>
            <div className='flex flex-col gap-4'>
                <Card title="Create Billing">
                    <BillingForm />
                </Card>
                <Card title="Billing List">
                    <BillingSearch />
                    <VehicleInvoiceTable />
                </Card>

            </div>

            <div className='flex justify-end items-center gap-2'>
                <label className='text-sm font-medium'>Status:</label>
                <Select
                    value={searchFilter?.searchStatus}
                    onChange={(value) => handleChange('searchStatus', value)}
                    dropdownMatchSelectWidth={false}
                >
                    <Select.Option value={1}>Active</Select.Option>
                    <Select.Option value={0}>Inactive</Select.Option>
                </Select>
            </div>
        </div>
    );
};

export default VehicleInvoice;
