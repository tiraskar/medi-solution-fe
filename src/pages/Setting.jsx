
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setSettingActiveTab } from '../store/slices/masterSlice';
import UserInfo from '../components/UserInfo';
import ChangePasswordForm from '../components/form/ChangePasswordForm';

const { TabPane } = Tabs;

const Setting = () => {
    const dispatch = useDispatch();
    const { settingActiveTab } = useSelector(state => state.master);

    const handleTabChange = (key) => {
        dispatch(setSettingActiveTab(key));
    };



    return (
        <div className="space-y-6">
            <Tabs
                activeKey={settingActiveTab}
                onChange={handleTabChange}
                type="card"
                size="small"
            >
                <TabPane tab="Profile" key="profile">
                    <UserInfo />
                </TabPane>

                <TabPane tab="Change Password" key="change-password">
                    <ChangePasswordForm />
                </TabPane>
            </Tabs>

        </div>
    );
};

export default Setting;
