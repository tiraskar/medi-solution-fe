import { Form, Input, Button, Upload, Card, Select, message, InputNumber } from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBranchList } from "../../api/master.api";
import {
  getAllCategoriesList,
  getSubCategoryByCategory,
} from "../../api/category.api";
import { clearSubCategoryByCategory } from "../../store/slices/categorySlice";
import {
  createVehicleRegistration,
  updateVehicleRegistration,
} from "../../api/vehicle.api";

const RegisterVehicleForm = () => {
  const { categoriesOptions, subCategoryByCategoryOptions } = useSelector(
    (state) => state.category
  );
  const { branchList } = useSelector((state) => state.master);
  const { economicYear, userInfo } = useSelector((state) => state.auth);
  const { editVehicle } = useSelector((state) => state.vehicle);
  const userBranch = userInfo?.branchInfo?.branch_id;
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [isOperatorOpen, setIsOperatorOpen] = useState(false);
  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const [isDriverOpen, setIsDriverOpen] = useState(false);
  const [isGeneralInformationOpen, setIsGeneralInformationOpen] =
    useState(true);

  const formData = {
    vehicleNo: "",
    ownerName: "",
    address: "",
    panNo: "",
    contact: '',
    membershipNo: "",
    registrationDate: "",
    organization: "",
    branchId: "",
    subCategoryId: "",
    subscriptionType: "",
    licensePaper: null,
    insurancePaper: null,
    photo: null,
    bluebookPhoto: null,
    routePermit: null,
    jachPass: null,
    categoryId: "",
    drivers: [
      {
        driverName: "",
        registrationNumber: "",
        panNo: "",
        licenseNo: "",
        photo: null,
        address: "",
      },
    ],
    operator: {
      operatorName: "",
      address: "",
      registrationNumber: "",
      panNo: "",
      photo: null,
    },
    helper: {
      helperName: "",
      address: "",
      registrationNumber: "",
      panNo: "",
      photo: null,
    },
  };

  const handleFinish = async (values) => {
    const getFile = (fileList) => fileList?.[0]?.originFileObj || null;

    const data = {
      ...values,
      photo: getFile(values.photo),
      bluebookPhoto: getFile(values.bluebookPhoto),
      licensePaper: getFile(values.licensePaper),
      insurancePaper: getFile(values.insurancePaper),
      operator: {
        ...values.operator,
        photo: getFile(values.operator?.photo),
      },
      helper: {
        ...values.helper,
        photo: getFile(values.helper?.photo),
      },
      drivers: values.drivers?.map((driver) => ({
        ...driver,
        photo: getFile(driver.photo),
      })),
      functionalYear: economicYear.functional_year_id,
      jachPass: getFile(values.jachPass), 
      routePermit: getFile(values.routePermit),
    };

    // Build FormData
    const formData = new FormData();

    // Append simple fields
    formData.append("ownerName", data.ownerName || "");
    formData.append("address", data.address || "");
    formData.append("vehicleNo", data.vehicleNo || "");
    formData.append("panNo", data.panNo || "");
    formData.append("membershipNo", data.membershipNo || "");
    formData.append("registrationDate", data.registrationDate || "");
    formData.append("categoryId", data.categoryId || "");
    formData.append("subCategoryId", data.subCategoryId || "");
    formData.append("branchId", data.branchId || "");
    formData.append("organization", data.organization || "");
    formData.append("subscriptionType", data.subscriptionType || "");
    formData.append("functionalYear", data.functionalYear);
    formData.append("contact", data.contact);
    // Append files if present
    if (data.photo) formData.append("photo", data.photo);
    if (data.bluebookPhoto)
      formData.append("billBookPhoto", data.bluebookPhoto);
    if (data.licensePaper) formData.append("licensePaper", data.licensePaper);
    if (data.jachPass) formData.append("jachPass", data.jachPass);
    if (data.routePermit) formData.append("routePermit", data.routePermit);
    if (data.insurancePaper)
      formData.append("insurancePaper", data.insurancePaper);

    // Append operator
    formData.append(
      "operator",
      JSON.stringify({
        operatorName: data.operator.operatorName || "",
        address: data.operator.address || "",
        registrationNumber: data.operator.registrationNumber || "",
        panNo: data.operator.panNo || "",
      })
    );
    if (data.operator.photo) {
      formData.append("operatorPhoto", data.operator.photo);
    }

    formData.append(
      "helper",
      JSON.stringify({
        helperName: data.helper.helperName || "",
        address: data.helper.address || "",
        registrationNumber: data.helper.registrationNumber || "",
        panNo: data.helper.panNo || "",
      })
    );

    if (data.helper.photo) formData.append("helperPhoto", data.helper.photo);
    data?.drivers ? data?.drivers?.length > 0 &&
      formData.append(
        "drivers",
        JSON.stringify(
          data?.drivers.map((driver) => ({
            driverName: driver.driverName || "",
            registrationNumber: driver.registrationNumber || "",
            panNo: driver.panNo || "",
            licenseNo: driver.licenseNo || "",
            address: driver.address || "",
          }))
        )
      ) : formData.append("drivers", JSON.stringify([]));

    data?.drivers?.length > 0 &&
      data?.drivers?.forEach((driver, index) => {
        if (driver.photo) {
          formData.append(`driverPhoto[${index}]`, driver.photo);
        }
      });
    try {
      if (editVehicle) {
        await dispatch(updateVehicleRegistration(formData)).unwrap();
      } else {
        await dispatch(createVehicleRegistration(formData)).unwrap();
      }

      // ✅ Reset only on success
      form.resetFields();
    } catch (error) {
      console.error("Vehicle registration save failed:", error);
    }
  };

  useEffect(() => {
    dispatch(getBranchList())
      .unwrap().then(() => {
        userBranch && form.setFieldsValue({ branchId: userBranch });
      });
    dispatch(getAllCategoriesList());
  }, [dispatch]);

  useEffect(() => {
    form.resetFields();
    if (editVehicle) {
      form.setFieldsValue({
        vehicleNo: editVehicle?.vehicleNo,
        ownerName: editVehicle?.ownerName,
        address: editVehicle?.address,
        panNo: editVehicle?.panNo,
        categoryId: editVehicle?.categoryId,
        membershipNo: editVehicle?.membershipNo,
        registrationDate: editVehicle?.registrationDate
          ? editVehicle.registrationDate.split("T")[0]
          : '',
        organization: editVehicle?.organization,
        branchId: editVehicle?.branchId,
        subscriptionType: editVehicle?.subscriptionType,
        licensePaper: null,
        insurancePaper: null,
        photo: null,
        bluebookPhoto: null,
        subCategoryId: editVehicle?.subCategoryId || null,
        jachPass: null,
        routePermit: null,
        contact: editVehicle?.contact || '',
        drivers: editVehicle?.drivers
          ? [
              {
                driverName: editVehicle?.drivers[0]?.driverName,
                registrationNumber: editVehicle?.drivers[0]?.registrationNumber,
                panNo: editVehicle?.drivers[0]?.panNo,
                licenseNo: editVehicle?.drivers[0]?.licenseNo,
              photo: null,
                address: editVehicle?.drivers[0]?.address,
              },
              {
                driverName: editVehicle?.drivers[1]?.driverName,
                registrationNumber: editVehicle?.drivers[1]?.registrationNumber,
                panNo: editVehicle?.drivers[1]?.panNo,
                licenseNo: editVehicle?.drivers[1]?.licenseNo,
                photo: null,
                address: editVehicle?.drivers[1]?.address,
              },
            ]
          : [
              {
                driverName: "",
                registrationNumber: "",
                panNo: "",
                licenseNo: "",
                photo: null,
                address: "",
              },
            ],
        operator: editVehicle?.operator
          ? {
              operatorName: editVehicle?.operator?.operatorName,
              address: editVehicle?.operator?.address,
              registrationNumber: editVehicle?.operator?.registrationNumber,
              panNo: editVehicle?.operator?.panNo,
            photo: null,
            }
          : {
              operatorName: "",
              address: "",
              registrationNumber: "",
              panNo: "",
              photo: null,
            },
        helper: editVehicle?.helper
          ? {
              helperName: editVehicle?.helper?.helperName,
              address: editVehicle?.helper?.address,
              registrationNumber: editVehicle?.helper?.registrationNumber,
              panNo: editVehicle?.helper?.panNo,
            photo: null,
            }
          : {
              helperName: "",
              address: "",
              registrationNumber: "",
              panNo: "",
              photo: null,
            },
      });
    }
  }, [editVehicle]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      initialValues={formData}
      className="tight-form !w-full !space-y-3"
    >
      <Card
        title="General Information"
        extra={
          <Button
            type="text"
            icon={
              isGeneralInformationOpen ? <RightOutlined /> : <DownOutlined />
            }
            onClick={() =>
              setIsGeneralInformationOpen(!isGeneralInformationOpen)
            }
          />
        }
        bodyStyle={{ padding: !isGeneralInformationOpen ? 0 : "24px" }}
      >
        {isGeneralInformationOpen && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Form.Item
                name="ownerName"
                label="Owner Name"
                rules={[{ required: true, message: "Please enter owner name" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please enter address" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="panNo" label="PAN Number">
                <Input />
              </Form.Item>

              <Form.Item
                name="contact"
                label="Contact Number"
                rules={[{ required: true, message: 'Please enter contact number' }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="vehicleNo"
                label="Vehicle Number"
                rules={[
                  { required: true, message: "Please enter vehicle number" },
                ]}
              >
                <Input placeholder="Enter vehicle number" />
              </Form.Item>

              <Form.Item name="membershipNo" label="Membership Number">
                <Input />
              </Form.Item>

              <Form.Item
                label="Category"
                name="categoryId"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select
                  allowClear
                  onChange={(value) => {
                    dispatch(clearSubCategoryByCategory());
                    form.resetFields(["subCategoryId"]);
                    if (value) {
                      dispatch(getSubCategoryByCategory(value));
                    }
                  }}
                  placeholder="Select a category"
                >
                  {categoriesOptions.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Sub category"
                name="subCategoryId"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select placeholder="Select a category" allowClear>
                  {subCategoryByCategoryOptions?.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Branch"
                name="branchId"
                rules={[{ required: true, message: "Please select branch" }]}
              >
                <Select placeholder="Select a branch" allowClear>
                  {branchList?.map((branch) => (
                    <Select.Option
                      key={branch.branch_id}
                      value={branch.branch_id}
                    >
                      {branch.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="organization" label="Organization">
                <Input placeholder="Enter organization name (optional)" />
              </Form.Item>

              <Form.Item
                label="Registration Date (BS)"
                name="registrationDate"
                rules={[
                  { required: true, message: 'Please enter BS start date' },
                  {
                    pattern: /^\d{4}-\d{2}-\d{2}$/,
                    message: 'Date must be in YYYY-MM-DD format',
                  },
                ]}
              >
                <Input
                  maxLength={10}
                  placeholder="e.g., 2081-12-30"
                  onChange={(e) => {
                    let raw = e.target.value.replace(/\D/g, "").slice(0, 8); // only digits, max 8

                    let year = raw.slice(0, 4);
                    let month = raw.slice(4, 6);
                    let day = raw.slice(6, 8);

                    // Apply validation constraints
                    if (month && parseInt(month) > 12) month = "12";
                    if (day && parseInt(day) > 32) day = "32";

                    let formatted = year;
                    if (month) formatted += `-${month}`;
                    if (day) formatted += `-${day}`;

                    form.setFieldsValue({ registrationDate: formatted });
                  }} />
              </Form.Item>
              <Form.Item
                label="Subscription Type"
                name="subscriptionType"
                rules={[
                  {
                    required: true,
                    message: "Please select subscription type",
                  },
                ]}
              >
                <Select placeholder="Select subscription type" allowClear>
                  <Select.Option value="monthly">Monthly</Select.Option>
                  <Select.Option value="yearly">Yearly</Select.Option>
                  <Select.Option value="both">Both</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mt-2">
              <Form.Item
                name="photo"
                label="Photo"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                className="!mt-2"
              >
                <Upload
                  beforeUpload={(file) => {
                    const isValidType =
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/png";
                    if (!isValidType) {
                      message.error("You can only upload JPG/PNG file!");
                      return Upload.LIST_IGNORE;
                    }

                    const isLt200KB = file.size / 1024 <= 200;
                    if (!isLt200KB) {
                      message.error("Image must be smaller than 200KB!");
                      return Upload.LIST_IGNORE;
                    }

                    return false;
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="bluebookPhoto"
                label="Bluebook Photo"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                className="!mt-2"
              >
                <Upload
                  beforeUpload={(file) => {
                    const isValidType =
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/png";
                    if (!isValidType) {
                      message.error("You can only upload JPG/PNG file!");
                      return Upload.LIST_IGNORE;
                    }

                    const isLt200KB = file.size / 1024 <= 200;
                    if (!isLt200KB) {
                      message.error("Image must be smaller than 200KB!");
                      return Upload.LIST_IGNORE;
                    }

                    return false;
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="licensePaper"
                label="License Paper"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList || [])}
              >
                <Upload
                  beforeUpload={(file) => {
                    const isValidType =
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/png";

                    if (!isValidType) {
                      message.error("Only JPG or PNG files are allowed!");
                      return Upload.LIST_IGNORE;
                    }

                    const isLt200KB = file.size / 1024 <= 200;
                    if (!isLt200KB) {
                      message.error("Image must be smaller than 200KB!");
                      return Upload.LIST_IGNORE;
                    }
                    return false; // stop auto upload
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>


              {/* Insurance Paper Upload */}
              <Form.Item
                name="insurancePaper"
                label="Insurance Paper"
                valuePropName="file"
                className="!mt-2"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  beforeUpload={(file) => {
                    const isValidType =
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/png";
                    if (!isValidType) {
                      message.error("Only JPG, PNG, or PDF files are allowed!");
                      return Upload.LIST_IGNORE;
                    }

                    const isLt200KB = file.size / 1024 <= 200;
                    if (!isLt200KB) {
                      message.error("Image must be smaller than 200KB!");
                      return Upload.LIST_IGNORE;
                    }

                    return false; // Prevent auto upload
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="routePermit"
                label="Route Permit"
                valuePropName="file"
                className="!mt-2"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  beforeUpload={(file) => {
                    const isValidType =
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/png";
                    if (!isValidType) {
                      message.error("Only JPG, PNG, or PDF files are allowed!");
                      return Upload.LIST_IGNORE;
                    }

                    const isLt200KB = file.size / 1024 <= 200;
                    if (!isLt200KB) {
                      message.error("Image must be smaller than 200KB!");
                      return Upload.LIST_IGNORE;
                    }

                    return false; // Prevent auto upload
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="jachPass"
                label="Jach Pass"
                valuePropName="file"
                className="!mt-2"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  beforeUpload={(file) => {
                    const isValidType =
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/png";
                    if (!isValidType) {
                      message.error("Only JPG, PNG, or PDF files are allowed!");
                      return Upload.LIST_IGNORE;
                    }

                    const isLt200KB = file.size / 1024 <= 200;
                    if (!isLt200KB) {
                      message.error("Image must be smaller than 200KB!");
                      return Upload.LIST_IGNORE;
                    }

                    return false; // Prevent auto upload
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </div>
          </>
        )}
      </Card>

      <Card
        title="Drivers"
        className=""
        extra={
          <Button
            type="text"
            icon={isDriverOpen ? <RightOutlined /> : <DownOutlined />}
            onClick={() => setIsDriverOpen(!isDriverOpen)}
          />
        }
        bodyStyle={{ padding: !isDriverOpen ? 0 : "24px" }}
      >
        {isDriverOpen && (
          <>
            <Form.List name="drivers">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Card
                      type="inner"
                      title={`Driver ${index + 1}`}
                      key={key}
                      extra={
                        fields.length > 1 ? (
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        ) : null
                      }
                      className="mb-4"
                    >
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                        <Form.Item
                          {...restField}
                          name={[name, "driverName"]}
                          label="Driver Name"
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "registrationNumber"]}
                          label="Registration Number"
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "panNo"]}
                          label="PAN Number"
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "licenseNo"]}
                          label="License Number"
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "address"]}
                          label="Address"
                        >
                          <Input rows={2} />
                        </Form.Item>
                      </div>
                      <Form.Item
                        {...restField}
                        name={[name, "photo"]}
                        label="Photo"
                        valuePropName="file"
                        className="!mt-2"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e?.fileList
                        }
                      >
                        <Upload
                          beforeUpload={(file) => {
                            const isValidType =
                              file.type === "image/jpeg" ||
                              file.type === "image/jpg" ||
                              file.type === "image/png";
                            if (!isValidType) {
                              message.error(
                                "Only JPG, PNG, or PDF files are allowed!"
                              );
                              return Upload.LIST_IGNORE;
                            }

                            const isLt200KB = file.size / 1024 <= 200;
                            if (!isLt200KB) {
                              message.error(
                                "Image must be smaller than 200KB!"
                              );
                              return Upload.LIST_IGNORE;
                            }

                            return false; // Prevent auto upload
                          }}
                          maxCount={1}
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Form.Item>
                    </Card>
                  ))}
                  <Form.Item className="!mt-2">
                    <Button
                      disabled={fields.length === 2}
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Driver
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </>
        )}
      </Card>


      <Card
        title="Operator Details"
        className=""
        extra={
          <Button
            type="text"
            icon={isOperatorOpen ? <RightOutlined /> : <DownOutlined />}
            onClick={() => setIsOperatorOpen(!isOperatorOpen)}
          />
        }
        bodyStyle={{ padding: !isOperatorOpen ? 0 : "24px" }}
      >
        {isOperatorOpen && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
              <Form.Item
                name={["operator", "operatorName"]}
                label="Operator Name"
              >
                <Input />
              </Form.Item>

              <Form.Item name={["operator", "address"]} label="Address">
                <Input />
              </Form.Item>

              <Form.Item
                name={["operator", "registrationNumber"]}
                label="Registration Number"
              >
                <Input />
              </Form.Item>

              <Form.Item name={["operator", "panNo"]} label="PAN Number">
                <Input />
              </Form.Item>
            </div>
            <Form.Item
              name={["operator", "photo"]}
              label="Phone"
              valuePropName="file"
              className="!mt-2"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
              <Upload
                beforeUpload={(file) => {
                  const isValidType =
                    file.type === "image/jpeg" ||
                    file.type === "image/jpg" ||
                    file.type === "image/png";
                  if (!isValidType) {
                    message.error("Only JPG, PNG, or PDF files are allowed!");
                    return Upload.LIST_IGNORE;
                  }

                  const isLt200KB = file.size / 1024 <= 200;
                  if (!isLt200KB) {
                    message.error("Image must be smaller than 200KB!");
                    return Upload.LIST_IGNORE;
                  }

                  return false; // Prevent auto upload
                }}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </>
        )}
      </Card>

      <Card
        title="Helper Details"
        className=""
        extra={
          <Button
            type="text"
            icon={isHelperOpen ? <RightOutlined /> : <DownOutlined />}
            onClick={() => setIsHelperOpen(!isHelperOpen)}
          />
        }
        bodyStyle={{ padding: !isHelperOpen ? 0 : "24px" }}
      >
        {isHelperOpen && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
              <Form.Item name={["helper", "helperName"]} label="Helper Name">
                <Input />
              </Form.Item>

              <Form.Item name={["helper", "address"]} label="Address">
                <Input rows={2} />
              </Form.Item>

              <Form.Item
                name={["helper", "registrationNumber"]}
                label="Registration Number"
              >
                <Input />
              </Form.Item>

              <Form.Item name={["helper", "panNo"]} label="PAN Number">
                <Input />
              </Form.Item>
            </div>
            <Form.Item
              name={["helper", "photo"]}
              label="Phone"
              valuePropName="file"
              className="!mt-2"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
              <Upload
                beforeUpload={(file) => {
                  const isValidType =
                    file.type === "image/jpeg" ||
                    file.type === "image/jpg" ||
                    file.type === "image/png";
                  if (!isValidType) {
                    message.error("Only JPG, PNG, or PDF files are allowed!");
                    return Upload.LIST_IGNORE;
                  }

                  const isLt200KB = file.size / 1024 <= 200;
                  if (!isLt200KB) {
                    message.error("Image must be smaller than 200KB!");
                    return Upload.LIST_IGNORE;
                  }

                  return false; // Prevent auto upload
                }}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </>
        )}
      </Card>

      <div className="flex flex-row items-center gap-3 mt-6 ">
        <Form.Item className="">
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
        <Form.Item className="">
          <Button
            danger
            onClick={() => {
              form.resetFields();
              userBranch && form.setFieldsValue({ branchId: userBranch });
            }}
            type="primary"
            htmlType="button"
            block
            className="!bg-red-500 hover:bg-red-700"
          >
            Cancel
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default RegisterVehicleForm;
