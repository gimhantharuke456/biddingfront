import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message } from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const CreateUpdateAuctionModal = ({ visible, auction, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // If `auction` has an ID, it's an update, otherwise it's a create
      const response = auction?.auctionId
        ? await axios.put(`/api/auctions/${auction.auctionId}`, values)
        : await axios.post("/api/auctions", values);

      message.success(
        `Auction ${auction?.auctionId ? "updated" : "created"} successfully`
      );
      onSave(response.data);
    } catch (error) {
      console.error(error);
      message.error("An error occurred while saving the auction.");
    } finally {
      setLoading(false);
    }
  };

  // Initial values for the form if it's an update
  const initialValues = auction
    ? {
        ...auction,
        startTime: moment(auction.startTime),
        endTime: moment(auction.endTime),
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
          name="itemID"
          label="Item ID"
          rules={[{ required: true, message: "Please input the item ID!" }]}
        >
          <Input />
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
            <Option value="ACTIVE">Active</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUpdateAuctionModal;
