import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import axios from "axios";
import CreateUpdateAuctionModal from "./CreateUpdateAuctionModal";

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

  const handleEditClick = (auction) => {
    setCurrentAuction(auction);
    setIsModalVisible(true);
  };

  const handleDeleteClick = async (auctionId) => {
    try {
      await axios.delete(`/api/auctions/${auctionId}`);
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

  const columns = [
    {
      title: "Auction ID",
      dataIndex: "auctionId",
      key: "auctionId",
    },
    // Add other column definitions here
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button onClick={() => handleEditClick(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this auction?"
            onConfirm={() => handleDeleteClick(record.auctionId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
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
