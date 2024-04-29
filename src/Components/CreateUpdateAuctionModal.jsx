import React, { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message } from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const CreateUpdateAuctionModal = ({ visible, auction, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchItems();
    }
  }, [visible]);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/items/");
      setItems(response.data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      message.error("Failed to load items.");
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = auction?.auctionId
        ? await axios.put(
            `http://localhost:8080/api/auctions/${auction.auctionId}`,
            {
              ...values,
              itemID: parseInt(values.itemID), // Ensure itemID is sent as an integer
            }
          )
        : await axios.post("http://localhost:8080/api/auctions/", {
            ...values,
            itemID: parseInt(values.itemID),
          });

      message.success(
        `Auction ${auction?.auctionId ? "updated" : "created"} successfully`
      );
      onSave(response.data);
    } catch (error) {
      console.error("Error saving auction:", error);
      message.error("An error occurred while saving the auction.");
    } finally {
      setLoading(false);
    }
  };

  const initialValues = auction
    ? {
        ...auction,
        startTime: moment(auction.startTime),
        endTime: moment(auction.endTime),
        itemID: auction.itemID.toString(), // Ant Design Select component handles value as string
      }
    : {};

  return (
    <Modal
      title={`${auction?.auctionId ? "Update" : "Create"} Auction`}
      visible={visible}
      onOk={form.submit}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={form.submit}
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
        layout="vertical"
        hideRequiredMark
      >
        <Form.Item
          name="itemId"
          label="Item ID"
          rules={[{ required: true, message: "Please select an item!" }]}
        >
          <Select placeholder="Select an item">
            {items.map((item) => (
              <Option key={item.itemId} value={item.itemId.toString()}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="startTime"
          label="Start Time"
          rules={[{ required: true, message: "Please select the start time!" }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          name="endTime"
          label="End Time"
          rules={[{ required: true, message: "Please select the end time!" }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          name="currentPrice"
          label="Current Price"
          rules={[
            { required: true, message: "Please input the current price!" },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status!" }]}
        >
          <Select>
            <Option value="active">Active</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUpdateAuctionModal;
