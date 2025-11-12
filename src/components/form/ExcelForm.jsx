import React from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

export default function ExcelForm({ excelData, onSave, }) {
  const [form] = Form.useForm();

  const initialValues = {
    tests: excelData.slice(1).map((row) => ({
      test_name: row[0]?.value || "",
      parameters: row[1]?.value || "",
      low_range: row[2]?.value || "",
      top_range: row[3]?.value || "",
      rate: row[4]?.value || "",
      gender: row[5]?.value || "",
      email: row[6]?.value || "",
      mobile: row[7]?.value || "",
      address: row[8]?.value || "",
      qualification: row[9]?.value || "",
      bio: row[10]?.value || "",
    })),
  };

  const handleFinish = (values) => {
    console.log(values.tests);
    
    console.log("Updated values:", values.tests);
    onSave(values.tests);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
    >
      {/* Table Header */}
      <Row
        gutter={8}
        style={{
        //   fontWeight: "bold",
          marginBottom: 4,
          borderBottom: "2px solid #000",
          padding: 8,
          background: "#28648a",
           color: "#fff",
            borderRadius: "8px",
            textTransform: "uppercase",
        }}
      >
        <Col span={3}>Test Name</Col>
        <Col span={2}>Parameters</Col>
        <Col span={1}>Low</Col>
        <Col span={1}>Top</Col>
        <Col span={1}>Rate</Col>
        <Col span={2}>Gender</Col>
        <Col span={3}>Email</Col>
        <Col span={2}>Mobile</Col>
        <Col span={3}>Address</Col>
        <Col span={2}>Qualification</Col>
        <Col span={3}>Bio</Col>
        <Col span={1}>Delete</Col>
      </Row>

      {/* Table Body */}
      <Form.List name="tests">
        {(fields, { add, remove }) => (
          <>
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #d9d9d9",
              }}
            >
              {fields.map(({ key, name, ...restField }) => (
                <Row
                  gutter={8}
                  key={key}
                  style={{
                    marginBottom: 0,
                    borderBottom: "1px solid #f0f0f0",
                    padding: "4px 0",
                  }}
                >
                  <Col span={3}>
                    <Form.Item
                      {...restField}
                      name={[name, "test_name"]}
                      rules={[{ required: true, message: "Required" }]}
                      style={{ margin: 0 }}
                    >
                      <Input placeholder="Test Name" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Form.Item {...restField} name={[name, "parameters"]} style={{ margin: 0 }}>
                      <Input placeholder="Parameters" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={1}>
                    <Form.Item {...restField} name={[name, "low_range"]} style={{ margin: 0 }}>
                      <Input placeholder="Low" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={1}>
                    <Form.Item {...restField} name={[name, "top_range"]} style={{ margin: 0 }}>
                      <Input placeholder="Top" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={1}>
                    <Form.Item {...restField} name={[name, "rate"]} style={{ margin: 0 }}>
                      <Input placeholder="Rate" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Form.Item {...restField} name={[name, "gender"]} style={{ margin: 0 }}>
                      <Input placeholder="Gender" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item {...restField} name={[name, "email"]} style={{ margin: 0 }}>
                      <Input placeholder="Email" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Form.Item {...restField} name={[name, "mobile"]} style={{ margin: 0 }}>
                      <Input placeholder="Mobile" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item {...restField} name={[name, "address"]} style={{ margin: 0 }}>
                      <Input placeholder="Address" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Form.Item {...restField} name={[name, "qualification"]} style={{ margin: 0 }}>
                      <Input placeholder="Qualification" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item {...restField} name={[name, "bio"]} style={{ margin: 0 }}>
                      <Input placeholder="Bio" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col
                    span={1}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DeleteOutlined
                      onClick={() => remove(name)}
                      style={{ background: "red",color:"#fff", padding:"5px",borderRadius:"3px", fontSize: 16 }}
                    />
                  </Col>
                </Row>
              ))}
            </div>

            <Form.Item style={{ marginTop: 10 }}>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Test
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

    <Form.Item>
  <div style={{ textAlign: "right" }}>
    <Button type="primary" htmlType="submit">
      Save 
    </Button>
  </div>
</Form.Item>
    </Form>
  );
}
