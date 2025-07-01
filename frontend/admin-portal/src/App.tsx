import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import VideoManagement from "./components/VideoManagement";
import BannerManagement from "./components/BannerManagement";
import BannerNewsManagement from "./components/BannerNewsManagement";
import GreetingManagement from "./components/GreetingManagement";
import "./App.css";

function App() {
  const [activeMenu, setActiveMenu] = useState("videos");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuChange = (menu: string) => {
    setActiveMenu(menu);
    // 모바일에서 메뉴 선택 시 사이드바 닫기
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "videos":
        return <VideoManagement />;
      case "banners":
        return <BannerManagement />;
      case "banner-news":
        return <BannerNewsManagement />;
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
      case "banner-news":
        return "배너 뉴스 관리";
      case "greetings":
        return "인사말 관리";
      default:
        return "비디오 관리";
    }
  };

  return (
    <div className="app">
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={handleMenuChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
        <header className="content-header">
          <button
            className="menu-toggle-btn"
            onClick={toggleSidebar}
            aria-label="메뉴 토글"
          >
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
