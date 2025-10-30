import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet, useLocation, useNavigate, } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATH } from '../utils/path';

const { Content } = Layout;

const SharedLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const sidebarWidth = collapsed ? 80 : 200;
    const toggle = () => setCollapsed(!collapsed);
    const { isBranchSetup, isEconomicYearSetUp } = useSelector((state) => state.auth);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (pathname !== PATH.SETUP && (!isEconomicYearSetUp || !isBranchSetup)) {
            navigate(PATH.SETUP);
        }
    }, [isEconomicYearSetUp, isBranchSetup]);


    return (
        <Layout>
            {/* Sidebar */}
            <Sidebar
                sidebarWidth={sidebarWidth}
                collapsed={collapsed}
            />
            {/* Main Layout */}
            <Layout
                style={{
                    transition: 'margin-left 0.2s',
                    minHeight: '100vh',
                }}
            >
                {/* Fixed Header */}
                <Navbar
                    collapsed={collapsed}
                    sidebarWidth={sidebarWidth}
                    toggle={toggle}
                />

                {/* Content */}
                <Content
                    className="p-6 bg-gray-50 overflow-auto"
                    style={{
                        marginTop: 64,
                        height: 'calc(100vh - 64px)',
                        marginLeft: sidebarWidth,
                    }}
                >
                    <Outlet>
                        {children}
                    </Outlet>
                </Content>
            </Layout>
        </Layout>
    );
};

export default SharedLayout;
