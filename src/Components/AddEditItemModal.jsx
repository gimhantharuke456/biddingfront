import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

const AddEditItemModal = ({ visible, item, onSave, onCancel, owners }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = item?.itemId
        ? await axios.put(
            `http://localhost:8080/api/items/${item.itemId}`,
            values
          )
        : await axios.post("http://localhost:8080/api/items/", values);
      message.success(
        `Item ${item?.itemId ? "updated" : "created"} successfully`
      );
      onSave(response.data);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("An error occurred while saving the item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`${item?.itemId ? "Edit" : "Add"} Item`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        initialValues={item || {}}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the item name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="startingPrice"
          label="Starting Price"
          rules={[
            { required: true, message: "Please input the starting price!" },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please input the category!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ownerId"
          label="Owner"
          rules={[{ required: true, message: "Please select the owner!" }]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {owners.map((owner) => (
              <Option key={owner.userId} value={owner.userId}>
                {owner.username}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditItemModal;
