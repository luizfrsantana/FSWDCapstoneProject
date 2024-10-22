import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Banner from "./components/Banner";
import UserPage from "./components/UserPage";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import DevicePage from "./components/DevicePage";
import InterfacePage from "./components/InterfacePage";
import ConnectionPage from "./components/ConnectionPage";

export default function App() {
  return (
    <div className="App">
      <Router>
      <Navigation />
      <div className="main-content">
        <Banner />
        <Routes>
            <Route path="/" element={<Home />}  />
            <Route path="/users" element={<UserPage />}  />
            <Route path="/devices" element={<DevicePage />}  />
            <Route path="/interfaces" element={<InterfacePage />}  />
            <Route path="/connections" element={<ConnectionPage />}  />
        </Routes>
      </div>

      </Router>

    </div>  
  );
}
