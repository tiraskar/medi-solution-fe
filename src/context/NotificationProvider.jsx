import React, { createContext } from 'react';
import { notification } from 'antd';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };

    return (
        <NotificationContext.Provider value={openNotification}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
