import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config";
import TipTapEditor from "./TipTapEditor";

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

  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({
    title: "",
    content: "",
    isActive: false,
  });

  const getGreetings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.GREETINGS}/list`);
      const data = await response.json();
      setGreetings(data.content || []);
    } catch (error) {
      console.error("Error fetching greetings:", error);
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
    if (!editingId) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.GREETINGS}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addFormData),
      });

      if (response.ok) {
        setShowAddForm(false);
        setAddFormData({ title: "", content: "", isActive: false });
        setIsEditing(false);
        setEditingId(null);
        getGreetings();
      }
    } catch (error) {
      console.error("Error updating greeting:", error);
    }
  };

  const handleEditClick = (greeting: Greeting) => {
    setAddFormData({
      title: greeting.title,
      content: greeting.content,
      isActive: greeting.isActive,
    });
    setIsEditing(true);
    setEditingId(greeting.id);
    setShowAddForm(true);
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
        <section className="form-section" aria-labelledby="form-title">
          <h3 id="form-title">
            {isEditing ? "인사말 수정" : "새 인사말 추가"}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              isEditing ? handleUpdateGreeting() : handleAddGreeting();
            }}
          >
            <fieldset>
              <legend>인사말 정보</legend>
              <div>
                <label htmlFor="title">제목</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={addFormData.title}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, title: e.target.value })
                  }
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="content">내용</label>
                <TipTapEditor
                  value={addFormData.content}
                  onChange={(value) =>
                    setAddFormData({ ...addFormData, content: value })
                  }
                />
              </div>
              <div>
                <label htmlFor="isActive">활성화</label>
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
                  <span className="slider"></span>
                </label>
              </div>
            </fieldset>
            <div className="form-actions">
              <button type="submit">{isEditing ? "수정" : "추가"}</button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setAddFormData({ title: "", content: "", isActive: false });
                }}
              >
                취소
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default GreetingManagement;
