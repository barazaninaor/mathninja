import naorImg from "../../assets/naor.jpg";
import { GlassCard } from "../../components/GlassCard/GlassCard";
import { MainTitle } from "../../components/MainTitle/MainTitle";
import { ResponsiveVideo } from "../../components/ResponsiveVideo/ResponsiveVideo";
import "./About.css";

export const About = () => {
  return (
    <div className="about-page">
      <MainTitle text="About" />

      <GlassCard>
        <img src={naorImg} alt="Naor Barazani" className="profile-img" />

        <h1 className="about-header-title">Naor Barazani</h1>
        <h2 className="subtitle">The Story Behind The Legendary Times Table</h2>

        <div className="personal-story-section">
          <p>
            Ever since I was a little boy, my grandfather would challenge me
            with mental calculations out of nowhere, asking questions like 74 ×
            72. I suppose that’s where I first caught this lifelong passion for
            numbers and calculation.
          </p>
          <p>
            Years later, while preparing for the Psychometric Entrance Exam, we
            were given exercises on the times tables from 1 to 20, and I was
            completely hooked. I ended up spending most of my preparation time
            practicing numerical calculations instead of the actual exam
            material. After the exam, I searched high and low for a website that
            could simulate those exercises, but back then AI didn't exist and
            decent options were scarce. Eventually, I found a clunky site with
            terrible graphics. After a few years of daily use, even that site
            shut down.
          </p>
          <p>
            I asked a childhood friend to build a similar app for me - it was an
            improvement, but I couldn't customize it with all the features I
            truly wanted. At first, my entire drive to learn programming stemmed
            from the sheer desire to create this exact platform myself. I
            started learning Python before the AI boom, taking my very first
            steps into the coding world just to bring this idea to life. Later
            on, this even became my very first project during a course using
            Vanilla JavaScript, and this current website is a massive, advanced
            upgrade of that original project.
          </p>
          <p>
            Combining my background in philosophy with modern software
            development, building this platform from scratch feels like a
            complete and meaningful circle of life - turning an old childhood
            passion and a long-standing vision into reality, exactly the way I
            envisioned it.
          </p>
        </div>

        {/* קונטיינר המציג את שני הסרטונים זה לצד זה במסכים רחבים */}
        <div className="videos-grid">
          <ResponsiveVideo
            videoUrl="https://www.youtube.com/embed/jEqU6BIIEiw?hl=en"
            title="My First Python Project | How I Keep My Mind Sharp"
          />

          <ResponsiveVideo
            videoUrl="https://www.youtube.com/embed/gbMWRa0guhg?hl=en"
            title="Death as a Motive for Life"
          />
        </div>
      </GlassCard>
    </div>
  );
};
