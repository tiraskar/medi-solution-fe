import { Table, Modal } from 'antd';

import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSelectedCategory, updatePagination } from '../../store/slices/categorySlice';
import { deleteCategory, fetchCategories } from '../../api/category.api';
import useDynamicTableScroll from '../../hook/useDynamicTableScroll';
import { tableComponent } from '../report/VehicleExpiryReport';
import { parseUntilNotString } from '../../utils/array';
// import { tableHeadRowComponent } from '../tableHeadRowComponent';

const CategoryTable = () => {
    const { categories, pagination } = useSelector((state) => state.category);
    const dispatch = useDispatch();
    const scroll = useDynamicTableScroll();

    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};

    const handleEdit = (record) => {
        dispatch(toggleSelectedCategory(record));
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this category?',
            icon: <ExclamationCircleOutlined />,
            content: `Category: ${record.name}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteCategory(record));
            },
        });
    };


    const columns = [
        {
            title: 'SN',
            key: 'sn',
            width: 80,
            render: (text, record, index) => {
                // Calculate global SN if pagination is used
                const currentPage = pagination?.page || 1;
                const pageSize = pagination?.limit || 10;
                return (currentPage - 1) * pageSize + index + 1;
            },
        },
        {
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span>{status === 1 ? 'Active' : 'Inactive'}</span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <span style={{ display: 'flex', gap: '12px' }}>
                    {(permission?.category?.includes('update') || userInfo?.user_type == 'admin') && <EditOutlined
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering onRow click
                            handleEdit(record);
                        }}
                        className='!bg-blue-500 p-2 rounded-md !text-white'
                    />}
                    {(permission?.category?.includes('delete') || userInfo?.user_type == 'admin') && <DeleteOutlined
                        style={{ color: '#ff4d4f', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record);
                        }}
                        className='!bg-red-500 p-2 rounded-md !text-white'
                    />}
                </span>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={categories}
            components={tableComponent}
            rowKey="id"
            onRow={(record) => {
                return {
                    onClick: () => {
                        dispatch(toggleSelectedCategory(record));
                    },
                };
            }}
            scroll={scroll}
            pagination={{
                showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} entries`,
                current: pagination.page,
                pageSize: pagination.limit,
                total: pagination.total,
                showSizeChanger: true,
                onChange: (page, limit) => {
                    dispatch(updatePagination({ page, limit }));
                    dispatch(fetchCategories());
                },
            }}
            size="medium"
            
        />
    );
};

export default CategoryTable;
