import React, { FormEvent, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config";
import axios from "axios";
import "./VideoManagement.css";

interface Video {
    id: number;
    title: string;
    description: string;
    youtubeUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function VideoManagement() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Video>>({});
    const [showModal, setShowModal] = useState(false);
    const [modal, setModal] = useState<{
        open: boolean;
        message: string;
        onConfirm?: (() => void) | null;
    }>({ open: false, message: "", onConfirm: null });

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.VIDEOS);
            setVideos(response.data);
        } catch (error) {
            console.error("영상 목록 조회 실패:", error);
            setModal({
                open: true,
                message: "영상 목록을 불러오는데 실패했습니다.",
                onConfirm: null,
            });
        }
    };

    const extractVideoId = (iframeCode: string): string | null => {
        try {
            const srcMatch = iframeCode.match(/src="([^"]+)"/);
            if (!srcMatch) return null;

            const url = srcMatch[1];
            const urlObj = new URL(url);

            const pathParts = urlObj.pathname.split("/");
            const videoId = pathParts[pathParts.length - 1].split("?")[0];

            return videoId;
        } catch {
            return null;
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const youtubeUrl = formData.get("youtubeUrl") as string;

        const videoId = extractVideoId(youtubeUrl);
        if (!videoId) {
            setModal({
                open: true,
                message: "유효한 YouTube iframe 코드를 입력해주세요.",
                onConfirm: null,
            });
            return;
        }

        try {
            const response = await axios.post(API_ENDPOINTS.VIDEOS, {
                title,
                description,
                youtubeUrl,
                isActive: false,
            });

            if (response.status === 200 || response.status === 201) {
                setModal({
                    open: true,
                    message: "영상이 성공적으로 추가되었습니다.",
                    onConfirm: null,
                });
                (e.target as HTMLFormElement).reset();
                fetchVideos();
            }
        } catch (error) {
            console.error("영상 추가 실패:", error);
            setModal({
                open: true,
                message: "영상 추가에 실패했습니다.",
                onConfirm: null,
            });
        }
    };

    const handleToggleActive = async (video: Video) => {
        if (
            !video.isActive &&
            videos.some((v) => v.isActive && v.id !== video.id)
        ) {
            setModal({
                open: true,
                message:
                    "이미 활성화된 영상이 있습니다. 한 번에 하나만 활성화할 수 있습니다.",
                onConfirm: null,
            });
            return;
        }
        try {
            await axios.put(`${API_ENDPOINTS.VIDEOS}/${video.id}`, {
                ...video,
                isActive: !video.isActive,
            });
            fetchVideos();
            if (selectedVideo && selectedVideo.id === video.id) {
                setSelectedVideo({ ...video, isActive: !video.isActive });
            }
        } catch (error) {
            setModal({
                open: true,
                message: "상태 변경에 실패했습니다.",
                onConfirm: null,
            });
        }
    };

    const handleEditClick = () => {
        if (selectedVideo) {
            setEditForm({
                title: selectedVideo.title,
                description: selectedVideo.description,
                isActive: selectedVideo.isActive,
            });
            setEditMode(true);
        }
    };

    const handleEditChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    };

    // 이미 활성화된 영상이 있는지 체크
    const isAnotherActiveExists = (excludeId?: number) =>
        videos.some((v) => v.isActive && v.id !== excludeId);

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVideo) return;
        // 활성화 중복 체크 (토글을 눌러 활성화로 바꾸거나, 원래 활성화 상태인 경우 모두)
        console.log("editForm.isActive:", editForm.isActive);
        console.log("selectedVideo.isActive:", selectedVideo.isActive);
        console.log(
            "isAnotherActiveExists(selectedVideo.id):",
            isAnotherActiveExists(selectedVideo.id)
        );
        console.log(
            "videos:",
            videos.map((v) => ({ id: v.id, isActive: v.isActive }))
        );
        if (
            (editForm.isActive === true ||
                (editForm.isActive === undefined && selectedVideo.isActive)) &&
            isAnotherActiveExists(selectedVideo.id)
        ) {
            setModal({
                open: true,
                message:
                    "이미 활성화된 영상이 있습니다. 한 번에 하나만 활성화할 수 있습니다.",
                onConfirm: null,
            });
            return;
        }
        try {
            await axios.put(`${API_ENDPOINTS.VIDEOS}/${selectedVideo.id}`, {
                ...selectedVideo,
                ...editForm,
            });
            setEditMode(false);
            fetchVideos();
            setSelectedVideo({ ...selectedVideo, ...editForm } as Video);
        } catch {
            setModal({
                open: true,
                message: "수정에 실패했습니다.",
                onConfirm: null,
            });
        }
    };

    const handleEditCancel = () => {
        setEditMode(false);
        setEditForm({});
    };

    const handleDeleteVideo = async (videoId: number) => {
        setModal({
            open: true,
            message: "정말로 이 영상을 삭제하시겠습니까?",
            onConfirm: async () => {
                try {
                    await axios.delete(`${API_ENDPOINTS.VIDEOS}/${videoId}`);
                    fetchVideos();
                    if (selectedVideo && selectedVideo.id === videoId) {
                        setSelectedVideo(null);
                    }
                } catch {
                    setModal({
                        open: true,
                        message: "삭제에 실패했습니다.",
                        onConfirm: null,
                    });
                }
            },
        });
    };

    return (
        <div>
            <h1>영상 관리</h1>
            {modal.open && (
                <div className="custom-modal-backdrop">
                    <div className="custom-modal">
                        <p>{modal.message}</p>
                        <button
                            onClick={async () => {
                                setModal({ ...modal, open: false });
                                if (modal.onConfirm) await modal.onConfirm();
                            }}
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
            <section className="video-management-layout">
                <div className="video-list-area">
                    <h2>영상 목록</h2>
                    <table className="video-table">
                        <thead>
                            <tr>
                                <th>제목</th>
                                <th>상태</th>
                                <th>생성일</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video) => (
                                <tr
                                    key={video.id}
                                    onClick={() => setSelectedVideo(video)}
                                    className={
                                        selectedVideo?.id === video.id
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    <td>{video.title}</td>
                                    <td>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={video.isActive}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleActive(video);
                                                }}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                    <td>
                                        {new Date(
                                            video.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteVideo(video.id);
                                            }}
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="video-detail-area">
                    {selectedVideo && (
                        <div className="video-detail-list">
                            <div className="video-detail-header">
                                <h3>상세보기</h3>
                                {editMode ? (
                                    <div className="edit-btn-row">
                                        <button
                                            type="button"
                                            onClick={handleEditSave}
                                        >
                                            저장
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleEditCancel}
                                        >
                                            취소
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleEditClick}
                                    >
                                        수정
                                    </button>
                                )}
                            </div>
                            {editMode ? (
                                <form onSubmit={handleEditSave}>
                                    <div>
                                        <label>제목</label>
                                        <input
                                            name="title"
                                            value={editForm.title || ""}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>설명</label>
                                        <textarea
                                            name="description"
                                            value={editForm.description || ""}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                    <div className="toggle-row">
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={!!editForm.isActive}
                                                onChange={handleEditChange}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                        <span className="toggle-status">
                                            {editForm.isActive
                                                ? "활성"
                                                : "비활성"}
                                        </span>
                                    </div>
                                    <div className="video-edit-iframe">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: selectedVideo.youtubeUrl,
                                            }}
                                        />
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <h4>{selectedVideo.title}</h4>

                                    <p>{selectedVideo.description}</p>
                                    <div className="video-meta">
                                        <span>
                                            상태:{" "}
                                            {selectedVideo.isActive
                                                ? "활성"
                                                : "비활성"}
                                        </span>
                                        <div className="video-meta-row">
                                            <span>
                                                생성일:{" "}
                                                {new Date(
                                                    selectedVideo.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                            <span>
                                                수정일:{" "}
                                                {new Date(
                                                    selectedVideo.updatedAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="video-edit-iframe">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: selectedVideo.youtubeUrl,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>
            <section>
                <h2>새 영상 추가</h2>
                <article>
                    <form onSubmit={handleSubmit}>
                        <fieldset>
                            <legend>영상 정보 입력</legend>
                            <div>
                                <label htmlFor="title">영상 제목</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="영상 제목을 입력하세요"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="youtubeUrl">
                                    YouTube iframe 코드
                                </label>
                                <textarea
                                    id="youtubeUrl"
                                    name="youtubeUrl"
                                    placeholder={`<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description">영상 설명</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="영상 설명을 입력하세요"
                                />
                            </div>
                            <button type="submit">영상 추가</button>
                        </fieldset>
                    </form>
                </article>
            </section>
        </div>
    );
}
