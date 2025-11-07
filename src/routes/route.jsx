import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PATH } from "../utils/path";
import {
    Category, Dashboard, EconomicYear, Login, SubCategory, Users, SMSSetting,
    Ledger, LedgerMapping, Branch,  BillingTitle, BillingTitleMapping,
    VehicleRegistration, VehicleInvoice,
    CashInvoice
} from "../pages";
import ProtectedLayout from "../layout/ProtectedLayout";
import SharedLayout from "../layout/SharedLayout";
import VehicleExpiryReport from "../components/report/VehicleExpiryReport";
import RenewalReport from "../components/report/RenewalReport";
import UserPermission from "../components/permission/UserPermission";
import PermissionRoute from "./PermissionRoute";
import Setting from "../pages/Setting";
import IndividualReport from "../components/report/IndividualReport";
import CreateDoctorForm from "../components/form/CreateDoctorForm";
import PatientForm from "../components/form/PatientForm";
import DoctorList from "../pages/master/DoctorList";
import PatientList from "../pages/master/PatientList";


const AppRoute = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route path={PATH.LOGIN} element={<Login />} />

                {/* Protected Routes */}
                {/* <Route element={<ProtectedLayout />}> */}
                    <Route path={PATH.SETUP} element={<SharedLayout />}>
                        {/* <Route index path={PATH.SETUP} element={<ProjectSetup />} /> */}
                        <Route path={PATH.DASHBOARD} element={<Dashboard />} />
                        <Route path={PATH.MASTER}>
                            <Route path={PATH.CATEGORY}
                                element={
                                    // <PermissionRoute module="category">
                                        <Category />
                                    /* </PermissionRoute> */
                                }
                            />
                             <Route path={PATH.DOCTORLIST}
                                element={
                                    // <PermissionRoute module="category">
                                        <DoctorList />
                                    /* </PermissionRoute> */
                                }
                            />



                                 <Route path={PATH.PATIENTLIST}
                                element={
                                    // <PermissionRoute module="category">
                                        // <PatientForm/>
                                        <PatientList />
                                    /* </PermissionRoute> */
                                }

                            />
                                        <Route path={PATH.DOCTOR} element={<CreateDoctorForm />} />

                            <Route path={PATH.SUB_CATEGORY}
                                element={
                                    // <PermissionRoute module="subCategory">
                                        <SubCategory />
                                    //  </PermissionRoute> 
                                }
                            />
                            <Route path={PATH.ECONOMIC_YEAR} element={
                                // <PermissionRoute module="economicYear">
                                    <EconomicYear />
                                //  </PermissionRoute> 
                            }
                            />
                            <Route path={PATH.SMS_SETTING} element={
                                // <PermissionRoute module="sms">
                                    <SMSSetting />
                                //  </PermissionRoute> 
                            }
                            />
                            <Route path={PATH.BRANCH} element={
                                // <PermissionRoute module="branch">
                                    <Branch />
                                //  </PermissionRoute> 
                            }
                            />
                            <Route path={PATH.USERS} element={
                                // <PermissionRoute module="user">
                                    <Users />
                                //  </PermissionRoute> 
                            }
                            />
                            <Route path={PATH.USERS_PERMISSION} element={
                                // <PermissionRoute module="userPermission">
                                    <UserPermission />
                                //  </PermissionRoute> 
                            }
                            />
                        </Route>
                        <Route path={PATH.ACCOUNTING}>
                            <Route path={PATH.LEDGER} element={
                                // <PermissionRoute module="ledger">
                                    <Ledger />
                                //  </PermissionRoute> 
                            }
                            />
                            <Route path={PATH.LEDGER_MAPPING} element={
                                // <PermissionRoute module="ledgerMapping">
                                    <LedgerMapping />
                                //  </PermissionRoute> 
                            } />
                            <Route path={PATH.BILLING_TITLE} element={
                                // <PermissionRoute module="billingTitle">
                                    <BillingTitle />
                                //  </PermissionRoute> 
                            } />
                            <Route path={PATH.BILLING_TITLE_MAPPING} element={
                                // <PermissionRoute module="billingTitleMapping">
                                    <BillingTitleMapping />
                                //  </PermissionRoute> 
                            } />
                            <Route path={PATH.INVOICE} element={
                                // <PermissionRoute module="vehicleInvoice">
                                    <VehicleInvoice />
                                //  </PermissionRoute> 
                            } />
                            <Route path={PATH.CASH_INVOICE} element={
                                // <PermissionRoute module="cashInvoice">
                                    <CashInvoice />
                                //  </PermissionRoute> 
                            } />
                        </Route>
                        <Route path={PATH.REPORT}>
                            <Route path={PATH.VEHICLE_EXPIRY_REPORT} element={
                                // <PermissionRoute module="vehicleExpiryReport">
                                    <VehicleExpiryReport />
                                //  </PermissionRoute> 
                            } />
                            <Route path={PATH.INDIVIDUAL_LEDGER_REPORT} element={
                                // <PermissionRoute module="individualLedgerReport">
                                    <IndividualReport />
                                //  </PermissionRoute> 
                            } />
                            <Route path={PATH.VEHICLE_RENEWAL_REPORT} element={
                                // <PermissionRoute module="renewalReminderReport">
                                    <RenewalReport />
                                //  </PermissionRoute> 
                            } />
                        </Route>
                        <Route path={PATH.VEHICLE_REGISTRATION} element={
                            // <PermissionRoute module="vehicleRegistration">
                                <VehicleRegistration />
                            //  </PermissionRoute> 
                        } />
                        <Route path={PATH.SETTINGS} element={
                            <Setting />
                        } />
                    </Route>
                {/* </Route> */}
                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoute;
