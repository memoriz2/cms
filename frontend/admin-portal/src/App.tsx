import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import VideoManagement from "./components/VideoManagement";
import BannerManagement from "./components/BannerManagement";
import GreetingManagement from "./components/GreetingManagement";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("videos");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuChange = (menu: string) => {
    setActiveMenu(menu);

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "videos":
        return <VideoManagement />;
      case "banners":
        return <BannerManagement />;
      case "greetings":
        return <GreetingManagement />;
      default:
        return <VideoManagement />;
    }
  };

  const getPageTitle = () => {
    switch (activeMenu) {
      case "videos":
        return "비디오 관리";
      case "banners":
        return "배너 관리";
      case "greetings":
        return "인사말 관리";
      default:
        return "비디오 관리";
    }
  };

  return (
    <div className="app">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        activeMenu={activeMenu}
        onMenuChange={handleMenuChange}
      />
      <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
        <header className="content-header">
          <button className="menu-toggle-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <h1>{getPageTitle()}</h1>
        </header>
        <section className="content-body">{renderContent()}</section>
      </main>
    </div>
  );
}

export default App;
