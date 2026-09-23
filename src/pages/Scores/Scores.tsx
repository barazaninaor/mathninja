import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScoreChart from "../../components/ScoreChart/ScoreChart";
import ScoreTable, {
  type ScoreItem,
  type ScoreSortKey,
} from "../../components/ScoreTable/ScoreTable";
import { MainTitle } from "../../components/MainTitle/MainTitle";
import AuthModal from "../../components/AuthModal/AuthModal";
import "./Scores.css";
import { getScores } from "../../apiService";

const LEVELS = ["Easy", "Medium", "Hard", "Insane"] as const;
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

// Helper function to get the saved level from localStorage or default to "Easy"
function getSavedLevel() {
  const savedLevel = localStorage.getItem("selectedLevel");
  return savedLevel && LEVELS.includes(savedLevel as any) ? savedLevel : "Easy";
}

// Helper function to extract sortable numeric values from score items
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
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Authentication check on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAuthModal(true);
    }
  }, []);

  const [currentLevel, setCurrentLevel] = useState(getSavedLevel);
  const [currentTimeFilter, setCurrentTimeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState<ScoreItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<ScoreSortKey>("DATE");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const rowsPerPage = 10;

  // Fetch scores whenever level, time filter, or custom dates change
  useEffect(() => {
    fetchScoresData();
  }, [currentLevel, currentTimeFilter, startDate, endDate]);

  // Calculate start and end date boundaries based on selected filter
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

  // Fetch real user score data from backend API
  const fetchScoresData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    const { start, end } = getDateRange();
    const levelId = LEVEL_IDS[currentLevel] || 1;

    try {
      const data = await getScores(levelId, start, end);
      setFilteredData(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch scores from API:", error);
      setFilteredData([]);
      setCurrentPage(1);
    }
  };

  // Sort and paginate data for display
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

        {/* Level Selector */}
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

        {/* Time Filters & Date Range Picker */}
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

      {/* Main Dashboard Grid containing Chart and Table */}
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

      {/* Authentication Modal popup */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          navigate("/");
        }}
      />
    </div>
  );
}
