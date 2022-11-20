import React from "react";

import Navbar from "./Navbar";
import Search from "./Search";
import ActiveChats from "./ActiveChats";
import "../styles/Sidebar.scss";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <ActiveChats />
    </div>
  );
};

export default Sidebar;
