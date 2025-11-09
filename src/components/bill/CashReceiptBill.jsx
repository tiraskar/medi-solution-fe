import { useSelector } from "react-redux";
import { organization } from "../../constant/organization";
import { toWords } from "number-to-words";

const CashReceiptBill = () => {
    const { printCashInvoiceData } = useSelector((state) => state.cashInvoice);
    const { userInfo } = useSelector(state => state.auth)
    return (
        <div className="">
            <div className="w-full max-w-full border-2 border-dashed p-6 bg-[#f9e5ea]  transform  rounded-md  relative">

                <div className="mt-4 space-y-1 text-center">
                    <p className="text-2xl font-bold leading-0">{organization.name}</p>
                    <p className="font-semibold text-lg leading-3"> {organization.address}</p>
                    <p className="font-bold text-xl leading-2 underline">नगदी रसीद</p>
                </div>
                <div className="absolute top-4 left-6 ">
                    <img src='/images/logo.png' alt="Logo" className="w-16 h-16 rounded-full" />
                </div>
                <div className="absolute top-4 right-10 ">
                    <img src='/images/qr.png' alt="Logo" className="w-16 h-16 " />
                </div>

                <div className="flex justify-between -mt-5">
                    <p className="text-sm font-bold"> रसीद.नं: {printCashInvoiceData?.id} </p>
                    <p className="text-sm font-bold">मिति: {printCashInvoiceData?.bill_date_bs}</p>
                </div>


                {/* Main Content Grid */}
                <div className="grid grid-cols-2 gap-4 font-semibold ">
                    <div className="col-span-1 space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="w-16 text-sm whitespace-nowrap">नाम :</span>
                            <div className="border-b border-black w-full">{printCashInvoiceData?.vehicle?.ownerName}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-16 text-sm">हस्ते:</span>
                            <div className="border-b border-black w-full">{userInfo?.name}</div>
                        </div>

                    </div>

                    <div className="col-span-1 space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="w-16 text-sm whitespace-nowrap">ठेगाना:</span>
                            <div className="border-b border-black w-full">{printCashInvoiceData?.vehicle?.address}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-16 text-sm">वापत:</span>
                            <div className="border-b border-black w-full"></div>
                        </div>

                    </div>
                </div>


                {/* Separator Line */}
                <div className="my-3  items-center  gap-4 ">

                    <div className="flex flex-row items-center  min-w-full">
                        <p className=" font-bold">अक्षरुपी</p>
                        <div className="w-full border-b text-center border-black text-lg font-bold leading-4 -mt-5 ml-4 capitalize">{printCashInvoiceData?.amount
                            ? toWords(parseInt(printCashInvoiceData?.amount))
                            : ""}</div>
                        <p className="inline whitespace-nowrap font-bold">बुझिलिए‌ँ।</p>
                    </div>
                </div>

                {/* Signature Section */}
                <div className="grid grid-cols-3 gap-8 ">
                    <div>
                        <div className="col-span-3 w-full border-2 border-dashed p-2 rounded-3xl"><span className="text-lg font-bold" >रु.</span>{''} <span className="text-xl font-bold ml-2">{printCashInvoiceData?.amount}</span></div>
                    </div>
                    <div className="col-span-1 text-center">
                        <div className="border-b border-black mt-8"></div>
                        <p className="text-sm mt-1 font-bold">बुझाउनेको सही</p>
                    </div>
                    <div className="col-span-1 text-center">
                        <div className="border-b border-black mt-8"></div>
                        <p className="text-sm mt-1 font-bold">बुझिलिएको सही</p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CashReceiptBill;