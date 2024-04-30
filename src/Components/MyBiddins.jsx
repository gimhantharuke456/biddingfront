import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, List, Card, Tag } from "antd";

const MyBiddings = () => {
  const [auctions, setAuctions] = useState([]);
  const [biddings, setBiddings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auctionResponse, biddingResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/auctions/"),
          axios.get("http://localhost:8080/api/bids/"),
        ]);

        const fetchedAuctions = auctionResponse.data;

        let fetchedBiddings = biddingResponse.data.filter((bid) => {
          return bid.userId == localStorage.getItem("userID");
        });

        const combinedData = fetchedBiddings.map((bid) => {
          const auction = fetchedAuctions.find(
            (a) => a.auctionId === bid.auctionId
          );
          return {
            ...bid,
            auction,
            isWinner:
              new Date(auction.endTime) < new Date() &&
              bid.bidAmount === auction.currentPrice,
          };
        });

        setBiddings(combinedData);
        setAuctions(fetchedAuctions);
      } catch (error) {
        message.error("Failed to fetch data: " + error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={biddings}
      renderItem={(item) => (
        <List.Item>
          <Card title={`Bid on: ${item.auction.item.name}`}>
            Bid Amount: ${item.bidAmount}
            <br />
            Current Auction Price: ${item.auction.currentPrice}
            <br />
            Status: {`    `}
            {item.isWinner ? (
              <Tag color="green">Winner</Tag>
            ) : (
              <Tag color="blue">Ongoing</Tag>
            )}
          </Card>
        </List.Item>
      )}
    />
  );
};

export default MyBiddings;
