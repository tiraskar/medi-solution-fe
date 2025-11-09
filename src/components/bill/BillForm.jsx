import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Select,
    Spin,
    Radio,
    Button,
} from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
// import { printInvoice } from '../../store/slices/vehicleInvoiceSlice';
import DailyMemberShipBill from './DailyMembershipBill';
import { adDateToCustomDate } from '../../api';
//eslint-disable-next-line
import { createVehicleInvoice, fetchReceiptNo, getVehicleExpiryDate } from '../../api/vehicleInvoice.api';
import { getAllVehicleList } from '../../api/vehicle.api';
import { getAllBillingTitleList } from '../../api/billingTitle.api';
import { fetchBankLedger } from '../../api/accounting.api';
import { getBranchList } from '../../api/master.api';
import { printInvoice } from '../../store/slices/vehicleInvoiceSlice';
import moment from 'moment/moment';

const { Option } = Select;

const BillingForm = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    // const [receiptNo, setReceiptNo] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const { vehicleListOptions } = useSelector(state => state.vehicle);
    const { billingTitleOptions } = useSelector((state) => state.billingTitle);
    const { bankLedgers } = useSelector((state) => state.accounting);
    const { printInvoiceData, selectedBill, loading, selectedInvoice } = useSelector((state) => state.vehicleInvoice);
    const { economicYear, userInfo } = useSelector((state) => state.auth);
    const { branchList } = useSelector((state) => state.master);
    const userBranch = userInfo?.branchInfo?.branch_id;

    const handlePaymentChange = (e) => {
        const selectedMethod = e.target.value;
        setPaymentMethod(selectedMethod);

        if (selectedMethod !== 'online') {
            form.setFieldsValue({ bank_id: undefined });
        }
    };

    const onFinish = async (values) => {
        try {
            const data = {
                ...values,
                functional_year_id: economicYear.functional_year_id,
            };
            await dispatch(createVehicleInvoice(data)).unwrap()
            // success → clear form
            form.resetFields();
            getReceiptNo();
            getTodayDate();
            userBranch && form.setFieldsValue({ branch_id: userBranch });
        } catch (error) {
            // failure → show error, keep form values
            console.error("Failed to create vehicle invoice:", error);
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
        dispatch(printInvoice(null));
        dispatch(getBranchList()).unwrap().then(() => {
            userBranch && form.setFieldsValue({ branch_id: userBranch });
        });
        dispatch(getAllVehicleList());
        dispatch(getAllBillingTitleList());
        dispatch(fetchBankLedger());
        Promise.all([getReceiptNo(), getTodayDate()]);
    }, [dispatch]);

    useEffect(() => {
        if (selectedInvoice) {
            // Populate form fields with selectedInvoice data
            form.setFieldsValue({
                receipt_no: selectedInvoice.receipt_no,
                bill_date_bs: selectedInvoice.bill_date_bs,
                vehicle_id: selectedInvoice?.vehicleInfo.id,
                billing_title_id: selectedInvoice?.billingInfo?.billing_title_id,
                amount: selectedInvoice.rate,
                remarks: selectedInvoice.remarks,
                payment_method: selectedInvoice.payment_mode,
                bank_id: selectedInvoice.bank_id,
                qrRemarks: selectedInvoice.qrRemarks,
                status: selectedInvoice.status,
                expiry_date_bs: selectedInvoice.expiry_date_bs,
                branch_id: selectedInvoice?.billingInfo.branch_id,
            });

            // Set payment method state for conditional fields
            setPaymentMethod(selectedInvoice.payment_mode);
        } else {
            // If no invoice selected, set defaults
            form.resetFields();
            getTodayDate();
            getReceiptNo();
            setPaymentMethod('cash');
        }
    }, [selectedInvoice]);

    useEffect(() => {
        if (printInvoiceData) {
            // Trigger print
            setTimeout(() => {
                window.print();

                // After print OR cancel, clear data
                window.onafterprint = () => {
                    dispatch(printInvoice(null));
                };
            }, 300); // small delay so print area is ready
        }
    }, [printInvoiceData, dispatch]);




    return (
        <div>
            <div className="no-print">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Spin />
                    </div>
                ) : (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            bill_date: dayjs(),
                            payment_method: 'cash',
                        }}
                        className="tight-form"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                    <Form.Item label="Receipt No" name="receipt_no">
                                    <Input disabled />
                                </Form.Item>
                            </div>

                            <div>
                                <Form.Item
                                    label="Bill Date (BS)"
                                    name="bill_date_bs"
                                    rules={[
                                        { required: true, message: 'Please enter Date BS.' },
                                        {
                                            pattern: /^\d{4}-\d{2}-\d{2}$/,
                                            message: 'Date must be in YYYY-MM-DD format',
                                        },
                                    ]}
                                >
                                    <Input
                                        maxLength={10}
                                        placeholder="e.g., 2081-12-30"
                                        onChange={(e) => {
                                            let raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                                            let year = raw.slice(0, 4);
                                            let month = raw.slice(4, 6);
                                            let day = raw.slice(6, 8);
                                            if (month && parseInt(month) > 12) month = "12";
                                            if (day && parseInt(day) > 32) day = "32";
                                            let formatted = year;
                                            if (month) formatted += `-${month}`;
                                            if (day) formatted += `-${day}`;
                                            form.setFieldsValue({ bill_date_bs: formatted });
                                        }}
                                    />
                                </Form.Item>
                            </div>

                            <div>
                                    <Form.Item
                                        label="Vehicle"
                                        name="vehicle_id"
                                        rules={[{ required: false }]}
                                    >
                                        <Select
                                            placeholder="Select Vehicle"
                                            onChange={(vehicleId) => {
                                                const billingId = form.getFieldValue("billing_title_id");
                                                if (billingId) {
                                                    dispatch(getVehicleExpiryDate({ vehicle_id: vehicleId, billing_title_id: billingId })).unwrap().then((response) => {
                                                        const formattedDate = moment(response).format("YYYY-MM-DD");
                                                        form.setFieldsValue({ expiry_date_bs: formattedDate });
                                                    });
                                                }
                                            }}
                                        >
                                            {vehicleListOptions?.map((v) => (
                                                <Option key={v.id} value={v.id}>
                                                    {v.vehicleNo}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                            </div>

                            <div>
                                <Form.Item
                                    label="Billing Title"
                                    name="billing_title_id"
                                        rules={[{ required: true, message: "Please select a billing title" }]}
                                >
                                    <Select
                                        placeholder="Select billing title"
                                        allowClear
                                            onChange={(billingId) => {
                                            const selected = billingTitleOptions.find(
                                                (billing) => billing.billing_title_id === billingId
                                            );
                                            form.setFieldsValue({ amount: selected?.rate ?? 0 });

                                                const vehicleId = form.getFieldValue("vehicle_id");
                                                if (vehicleId) {
                                                    dispatch(getVehicleExpiryDate({ vehicle_id: vehicleId, billing_title_id: billingId })).unwrap().then((response) => {
                                                        const formattedDate = moment(response).format("YYYY-MM-DD");
                                                        form.setFieldsValue({ expiry_date_bs: formattedDate });
                                                    });
                                                }
                                        }}
                                    >
                                        {billingTitleOptions.map((billing) => (
                                            <Option key={billing.billing_title_id} value={billing.billing_title_id}>
                                                {billing.billing_title}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <div>
                                <Form.Item
                                    label="Amount"
                                    name="amount"
                                    rules={[
                                        { required: true, message: 'Amount is required' },
                                        { pattern: /^\d+(\.\d{1,2})?$/, message: 'Amount must be a number' },
                                    ]}
                                >
                                    <Input
                                        inputMode="decimal"
                                        placeholder="Enter amount"
                                        onChange={e => {
                                            let value = e.target.value;
                                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                e.target.value = value;
                                            } else {
                                                e.target.value = value
                                                    .replace(/[^0-9.]/g, '')
                                                    .replace(/^(\d*\.)(.*)\./, '$1$2')
                                                    .replace(/^(\d+\.\d{2}).*/, '$1');
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </div>

                                <div className="">
                                <Form.Item
                                    label="Remarks"
                                    name="remarks"
                                    rules={
                                        selectedBill
                                            ? [{ required: true, message: 'Remarks are required on update' }]
                                            : []
                                    }
                                >
                                    <Input.TextArea rows={1} placeholder="Enter remarks" />
                                </Form.Item>
                            </div>

                            <div className="">
                                <Form.Item
                                    label="Payment Method"
                                    name="payment_method"
                                    rules={[{ required: true, message: 'Please select payment method' }]}
                                >
                                    <Radio.Group onChange={handlePaymentChange} value={paymentMethod}>
                                            <Radio value="cash">Cash</Radio>
                                            <Radio value="credit">Credit</Radio>
                                            <Radio value="online">QR</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </div>

                                {paymentMethod === 'online' && (
                                <div className='sm:col-span-2 grid sm:grid-cols-2 gap-4'>
                                    <div>
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
                                    </div>
                                    <div>
                                        <Form.Item
                                                label="Payment method Remarks"
                                            name="qrRemarks"
                                            rules={[{ required: true, message: 'QR Remarks are required' }]}
                                        >
                                            <Input.TextArea rows={1} placeholder="Enter QR remarks" />
                                        </Form.Item>
                                    </div>
                                </div>
                            )}
                                <div>
                                    <Form.Item
                                        label="Status"
                                        name="status"
                                        rules={[{ required: true, message: "Please select status" }]}
                                        initialValue={1} // default active
                                    >
                                        <Select placeholder="Select status">
                                            <Option value={1}>Active</Option>
                                            <Option value={0}>Inactive</Option>
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div>
                                    <Form.Item
                                        label="Expiry Date (BS)"
                                        name="expiry_date_bs"
                                        rules={[
                                            { required: true, message: 'Please enter expiry date.' },
                                            {
                                                pattern: /^\d{4}-\d{2}-\d{2}$/,
                                                message: 'Date must be in YYYY-MM-DD format',
                                            },
                                        ]}
                                    >
                                        <Input
                                            maxLength={10}
                                            placeholder="e.g., 2081-12-30"
                                            onChange={(e) => {
                                                let raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                                                let year = raw.slice(0, 4);
                                                let month = raw.slice(4, 6);
                                                let day = raw.slice(6, 8);
                                                if (month && parseInt(month) > 12) month = "12";
                                                if (day && parseInt(day) > 32) day = "32";
                                                let formatted = year;
                                                if (month) formatted += `-${month}`;
                                                if (day) formatted += `-${day}`;
                                                form.setFieldsValue({ expiry_date_bs: formatted });
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                                <div>
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
                                </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                                <Form.Item className="!mt-4 ">
                                    <Button
                                        disabled={loading}
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        {loading ? <Spin /> : selectedBill ? 'Update' : 'Create'}
                                    </Button>
                                    <Button
                                        disabled={loading}
                                        htmlType="button"
                                        onClick={() => {
                                            form.resetFields();
                                            getTodayDate();
                                            getReceiptNo();
                                        }}
                                        className="!ml-2"
                                        danger
                                    >
                                        Cancel
                                    </Button>
                                </Form.Item>
                        </div>
                    </Form>

                )}

            </div>
            {/* Show this only during printing */}
            <div className="print-area absolute top-0 left-0 z-[-1] space-y-2 -ml-40">
                {printInvoiceData && <DailyMemberShipBill />}
                {printInvoiceData && <DailyMemberShipBill />}
            </div>

        </div>
    );
};

export default BillingForm;
