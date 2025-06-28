import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config";
import TipTapEditor from "./TipTapEditor";
import "./GreetingManagement.css";

interface Greeting {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const GreetingManagement: React.FC = () => {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const [editorReady, setEditorReady] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({
    title: "",
    content: "",
    isActive: false,
  });

  const getGreetings = async () => {
    console.log("=== 인사말 목록 불러오기 시작 ===");
    setLoading(true);
    try {
      const response = await fetch(
        `${API_ENDPOINTS.GREETINGS}/list?size=10&page=0`
      );
      console.log("목록 요청 응답 상태:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("목록 응답 데이터:", data);
        console.log("목록의 첫 번째 항목:", data.content?.[0]);
        console.log("목록의 첫 번째 항목 제목:", data.content?.[0]?.title);
        console.log("목록의 첫 번째 항목 내용:", data.content?.[0]?.content);
        setGreetings(data.content || []);
        console.log("설정된 인사말 목록:", data.content || []);
      } else {
        console.error("목록 불러오기 실패:", response.status);
      }
    } catch (error) {
      console.error("목록 불러오기 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGreetings();
  }, []);

  const handleAddGreeting = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.GREETINGS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addFormData),
      });

      if (response.ok) {
        setShowAddForm(false);
        setAddFormData({ title: "", content: "", isActive: false });
        getGreetings();
      }
    } catch (error) {
      console.error("Error adding greeting:", error);
    }
  };

  const handleUpdateGreeting = async () => {
    if (!editingId) {
      console.error("editingId가 없습니다!");
      return;
    }

    console.log("=== 인사말 수정 시작 ===");
    console.log("editingId:", editingId);
    console.log("수정할 데이터:", addFormData);
    console.log("API 엔드포인트:", `${API_ENDPOINTS.GREETINGS}/${editingId}`);

    const requestBody = JSON.stringify(addFormData);
    console.log("요청 본문:", requestBody);

    try {
      const response = await fetch(`${API_ENDPOINTS.GREETINGS}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      console.log("서버 응답 상태:", response.status);
      console.log(
        "서버 응답 헤더:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        console.log("수정 성공!");
        const responseData = await response.json();
        console.log("서버 응답 데이터:", responseData);
        console.log("수정된 제목:", responseData.title);
        console.log("수정된 내용:", responseData.content);
        setShowAddForm(false);
        setAddFormData({ title: "", content: "", isActive: false });
        setIsEditing(false);
        setEditingId(null);
        getGreetings();
      } else {
        console.error("수정 실패 - 응답 상태:", response.status);
        const errorText = await response.text();
        console.error("에러 내용:", errorText);
      }
    } catch (error) {
      console.error("수정 중 에러 발생:", error);
    }
  };

  const handleEditClick = (greeting: Greeting) => {
    console.log("=== 모달 편집 시작 ===");
    console.log("원본 HTML 길이:", greeting.content.length);
    console.log(
      "이미지 태그 개수:",
      (greeting.content.match(/<img/g) || []).length
    );
    console.log("HTML 일부:", greeting.content.substring(0, 200) + "...");

    setAddFormData({
      title: greeting.title,
      content: greeting.content,
      isActive: greeting.isActive,
    });
    setIsEditing(true);
    setEditingId(greeting.id);
    setShowAddForm(true);
    setModalKey((prev) => prev + 1);
    setEditorReady(false);

    setTimeout(() => {
      console.log("=== 강제 업데이트 실행 ===");
      setAddFormData((prev) => ({
        ...prev,
        content: greeting.content,
      }));
      setEditorReady(true);
    }, 200);
  };

  return (
    <div className="greeting-management">
      <header className="header">
        <h1>인사말 관리</h1>
        {greetings.length === 0 ? (
          <button
            type="button"
            className="btn-add"
            onClick={() => setShowAddForm(true)}
          >
            인사말 추가
          </button>
        ) : (
          <button
            type="button"
            className="btn-edit"
            onClick={() => handleEditClick(greetings[0])}
          >
            인사말 수정
          </button>
        )}
      </header>
      <main className="content">
        {loading ? (
          <section className="loading">
            <p>로딩 중...</p>
          </section>
        ) : (
          <section className="greetings-list">
            {greetings.map((greeting) => (
              <article key={greeting.id} className="greeting-item">
                <header className="greeting-header">
                  <h2>{greeting.title}</h2>
                  <span
                    className={`status ${
                      greeting.isActive ? "active" : "inactive"
                    }`}
                  >
                    {greeting.isActive ? "활성" : "비활성"}
                  </span>
                </header>
                <div className="greeting-content">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: greeting.content,
                    }}
                    className="greeting-content-html"
                    ref={(el) => {
                      if (el) {
                        setTimeout(() => {
                          el.querySelectorAll("mark[data-color]").forEach(
                            (markEl) => {
                              const color = markEl.getAttribute("data-color");
                              if (color) {
                                (markEl as HTMLElement).style.backgroundColor =
                                  color;
                              }
                            }
                          );

                          el.querySelectorAll("[style]").forEach((styleEl) => {
                            const styleAttr = styleEl.getAttribute("style");
                            if (styleAttr) {
                              (styleEl as HTMLElement).setAttribute(
                                "style",
                                styleAttr
                              );
                            }
                          });

                          el.querySelectorAll("table[data-table]").forEach(
                            (table) => {
                              (table as HTMLElement).style.borderCollapse =
                                "collapse";
                              (table as HTMLElement).style.width = "100%";
                              (table as HTMLElement).style.marginBottom =
                                "1rem";

                              table
                                .querySelectorAll("th, td")
                                .forEach((cell) => {
                                  (cell as HTMLElement).style.border =
                                    "1px solid #ddd";
                                  (cell as HTMLElement).style.padding = "8px";
                                  (cell as HTMLElement).style.textAlign =
                                    "left";
                                });

                              table.querySelectorAll("th").forEach((header) => {
                                (header as HTMLElement).style.backgroundColor =
                                  "#f2f2f2";
                                (header as HTMLElement).style.fontWeight =
                                  "bold";
                              });

                              table.removeAttribute("data-table");
                            }
                          );

                          el.querySelectorAll("img[data-image]").forEach(
                            (img) => {
                              (img as HTMLElement).style.maxWidth = "100%";
                              (img as HTMLElement).style.height = "auto";
                              (img as HTMLElement).style.display = "block";
                              (img as HTMLElement).style.margin = "1rem 0";

                              img.removeAttribute("data-image");
                            }
                          );
                        }, 0);
                      }
                    }}
                  />
                </div>
                <footer className="greeting-actions">
                  <time dateTime={greeting.updatedAt}>
                    수정일: {new Date(greeting.updatedAt).toLocaleDateString()}
                  </time>
                </footer>
              </article>
            ))}
          </section>
        )}
      </main>
      {showAddForm && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowAddForm(false);
            setIsEditing(false);
            setEditingId(null);
            setAddFormData({ title: "", content: "", isActive: false });
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {isEditing ? "인사말 수정" : "새 인사말 추가"}
              </h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowAddForm(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setAddFormData({ title: "", content: "", isActive: false });
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <form
              className="modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                console.log("=== 폼 제출 이벤트 발생 ===");
                console.log("isEditing:", isEditing);
                console.log("editingId:", editingId);
                console.log("현재 폼 데이터:", addFormData);

                if (isEditing) {
                  console.log("수정 함수 호출");
                  handleUpdateGreeting();
                } else {
                  console.log("추가 함수 호출");
                  handleAddGreeting();
                }
              }}
            >
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  제목 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  value={addFormData.title}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, title: e.target.value })
                  }
                  required
                  placeholder="인사말 제목을 입력하세요"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content" className="form-label">
                  내용 <span className="required">*</span>
                </label>
                <div className="editor-container">
                  {editorReady && (
                    <TipTapEditor
                      key={`editor-${
                        editingId || "new"
                      }-${showAddForm}-${modalKey}`}
                      value={addFormData.content}
                      onChange={(value) =>
                        setAddFormData((prev) => ({ ...prev, content: value }))
                      }
                    />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">활성화 상태</label>
                <div className="toggle-container">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={addFormData.isActive}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          isActive: e.target.checked,
                        })
                      }
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">
                    {addFormData.isActive ? "활성화됨" : "비활성화됨"}
                  </span>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setIsEditing(false);
                    setEditingId(null);
                    setAddFormData({ title: "", content: "", isActive: false });
                  }}
                >
                  취소
                </button>
                <button type="submit" className="btn-primary">
                  {isEditing ? "수정 완료" : "추가 완료"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GreetingManagement;
