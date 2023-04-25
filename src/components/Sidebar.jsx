import React from "react";

import SidebarHeader from "./SidebarHeader";
import Search from "./Search";
import ActiveChats from "./ActiveChats";
import "../styles/Sidebar.scss";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <SidebarHeader />
      <Search />
      <ActiveChats />
    </div>
  );
};

export default Sidebar;
