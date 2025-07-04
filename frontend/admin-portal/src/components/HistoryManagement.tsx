import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import Modal from "./Modal";
import ToggleSwitch from "./ToggleSwitch";
import "./HistoryManagement.css";

interface HistoryData {
  id: number;
  year: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

const HistoryManagement = () => {
  const [histories, setHistories] = useState<HistoryData[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<HistoryData | null>(null);
  const [formData, setFormData] = useState({
    year: "",
    description: "",
    sortOrder: 0,
    isActive: false,
  });

  const fetchHistories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_ENDPOINTS.HISTORIES, {
        params: { page, size },
      });
      console.log("연혁 데이터:", res.data.content);
      setHistories(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("연혁 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (data: HistoryData | null = null) => {
    console.log("openModal 호출 - 데이터:", data);

    if (data) {
      console.log("수정 모드 - 원본 데이터:", data);
      setEditData(data);
      setFormData({
        year: data.year,
        description: data.description,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      });
    } else {
      console.log("등록 모드");
      setFormData({
        year: "",
        description: "",
        sortOrder: 0,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleCreate = async (formData: any) => {
    try {
      await axios.post(API_ENDPOINTS.HISTORIES, formData);
      fetchHistories();
    } catch (error) {
      console.error("연혁 생성 실패:", error);
    }
  };

  const handleUpdate = async (id: number, formData: any) => {
    try {
      await axios.put(`${API_ENDPOINTS.HISTORIES}/${id}`, formData);
      fetchHistories();
    } catch (error) {
      console.error("연혁 수정 실패:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_ENDPOINTS.HISTORIES}/${id}`);
      fetchHistories();
    } catch (error) {
      console.error("연혁 삭제 실패:", error);
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await axios.put(`${API_ENDPOINTS.HISTORIES}/${id}/active`, null, {
        params: { isActive: !isActive },
      });
      fetchHistories();
    } catch (error) {
      console.error("활성화 토글 실패:", error);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, [page, size]);

  return (
    <div className="history-management">
      <header className="header">
        <h1>연혁 관리</h1>
        <button type="button" className="btn-add" onClick={() => openModal()}>
          연혁 추가
        </button>
      </header>
      <main className="content">
        {loading ? (
          <div className="loading">연혁 목록을 불러오는 중...</div>
        ) : (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>연도</th>
                  <th>설명</th>
                  <th>정렬 순서</th>
                  <th>활성화</th>
                  <th>생성일</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {histories.map((history) => (
                  <tr key={history.id}>
                    <td>{history.year}</td>
                    <td className="description-cell">
                      {history.description.length > 50
                        ? `${history.description.substring(0, 50)}...`
                        : history.description}
                    </td>
                    <td>{history.sortOrder}</td>
                    <td>
                      <ToggleSwitch
                        checked={history.isActive}
                        onChange={() =>
                          handleToggleActive(history.id, history.isActive)
                        }
                      />
                    </td>
                    <td>{new Date(history.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => openModal(history)}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => handleDelete(history.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {histories.length === 0 && (
              <div className="no-data">등록된 연혁이 없습니다.</div>
            )}
          </div>
        )}
      </main>

      <Modal isOpen={modalOpen} onClose={closeModal}>
        <header className="modal-header">
          <h2 id="modal-title">{editData ? "연혁 수정" : "연혁 등록"}</h2>
        </header>
        <main className="modal-body">
          <form
            onSubmit={handleFormSubmit}
            aria-labelledby="modal-title"
            id="history-form"
          >
            <fieldset>
              <legend className="visually-hidden">연혁 정보</legend>

              <div className="form-group">
                <label htmlFor="year" className="required">
                  연도
                  <span className="required-mark" aria-label="필수">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  placeholder="연도를 입력해주세요.(예: 2024)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="required">
                  설명
                  <span className="required-mark" aria-label="필수">
                    *
                  </span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  placeholder="연혁에 대한 설명을 입력하세요."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sortOrder" className="required">
                  정렬 순서
                  <span className="required-mark" aria-label="필수">
                    *
                  </span>
                </label>
                <input
                  type="number"
                  id="sortOrder"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  placeholder="정렬 순서를 입력해주세요.(예: 1)"
                  min="0"
                />
              </div>

              <div className="form-group">
                <fieldset className="checkbox-fieldset">
                  <legend className="visually-hidden">활성화 설정</legend>
                  <div className="toggle-row">
                    <ToggleSwitch
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(checked) => {
                        setFormData((prev) => ({ ...prev, isActive: checked }));
                      }}
                      aria-label="활성화 상태 토글"
                    />
                    <span className="toggle-label">
                      활성화(현재: {formData.isActive ? "활성" : "비활성"})
                    </span>
                  </div>
                  <p className="help-text">
                    활성화된 연혁은 사용자 페이지에 표시됩니다.
                  </p>
                </fieldset>
              </div>
            </fieldset>
          </form>
        </main>
        <footer className="modal-footer">
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={closeModal}>
              취소
            </button>
            <button
              type="submit"
              className="submit-btn"
              form="history-form"
              aria-label={editData ? "수정 완료" : "등록 완료"}
            >
              {editData ? "수정" : "등록"}
            </button>
          </div>
        </footer>
      </Modal>
    </div>
  );
};

export default HistoryManagement;
