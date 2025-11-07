import { Modal, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubCategory, fetchSubCategories } from '../../api/category.api';
import { toggleSelectedSubCategory, updatePagination } from '../../store/slices/categorySlice';
import useDynamicTableScroll from '../../hook/useDynamicTableScroll';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { tableComponent } from '../report/VehicleExpiryReport';
import { parseUntilNotString } from '../../utils/array';
// import { tableHeadRowComponent } from '../tableHeadRowComponent';


const SubCategoryTable = () => {
    const { subCategories, pagination } = useSelector(state => state.category);
    const dispatch = useDispatch();
    const handleEdit = (record) => {
        dispatch(toggleSelectedSubCategory(record));
    };
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};
    const scroll = useDynamicTableScroll();

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this sub category?',
            icon: <ExclamationCircleOutlined />,
            content: `Sub Category: ${record.name}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteSubCategory(record));
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
            title: 'Subcategory Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <span style={{ display: 'flex', gap: '12px' }}>
                    {(permission?.subCategory?.includes('update') || userInfo?.user_type == 'admin') && <EditOutlined
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(record);
                        }}
                        className='!bg-blue-500 p-2 rounded-md !text-white'
                    />}
                    {(permission?.subCategory?.includes('delete') || userInfo?.user_type == 'admin') && <DeleteOutlined
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
            dataSource={subCategories || []}
            components={tableComponent}
            rowKey="id"
            pagination={{
                showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} entries`,
                current: pagination.page,
                pageSize: pagination.limit,
                total: pagination.total,
                showSizeChanger: true,
                onChange: (page, limit) => {
                    dispatch(updatePagination({ page, limit }));
                    dispatch(fetchSubCategories());
                },
            }}
            onRow={(record) => {
                return {
                    onClick: () => {
                        handleEdit(record);
                    },
                };
            }}
            size='small'
            scroll={scroll}
        />
    );
};

export default SubCategoryTable;
