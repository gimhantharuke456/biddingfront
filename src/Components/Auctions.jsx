import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, Select, message } from "antd";
import axios from "axios";
import CreateUpdateAuctionModal from "./CreateUpdateAuctionModal";

const { Option } = Select;

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAuction, setCurrentAuction] = useState(null);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/auctions/");
      setAuctions(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch auctions");
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentAuction(null);
    setIsModalVisible(true);
  };

  const handleDeleteClick = async (auctionId) => {
    try {
      await axios.delete(`http://localhost:8080/api/auctions/${auctionId}`);
      fetchAuctions();
      message.success("Auction deleted successfully");
    } catch (error) {
      message.error("Failed to delete auction");
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleSaveModal = (savedAuction) => {
    setIsModalVisible(false);
    fetchAuctions();
  };

  const handleChangeStatus = async (auctionId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/auctions/${auctionId}/status`,
        {
          status,
        }
      );
      message.success(`Auction status updated to ${status}`);
      fetchAuctions();
    } catch (error) {
      message.error("Failed to update auction status");
    }
  };

  const columns = [
    {
      title: "Auction ID",
      dataIndex: "auctionId",
      key: "auctionId",
    },
    {
      title: "Item Name",
      dataIndex: ["item", "name"],
      key: "itemName",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Current Price",
      dataIndex: "currentPrice",
      key: "currentPrice",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status, record) => (
    //     <Select
    //       defaultValue={status}
    //       style={{ width: 120 }}
    //       onChange={(value) => handleChangeStatus(record.auctionId, value)}
    //     >
    //       <Option value="active">Active</Option>
    //       <Option value="completed">Completed</Option>
    //       <Option value="cancelled">Cancelled</Option>
    //     </Select>
    //   ),
    // },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Popconfirm
            title="Are you sure to delete this auction?"
            onConfirm={() => handleDeleteClick(record.auctionId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "100vw", padding: 32 }}>
      <Button type="primary" onClick={handleAddClick}>
        Add Auction
      </Button>
      <Table
        style={{ minWidth: "100%" }}
        dataSource={auctions}
        columns={columns}
        rowKey="auctionId"
        loading={loading}
      />
      <CreateUpdateAuctionModal
        visible={isModalVisible}
        auction={currentAuction}
        onSave={handleSaveModal}
        onCancel={handleCancelModal}
      />
    </div>
  );
};

export default Auctions;
