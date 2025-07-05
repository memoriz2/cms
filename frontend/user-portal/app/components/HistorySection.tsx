import React, { useState, useEffect, useMemo, useCallback } from "react";
import { API_URL } from "../../config";
import "./HistorySection.css"; // 일반 CSS 파일 import
// import styles from "./HistorySection.module.css"; // 임시 주석 처리

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
      <section className="historySection" aria-labelledby="history-heading">
        <h2 id="history-heading" className="historyTitle">
          HISTORY
        </h2>
        <div className="errorMessage" role="alert">
          {error}
          <button onClick={fetchHistories} className="retryButton">
            다시 시도
          </button>
        </div>
      </section>
    );
  }

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <section className="historySection" aria-labelledby="history-heading">
        <h2 id="history-heading" className="historyTitle">
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
      <section className="historySection" aria-labelledby="history-heading">
        <h2 id="history-heading" className="historyTitle">
          HISTORY
        </h2>
        <div className="emptyState">표시할 연혁이 없습니다.</div>
      </section>
    );
  }

  return (
    <section
      className="historySection"
      aria-labelledby="history-heading"
      role="region"
      aria-live="polite"
    >
      <h2 id="history-heading" className="historyTitle">
        HISTORY
      </h2>
      <div className="historyTimeline">
        {sortedYears.map((year, yearIndex) => (
          <div key={year} className="yearGroup" data-year={year}>
            <h3 className="yearTitle">{year}</h3>
            <div className="yearContent">
              {groupedHistories[year]
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((history, historyIndex) => (
                  <div
                    key={history.id}
                    className="historyItem"
                    data-year={year}
                    data-index={historyIndex}
                  >
                    <div className="historyContent">
                      <p className="historyDescription">
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
