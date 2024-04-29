import React, { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/login?email=${values.username}&password=${values.password}`
      );
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("userID", response.data.userID);
      message.success("Login successful!");
      if (response.data.role === "auctioneer") {
        navigate("/auctioneer");
      } else {
        navigate("/bidder");
      }
    } catch (error) {
      console.error("Login failed: ", error);
      message.error(
        "Failed to log in, please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backgroundImage">
      <div className="overlay">
        <Spin spinning={loading} tip="Logging in...">
          <Form
            name="login_form"
            onFinish={handleSubmit}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label={<label style={{ color: "white" }}>Email</label>} // Updated to Email for clarity
              name="username"
              rules={[{ required: true, message: "Please input your email!" }]}
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
                Log In
              </Button>
            </Form.Item>
          </Form>
        </Spin>
        <p style={{ color: "white", textAlign: "center" }}>
          Don't have an account? <Link to="/signup">Sign up Now</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
