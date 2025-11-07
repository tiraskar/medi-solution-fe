import { useEffect } from 'react';
import { Button, Typography, Modal, Select, Form } from 'antd';
import { SubCategoryForm, SubCategoryTable } from '../../components';
import { fetchSubCategories, getAllCategoriesList } from '../../api/category.api';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCreateModelOpen, toggleSelectedSubCategory, updateSearchFilter } from '../../store/slices/categorySlice';
import { parseUntilNotString } from '../../utils/array';

const SubCategory = () => {
    const { selectedSubCategory, isCreateModelOpen, searchFilter } = useSelector((state) => state.category);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { userInfo } = useSelector(state => state.auth);
    const permission = parseUntilNotString(userInfo?.permissionInfo.permission) || {};

    const handleOpen = () => {
        dispatch(toggleCreateModelOpen(true));
        dispatch(toggleSelectedSubCategory(null));
    };

    const handleClose = () => {
        form.resetFields();
        dispatch(toggleCreateModelOpen(false));
        dispatch(toggleSelectedSubCategory(null));
    };

    useEffect(() => {
        dispatch(fetchSubCategories());
        dispatch(getAllCategoriesList());
    }, [dispatch]);

    const handleChange = (name, value) => {
        dispatch(updateSearchFilter({ name, value }));
        dispatch(fetchSubCategories());
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Typography.Title level={3} className="!text-xl !m-0">
                    Sub Category List
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
                    {
                        (permission?.subCategory?.includes('create') || userInfo?.user_type == 'admin') && <Button type="primary" onClick={handleOpen} className="mt-2 sm:mt-0">
                        Create Sub Category
                        </Button>}
                </div>
            </div>

            {/* Table */}
            {(permission?.subCategory?.includes('view') || userInfo?.user_type == 'admin') && <div className="bg-white rounded-xl shadow-md p-4">
                <SubCategoryTable />
            </div>}

            {/* Modal for Form */}
            <Modal
                open={isCreateModelOpen || selectedSubCategory}
                title={`${selectedSubCategory ? 'Update' : 'Create'} Sub Category`}
                onCancel={handleClose}
                footer={null}
                className="rounded-xl"
                bodyStyle={{ padding: '24px' }}
            >
                <SubCategoryForm form={form} />
            </Modal>
        </div>
    );
};

export default SubCategory;
