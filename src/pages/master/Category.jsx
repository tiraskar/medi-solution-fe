import { useEffect } from 'react';
import { CategoryForm, CategoryTable } from '../../components';
import { Button, Typography, Modal, Select, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../api/category.api';
import { toggleCreateModelOpen, toggleSelectedCategory, updateSearchFilter } from '../../store/slices/categorySlice';
import { parseUntilNotString } from '../../utils/array';

const { Option } = Select;

const Category = () => {
    const { selectedCategory, searchFilter, isCreateModelOpen } = useSelector((state) => state.category);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleOpen = () => dispatch(toggleCreateModelOpen(true));

    const handleClose = () => {
        form.resetFields();
        dispatch(toggleCreateModelOpen(false));
        dispatch(toggleSelectedCategory(null));
    };

    const handleChange = (name, value) => {
        dispatch(updateSearchFilter({ name, value }));
        dispatch(fetchCategories());
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Typography.Title level={2} className="!text-xl !m-0">
                    Category List
                </Typography.Title>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Status:</label>
                        <Select
                            value={searchFilter?.searchStatus}
                            onChange={(value) => handleChange('searchStatus', value)}
                            className="w-36"
                            dropdownMatchSelectWidth={false}
                        >
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </div>
                    {(permission?.category?.includes('create') || userInfo?.user_type == 'admin') && <Button type="primary" onClick={handleOpen} className="mt-2 sm:mt-0">
                        Create Category
                    </Button>}
                </div>
            </div>

            {/* Table */}
            {(permission?.category?.includes('view') || userInfo?.user_type == 'admin') &&
            <div className="bg-white rounded-xl shadow-md p-4">
                    <CategoryTable />
            </div>
            }

            {/* Modal for Form */}
            <Modal
                open={isCreateModelOpen || selectedCategory}
                title={selectedCategory ? 'Update Category' : 'Create Category'}
                onCancel={handleClose}
                footer={null}
                className="rounded-xl"
                bodyStyle={{ padding: '24px' }}
                
            >
                <CategoryForm form={form} onFinishCallback={handleClose} />
            </Modal>
        </div>
    );
};

export default Category;
