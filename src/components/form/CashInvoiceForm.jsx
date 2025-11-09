import { Form, Input, Button, Select, Space, InputNumber } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCashInvoice, updateCashInvoice } from '../../api/cashInvoice.api';
import { adDateToCustomDate, getBranchList } from '../../api/master.api';
import { getAllVehicleList } from '../../api/vehicle.api';
import dayjs from 'dayjs';
import { fetchReceiptNo } from '../../api/vehicleInvoice.api';
import { printCashInvoice, toggleSelectedCashInvoice } from '../../store/slices/cashInvoiceSlice';
import CashReceiptBill from '../bill/CashReceiptBill';

const { Option } = Select;

const CashInvoiceForm = ({ form, onClose }) => {
    const dispatch = useDispatch();
    const { vehicleListOptions } = useSelector(state => state.vehicle);
    const { selectedCashInvoice, loading, printCashInvoiceData } = useSelector(state => state.cashInvoice);
    const { economicYear, userInfo } = useSelector(state => state.auth);
    const { bankLedgers } = useSelector((state) => state.accounting);
    const { branchList } = useSelector((state) => state.master);
    // ✅ Watch payment_method dynamically
    const paymentMethod = Form.useWatch('payment_method', form);
    const userBranch = userInfo?.branchInfo?.id


    const onFinish = async (values) => {
        const payload = {
            ...values,
            bill_date_bs: values.bill_date_bs,
            functional_year_id: economicYear?.functional_year_id,
            // created_by: userInfo?.user_id,
        };

        try {
            if (selectedCashInvoice) {
                await dispatch(
                    updateCashInvoice({ id: selectedCashInvoice.id, ...payload })
                ).unwrap();
            } else {
                await dispatch(createCashInvoice(payload)).unwrap();
            }

            // ✅ Only run these on success
        form.resetFields();
            // getReceiptNo();
        getTodayDate();
            onClose();
        } catch (error) {
            console.error("Failed to save cash invoice:", error);
        }
    };


    const getReceiptNo = () => {
        return dispatch(fetchReceiptNo())
            .unwrap()
            .then((response) => {
                form.setFieldsValue({ receipt_no: response });
            });
    };

    const getTodayDate = () => {
        const today = dayjs().format('YYYY-MM-DD');
        return dispatch(adDateToCustomDate(today))
            .unwrap()
            .then((response) => {
                form.setFieldsValue({ bill_date_bs: response });
            });
    };

    useEffect(() => {
        dispatch(printCashInvoice(null));
        dispatch(getBranchList()).unwrap().then(() => {
            userBranch && form.setFieldsValue({ branch_id: userBranch });
        });
        dispatch(getAllVehicleList());
        Promise.all([
            // getReceiptNo(),
            getTodayDate()]);
    }, [dispatch]);

    useEffect(() => {
        if (printCashInvoiceData) {
            // Setup afterprint handler
            const handleAfterPrint = () => {
                dispatch(printCashInvoice(null));
            };
            window.onafterprint = handleAfterPrint;

            // Trigger print with a slight delay
            const timer = setTimeout(() => {
                window.print();
            }, 300);

            // Cleanup
            return () => {
                clearTimeout(timer);
                window.onafterprint = null;
            };
        }
    }, [printCashInvoiceData, dispatch]);


    useEffect(() => {
        form.resetFields();
        if (selectedCashInvoice) {
            form.setFieldsValue({
                vehicle_id: selectedCashInvoice.vehicle_id,
                bill_date_bs: selectedCashInvoice.bill_date_bs,
                payment_method: selectedCashInvoice.payment_method,
                amount: selectedCashInvoice.amount,
                remarks: selectedCashInvoice.remarks,
                status: selectedCashInvoice.status,
                branch_id: selectedCashInvoice.branch_id
            });
        }
    }, [selectedCashInvoice, form]);

    return (
        <div>
            <div className='no-print'>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    className="tight-form space-y-3 w-full"
                    initialValues={{ status: 1, payment_method: 'cash' }}
                >
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* <Form.Item label="Receipt No" name="receipt_no">
                            <Input disabled />
                        </Form.Item> */}

                        <Form.Item
                            label="Bill Date (BS)"
                            name="bill_date_bs"
                            rules={[{ required: true, message: 'Please enter bill date in BS' }]}
                        >
                            <Input placeholder="YYYY-MM-DD (e.g., 2081-05-15)" />
                        </Form.Item>

                        <Form.Item
                            label="Vehicle"
                            name="vehicle_id"
                            rules={[{ required: true, message: 'Please select a vehicle' }]}
                        >
                            <Select placeholder="Select vehicle" allowClear showSearch optionFilterProp="children">
                                {vehicleListOptions?.map(vehicle => (
                                    <Option key={vehicle.id} value={vehicle.id}>
                                        {vehicle.vehicleNo}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Payment Method"
                            name="payment_method"
                            rules={[{ required: true, message: 'Please select payment method' }]}
                        >
                            <Select placeholder="Select payment method">
                                <Option value="cash">Cash</Option>
                                <Option value="online">Online</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Amount"
                            name="amount"
                            rules={[{ required: true, message: 'Please enter amount' }]}
                        >
                            <InputNumber min={0} step={0.01} className="!w-full" placeholder="Enter amount" />
                        </Form.Item>


                        <Form.Item
                            label="Branch"
                            name="branch_id"
                            rules={[{ required: true, message: "Please select branch" }]}
                        >
                            <Select placeholder="Select a branch" allowClear>
                                {branchList?.map((branch) => (
                                    <Select.Option
                                        key={branch.branch_id}
                                        value={branch.branch_id}
                                    >
                                        {branch.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>


                        {/* <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: 'Please select status' }]}
                        >
                            <Select>
                                <Option value={1}>Active</Option>
                                <Option value={0}>Inactive</Option>
                            </Select>
                        </Form.Item> */}

                        <Form.Item label="Remarks" name="remarks">
                            <Input.TextArea rows={1} placeholder="Enter remarks (optional)" />
                        </Form.Item>

                        {/* ✅ Conditionally show these fields when Online is selected */}
                        {paymentMethod === 'online' && (
                            <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4">
                                <Form.Item
                                    label="Bank"
                                    name="bank_id"
                                    rules={[{ required: true, message: 'Bank is required for QR payment' }]}
                                >
                                    <Select placeholder="Select Bank">
                                        {bankLedgers?.map((b) => (
                                            <Option key={b.id} value={b.id}>
                                                {b.ledgername}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Payment method Remarks"
                                    name="qrRemarks"
                                    rules={[{ required: true, message: 'QR Remarks are required' }]}
                                >
                                    <Input.TextArea rows={1} placeholder="Enter QR remarks" />
                                </Form.Item>
                            </div>
                        )}
                    </div>

                    <Form.Item>
                        <Space className="w-full justify-start mt-4 flex">
                            <Button type="primary" htmlType="submit">
                                {loading ? 'Saving...' : selectedCashInvoice ? 'Update' : 'Create'}
                            </Button>
                            <Button danger htmlType="button" onClick={() => {
                                form.resetFields();
                                dispatch(toggleSelectedCashInvoice(null));
                            }}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>

            </div>
            <div className="print-area absolute top-0 left-0 z-[-1] space-y-2 -ml-40">
                {printCashInvoiceData && <CashReceiptBill />}
                {printCashInvoiceData && <CashReceiptBill />}
            </div>
        </div>
    );
};

export default CashInvoiceForm;
