import React, { useState, useEffect, useMemo, useCallback } from "react";
import { API_URL } from "../../config";
import "./HistorySection.css";

interface History {
  id: number;
  year: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

const HistorySection: React.FC = () => {
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/histories/active`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: History[] = await response.json();

      if (Array.isArray(data)) {
        setHistories(data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("연혁 데이터 로드 실패:", error);
      setError("연혁을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistories();
  }, [fetchHistories]);

  // 메모이제이션된 데이터 처리
  const groupedHistories = useMemo(() => {
    const grouped: { [key: string]: History[] } = {};
    histories.forEach((history) => {
      if (!grouped[history.year]) {
        grouped[history.year] = [];
      }
      grouped[history.year].push(history);
    });
    return grouped;
  }, [histories]);

  const sortedYears = useMemo(
    () => Object.keys(groupedHistories).sort((a, b) => b.localeCompare(a)),
    [groupedHistories]
  );

  // 에러 상태 렌더링
  if (error) {
    return (
      <section className="history-section" aria-labelledby="history-heading">
        <h2 id="history-heading" className="history-title">
          HISTORY
        </h2>
        <div className="error-message" role="alert">
          {error}
          <button onClick={fetchHistories} className="retry-button">
            다시 시도
          </button>
        </div>
      </section>
    );
  }

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <section className="history-section" aria-labelledby="history-heading">
        <h2 id="history-heading" className="history-title">
          HISTORY
        </h2>
        <div className="loading" aria-live="polite">
          연혁을 불러오는 중...
        </div>
      </section>
    );
  }

  // 빈 데이터 처리
  if (histories.length === 0) {
    return (
      <section className="history-section" aria-labelledby="history-heading">
        <h2 id="history-heading" className="history-title">
          HISTORY
        </h2>
        <div className="empty-state">표시할 연혁이 없습니다.</div>
      </section>
    );
  }

  return (
    <section
      className="history-section"
      aria-labelledby="history-heading"
      role="region"
      aria-live="polite"
    >
      <h2 id="history-heading" className="history-title">
        HISTORY
      </h2>
      <div className="history-timeline">
        {sortedYears.map((year, yearIndex) => (
          <div key={year} className="year-group" data-year={year}>
            <h3 className="year-title">{year}</h3>
            <div className="year-content">
              {groupedHistories[year]
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((history, historyIndex) => (
                  <div
                    key={history.id}
                    className="history-item"
                    data-year={year}
                    data-index={historyIndex}
                  >
                    <div className="history-content">
                      <p className="history-description">
                        {history.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HistorySection;
