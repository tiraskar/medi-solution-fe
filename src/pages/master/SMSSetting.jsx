import React from 'react';
import { SMSForm } from '../../components';

const SMSSetting = () => {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">SMS Settings</h1>
                <p className="text-gray-600 mt-2">Configure SMS gateway settings for notifications</p>
            </div>
            <SMSForm />
        </div>
    );
};

export default SMSSetting; 