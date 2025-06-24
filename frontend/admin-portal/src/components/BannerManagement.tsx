import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config";
import Modal from "./Modal";

interface Banner {
  id: number;
  title: string;
  fileName: string;
  filePath: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({
    title: "",
    isActive: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    isActive: false,
  });
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm?: () => void;
    showCancel?: boolean;
  }>({ isOpen: false, message: "" });

  const closeModal = () => {
    setModal({ isOpen: false, message: "" });
  };

  const showModal = (
    message: string,
    onConfirm?: () => void,
    showCancel: boolean = false
  ) => {
    setModal({ isOpen: true, message, onConfirm, showCancel });
  };

  const getBanners = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.BANNERS);
      const data = await response.json();
      setBanners(data.content);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BANNERS}/${banner.id}/toggle`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("배너 상태 변경에 실패했습니다.");
      }
      await getBanners();
    } catch (error) {
      console.error("Error toggling banner:", error);
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addFormData.title.trim()) {
      showModal("제목을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", addFormData.title);
      formData.append("isActive", addFormData.isActive.toString());

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch(API_ENDPOINTS.BANNERS, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("배너 추가에 실패했습니다.");
      }

      setAddFormData({ title: "", isActive: false });
      setSelectedFile(null);
      setShowAddForm(false);
      await getBanners();

      showModal("배너가 성공적으로 추가되었습니다.");
    } catch (error) {
      console.error("Error adding banner:", error);
      showModal("배너 추가에 실패했습니다.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleEditClick = (banner: Banner) => {
    setEditingBanner(banner);
    setEditFormData({
      title: banner.title,
      isActive: banner.isActive,
    });
    setEditSelectedFile(null);
    setShowEditForm(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditSelectedFile(file);
  };

  const handleEditBanner = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editFormData.title.trim()) {
      showModal("제목을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", editFormData.title);
      formData.append("isActive", editFormData.isActive.toString());

      if (editSelectedFile) {
        formData.append("file", editSelectedFile);
      }

      const response = await fetch(
        `${API_ENDPOINTS.BANNERS}/${editingBanner?.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("배너 수정에 실패했습니다.");
      }

      setEditFormData({ title: "", isActive: false });
      setEditSelectedFile(null);
      setEditingBanner(null);
      setShowEditForm(false);
      await getBanners();

      showModal("배너가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("Error editing banner:", error);
      showModal("배너 수정에 실패했습니다.");
    }
  };

  const handleEditCancel = () => {
    setEditFormData({ title: "", isActive: false });
    setEditSelectedFile(null);
    setEditingBanner(null);
    setShowEditForm(false);
  };

  const handleDeleteBanner = async (banner: Banner) => {
    showModal(
      `"${banner.title}" 배너를 정말로 삭제하시겠습니까?`,
      async () => {
        try {
          const response = await fetch(
            `${API_ENDPOINTS.BANNERS}/${banner.id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("배너 삭제에 실패했습니다.");
          }

          await getBanners();
          showModal("배너가 성공적으로 삭제되었습니다.");
        } catch (error) {
          console.error("Error deleting banner:", error);
          showModal("배너 삭제에 실패했습니다.");
        }
      },
      true // 취소 버튼 표시
    );
  };

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <section className="banner-management">
      <div className="banner-actions">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-banner-btn"
        >
          {showAddForm ? "취소" : "새 배너 추가"}
        </button>
      </div>

      <main>
        {showAddForm && (
          <section className="banner-add-form">
            <h3>새 배너 추가</h3>
            <form onSubmit={handleAddBanner} className="add-banner-form">
              <div className="form-group">
                <label htmlFor="title">배너 제목</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={addFormData.title}
                  onChange={handleInputChange}
                  placeholder="배너 제목을 입력하세요"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="file">배너 이미지 (선택사항)</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {selectedFile && (
                  <p className="file-info">선택된 파일: {selectedFile.name}</p>
                )}
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={addFormData.isActive}
                    onChange={handleInputChange}
                  />
                  활성화
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn submit-btn">
                  배너 추가
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  취소
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <div className="loading-state">
            <p>배너 목록을 불러오는 중...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="empty-state">
            <p>등록된 배너가 없습니다.</p>
          </div>
        ) : (
          <ul className="banner-items">
            {banners.map((banner) => (
              <li key={banner.id} className="banner-item">
                <article>
                  <header>
                    <h3>{banner.title}</h3>
                  </header>
                  <div className="banner-info">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={banner.isActive}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleActive(banner);
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="toggle-status">
                      {banner.isActive ? "활성" : "비활성"}
                    </span>
                    <time dateTime={banner.createdAt}>
                      생성일: {new Date(banner.createdAt).toLocaleDateString()}
                    </time>

                    <button
                      onClick={() => handleEditClick(banner)}
                      className="edit-btn"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner)}
                      className="delete-btn"
                    >
                      삭제
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {showEditForm && editingBanner && (
          <section className="banner-edit-form">
            <h3>배너 수정</h3>
            <form onSubmit={handleEditBanner} className="edit-banner-form">
              <div className="form-group">
                <label htmlFor="title">배너 제목</label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditInputChange}
                  placeholder="배너 제목을 입력하세요"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="file">배너 이미지 (선택사항)</label>
                <input
                  type="file"
                  id="edit-file"
                  name="file"
                  onChange={handleEditFileChange}
                  accept="image/*"
                />
                {editSelectedFile && (
                  <p className="file-info">
                    선택된 파일: {editSelectedFile.name}
                  </p>
                )}
                {editingBanner.fileName && !editSelectedFile && (
                  <p className="file-info">
                    현재 파일: {editingBanner.fileName}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={editFormData.isActive}
                    onChange={handleEditInputChange}
                  />
                  활성화
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn submit-btn">
                  수정 완료
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleEditCancel}
                >
                  취소
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

      {/* 공통 모달 사용 */}
      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
        showCancel={modal.showCancel}
      />
    </section>
  );
};

export default BannerManagement;
