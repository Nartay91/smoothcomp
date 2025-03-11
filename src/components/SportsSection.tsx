import React from "react";
import { Link } from "react-router-dom";
import "../styles/SportsSection.scss";
import box from "../assets/box.webp";
import jitsu from "../assets/jiu-jitsu.webp";
import jjif from "../assets/jjif.webp";
import judo from "../assets/judo.webp";
import karate from "../assets/karate.webp";
import mma from "../assets/mma.webp";
import taekwondo from "../assets/taekwondo.webp";
import thaibox from "../assets/thaibox.webp";
import wrestling from "../assets/wrestling.webp";
import arrow from "../assets/arrow_white.svg"

interface Sport {
  name: string;
  image?: string;
  links?: { name: string; url: string }[];
}

const sports: Sport[] = [
  { name: "Jiu-Jitsu", image: jitsu },
  { name: "Judo", image: judo },
  { name: "Karate", image: karate },
  { name: "Thaiboxing", image: thaibox },
  { name: "Wrestling", image: wrestling },
  { name: "JJIF", image: jjif },
  { name: "Taekwondo", image: taekwondo },
  { name: "Boxing", image: box },
  { name: "MMA", image: mma },
  {
    name: "More sports",
    links: [
      { name: "Kickboxing", url: "/kickboxing" },
      { name: "Sambo", url: "/sambo" },
      { name: "Wushu Sanda", url: "/wushu-sanda" },
      { name: "UWW Grappling", url: "/uww-grappling" },
      { name: "Wrestling - Folkstyle", url: "/folkstyle-wrestling" },
      { name: "Wushu Taolo", url: "/wushu-taolo" },
      { name: "+ More", url: "/more-sports" },
    ],
  },
];

const SportsSection: React.FC = () => {
  return (
    <div className="sports-grid">
      {sports.map((sport, index) => (
        <div key={index} className={`sport-card ${sport.image ? "" : "more-sports-card"}`}>
          {sport.image ? (
            <>
              <img src={sport.image} alt={sport.name} />
              <div className="overlay"></div>
            </>
          ) : (
            <div className="more-sports-content">
              <h3 className="more-sports-title">{sport.name}</h3>
              <div className="more-sports-links">
                {sport.links?.map((link, i) => (
                  <Link key={i} to={link.url} className="more-sports-link">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {sport.image && <span className="sport-name">{sport.name}<img className="arrows" src={arrow} alt="" /> </span>}
        </div>
      ))}
    </div>
  );
};

export default SportsSection;