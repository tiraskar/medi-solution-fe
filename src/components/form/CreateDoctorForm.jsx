import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const { Option } = Select;

export default function CreateDoctorForm({ onSubmit, selectedDoctor }) {
  const [bio, setBio] = useState("");
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const {loading} = useSelector((state)=>state.doctor)

  // console.log(loading);
  

  const fallbackImage = "https://via.placeholder.com/150";

  useEffect(() => {
    if (selectedDoctor) {
      form.setFieldsValue({
        ...selectedDoctor,
        dob: selectedDoctor.dob ? dayjs(selectedDoctor.dob) : null,
      });
      setBio(selectedDoctor.bio || "");

      if (selectedDoctor.photo) {
        const cleanPhoto = selectedDoctor.photo.replace(/\\/g, "/");
        const photoUrl = `https://kq6rzfx3-5000.inc1.devtunnels.ms/${cleanPhoto}`;
        setFileList([{ url: photoUrl, name: "Doctor Photo", uid: "-1" }]);
      } else {
        setFileList([{ url: fallbackImage, name: "Doctor Photo", uid: "-1" }]);
      }
    } else {
      form.resetFields();
      setBio("");
      setFileList([]);
    }
  }, [selectedDoctor, form]);

  const handleFinish = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "dob" && values.dob) {
        formData.append("dob", values.dob.format("YYYY-MM-DD"));
      } else if (values[key]) {
        formData.append(key, values[key]);
      }
    });
    formData.append("bio", bio || "");

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("photo", fileList[0].originFileObj);
    }

    onSubmit(formData, selectedDoctor ? selectedDoctor.doctor_id : null);
    form.resetFields();
    setBio("");
    setFileList([]);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">
        {selectedDoctor ? "Edit Doctor" : "Create Doctor"}
      </h2>

      <Form layout="vertical" onFinish={handleFinish} form={form}>
        <Row gutter={24}>
          <Col span={6}>
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
          </Col>

          <Col span={18}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Doctor's Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter name" }]}
                >
                  <Input placeholder="Enter doctor's name" />
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
              <Col span={6}>
                <Form.Item label="Date of Birth" name="dob">
                  <DatePicker style={{ width: "100%" }} />
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
            </Row>
          </Col>
        </Row>

        <Form.Item label="Doctor's Bio">
          <ReactQuill value={bio} onChange={setBio} theme="snow" />
        </Form.Item>

        <div className="text-right mt-4">
          <Button type="primary" disabled={loading} htmlType="submit">
            {selectedDoctor ? "Update Doctor" : "Create Doctor"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
