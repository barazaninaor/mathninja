import { useNavigate } from "react-router-dom";
import { MainTitle } from "../../components/MainTitle/MainTitle";
import { SubTitle } from "../../components/SubTitle/SubTitle";
import { PurpleButton } from "../../components/PurpleButton/PurpleButton";
import { TransparentButton } from "../../components/TransparentButton/TransparentButton";
import { BenefitCard } from "../../components/BenefitCard/BenefitCard";
import "./Home.css";

export function Home() {
  const navigate = useNavigate();

  const handleTrainClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/game"); // אם המשתמש מחובר, ניכנס למשחק
    } else {
      navigate("/signin"); // אם המשתמש לא מחובר, נעביר אותו לעמוד ההתחברות
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <MainTitle text="Math Ninja" />
        <SubTitle text="The Path to Multiplication Mastery" />

        <div className="home-buttons">
          <PurpleButton text="Train" onClick={handleTrainClick} />
          <TransparentButton
            text="Create Account"
            onClick={() => navigate("/signup")}
          />
        </div>

        <div className="benefits-grid">
          <BenefitCard
            title="Building a Habit"
            text="Just like brushing your teeth prevents decay, spending 5 minutes a day on mental math keeps your brain sharp. It's a short daily workout that forces you to hold multiple variables, sharpen your focus and upgrade mental clarity."
          />
          <BenefitCard
            title="Improving Memory"
            text="Solving multiplication problems forces your brain to hold and manipulate multiple variables at once. This acts as a high-intensity workout for your short-term memory, significantly improving your ability to retain information."
          />
          <BenefitCard
            title="Developing a Skill"
            text="You encounter quick calculations everywhere in daily life - like checking your change at the grocery store without pulling out your phone. A 5-minute daily investment trains your brain to compute these things instantly and effortlessly."
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
