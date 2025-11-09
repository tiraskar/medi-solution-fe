import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Popconfirm, Modal, Input, Avatar } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  getAllAgents,
  deleteAgent,
  addAgent,
  updateAgent,
  getSearchAgents,
} from "../../api/agent.api";

import CreateAgentForm from "../../components/form/AgentForm";
import { tableComponent } from "../../components/report/VehicleExpiryReport";
import useDynamicTableScroll from "../../hook/useDynamicTableScroll";
import {
  updateSearchFilter,
  updatePagination,
} from "../../store/slices/agentSlice";

const { Search } = Input;

export default function AgentList() {
  const dispatch = useDispatch();
  const {
    agents: agentsData,
    loading,
    pagination,
    searchFilter,
  } = useSelector((state) => state.agent) || {};

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [agentDetails, setAgentDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const agents = Array.isArray(agentsData)
    ? agentsData
    : agentsData?.data || [];

  const scroll = useDynamicTableScroll();

  // Fetch all agents when pagination changes
  useEffect(() => {
    dispatch(getAllAgents({ page: pagination.page, limit: pagination.limit }));
  }, [dispatch, pagination.page, pagination.limit]);

  const handleEdit = (agent) => {
    setIsModalVisible(true);
    setSelectedAgent(agent);
  };

  const handleDelete = (id) => {
    dispatch(deleteAgent(id));
  };

  const handleSubmit = async (formData, id = null) => {
    if (id) {
      await dispatch(updateAgent({ id, data: formData }));
    } else {
      await dispatch(addAgent(formData));
    }
    setIsModalVisible(false);
    setSelectedAgent(null);
    dispatch(getAllAgents({ page: pagination.page, limit: pagination.limit }));
  };

  const handleSearch = () => {
    dispatch(
      getSearchAgents({
        keyword: searchFilter.keyword,
        page: 1,
        limit: pagination.limit,
      })
    );
    dispatch(updatePagination({ page: 1 }));
  };

  const columns = [
    {
      title: "Agent Name",
      dataIndex: "agent_name",
      key: "agent_name",
      render: (name, record) => (
        <div
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={() => {
            setAgentDetails(record);
            setIsDetailModalVisible(true);
          }}
        >
          {/* <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ marginRight: 8 }}
          /> */}
          <span style={{ color: "#1677ff", fontWeight: 500 }}>{name}</span>
        </div>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this agent?"
            onConfirm={() => handleDelete(record.agent_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

//   console.log(agents);
  

  return (
    <div className="p-2 pt-0 overflow-auto hide-scrollbar">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Agent List</h2>
      </div>

      {/* Search + Create */}
      <div className="flex justify-between items-center mb-4">
        <Search
          placeholder="Search agent by name or email"
          allowClear
          enterButton={<SearchOutlined />}
          value={searchFilter?.keyword || ""}
          onChange={(e) => {
            const value = e.target.value;
            dispatch(updateSearchFilter({ name: "keyword", value }));
            if (value === "") handleSearch("");
          }}
          onSearch={() => handleSearch()}
          style={{ width: 400 }}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedAgent(null);
            setIsModalVisible(true);
          }}
        >
          Create Agent
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={agents}
        columns={columns}
        scroll={scroll}
        components={tableComponent}
        loading={loading}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `Showing ${range[0]}–${range[1]} of ${total} entries`,
        }}
        onChange={(pag) => {
          dispatch(
            updatePagination({ page: pag.current, limit: pag.pageSize })
          );
          dispatch(getAllAgents({ page: pag.current, limit: pag.pageSize }));
        }}
      />

      {/* Detail Modal */}
      <Modal
        open={isDetailModalVisible}
        footer={null}
        onCancel={() => setIsDetailModalVisible(false)}
        width={600}
        title={
          <span style={{ fontWeight: "700", color: "#1677ff" }}>
            Agent Details
          </span>
        }
      >
        {agentDetails && (
          <div
            style={{
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <tbody>
                {[
                  ["Name", agentDetails.agent_name],
                  ["Email", agentDetails.email],
                  ["Mobile", agentDetails.mobile],
                  ["Gender", agentDetails.gender],
                  ["Address", agentDetails.address],
                  ["Qualification", agentDetails.qualification],
                  ["Bio", agentDetails.bio],
                ].map(([label, value], index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      height: "35px",
                    }}
                  >
                    <td
                      style={{
                        fontWeight: "600",
                        padding: "6px 10px",
                        color: "#333",
                        width: "35%",
                      }}
                    >
                      {label}:
                    </td>
                    <td style={{ padding: "6px 10px", color: "#555" }}>
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        bodyStyle={{ padding: 0, background: "transparent" }}
        centered
      >
        <CreateAgentForm onSubmit={handleSubmit} selectedAgent={selectedAgent} />
      </Modal>
    </div>
  );
}
