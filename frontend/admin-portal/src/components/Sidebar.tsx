import React from "react";
import "./Sidebar.css";

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const Sidebar = ({ activeMenu, onMenuChange }: SidebarProps) => {
  const menuItems = [
    {
      label: "비디오 관리",
      icon: "video",
      id: "videos",
      path: "/videos",
    },
    {
      label: "배너 관리",
      icon: "banner",
      id: "banners",
      path: "/banners",
    },
    {
      label: "배너 뉴스 관리",
      icon: "news",
      id: "banner-news",
      path: "/banner-news",
    },
    {
      label: "인사말 관리",
      icon: "greeting",
      id: "greetings",
      path: "/greetings",
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>관리자 포털</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeMenu === item.id ? "active" : ""}`}
            onClick={() => onMenuChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
