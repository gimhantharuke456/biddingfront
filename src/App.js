import "antd/dist/reset.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Views/Login";
import Signup from "./Views/Signup";
import BidderDashboard from "./Views/BidderDashboard";
import AuctioneerDashboard from "./Views/AuctioneerDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bidder" element={<BidderDashboard />} />
        <Route path="/auctioneer" element={<AuctioneerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
