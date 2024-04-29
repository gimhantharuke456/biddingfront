import React from "react";
import { Tabs } from "antd";
import Auctions from "../Components/Auctions";
import Payments from "../Components/Payments";
import Items from "../Components/Items";

const { TabPane } = Tabs;

const AuctioneerDashboard = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        padding: 32,
        display: "flex",
      }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Current Auctions" key="1">
          <Auctions />
        </TabPane>
        <TabPane tab="Payments" key="2">
          <Payments />
        </TabPane>
        <TabPane tab="Items" key="4">
          <Items />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AuctioneerDashboard;
