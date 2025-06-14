"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

interface Video {
    id: number;
    title: string;
    description: string;
    youtubeUrl: string;
    isActive: boolean;
}

export default function Home() {
    const [video, setVideo] = useState<Video | null>(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/videos`);
                if (response.data && response.data.length > 0) {
                    setVideo(response.data[0]); // 첫 번째 활성화된 영상 사용
                }
            } catch (error) {
                console.error("영상을 불러오는데 실패했습니다:", error);
            }
        };

        fetchVideo();
    }, []);

    return (
        <div>
            <div>
                <Image
                    src="/images/banner.png"
                    alt="배너 이미지"
                    width={1200}
                    height={400}
                />
            </div>
            <section id="main-video">
                {video ? (
                    <div
                        dangerouslySetInnerHTML={{ __html: video.youtubeUrl }}
                    />
                ) : (
                    <p>표시할 영상이 없습니다.</p>
                )}
            </section>
        </div>
    );
}
