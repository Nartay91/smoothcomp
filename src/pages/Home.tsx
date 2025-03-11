import SportsSection from "../components/SportsSection";
import { useTranslation } from 'react-i18next';
import "../styles/Home.scss"

const Home = () => {
  const { t } = useTranslation();

    return (
      <div className="home">
        <div className="hero">
          <div className="container">
            <h1 className="title-heading">
              We empower the world's greatest tournaments and athletes
            </h1>
            <div className="buttons">
              <button className="btn primary">{t("Find events")}</button>
              <button className="btn secondary">{t("Create event")}</button>
            </div>
          </div>
        </div>
        <h1 className="sport-header"><p className="yellow">No 1</p> Tournament software for combat sports</h1>
        <SportsSection />
      </div>
    );
  };
  
  export default Home;
  