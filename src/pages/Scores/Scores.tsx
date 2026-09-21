import { useEffect, useState } from "react";
import ScoreChart from "../../components/ScoreChart/ScoreChart";
import ScoreTable, {
  type ScoreItem,
  type ScoreSortKey,
} from "../../components/ScoreTable/ScoreTable";
import { MainTitle } from "../../components/MainTitle/MainTitle";
import "./Scores.css";

const LEVELS = ["Easy", "Medium", "Hard", "Insane"];
const TIME_FILTERS = [
  { id: "all", label: "All Time" },
  { id: "week", label: "Last Week" },
  { id: "month", label: "Last Month" },
  { id: "year", label: "Last Year" },
];
const LEVEL_IDS: Record<string, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
  Insane: 4,
};

const MOCK_DATES = [
  "09/20/2026",
  "08/14/2026",
  "07/03/2026",
  "05/22/2026",
  "03/11/2026",
  "12/19/2025",
  "10/06/2025",
  "08/27/2025",
  "06/15/2025",
  "02/28/2025",
  "11/09/2024",
  "08/18/2024",
  "04/07/2024",
  "12/21/2023",
];

function createMockScores(
  scorePattern: number[],
  successPattern: number[],
  durationOffset: number,
): ScoreItem[] {
  return MOCK_DATES.map((date, index) => ({
    DATE: date,
    DURATION: `${2 + Math.floor((index + durationOffset) / 5)}:${String(
      12 + ((index * 13 + durationOffset * 7) % 48),
    ).padStart(2, "0")}`,
    SUCCESS_RATE: successPattern[index],
    SCORE: scorePattern[index],
    CORRECT_ANSWERS: Math.round((successPattern[index] / 100) * 30),
  }));
}

const MOCK_SCORES_BY_LEVEL: Record<string, ScoreItem[]> = {
  Easy: createMockScores(
    [72, 78, 81, 84, 86, 88, 90, 91, 93, 94, 95, 96, 97, 98],
    [70, 77, 80, 83, 87, 87, 90, 90, 93, 93, 97, 97, 97, 100],
    1,
  ),
  Medium: createMockScores(
    [68, 74, 79, 83, 86, 89, 91, 93, 94, 95, 96, 97, 98, 99],
    [67, 73, 77, 83, 87, 87, 90, 93, 93, 97, 97, 97, 100, 100],
    2,
  ),
  Hard: createMockScores(
    [61, 69, 73, 78, 82, 85, 88, 90, 92, 93, 95, 96, 97, 98],
    [60, 67, 73, 77, 80, 83, 87, 90, 90, 93, 93, 97, 97, 100],
    3,
  ),
  Insane: createMockScores(
    [48, 56, 63, 69, 74, 78, 82, 85, 88, 90, 92, 94, 96, 97],
    [47, 53, 60, 67, 70, 77, 80, 83, 87, 90, 90, 93, 97, 100],
    4,
  ),
};

function getSavedLevel() {
  const savedLevel = localStorage.getItem("selectedLevel");
  return savedLevel && LEVELS.includes(savedLevel) ? savedLevel : "Easy";
}

function getSortValue(item: ScoreItem, key: ScoreSortKey): number {
  if (key === "DATE") return new Date(item.DATE).getTime();
  if (key === "DURATION") {
    const [minutes, seconds] = item.DURATION.split(":").map(Number);
    return minutes * 60 + seconds;
  }
  if (key === "CORRECT_ANSWERS") {
    return item.CORRECT_ANSWERS ?? Math.round((item.SUCCESS_RATE / 100) * 30);
  }
  return item[key];
}

