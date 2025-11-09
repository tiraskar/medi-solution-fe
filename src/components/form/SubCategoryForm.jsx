import { Form, Input, Button, Select, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createSubCategory, updateSubCategory } from '../../api/category.api';
import { useEffect } from 'react';
import { toggleCreateModelOpen, toggleSelectedCategory } from '../../store/slices/categorySlice';

const { Option } = Select;

const SubCategoryForm = ({ form }) => {
    const dispatch = useDispatch();
    const { loading, selectedSubCategory, categoriesOptions } = useSelector(state => state.category);

    const onFinish = async (values) => {
        const categoryData = {
            ...values,
            status: values.status === "Active" ? 1 : 0,
        };

        try {
            if (selectedSubCategory) {
                await dispatch(updateSubCategory(categoryData)).unwrap();
            } else {
                await dispatch(createSubCategory(categoryData)).unwrap();
            }

            // ✅ Reset form only on success
            form.resetFields();
        } catch (error) {
            console.error("Failed to save sub-category:", error);
        }
    };



    useEffect(() => {
        form.resetFields();
        if (selectedSubCategory) {
            form.setFieldsValue({
                status: selectedSubCategory.status === 1 ? 'Active' : 'Inactive',
                name: selectedSubCategory.name,
                categoryId: selectedSubCategory.categoryId
            });
        }
    }, [selectedSubCategory, form])

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'Active' }} className='!space-y-2'>
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter category name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Category"
                name="categoryId"
                rules={[{ required: true, message: 'Please select category' }]}
            >
                <Select placeholder="Select a category" allowClear>
                    {categoriesOptions.map((cat) => (
                        <Select.Option key={cat.id} value={cat.id}>
                            {cat.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>


            <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select the status' }]}>
                <Select>
                    <Option value="Active">Active</Option>
                    <Option value="Inactive">Inactive</Option>
                </Select>
            </Form.Item>

            <Form.Item className="!mt-4">
                <Button
                    disabled={loading}
                    type="primary"
                    htmlType="submit"
                >
                    {loading ? <Spin /> : selectedSubCategory ? 'Update' : 'Create'}
                </Button>
                <Button
                    disabled={loading}
                    htmlType="button"
                    onClick={() => {
                        form.resetFields();
                        dispatch(toggleSelectedCategory(null));
                        dispatch(toggleCreateModelOpen(true));
                    }}
                    className="!ml-2"
                >
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SubCategoryForm;
