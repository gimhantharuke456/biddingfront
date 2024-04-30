import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Card,
  message,
  Modal,
  InputNumber,
  Button,
  Row,
} from "antd";
import Countdown from "react-countdown";
import MyBiddins from "../Components/MyBiddins";
import axios from "axios";
const { Content } = Layout;
const { Title } = Typography;

const BidderDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidValue, setBidValue] = useState(0);
  const [myBiddingsOpened, setMyBiddingsOpened] = useState(false);

  const handleMyBiddings = () => {
    setMyBiddingsOpened(!myBiddingsOpened);
  };

  const showModal = (auction) => {
    const now = new Date();
    const endTime = new Date(auction.endTime);

    if (endTime < now) {
      message.warning("This auction has already ended.");
      return;
    }

    setSelectedAuction(auction);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setBidValue(0); // Reset the bid value upon cancellation
  };

  const handleBid = async () => {
    if (bidValue <= selectedAuction.currentPrice) {
      message.error("Your bid must be higher than the current price.");
      return;
    }

    const bidDTO = {
      auctionId: selectedAuction.auctionId,
      userId: localStorage.getItem("userID"),
      bidAmount: bidValue,
      bidTime: new Date().toISOString(),
    };

    // Call API to create a new bid
    try {
      const response = await fetch("http://localhost:8080/api/bids/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bidDTO),
      });

      if (!response.ok) throw new Error("Failed to create bid");
      const newBid = await response.json();
      await axios.put(
        "http://localhost:8080/api/auctions/" +
          selectedAuction.auctionId +
          "/currentPrice/" +
          parseFloat(bidValue),
        {
          newPrice: parseFloat(bidValue),
        }
      );
      message.success("Bid placed successfully!");

      // Update auction's current price in local state
      const updatedAuctions = auctions.map((auction) =>
        auction.auctionId === selectedAuction.auctionId
          ? { ...auction, currentPrice: bidValue }
          : auction
      );
      setAuctions(updatedAuctions);
      setIsModalVisible(false);
    } catch (error) {
      message.error("Error placing bid: " + error.message);
    }
  };

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auctions/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAuctions(data);
      } catch (error) {
        message.error("Failed to fetch auctions: " + error.message);
      }
    };

    fetchAuctions();
  }, []);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Auction ended</span>;
    } else {
      return (
        <span>
          {days}d {hours}h {minutes}m {seconds}s
        </span>
      );
    }
  };

  return (
    <Layout style={{ height: "100vh", backgroundColor: "black" }}>
      <Content style={{ padding: "2%", height: "100%" }}>
        <Title style={{ color: "#FFF", textAlign: "center", paddingTop: "2%" }}>
          Art Dealer
        </Title>
        <p style={{ color: "#FFF", textAlign: "center" }}>
          Welcome to our Art Dealer gallery, where timeless elegance meets
          contemporary brilliance.
        </p>
        <Row style={{ marginTop: 48, marginBottom: 48 }} justify={"center"}>
          <Button onClick={handleMyBiddings}>My Biddings</Button>
        </Row>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            gap: "20px",
            marginTop: "20px",
            overflow: "auto",
          }}
        >
          {auctions.map((auction) => (
            <Card
              hoverable
              style={{ width: 240, backgroundColor: "#333", color: "#FFF" }}
              key={auction.auctionId}
              onClick={() => showModal(auction)}
            >
              <Card.Meta
                title={
                  <span style={{ color: "#FFF" }}>{auction.item.name}</span>
                }
                description={
                  <span style={{ color: "#DDD" }}>
                    {auction.item.description}
                  </span>
                }
              />
              <div style={{ color: "#FFF" }}>
                Current Price: ${auction.currentPrice}
              </div>
              <Countdown date={new Date(auction.endTime)} renderer={renderer} />
            </Card>
          ))}
        </div>
      </Content>
      <Modal
        title="Place a Bid"
        visible={isModalVisible}
        onOk={handleBid}
        onCancel={handleCancel}
        okText="Submit Bid"
      >
        <p>{selectedAuction ? `Bid on: ${selectedAuction.item.name}` : ""}</p>
        <p>
          Current Price: ${selectedAuction ? selectedAuction.currentPrice : 0}
        </p>
        <InputNumber
          min={selectedAuction ? selectedAuction.currentPrice + 1 : 0}
          value={bidValue}
          onChange={setBidValue}
          style={{ width: "100%" }}
        />
      </Modal>
      <Modal
        width={1000}
        onCancel={handleMyBiddings}
        footer={null}
        open={myBiddingsOpened}
      >
        <MyBiddins />
      </Modal>
    </Layout>
  );
};

export default BidderDashboard;
