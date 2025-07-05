import React, { useEffect, useState } from "react";
import Image from "next/image";
import { API_URL } from "../../config";

interface BannerNews {
  id: number;
  title: string;
  source: string;
  imagePath: string;
  linkUrl: string;
}

const BannerNewsSection = () => {
  const [news, setNews] = useState<BannerNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("배너뉴스 데이터 요청 시작");
    fetch(`${API_URL}/api/banner-news/active?limit=4`)
      .then((res) => {
        console.log("배너뉴스 응답 상태:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("배너뉴스 데이터:", data);
        setNews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("배너뉴스 데이터를 불러오는데 실패했습니다:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section
        style={{ margin: "48px 0" }}
        aria-labelledby="highlights-heading"
      >
        <h2
          id="highlights-heading"
          style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 24 }}
        >
          HIGHLIGHTS
        </h2>
        <div style={{ textAlign: "center", padding: "20px" }}>
          배너뉴스를 불러오는 중...
        </div>
      </section>
    );
  }

  if (!news.length) {
    return (
      <section
        style={{ margin: "48px 0" }}
        aria-labelledby="highlights-heading"
      >
        <h2
          id="highlights-heading"
          style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 24 }}
        >
          HIGHLIGHTS
        </h2>
        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          표시할 배너뉴스가 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section style={{ margin: "48px 0" }} aria-labelledby="highlights-heading">
      <h2
        id="highlights-heading"
        style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 24 }}
      >
        HIGHLIGHTS
      </h2>
      <ul
        className="banner-news-grid"
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {news.map((item) => (
          <li key={item.id} style={{ padding: 0, margin: 0 }}>
            <a
              href={item.linkUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "100%",
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                textDecoration: "none",
                color: "#222",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 20,
                transition: "box-shadow 0.2s",
                minHeight: "280px",
              }}
            >
              <figure style={{ width: "100%", margin: 0 }}>
                <div
                  style={{
                    width: "100%",
                    height: 180,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: 8,
                    background: "#f5f5f5",
                    position: "relative",
                  }}
                >
                  {item.imagePath ? (
                    <>
                      <Image
                        src={
                          item.imagePath.startsWith("http")
                            ? item.imagePath
                            : `${API_URL}${
                                item.imagePath.startsWith("/")
                                  ? item.imagePath
                                  : "/" + item.imagePath
                              }`
                        }
                        alt={item.title}
                        fill
                        style={{
                          objectFit: "cover",
                        }}
                        onLoad={() => {
                          console.log("이미지 로드 성공:", item.imagePath);
                        }}
                        onError={(e) => {
                          console.error("이미지 로드 실패:", item.imagePath);
                          console.error("시도한 URL:", e.currentTarget.src);
                          e.currentTarget.style.display = "none";
                          const nextElement = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = "flex";
                          }
                        }}
                      />
                      <span
                        style={{
                          color: "#aaa",
                          fontSize: 14,
                          display: "none",
                          position: "absolute",
                        }}
                      >
                        이미지 로드 실패
                      </span>
                    </>
                  ) : (
                    <span style={{ color: "#aaa", fontSize: 14 }}>
                      이미지 없음
                    </span>
                  )}
                </div>
                <figcaption style={{ width: "100%", textAlign: "left" }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 8,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      color: "#009cff",
                      fontSize: 15,
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    {item.source}
                  </div>
                </figcaption>
              </figure>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BannerNewsSection;
