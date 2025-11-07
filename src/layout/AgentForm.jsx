import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  message,
  Row,
  Col,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const AgentForm = () => {
  const [form] = Form.useForm();
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle file upload
  const handleUpload = ({ file }) => {
    const selectedFile = file.originFileObj;
    if (selectedFile) {
      setPhoto(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  // Submit handler
  const handleSubmit = (values) => {
    const data = { ...values, photo };
    console.log("Form Data:", data);
    message.success("Form submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 px-6">
      <Card className="w-full max-w-6xl shadow-lg rounded-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Agent Registration</h1>
          <Button type="primary">Agent List</Button>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-6"
        >
          <Row gutter={[24, 16]}>
            {/* Upload Section */}
            <Col xs={24} md={6} className="flex justify-center">
              <Upload
                beforeUpload={() => false}
                showUploadList={false}
                onChange={handleUpload}
                accept="image/*"
              >
                <div className="w-36 h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <UploadOutlined className="text-2xl text-gray-500" />
                      <span className="text-sm text-gray-600 mt-2">
                        Upload Photo
                      </span>
                    </>
                  )}
                </div>
              </Upload>
              {photo && (
                <p className="text-xs text-gray-600 mt-2 text-center">
                  {photo.name}
                </p>
              )}
            </Col>

            {/* Info Section */}
            <Col xs={24} md={18}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="* Agent Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter name" }]}
                  >
                    <Input placeholder="Enter agent's name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="* Gender"
                    name="gender"
                    rules={[{ required: true, message: "Please select gender" }]}
                  >
                    <Select placeholder="Select gender">
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Date of Birth" name="dob">
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ type: "email", message: "Invalid email" }]}
                  >
                    <Input placeholder="Enter email" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Mobile No" name="mobile">
                    <Input placeholder="Enter mobile number" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Select Role" name="role">
                    <Select placeholder="Select role">
                      <Option value="Senior Agent">Senior Agent</Option>
                      <Option value="Junior Agent">Junior Agent</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Address Section */}
          <Form.Item label="Address" name="address">
            <TextArea rows={3} placeholder="Enter address" />
          </Form.Item>

          {/* Submit Button */}
          <div className="text-right">
            <Button type="primary" htmlType="submit" size="large">
              Save Agent
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AgentForm;
