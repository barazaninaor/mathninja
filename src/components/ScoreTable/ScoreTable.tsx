import "./ScoreTable.css";

export interface ScoreItem {
  DATE: string;
  DURATION: string;
  SUCCESS_RATE: number;
  SCORE: number;
  CORRECT_ANSWERS?: number;
}

export type ScoreSortKey = keyof ScoreItem;

interface ScoreTableProps {
  data: ScoreItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (direction: number) => void;
  sortKey: ScoreSortKey;
  sortDirection: "asc" | "desc";
  onSort: (key: ScoreSortKey) => void;
}

export default function ScoreTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  sortKey,
  sortDirection,
  onSort,
}: ScoreTableProps) {
  const sortableHeaders: Array<{ key: ScoreSortKey; label: string }> = [
    { key: "DATE", label: "Date" },
    { key: "DURATION", label: "Duration" },
    { key: "SUCCESS_RATE", label: "Success Rate" },
    { key: "CORRECT_ANSWERS", label: "Correct Answers" },
    { key: "SCORE", label: "Score" },
  ];

  return (
    <div className="table-container stats-box">
      <h3>SESSION HISTORY</h3>
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {sortableHeaders.map(({ key, label }) => (
                <th key={key}>
                  <button
                    className={`sort-button ${sortKey === key ? "active" : ""}`}
                    onClick={() => onSort(key)}
                    aria-label={`Sort by ${label}`}
                  >
                    {label}
                    <span
                      className={`sort-indicator ${sortDirection}`}
                      aria-hidden="true"
                    >
                      <span className="sort-arrow-up" />
                      <span className="sort-arrow-down" />
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data || data.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-cell">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={`${item.DATE}-${index}`}>
                  <td>{item.DATE}</td>
                  <td>{item.DURATION}</td>
                  <td>{item.SUCCESS_RATE}%</td>
                  <td>
                    {item.CORRECT_ANSWERS ??
                      Math.round((item.SUCCESS_RATE / 100) * 30)}
                    /30
                  </td>
                  <td className="score-value">{item.SCORE}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination-controls">
          <button onClick={() => onPageChange(-1)} disabled={currentPage === 1}>
            PREVIOUS
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