export default function Scores() {
  const [currentLevel, setCurrentLevel] = useState(getSavedLevel);
  const [currentTimeFilter, setCurrentTimeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState<ScoreItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<ScoreSortKey>("DATE");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const rowsPerPage = 10;

  useEffect(() => {
    refreshData();
  }, [currentLevel, currentTimeFilter, startDate, endDate]);

  const getDateRange = () => {
    let start = startDate;
    const end = endDate;
    if (["week", "month", "year"].includes(currentTimeFilter)) {
      const date = new Date();
      if (currentTimeFilter === "week") date.setDate(date.getDate() - 7);
      if (currentTimeFilter === "month") date.setMonth(date.getMonth() - 1);
      if (currentTimeFilter === "year")
        date.setFullYear(date.getFullYear() - 1);
      start = date.toISOString().split("T")[0];
    }
    return { start, end };
  };

  const getFilteredMockScores = () => {
    const { start, end } = getDateRange();
    const startTime = start
      ? new Date(`${start}T00:00:00`).getTime()
      : -Infinity;
    const endTime = end ? new Date(`${end}T23:59:59`).getTime() : Infinity;

    return MOCK_SCORES_BY_LEVEL[currentLevel].filter((item) => {
      const [month, day, year] = item.DATE.split("/").map(Number);
      const itemTime = new Date(year, month - 1, day).getTime();
      return itemTime >= startTime && itemTime <= endTime;
    });
  };

  const refreshData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFilteredData(getFilteredMockScores());
      setCurrentPage(1);
      return;
    }

    const { start, end } = getDateRange();
    const params = new URLSearchParams({
      levelId: String(LEVEL_IDS[currentLevel] || LEVEL_IDS.Insane),
      startDate: start,
      endDate: end,
    });

    try {
      const response = await fetch(`/api/scores?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        setFilteredData(getFilteredMockScores());
        setCurrentPage(1);
        return;
      }
      const data: ScoreItem[] = await response.json();
      setFilteredData(
        Array.isArray(data) && data.length > 0 ? data : getFilteredMockScores(),
      );
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch scores:", error);
      setFilteredData(getFilteredMockScores());
      setCurrentPage(1);
    }
  };

  const sortedData = [...filteredData].sort((first, second) => {
    const firstValue = getSortValue(first, sortKey);
    const secondValue = getSortValue(second, sortKey);
    const comparison =
      firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;
    return sortDirection === "asc" ? comparison : -comparison;
  });
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedItems = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <div className="stats-dashboard">
      <header className="stats-header">
        <MainTitle text={`${currentLevel} performance`} />
        <div className="level-selector">
          {LEVELS.map((level) => (
            <button
              key={level}
              className={`level-btn ${currentLevel === level ? "active" : ""}`}
              onClick={() => {
                setCurrentLevel(level);
                localStorage.setItem("selectedLevel", level);
              }}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="time-selector">
          <div className="preset-filters">
            {TIME_FILTERS.map((period) => (
              <button
                key={period.id}
                className={`time-btn ${currentTimeFilter === period.id ? "active" : ""}`}
                onClick={() => {
                  setCurrentTimeFilter(period.id);
                  setStartDate("");
                  setEndDate("");
                }}
              >
                {period.label}
              </button>
            ))}
          </div>
          <div className="custom-date-container">
            <input
              type="date"
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);
                setCurrentTimeFilter("custom");
              }}
            />
            <span className="date-separator">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => {
                setEndDate(event.target.value);
                setCurrentTimeFilter("custom");
              }}
            />
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        <ScoreChart data={filteredData} />
        <ScoreTable
          data={paginatedItems}
          currentPage={currentPage}
          totalPages={totalPages}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={(key) => {
            if (key === sortKey) {
              setSortDirection((direction) =>
                direction === "asc" ? "desc" : "asc",
              );
            } else {
              setSortKey(key);
              setSortDirection("asc");
            }
            setCurrentPage(1);
          }}
          onPageChange={(direction) => {
            setCurrentPage((page) =>
              Math.min(Math.max(page + direction, 1), totalPages),
            );
          }}
        />
      </div>
    </div>
  );
}
