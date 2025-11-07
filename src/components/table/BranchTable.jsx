import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useDynamicTableScroll from '../../hook/useDynamicTableScroll';
import { toggleSelectedBranch } from '../../store/slices/masterSlice';
import { tableComponent } from '../report/VehicleExpiryReport';
// import { tableHeadRowComponent } from '../tableHeadRowComponent';

const BranchTable = () => {
    const { branchList } = useSelector(state => state.master);
    const dispatch = useDispatch();

    const scroll = useDynamicTableScroll()

    const columns = [
        {
            title: 'Branch Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                return (
                    <span>{status === 1 ? 'Active' : 'Inactive'}</span>
                );
            }
        }
    ];

    return <Table
        scroll={scroll}
        columns={columns}
        components={tableComponent}
        dataSource={branchList || []}
        rowKey="branch_id"
        pagination={false}
        onRow={(record) => {
            return {
                onClick: () => {
                    dispatch(toggleSelectedBranch(record));
                },
            };
        }}
    />;
};

export default BranchTable;
