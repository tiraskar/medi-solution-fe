import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
  FileExcelOutlined ,
  ExperimentOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PATH } from "../utils/path";
import { useSelector } from "react-redux";
import { parseUntilNotString } from "../utils/array";
import { FaUserInjured } from "react-icons/fa";

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState(["master"]);
  const dropdownRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);
  const permission =
    parseUntilNotString(userInfo?.permissionInfo?.permission) || {};

  // ---------------- Permission-Based Menu Filtering ----------------
  const rawMenuItems = [
    {
      key: PATH.DASHBOARD,
      icon: <DashboardOutlined />,
      label: "Dashboard",
      module: null,
    },
    {
      key: "master",
      icon: <TeamOutlined />,
      label: "Master",
      children: [
        { key: PATH.DOCTORLIST, label: "Doctor" },
        { key: PATH.AGENTLIST, label: "Agent" },
        {key: PATH.PATIENTLIST,label:"patient"}
        // {key: PATH.TESTLIST,label:"patient"}
      ],
    },
    {
      key: "/billing",
      icon: <FileTextOutlined />,
      label: "Billing",
      module: "billing",
    },
    {
      key: "/patients",
      icon: <FaUserInjured />,
      label: "Patients",
      module: "patients",
    },
    {
      key: "/test",
      icon: <ExperimentOutlined />,
      label: "Test",
      module: "test",
    },
    {
      key: "/accounts",
      icon: <UserOutlined />,
      label: "Account",
       children: [
        { key: PATH.TESTBILLING, label: "Billing" },
        { key: PATH.BILLING_TITLE_MAPPING, label: "Billing map" },
        { key: PATH.TESTLIST, label: "Test" },
        { key: PATH.TESTGROUPLIST, label: "TestGroup" },
        {key: PATH.LEDGER,label:"Ledger"},
        {key: PATH.CASH_INVOICE,label:"Cash"},
        {key: PATH.LEDGER_MAPPING,label:"Ledger Maping"},

      ],
    },
     {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
      module: null,
    },
     {
      key:PATH.REPORTS,
      icon: <FileExcelOutlined  />,
      label: "reports",
      module: null,
    },
  ];

  // ---------------- Filter menu items based on user permission ----------------
  const menuItems = useMemo(() => {
    if (userInfo?.user_id === 1) return rawMenuItems; // Super admin sees all

    return rawMenuItems
      .map((item) => {
        if (item.children) {
          const visibleChildren = item.children.filter(
            (child) => !child.module || permission[child.module]?.length > 0
          );
          if (visibleChildren.length === 0) return null;
          return { ...item, children: visibleChildren };
        }
        if (!item.module) return item;
        return permission[item.module]?.length > 0 ? item : null;
      })
      .filter(Boolean);
  }, [permission, userInfo]);

  // ---------------- Menu toggle ----------------
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

  // ---------------- Close dropdown when clicking outside ----------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // You can handle dropdown closing here if needed
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`h-screen no-print fixed top-0 left-0 bg-[#3279a8] text-white transition-all duration-200 border-r border-gray-200 z-40 ${
        collapsed ? "w-[5.2rem]" : "w-[12.6rem]"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center pl-4 font-bold text-2xl">
        {collapsed ? "D" : "Dashboard"}
      </div>

      {/* Menu */}
      <nav className="overflow-y-auto h-[calc(100%-4rem)]">
        {menuItems.map((item) => (
          <div key={item.key}>
            {/* Parent Item */}
            <div
              className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#28648a] transition-colors ${
                location.pathname === item.key ? "bg-[#285a7a]" : ""
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
                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#28648a] transition-colors ${
                      location.pathname === child.key
                        ? "bg-[#0e4567] font-semibold"
                        : ""
                    }`}
                    onClick={() => handleNavigate(child.key)}
                  >
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
