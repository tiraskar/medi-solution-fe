import { Form, Input, Button, Select, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, updateCategory } from '../../api/category.api';
import { useEffect } from 'react';
import { toggleCreateModelOpen, toggleSelectedCategory } from '../../store/slices/categorySlice';

const { Option } = Select;

const CategoryForm = ({form}) => {
    const dispatch = useDispatch();
    const { loading, selectedCategory } = useSelector(state => state.category);

    const onFinish = async (values) => {
        const categoryData = {
            ...values,
            status: values.status === "Active" ? 1 : 0,
        };

        try {
            if (selectedCategory) {
                await dispatch(updateCategory(categoryData)).unwrap();
            } else {
                await dispatch(createCategory(categoryData)).unwrap();
            }
            // ✅ only reset/close on success
            form.resetFields();
        } catch (error) {
            console.error("Failed to save category:", error);
        }
    };



    useEffect(() => {
        form.resetFields();
        if (selectedCategory) {
            form.setFieldsValue({
                status: selectedCategory.status === 1 ? 'Active' : 'Inactive',
                name: selectedCategory.name
            });
        }
    }, [selectedCategory, form])

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'Active' }} className='!space-y-2'>
            <Form.Item
                label="Category Name"
                name="name"
                rules={[{ required: true, message: 'Please enter category name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select the status' }]}>
                <Select>
                    <Option value="Active">Active</Option>
                    <Option value="Inactive">Inactive</Option>
                </Select>
            </Form.Item>

            <Form.Item className="!mt-4 ">
                <Button
                    disabled={loading}
                    type="primary"
                    htmlType="submit"
                >
                    {loading ? <Spin /> : selectedCategory ? 'Update' : 'Create'}
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
                    danger
                >
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CategoryForm;
