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

export default function Home() {
  const [video, setVideo] = useState<Video | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다:", error);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      {banner && banner.filePath && banner.filePath.trim() !== "" && (
        <section className="banner-section">
          <Image
            src={`${API_URL}${
              banner.filePath.startsWith("/")
                ? banner.filePath
                : `/${banner.filePath}`
            }`}
            alt={banner.title || "배너 이미지"}
            width={1200}
            height={400}
            className="banner-image"
            priority
            onError={(e) => {
              console.error("배너 이미지 로드 실패:", e);
            }}
          />
        </section>
      )}
      {/* {인사말 섹션} */}
      <section className="greeting-section"></section>
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
