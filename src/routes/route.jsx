import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PATH } from "../utils/path";
import {
    Login
} from "../pages";


const AppRoute = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route path={PATH.LOGIN} element={<Login />} />

                {/* Protected Routes */}
                {/* <Route element={<ProtectedLayout />}>
                    <Route path={PATH.SETUP} element={<SharedLayout />}>
                        <Route index path={PATH.SETUP} element={<ProjectSetup />} />
                        <Route path={PATH.DASHBOARD} element={<Dashboard />} />
                        <Route path={PATH.MASTER}>
                            <Route path={PATH.CATEGORY}
                                element={
                                    <PermissionRoute module="category">
                                        <Category />
                                    </PermissionRoute>
                                }
                            />
                            <Route path={PATH.SUB_CATEGORY}
                                element={
                                    <PermissionRoute module="subCategory">
                                        <SubCategory />
                                    </PermissionRoute>
                                }
                            />
                            <Route path={PATH.ECONOMIC_YEAR} element={
                                <PermissionRoute module="economicYear">
                                    <EconomicYear />
                                </PermissionRoute>
                            }
                            />
                            <Route path={PATH.SMS_SETTING} element={
                                <PermissionRoute module="sms">
                                    <SMSSetting />
                                </PermissionRoute>
                            }
                            />
                            <Route path={PATH.BRANCH} element={
                                <PermissionRoute module="branch">
                                    <Branch />
                                </PermissionRoute>
                            }
                            />
                            <Route path={PATH.USERS} element={
                                <PermissionRoute module="user">
                                    <Users />
                                </PermissionRoute>
                            }
                            />
                            <Route path={PATH.USERS_PERMISSION} element={
                                <PermissionRoute module="userPermission">
                                    <UserPermission />
                                </PermissionRoute>
                            }
                            />
                        </Route>
                        <Route path={PATH.ACCOUNTING}>
                            <Route path={PATH.LEDGER} element={
                                <PermissionRoute module="ledger">
                                    <Ledger />
                                </PermissionRoute>
                            }
                            />
                            <Route path={PATH.LEDGER_MAPPING} element={
                                <PermissionRoute module="ledgerMapping">
                                    <LedgerMapping />
                                </PermissionRoute>
                            } />
                            <Route path={PATH.BILLING_TITLE} element={
                                <PermissionRoute module="billingTitle">
                                    <BillingTitle />
                                </PermissionRoute>
                            } />
                            <Route path={PATH.BILLING_TITLE_MAPPING} element={
                                <PermissionRoute module="billingTitleMapping">
                                    <BillingTitleMapping />
                                </PermissionRoute>
                            } />
                            <Route path={PATH.INVOICE} element={
                                <PermissionRoute module="vehicleInvoice">
                                    <VehicleInvoice />
                                </PermissionRoute>
                            } />
                            <Route path={PATH.CASH_INVOICE} element={
                                <PermissionRoute module="cashInvoice">
                                    <CashInvoice />
                                </PermissionRoute>
                            } />
                        </Route>
                        <Route path={PATH.REPORT}>
                            <Route path={PATH.VEHICLE_EXPIRY_REPORT} element={
                                <PermissionRoute module="vehicleExpiryReport">
                                    <VehicleExpiryReport />
                                </PermissionRoute>
                            } />
                            <Route path={PATH.INDIVIDUAL_LEDGER_REPORT} element={
                                <PermissionRoute module="individualLedgerReport">
                                    <IndividualReport />
                                </PermissionRoute>
                            } />
                            <Route path={PATH.VEHICLE_RENEWAL_REPORT} element={
                                <PermissionRoute module="renewalReminderReport">
                                    <RenewalReport />
                                </PermissionRoute>
                            } />
                        </Route>
                        <Route path={PATH.VEHICLE_REGISTRATION} element={
                            <PermissionRoute module="vehicleRegistration">
                                <VehicleRegistration />
                            </PermissionRoute>
                        } />
                        <Route path={PATH.SETTINGS} element={
                            <Setting />
                        } />
                    </Route>
                </Route> */}
                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoute;
