
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../api/auth.api';
import { organization } from '../constant/organization';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ collapsed, sidebarWidth, toggle }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            localStorage.clear();
            dispatch(logoutUser());
        } else if (key === 'settings') {
            navigate('/settings');
        }
    };

    const menu = (
        <Menu
            onClick={handleMenuClick}
            className="text-white !no-print rounded-md overflow-hidden !px-0 hover:!bg-white"
            items={[
                {
                    key: 'settings',
                    label: (
                        <div className="flex items-center gap-2 px-4 py-2 hover:bg-[#33779e]  hover:!text-white transition rounded-md">
                            <SettingOutlined /> Settings
                        </div>
                    ),
                },
                {
                    key: 'logout',
                    label: (
                        <div className="flex items-center gap-2 px-4 py-2 hover:bg-[#33779e] hover:!text-white transition rounded-md">
                            <LogoutOutlined /> Logout
                        </div>
                    ),
                },
            ]}
        />
    );


    return (
        <header
            className="fixed no-print top-0 right-0 h-16 bg-[#3279a8] text-white shadow flex items-center justify-between pl-4 pr-6 z-50"
            style={{ left: sidebarWidth }}
        >
            {/* Sidebar toggle button */}
            <div className='flex flex-row gap-4 items-center'>
                <button
                    onClick={toggle}
                    className="text-white hover:text-gray-200 transition-colors cursor-pointer"
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </button>
                <div className="flex flex-row items-center gap-2">
                    <img src='/images/logo.png' alt="Logo" className="w-10 h-10 rounded-full" />
                    <h2 className="text-2xl !font-bold !mt-2">{organization.name}</h2>
                </div>
            </div>



            {/* User dropdown menu */}
            <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
                <Button
                    type="text"
                    className="flex items-center gap-2 !bg-[#055583] !text-white hover:bg-[#33779e] rounded-md  !py-5"
                >
                    <span className="hidden sm:inline">{userInfo?.name || 'User'}</span>
                    <Avatar size="small" icon={<UserOutlined />} />
                </Button>
            </Dropdown>
        </header>
    );
};

export default Navbar;
