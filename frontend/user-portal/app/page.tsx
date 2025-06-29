"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./page.css";

interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Banner {
  id: number;
  title: string;
  fileName: string;
  filePath: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Greeting {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [video, setVideo] = useState<Video | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<Greeting | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 배너 데이터 가져오기
        try {
          const bannerResponse = await axios.get(
            `${API_URL}/api/banners/active`
          );
          if (bannerResponse.data && bannerResponse.data.filePath) {
            setBanner(bannerResponse.data);
          }
        } catch (bannerError) {
          console.log("배너 데이터를 불러올 수 없습니다:", bannerError);
          // 배너가 없어도 계속 진행
        }

        // 비디오 데이터 가져오기
        const videoResponse = await axios.get(`${API_URL}/api/videos/active`);
        if (
          videoResponse.data &&
          videoResponse.data.content &&
          videoResponse.data.content.length > 0
        ) {
          setVideo(videoResponse.data.content[0]);
        }

        // 인사말 데이터 가져오기
        try {
          const greetingResponse = await axios.get(
            `${API_URL}/api/greetings/active`
          );
          if (greetingResponse.data) {
            setGreeting(greetingResponse.data);
          }
        } catch (greetingError) {
          console.log("인사말 데이터를 불러올 수 없습니다:", greetingError);
          // 인사말이 없어도 계속 진행
        }
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다:", error);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  let bannerBackgroundImage = "none";
  if (banner && banner.filePath && banner.filePath.trim() !== "") {
    const normalizedPath = banner.filePath.replace(/\\/g, "/");
    bannerBackgroundImage = `url(${encodeURI(
      API_URL +
        (normalizedPath.startsWith("/") ? normalizedPath : "/" + normalizedPath)
    )})`;
  }

  if (loading) {
    return (
      <div className="main-container">
        <div className="loading">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-container">
        <div className="no-video">{error}</div>
      </div>
    );
  }

  return (
    <main className="main-container">
      {/* 배너 섹션 */}
      <section className="banner-section">
        <div
          className="banner-image"
          style={{
            backgroundImage: bannerBackgroundImage,
            backgroundColor:
              banner && banner.filePath && banner.filePath.trim() !== ""
                ? "transparent"
                : "#e9ecef",
          }}
          title={banner && banner.title ? banner.title : "배너 이미지"}
        >
          <div className="banner-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Blanditiis beatae
            dolore quas, adipisci, eos, amet excepturi laudantium soluta alias
            ipsum minus nesciunt placeat? Dicta voluptatem assumenda veniam hic
            officiis id.
          </div>
        </div>
      </section>
      {/* {인사말 섹션} */}
      {greeting && (
        <section className="greeting-section">
          <h2 className="greeting-title">{greeting.title}</h2>
          <div
            className="greeting-content"
            dangerouslySetInnerHTML={{ __html: greeting.content }}
          />
        </section>
      )}
      {/* 비디오 섹션 */}
      <section className="video-section">
        {video ? (
          <div>
            <h1 className="video-title">{video.title}</h1>
            {video.description && (
              <p className="video-description">{video.description}</p>
            )}
            <div className="video-container">
              <div className="video-wrapper">
                <div dangerouslySetInnerHTML={{ __html: video.youtubeUrl }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="no-video">
            <p>표시할 영상이 없습니다.</p>
          </div>
        )}
      </section>
    </main>
  );
}
