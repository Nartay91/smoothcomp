import { useTranslation } from "react-i18next";
import "../styles/Footer.scss";
import facebook from "../assets/facebook.svg";
import instagram from "../assets/instagram.svg";
import youtube from "../assets/youtube.svg";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-logo">{t("footer.logo")}</div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>{t("footer.athletes.title")}</h4>
              <ul>
                <li>{t("footer.athletes.mobile")}</li>
                <li>{t("footer.athletes.events")}</li>
                <li>{t("footer.athletes.login")}</li>
                <li>{t("footer.athletes.register")}</li>
                <li>{t("footer.athletes.kb")}</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>{t("footer.organizer.title")}</h4>
              <ul>
                <li>{t("footer.organizer.become")}</li>
                <li>{t("footer.organizer.scoreboard")}</li>
                <li>{t("footer.organizer.livestreams")}</li>
                <li>{t("footer.organizer.federation")}</li>
                <li>{t("footer.organizer.pricing")}</li>
                <li>{t("footer.organizer.kb")}</li>
                <li>{t("footer.organizer.support")}</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>{t("footer.community.title")}</h4>
              <ul>
                <li>{t("footer.community.academies")}</li>
                <li>{t("footer.community.affiliations")}</li>
                <li>{t("footer.community.athletes")}</li>
                <li>{t("footer.community.kb")}</li>
                <li>{t("footer.community.support")}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t("footer.bottom.company")}</p>
          <ul className="footer-bottom-links">
            <li>{t("footer.bottom.agreements")}</li>
            <li>{t("footer.bottom.privacy")}</li>
            <li>{t("footer.bottom.about")}</li>
            <li>{t("footer.bottom.logo")}</li>
          </ul>
          <div className="footer-socials">
            <span><img src={youtube} alt="" /></span>
            <span><img src={facebook} alt="" /></span>
            <span><img src={instagram} alt="" /></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;