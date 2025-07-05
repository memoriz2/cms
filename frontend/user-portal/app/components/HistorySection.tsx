import React, { useState, useEffect, useMemo, useCallback } from "react";
import { API_URL } from "../../config";
import styles from "./HistorySection.module.css"; 

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

  if (error) {
    return (
      <section className={styles.historySection} aria-labelledby="history-heading">
        <h2 id="history-heading" className={styles.historyTitle}>
          HISTORY
        </h2>
        <div className={styles.errorMessage} role="alert">
          {error}
          <button onClick={fetchHistories} className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className={styles.historySection} aria-labelledby="history-heading">
        <h2 id="history-heading" className={styles.historyTitle}>
          HISTORY
        </h2>
        <div className={styles.loading} aria-live="polite">
          연혁을 불러오는 중...
        </div>
      </section>
    );
  }

  if (histories.length === 0) {
    return (
      <section className={styles.historySection} aria-labelledby="history-heading">
        <h2 id="history-heading" className={styles.historyTitle}>
          HISTORY
        </h2>
        <div className={styles.emptyState}>표시할 연혁이 없습니다.</div>
      </section>
    );
  }

  return (
    <section
      className={styles.historySection}
      aria-labelledby="history-heading"
      role="region"
      aria-live="polite"
    >
      <h2 id="history-heading" className={styles.historyTitle}>
        HISTORY
      </h2>
      <div className={styles.historyTimeline}>
        {sortedYears.map((year, yearIndex) => (
          <div key={year} className={styles.yearGroup} data-year={year}>
            <h3 className={styles.yearTitle}>{year}</h3>
            <div className={styles.yearContent}>
              {groupedHistories[year]
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((history, historyIndex) => (
                  <div
                    key={history.id}
                    className={styles.historyItem}
                    data-year={year}
                    data-index={historyIndex}
                  >
                    <div className={styles.historyContent}>
                      <p className={styles.historyDescription}>
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