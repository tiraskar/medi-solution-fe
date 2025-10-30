import {
    DashboardOutlined,
    SettingOutlined,
    AppstoreOutlined,
    ClusterOutlined,
    BranchesOutlined,
    CalendarOutlined,
    TeamOutlined,
    MessageOutlined,
    AccountBookOutlined,
    SwapOutlined,
    TruckOutlined,
    MoneyCollectFilled,
    MoneyCollectTwoTone,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATH } from '../utils/path';
import { useState, useMemo } from 'react';
import { FaBus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { parseUntilNotString } from '../utils/array';

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState(['master', 'accounting']);

    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};

    const toggleMenu = (menuKey) => {
        setOpenMenus((prev) =>
            prev.includes(menuKey)
                ? prev.filter((m) => m !== menuKey)
                : [...prev, menuKey]
        );
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    // ---------------- Permission-Based Menu Filtering ----------------
    const rawMenuItems = [
        {
            key: PATH.DASHBOARD,
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            module: null,
        },
        {
            key: 'master',
            icon: <AppstoreOutlined />,
            label: 'Master',
            children: [
                { key: PATH.ECONOMIC_YEAR, icon: <CalendarOutlined />, label: 'Economic Year', module: 'economicYear' },
                { key: PATH.CATEGORY, icon: <ClusterOutlined />, label: 'Category', module: 'category' },
                { key: PATH.SUB_CATEGORY, icon: <ClusterOutlined />, label: 'Sub Category', module: 'subCategory' },
                { key: PATH.BRANCH, icon: <BranchesOutlined />, label: 'Branch', module: 'branch' },
                { key: PATH.SMS_SETTING, icon: <MessageOutlined />, label: 'SMS Settings', module: 'sms' },
                { key: PATH.USERS, icon: <TeamOutlined />, label: 'User', module: 'user' },
                { key: PATH.USERS_PERMISSION, icon: <TeamOutlined />, label: 'User Permission', module: 'userPermission' },
            ],
        },
        {
            key: 'accounting',
            icon: <AccountBookOutlined />,
            label: 'Accounting',
            children: [
                { key: PATH.BILLING_TITLE, icon: <AccountBookOutlined />, label: 'Billing Title', module: 'billingTitle' },
                { key: PATH.BILLING_TITLE_MAPPING, icon: <AccountBookOutlined />, label: 'Billing Title Mapping', module: 'billingTitleMapping' },
                { key: PATH.LEDGER, icon: <AccountBookOutlined />, label: 'Ledger', module: 'ledger' },
                { key: PATH.LEDGER_MAPPING, icon: <SwapOutlined />, label: 'Ledger Mapping', module: 'ledgerMapping' },
                { key: PATH.INVOICE, icon: <MoneyCollectFilled />, label: 'Invoice', module: 'vehicleInvoice' },
                { key: PATH.CASH_INVOICE, icon: <MoneyCollectTwoTone />, label: 'Cash Invoice', module: 'cashInvoice' },
            ],
        },
        {
            key: PATH.VEHICLE_REGISTRATION,
            icon: <TruckOutlined />,
            label: 'Vehicle Registration',
            module: 'vehicleRegistration',
        },
        {
            key: PATH.REPORT,
            icon: <AccountBookOutlined />,
            label: 'Report',
            children: [
                {
                    key: PATH.INDIVIDUAL_LEDGER_REPORT,
                    icon: <FaBus />,
                    label: 'Individual Report',
                    module: 'individualLedgerReport',
                },
                {
                    key: PATH.VEHICLE_EXPIRY_REPORT,
                    icon: <FaBus />,
                    label: 'Expiry Report',
                    module: 'vehicleExpiryReport',
                },
                { key: PATH.VEHICLE_RENEWAL_REPORT, icon: <AccountBookOutlined />, label: 'Renewal Report', module: 'renewalReminderReport' },
            ],
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            module: null, // always visible
        },
    ];

    // filter menu items based on user permission
    const menuItems = useMemo(() => {
        // If user_id is 1, return all menu items without filtering
        if (userInfo?.user_id === 1) return rawMenuItems;

        // Otherwise, filter based on permissions
        return rawMenuItems
            .map(item => {
                if (item.children) {
                    const visibleChildren = item.children.filter(child =>
                        !child.module || (permission[child.module]?.length > 0)
                    );
                    if (visibleChildren.length === 0) return null; // hide parent if no children
                    return { ...item, children: visibleChildren };
                }
                if (!item.module) return item; // always visible if module is null
                return permission[item.module]?.length > 0 ? item : null;
            })
            .filter(Boolean);
    }, [permission, userInfo]);


    return (
        <div
            className={`h-screen no-print fixed top-0 left-0 bg-[#3279a8] text-white transition-all duration-200 border-r border-gray-200 z-40 ${collapsed ? 'w-[5.2rem]' : 'w-[12.6rem]'
                }`}
        >
            {/* Logo */}
            <div className="h-16 flex items-center  pl-4 font-bold text-2xl">
                {collapsed ? 'D' : 'Dashboard'}
            </div>

            {/* Menu */}
            <nav className="overflow-y-auto h-[calc(100%-4rem)]">
                {menuItems.map((item) => (
                    <div key={item.key}>
                        {/* Parent Item */}
                        <div
                            className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#28648a] transition-colors ${location.pathname === item.key ? 'bg-[#285a7a]' : ''
                                }`}
                            onClick={() =>
                                item.children
                                    ? toggleMenu(item.key)
                                    : handleNavigate(item.key)
                            }
                        >
                            {item.icon}
                            {!collapsed && <span>{item.label}</span>}
                        </div>

                        {/* Children */}
                        {item.children && openMenus.includes(item.key) && !collapsed && (
                            <div className="ml-5 border-l border-white/20">
                                {item.children.map((child) => (
                                    <div
                                        key={child.key}
                                        className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#28648a] transition-colors ${location.pathname === child.key ? 'bg-[#0e4567] font-semibold' : ''
                                            }`}
                                        onClick={() => handleNavigate(child.key)}
                                    >
                                        {child.icon}
                                        <span>{child.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
