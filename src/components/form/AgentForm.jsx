import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Upload, Button, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";

const { Option } = Select;

export default function CreateAgentForm({ onSubmit, selectedAgent }) {
  const [bio, setBio] = useState("");
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const { loading } = useSelector((state) => state.agent);

  const fallbackImage = "https://via.placeholder.com/150";

  useEffect(() => {
    if (selectedAgent) {
      form.setFieldsValue({
        ...selectedAgent,
      });
      setBio(selectedAgent.bio || "");

      if (selectedAgent.photo) {
        const cleanPhoto = selectedAgent.photo.replace(/\\/g, "/");
        const photoUrl = `https://kq6rzfx3-5000.inc1.devtunnels.ms/${cleanPhoto}`;
        setFileList([{ url: photoUrl, name: "Agent Photo", uid: "-1" }]);
      } else {
        setFileList([{ url: fallbackImage, name: "Agent Photo", uid: "-1" }]);
      }
    } else {
      form.resetFields();
      setBio("");
      setFileList([]);
    }
  }, [selectedAgent, form]);

  const handleFinish = async (values) => {
    
    const formData = values
    // const formData = new FormData();


    // Object.keys(values).forEach((key) => {
    //   formData.append(key, values[key]);
    // });

    // formData.append("bio", bio || "");
    // formData.append("created_by", 1); // Static created_by for now

    // if (fileList.length > 0 && fileList[0].originFileObj) {
    //   formData.append("photo", fileList[0].originFileObj);
    // }

    console.log(formData);
    

    onSubmit(formData, selectedAgent ? selectedAgent.agent_id : null);
    form.resetFields();
    setBio("");
    setFileList([]);
  };

  return (
    <div className="">
      <h2 className="text-lg font-semibold mb-4">
        {selectedAgent ? "Edit Agent" : "Create Agent"}
      </h2>

      <Form layout="vertical" onFinish={handleFinish} form={form}>
        <Row gutter={24} style={{ width: "65vw" }}>
          {/* <Col span={6}>
            <Form.Item label="Upload Photo" name="photo">
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              >
                {fileList.length < 1 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col> */}

          <Col span={18}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Agent Name"
                  name="agent_name"
                  rules={[{ required: true, message: "Please enter agent name" }]}
                >
                  <Input placeholder="Enter agent name" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Parameters"
                  name="parameters"
                  rules={[{ required: true, message: "Please enter parameters" }]}
                >
                  <Input placeholder="Enter parameters (e.g. Fasting, Post-Meal)" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label="Low Range"
                  name="low_range"
                  rules={[{ required: true, message: "Enter low range" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 70" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label="Top Range"
                  name="top_range"
                  rules={[{ required: true, message: "Enter top range" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 140" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label="Rate"
                  name="rate"
                  rules={[{ required: true, message: "Enter rate" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 30.0" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label="Gender"
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

              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input type="email" placeholder="Enter email" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Mobile No" name="mobile">
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
                  <Input placeholder="Enter qualification (e.g. MBBS, Cardiology)" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Form.Item label="Bio">
          <ReactQuill value={bio} onChange={setBio} theme="snow" />
        </Form.Item>

        <div className="text-right mt-4">
          <Button type="primary" disabled={loading} htmlType="submit">
            {selectedAgent ? "Update Agent" : "Create Agent"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
