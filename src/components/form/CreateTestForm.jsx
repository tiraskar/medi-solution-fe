import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Button, Row, Col } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";

const { Option } = Select;

export default function CreateTestForm({ onSubmit, selectedTest }) {
  const [bio, setBio] = useState("");
  const [form] = Form.useForm();
  const { loading } = useSelector((state) => state.test);

  useEffect(() => {
    if (selectedTest) {
      form.setFieldsValue({
        ...selectedTest,
      });
      setBio(selectedTest.bio || "");
    } else {
      form.resetFields();
      setBio("");
    }
  }, [selectedTest, form]);

  const handleFinish = (values) => {
    // console.log(selectedTest);
    const formData = {
      ...values,
      bio,
      created_by: 1, // you can make this dynamic
      status: 1,
    };

    

    onSubmit(formData, selectedTest ? selectedTest.test_id : null);
    form.resetFields();
    setBio("");
  };

  return (
    <div >
      <h2 className="text-lg font-semibold mb-4">
        {selectedTest ? "Edit Test" : "Create Test"}
      </h2>

      <Form layout="vertical" onFinish={handleFinish} form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Test Name"
              name="test_name"
              rules={[{ required: true, message: "Please enter test name" }]}
            >
              <Input placeholder="Enter test name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Parameters"
              name="parameters"
              rules={[{ required: true, message: "Enter parameters" }]}
            >
              <Input placeholder="Fasting, Post-Meal, etc." />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Low Range"
              name="low_range"
              rules={[{ required: true, message: "Enter low range" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Top Range"
              name="top_range"
              rules={[{ required: true, message: "Enter top range" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Rate"
              name="rate"
              rules={[{ required: true, message: "Enter rate" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Select gender" }]}
            >
              <Select placeholder="Select gender">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Email" name="email">
              <Input type="email" placeholder="Enter email" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Mobile" name="mobile">
              <Input placeholder="Enter mobile number" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Address" name="address">
              <Input.TextArea placeholder="Enter address" rows={2} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Qualification" name="qualification">
              <Input placeholder="e.g. MBBS, Cardiology" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Bio">
          <ReactQuill value={bio} onChange={setBio} theme="snow" />
        </Form.Item>

        <div className="text-right mt-4">
          <Button type="primary" disabled={loading} htmlType="submit">
            {selectedTest ? "Update Test" : "Create Test"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
