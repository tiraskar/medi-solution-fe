import { useSelector } from "react-redux";
import { organization } from "../../constant/organization";
import { toWords } from "number-to-words";

const DailyMemberShipBill = () => {
    const { printInvoiceData } = useSelector((state) => state.vehicleInvoice);
    const { userInfo } = useSelector((state) => state.auth);

    return (
        <div className="">
            <div className="w-full  border-2 border-dashed  p-6 bg-[#f9e5ea]  transform  rounded-md  relative">
                {/* Header Section */}
                <div className="flex  justify-between items-center">
                    <div className="">
                        <span className="font-bold">दर्ता नं: {organization.registrationNumber}</span>
                        <br />
                        <span className="font-bold">पान नं: {organization.pan}</span>
                    </div>
                    <div>
                        <p className="font-bold">फोन नं : {organization.contact}</p>
                    </div>
                </div>

                <div className="mt-4 space-y-1 text-center">
                    <p className="text-2xl font-bold leading-0">{organization.name}</p>
                    <p className="font-semibold text-lg leading-3">{organization.branch}, {organization.address}</p>
                    <p className="font-bold text-md leading-2">{printInvoiceData?.billingInfo.billing_title} रसिद </p>
                </div>

                <div className="absolute top-16 left-10 ">
                    <img src='/images/logo.png' alt="Logo" className="w-16 h-16 rounded-full" />
                </div>
                <div className="absolute top-12 right-10 ">
                    <img src='/images/qr.png' alt="Logo" className="w-16 h-16 " />
                </div>


                <div className="flex justify-between -mt-5">
                    <p className="text-sm font-bold"> र.नं: {printInvoiceData?.id} </p>
                    <p className="text-sm font-bold">मिति: {printInvoiceData?.invoice_date_bs}</p>
                </div>


                {/* Main Content Grid */}
                <div className="grid grid-cols-2 gap-4 font-semibold ">
                    <div className="col-span-1 space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="w-24 text-sm whitespace-nowrap">गाडीधनि को नाम :</span>
                            <div className="border-b border-black w-full">{printInvoiceData?.vehicleInfo.ownerName}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-24 text-sm whitespace-nowrap">चालकको नाम :</span>
                            <div className="border-b border-black w-full">{printInvoiceData?.vehicleInfo?.drivers[0]?.driverName}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-24 text-sm whitespace-nowrap">सहचालको नाम :</span>
                            <div className="border-b border-black w-full">{printInvoiceData?.vehicleInfo?.operator?.operatorName}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-24 text-sm whitespace-nowrap">जारी मिति :</span>
                            <div className="border-b border-black w-full">{printInvoiceData?.invoice_date_bs}</div>
                        </div>
                    </div>

                    <div className="col-span-1 space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="w-16 text-sm">गाडी नं :</span>
                            <div className="border-b border-black w-full">{printInvoiceData?.vehicleInfo?.vehicleNo}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-16 text-sm">ला.नं.</span>
                            <div className="border-b border-black w-full">{printInvoiceData?.vehicleInfo?.drivers[0]?.licenseNo}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-28 text-sm">हेल्परको नाम :</span>
                            <div className="border-b border-black w-full">{printInvoiceData?.vehicleInfo?.helper?.helperName}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-28 text-sm">समाप्ति मिति :</span>
                            <div className="border-b border-black w-full">{printInvoiceData?.expire_date_bs}</div>
                        </div>
                    </div>
                </div>

                {/* Separator Line */}
                <div className="mt-4  items-center grid grid-cols-12 gap-4 ">
                    <div className="col-span-3 w-full border-2 border-dashed p-2 rounded-3xl"><span className="text-lg font-bold" >रु.</span>{''}<span className="font-bold text-xl ml-2">{printInvoiceData?.rate} </span></div>
                    <div className="col-span-9 flex flex-row items-center min-w-[400px]">
                        <p className=" font-bold">अक्षरुपी</p>
                        <div className="w-full border-b border-black text-lg font-bold text-italic  leading-4 -mt-5 ml-4 capitalize">{printInvoiceData?.rate
                            ? toWords(Number(printInvoiceData.rate))
                            : ""}</div>
                        <p className="inline whitespace-nowrap font-bold">प्राप्त भयो ।</p>
                    </div>
                </div>

                {/* Signature Section */}
                <div className="grid grid-cols-3 gap-8 -mt-3 ">
                    <div></div>
                    <div className="col-span-1 text-center">
                        <div className="border-b border-black  text-white">{'-'}</div>
                        <p className="text-sm mt-1 font-bold">बुझाउनेको सही :</p>
                    </div>
                    <div className="col-span-1 text-center">
                        <div className="border-b border-black ">{userInfo?.name}</div>
                        <p className="text-sm mt-1 font-bold">बुझिलिएको सही :</p>
                    </div>
                </div>

                {/* Note Section */}
                <div className="flex items-baseline">
                    <p className="font-bold ">नोट: </p> &nbsp;
                    <p className="text-start font-semibold">काटिसकेको रसिद फिर्ता हुने छैन । दुर्घटना भएमा यथाशीघ्र रूपमा अनिवार्य रूपमा प्रधान कार्यालयमा लिखित रूपमा दुर्घटनाको जानकारी दिनुहोस् ।</p>
                </div>
            </div>
        </div>
    );
};

export default DailyMemberShipBill;