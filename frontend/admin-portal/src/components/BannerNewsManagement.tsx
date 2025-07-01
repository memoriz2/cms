import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS, API_URL } from "../config";
import Modal from "./Modal";
import ToggleSwitch from "./ToggleSwitch";
import "./BannerNewsManagement.css";

interface BannerNewsData {
  id: number;
  title: string;
  source: string;
  imagePath: string;
  linkUrl: string;
  isActive: boolean;
  createdAt: string;
}

const BannerNewsManagement = () => {
  const [bannerNews, setBannerNews] = useState<BannerNewsData[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<BannerNewsData | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    source: "",
    imagePath: "",
    linkUrl: "",
    isActive: false,
  });
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeCount, setActiveCount] = useState(0);

  const fetchActiveCount = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.BANNER_NEWS}/active-count`
      );
      setActiveCount(response.data);
    } catch (error) {
      console.error("활성화된 배너 뉴스 개수 조회 실패:", error);
    }
  };

  const fetchBannerNews = async () => {
    const res = await axios.get(API_ENDPOINTS.BANNER_NEWS, {
      params: { page, size },
    });
    console.log("배너 뉴스 데이터:", res.data.content);
    console.log(
      "첫 번째 항목의 필드들:",
      res.data.content[0] ? Object.keys(res.data.content[0]) : "데이터 없음"
    );
    console.log("첫 번째 항목의 isActive 값:", res.data.content[0]?.isActive);
    console.log("첫 번째 항목의 active 값:", res.data.content[0]?.active);

    // 수정된 항목의 isActive 값 확인
    if (editData) {
      const updatedItem = res.data.content.find(
        (item: any) => item.id === editData.id
      );
      console.log("수정된 항목 찾기:", updatedItem);
      console.log("수정된 항목의 isActive 값:", updatedItem?.isActive);
    }
    setBannerNews(res.data.content);
    setTotalPages(res.data.totalPages);

    // 활성화된 개수도 함께 업데이트
    await fetchActiveCount();
  };

  const handleCreate = async (formData: any) => {
    await axios.post(API_ENDPOINTS.BANNER_NEWS, formData);
    fetchBannerNews();
  };

  const handleUpdate = async (id: number, formData: any) => {
    console.log("handleUpdate 호출 - ID:", id, "데이터:", formData);
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.BANNER_NEWS}/${id}`,
        formData
      );
      console.log("수정 API 응답:", response.data);
      console.log("수정 API 응답의 isActive 값:", response.data.isActive);
      fetchBannerNews();
    } catch (error) {
      console.error("수정 API 에러:", error);
      if (axios.isAxiosError(error)) {
        console.error("에러 응답:", error.response?.data);
      }
    }
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`${API_ENDPOINTS.BANNER_NEWS}/${id}`);
    fetchBannerNews();
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    console.log("활성화 토글 시도:", { id, isActive, newState: !isActive });

    if (!isActive) {
      const activeCount = bannerNews.filter((item) => item.isActive).length;
      console.log("현재 활성화된 개수:", activeCount);
      if (activeCount >= 4) {
        setWarningMessage("최대 4개까지만 활성화할 수 있습니다.");
        setWarningModalOpen(true);
        return;
      }
    }

    try {
      const url = `${API_ENDPOINTS.BANNER_NEWS}/${id}/active`;
      const params = { isActive: !isActive };
      console.log("API 호출:", { url, params });

      const response = await axios.put(url, null, { params });
      console.log("API 응답:", response.data);

      fetchBannerNews();
    } catch (error) {
      console.error("활성화 토글 실패:", error);
      if (axios.isAxiosError(error)) {
        console.error("응답 데이터:", error.response?.data);
        console.error("상태 코드:", error.response?.status);

        // 서버에서 받은 에러 메시지가 있으면 사용
        if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("활성화 상태 변경에 실패했습니다.");
        }
      } else {
        setErrorMessage("활성화 상태 변경에 실패했습니다.");
      }
      setErrorModalOpen(true);
    }
  };

  useEffect(() => {
    fetchBannerNews();
  }, [page, size]);

  const openModal = async (data: BannerNewsData | null = null) => {
    console.log("openModal 호출 - 데이터:", data);

    // 활성화된 개수 업데이트
    await fetchActiveCount();

    if (data) {
      console.log("수정 모드 - 원본 데이터 isActive:", data.isActive);
      setEditData(data);
      setFormData({
        title: data.title,
        source: data.source,
        imagePath: data.imagePath,
        linkUrl: data.linkUrl,
        isActive: data.isActive,
      });
    } else {
      console.log("등록 모드");
      setFormData({
        title: "",
        source: "",
        imagePath: "",
        linkUrl: "",
        isActive: false,
      });
      setEditData(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditData(null);
    setModalOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("폼 제출 - 현재 formData:", formData);
    console.log("폼 제출 - editData:", editData);

    if (editData) {
      console.log("수정 모드 - 전송할 데이터:", formData);
      await handleUpdate(editData.id, formData);
    } else {
      console.log("등록 모드 - 전송할 데이터:", formData);
      await handleCreate(formData);
    }
    closeModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(
          `${API_ENDPOINTS.UPLOADS}/banner-news`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setFormData((prev) => ({
          ...prev,
          imagePath: response.data.url,
        }));
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        setErrorMessage("이미지 업로드에 실패했습니다.");
        setErrorModalOpen(true);
      }
    }
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({
      ...prev,
      imagePath: "",
    }));
  };

  return (
    <section className="banner-news-management">
      <header>
        <h1>배너 뉴스 관리</h1>
        <button
          type="button"
          className="banner-news-add-btn"
          onClick={() => openModal()}
        >
          등록
        </button>
      </header>
      <main>
        <div className="banner-news-table-container">
          <table className="banner-news-table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">이미지</th>
                <th scope="col">제목</th>
                <th scope="col">출처</th>
                <th scope="col">링크</th>
                <th scope="col">활성화</th>
                <th scope="col">생성일</th>
                <th scope="col">액션</th>
              </tr>
            </thead>
            <tbody>
              {bannerNews.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                bannerNews.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {item.imagePath ? (
                        <img
                          src={`${API_URL}${item.imagePath}?t=${Date.now()}`}
                          alt={`${item.title} 미리보기`}
                          style={{
                            width: "60px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          onError={(e) => {
                            console.error("이미지 로드 실패:", item.imagePath);
                            console.error("이미지 요소:", e.currentTarget);
                            console.error("이미지 src:", e.currentTarget.src);
                            e.currentTarget.style.display = "none";
                            const nextSibling = e.currentTarget
                              .nextSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = "inline";
                            }
                          }}
                          onLoad={() => {
                            console.log("이미지 로드 성공:", item.imagePath);
                          }}
                        />
                      ) : (
                        <span style={{ color: "#999", fontSize: "12px" }}>
                          이미지 없음
                        </span>
                      )}
                      {item.imagePath && (
                        <span
                          style={{
                            color: "#999",
                            fontSize: "12px",
                            display: "none",
                          }}
                        >
                          로드 실패
                        </span>
                      )}
                    </td>
                    <td className="title-cell" title={item.title}>
                      {item.title}
                    </td>
                    <td className="source-cell" title={item.source}>
                      {item.source}
                    </td>
                    <td className="link-cell">
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={item.linkUrl}
                      >
                        {item.linkUrl}
                      </a>
                    </td>
                    <td>
                      <ToggleSwitch
                        checked={item.isActive}
                        onChange={() =>
                          handleToggleActive(item.id, item.isActive)
                        }
                        aria-label={item.isActive ? "활성화됨" : "비활성화됨"}
                      />
                    </td>
                    <td>{item.createdAt?.slice(0, 10)}</td>
                    <td>
                      <button type="button" onClick={() => openModal(item)}>
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <nav className="pagination" aria-label="배너 뉴스 페이지네이션">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            aria-label="이전 페이지"
          >
            이전
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
            aria-label="다음 페이지"
          >
            다음
          </button>
        </nav>
      </main>
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <header className="modal-header">
          <h2 id="modal-title">
            {editData ? "배너 뉴스 수정" : "배너 뉴스 등록"}
          </h2>
        </header>
        <main className="modal-body">
          <form
            onSubmit={handleFormSubmit}
            aria-labelledby="modal-title"
            id="banner-news-form"
          >
            <fieldset>
              <legend className="visually-hidden">배너 뉴스 정보</legend>
              <div className="form-group">
                <label htmlFor="title" className="required">
                  제목
                  <span className="required-mark" aria-label="필수">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  placeholder="배너 뉴스 제목을 입력하세요"
                />
              </div>

              <div className="form-group">
                <label htmlFor="source" className="required">
                  출처
                  <span className="required-mark" aria-label="필수">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  placeholder="출처를 입력하세요(예: 언론사, 블로그 등)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="linkUrl">링크 URL</label>
                <input
                  type="url"
                  id="linkUrl"
                  name="linkUrl"
                  value={formData.linkUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="imageFile">이미지 업로드</label>
                <input
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {formData.imagePath && (
                  <div className="image-preview">
                    <img
                      src={
                        formData.imagePath.startsWith("http")
                          ? formData.imagePath
                          : `${API_URL}${formData.imagePath}`
                      }
                      alt="미리보기"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                    <button type="button" onClick={handleImageRemove}>
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <fieldset className="checkbox-fieldset">
                  <legend className="visually-hidden">활성화 설정</legend>
                  <div className="toggle-row">
                    <ToggleSwitch
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(checked) => {
                        console.log(
                          "모달 내부 ToggleSwitch 변경:",
                          checked,
                          "이전 상태:",
                          formData.isActive
                        );

                        // 활성화하려는 경우, 이미 4개가 활성화되어 있으면 경고
                        if (checked && !formData.isActive && activeCount >= 4) {
                          setWarningMessage(
                            "이미 4개의 배너 뉴스가 활성화되어 있습니다. 더 이상 활성화할 수 없습니다."
                          );
                          setWarningModalOpen(true);
                          return;
                        }

                        setFormData((prev) => {
                          const newData = { ...prev, isActive: checked };
                          console.log("새로운 formData:", newData);
                          return newData;
                        });
                      }}
                      aria-label="활성화 상태 토글"
                      aria-describedby="active-description"
                    />
                    <span className="toggle-label">
                      활성화 (현재: {formData.isActive ? "활성" : "비활성"})
                    </span>
                  </div>
                  <p id="active-description" className="help-text">
                    활성화된 배너 뉴스는 사용자 페이지에 표시됩니다.(최대 4개) -
                    현재 {activeCount}개 활성화됨
                  </p>
                </fieldset>
              </div>
            </fieldset>
          </form>
        </main>
        <footer className="modal-footer">
          <div className="form-actions">
            <button
              type="button"
              onClick={closeModal}
              className="cancel-btn"
              aria-label="취소하고 모달 닫기"
            >
              취소
            </button>
            <button
              type="submit"
              form="banner-news-form"
              className="submit-btn"
              aria-label={editData ? "수정 완료" : "등록 완료"}
            >
              {editData ? "수정" : "등록"}
            </button>
          </div>
        </footer>
      </Modal>
      <Modal
        isOpen={warningModalOpen}
        message={warningMessage}
        onClose={() => setWarningModalOpen(false)}
        confirmText="확인"
        showCancel={false}
      />
      <Modal
        isOpen={errorModalOpen}
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
        confirmText="확인"
        showCancel={false}
      />
    </section>
  );
};

export default BannerNewsManagement;
