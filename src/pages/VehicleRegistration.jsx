
import { Modal, Tabs } from 'antd';
import { RegisteredVehicleTable, RegisterVehicleForm, VehicleDetails } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab, toggleSelectedVehicle } from '../store/slices/vehicleSlice';
import { useEffect } from 'react';
import { getAllVehicleRegistration } from '../api/vehicle.api';
import { parseUntilNotString } from '../utils/array';

const { TabPane } = Tabs;

const VehicleRegistration = () => {
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};
    const dispatch = useDispatch();
    const { activeTab, selectedVehicle } = useSelector(state => state.vehicle);

    const handleTabChange = (key) => {
        dispatch(setActiveTab(key));
    };


    useEffect(() => {
        dispatch(getAllVehicleRegistration());
    }, [dispatch])


    return (
        <div className="space-y-6">
            <Modal
                className='!min-w-[80vw]'
                open={!!selectedVehicle}
                onCancel={() => dispatch(toggleSelectedVehicle(null))}
                footer={null}
            >
                <VehicleDetails data={selectedVehicle} />
            </Modal>
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                type="card"
                size="small"
            >
                {
                    (permission?.vehicleRegistration?.includes('view') || userInfo?.user_type == 'admin') && <TabPane tab="Registered Vehicles List" key="list">
                    <RegisteredVehicleTable />
                    </TabPane>}

                {
                    (permission?.vehicleRegistration?.includes('create') || userInfo?.user_type == 'admin') && <TabPane tab="Create Vehicle registration" key="create">
                    <RegisterVehicleForm />
                    </TabPane>}
            </Tabs>

        </div>
    );
};

export default VehicleRegistration;
