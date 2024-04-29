import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message, Row } from "antd";
import axios from "axios";
import AddEditItemModal from "./AddEditItemModal";

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Dummy owners data
  const owners = [
    { userId: 1, username: "Alice" },
    { userId: 2, username: "Bob" },
    // Add more dummy owners here...
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      // Replace with your actual fetch call
      const response = await axios.get("http://localhost:8080/api/items/");
      setItems(response.data);
    } catch (error) {
      message.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentItem(null);
    setIsModalVisible(true);
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setIsModalVisible(true);
  };

  const handleDeleteClick = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/items/${itemId}`);
      message.success("Item deleted successfully");
      fetchItems();
    } catch (error) {
      message.error("Failed to delete item");
    }
  };

  const handleSaveModal = async (item) => {
    setIsModalVisible(false);
    await fetchItems();
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Item Desctiption",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Starting Price",
      dataIndex: "startingPrice",
      key: "startingPrice",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            style={{ marginRight: 8 }}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => handleDeleteClick(record.itemId)}
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
    <div
      style={{
        width: "100vw",
        padding: 32,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddClick}>
          Add Item
        </Button>
      </Row>
      <Table
        style={{ width: "100%" }}
        columns={columns}
        dataSource={items}
        rowKey="itemId"
        loading={loading}
      />
      <AddEditItemModal
        visible={isModalVisible}
        item={currentItem}
        owners={owners}
        onSave={handleSaveModal}
        onCancel={handleCancelModal}
      />
    </div>
  );
};

export default Items;
