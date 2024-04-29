import React, { useState } from "react";
import { Form, Input, Button, Select, message, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/",
        values
      );
      console.log("Received values of form: ", response.data);
      message.success("Signup successful! Redirecting to dasboard...");
      localStorage.setItem("userID", response.data.userID);
      localStorage.setItem("email", response.data.email);
      if (values.role === "auctioneer") {
        navigate("/auctioneer");
      } else {
        navigate("/bidder");
      }
    } catch (error) {
      console.error("Signup failed: ", error);
      message.error("Failed to sign up, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backgroundImage">
      <div className="overlay">
        <Spin spinning={loading} tip="Signing up...">
          <Form
            name="signup_form"
            onFinish={handleSubmit}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label={<label style={{ color: "white" }}>Username</label>}
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={<label style={{ color: "white" }}>Role</label>}
              name="role"
              rules={[{ required: true, message: "Please input your role!" }]}
            >
              <Select>
                <Option value="bidder">Bidder</Option>
                <Option value="auctioneer">Auctioneer</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<label style={{ color: "white" }}>Email</label>}
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                  type: "email",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={<label style={{ color: "white" }}>Password</label>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="form-item">
                Sign Up
              </Button>
            </Form.Item>
          </Form>
        </Spin>
        <p style={{ color: "white", textAlign: "center" }}>
          Already have an account? <Link to="/">Sign in Now</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
