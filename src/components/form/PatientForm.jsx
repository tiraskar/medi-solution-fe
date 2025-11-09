import React from "react";
import { Card, Form, Input, Select, DatePicker, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addPatient, updatePatient } from "../../api/patient.api";
import moment from "moment";

const { Option } = Select;

const CreatePatientForm = ({ onSubmit, selectedPatient }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.patient);

  // Populate form when editing
  React.useEffect(() => {
    if (selectedPatient) {
      form.setFieldsValue({
        first_name: selectedPatient.first_name,
        last_name: selectedPatient.last_name,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        contact: selectedPatient.contact,
        disease: selectedPatient.disease,
        doctor_name: selectedPatient.doctor_name,
        appointment_date: selectedPatient.appointment_date
          ? moment(selectedPatient.appointment_date)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [selectedPatient, form]);

  const handleFinish = (values) => {
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      age: values.age,
      gender: values.gender,
      contact: values.contact,
      disease: values.disease,
      doctor_name: values.doctor_name,
      appointment_date: values.appointment_date.format("YYYY-MM-DD"),
    };

    if (selectedPatient) {
      onSubmit(payload, selectedPatient.id);
    } else {
      onSubmit(payload);
    }

    form.resetFields();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <Card title={selectedPatient ? "Edit Patient" : "Register Patient"} className="border-0 shadow-none">
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          labelAlign="left"
          onFinish={handleFinish}
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <Form.Item label="First Name" name="first_name" rules={[{ required: true }]}>
              <Input placeholder="Enter first name" size="large" />
            </Form.Item>
            <Form.Item label="Last Name" name="last_name" rules={[{ required: true }]}>
              <Input placeholder="Enter last name" size="large" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-6">
            <Form.Item label="Age" name="age" rules={[{ required: true }]}>
              <Input type="number" placeholder="Enter age" size="large" />
            </Form.Item>
            <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
              <Select placeholder="Select gender" size="large">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-6">
            <Form.Item label="Contact" name="contact" rules={[{ required: true }, { len: 10 }]}>
              <Input placeholder="Enter contact number" size="large" />
            </Form.Item>
            <Form.Item label="Disease" name="disease" rules={[{ required: true }]}>
              <Input placeholder="Enter disease" size="large" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-6">
            <Form.Item label="Doctor Name" name="doctor_name" rules={[{ required: true }]}>
              <Input placeholder="Enter doctor name" size="large" />
            </Form.Item>
            <Form.Item label="Appointment Date" name="appointment_date" rules={[{ required: true }]}>
              <DatePicker className="w-full" size="large" />
            </Form.Item>
          </div>

          <div className="flex justify-center mt-10">
            <Button type="primary" htmlType="submit" disabled={loading} loading={loading} className="px-10 py-2 rounded-xl">
              {selectedPatient ? "Update Patient" : "Register Patient"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePatientForm;
