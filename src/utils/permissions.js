
export const modulePermissions = {
    economicYear: ["create", "view", "update", "delete"],
    category: ["create", "view", "update", "delete"],
    subCategory: ["create", "view", "update", "delete"],
    branch: ["create", "view", "update", "delete"],
    user: ["create", "view", "update", "delete"],
    userPermission: ["create", "view", "update", "delete"],
    accounting: ["create", "view", "update", "delete"],
    billingTitle: ["create", "view", "update", "delete"],
    billingTitleMapping: ["create", "view", "update", "delete"],
    ledger: ["create", "view", "update", "delete"],
    ledgerMapping: ["create", "view", "update", "delete"],
    vehicleInvoice: ["create", "view", "update", "delete"],
    cashInvoice: ["create", "view", "update", "delete"],
    vehicleRegistration: ["create", "view", "update", "delete"],
    report: ["create", "view", "update", "delete"],
    sms: ["create", "update", "view"], // no delete
    vehicleExpiryReport: ["view",],
    renewalReminderReport: ["view",],
    individualLedgerReport: ["view",],
};