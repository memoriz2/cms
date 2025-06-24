import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import VideoManagement from "./components/VideoManagement";
import BannerManagement from "./components/BannerManagement";
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
      default:
        return <VideoManagement />;
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
          <h1>{activeMenu === "videos" ? "비디오 관리" : "배너 관리"}</h1>
        </header>
        <section className="content-body">{renderContent()}</section>
      </main>
    </div>
  );
}

export default App;
