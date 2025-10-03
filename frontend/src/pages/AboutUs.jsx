import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import missionImg from "../assets/mission.jpg";
import visionImg from "../assets/vision.jpg";
import whatwedoImg from "../assets/whatwedo.jpg";
import importanceImg from "../assets/importanceImg.jpg";
import teamImg from "../assets/team.jpg";
import ctaImg from "../assets/ctaImg.jpg";

export default function AboutUs() {
  const navigate = useNavigate();

  const buttonClass =
    "px-6 py-3 rounded-xl shadow-lg text-white font-semibold text-sm sm:text-base md:text-lg " +
    "bg-[linear-gradient(315deg,#003153_0%,#1B1B1B_74%)] hover:scale-105 hover:shadow-blue-500/50 transition-all duration-300";

  const sections = [
    {
      title: "Our Mission",
      description:
        "Empowering individuals and organizations to track and reduce their carbon footprint for a sustainable future.",
      image: missionImg,
      reverse: false,
    },
    {
      title: "Our Vision",
      description:
        "A world where everyone makes environmentally conscious choices and collectively reduces global carbon emissions.",
      image: visionImg,
      reverse: true,
    },
    {
      title: "What We Do",
      description:
        "Calculate carbon emissions from daily activities, travel, energy use, and purchases. Suggest actionable ways to reduce your footprint and track progress over time.",
      image: whatwedoImg,
      reverse: false,
    },
    {
      title: "Why It Matters",
      description:
        "Small actions collectively make a big difference. Understanding your carbon footprint helps protect the environment and fight climate change.",
      image: importanceImg,
      reverse: true,
    },
    {
      title: "Meet Our Team",
      description:
        "Our team of developers, designers, and sustainability experts make climate action easy and effective.",
      image: teamImg,
      reverse: false,
    },
  ];

  const handleViewTeam = () => {
    navigate("/#team-section");
  };

  return (
    <div className="space-y-16 w-full">

      {/* Hero Section */}
      <section
        className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] lg:h-screen bg-cover bg-center flex items-center justify-center snap-start rounded-2xl overflow-hidden"
        style={{ backgroundImage: `url(${missionImg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative text-center py-16 sm:py-24 md:py-32">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            About <span className="text-blue-400">Us</span>
          </h1>
          <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
            Learn more about our mission, vision, and the team driving sustainable change.
          </p>
        </div>
      </section>

      {/* Info Sections */}
      {sections.map((sec, idx) => (
        <motion.section
          key={idx}
          className={`w-full flex flex-col sm:flex-row ${sec.reverse ? "sm:flex-row-reverse" : ""} items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 md:px-24 py-12 rounded-2xl snap-start`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={sec.image}
            alt={sec.title}
            className="w-full sm:w-1/2 rounded-xl mb-6 sm:mb-0 object-cover"
          />
          <div className="sm:ml-8 sm:mr-8 text-center sm:text-left flex-1">
            <h2 className="text-5xl sm:text-6xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">
              {sec.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl opacity-90 leading-relaxed">
              {sec.description}
            </p>
            {sec.title === "Meet Our Team" && (
              <button onClick={handleViewTeam} className={buttonClass + " mt-6"}>
                View Team
              </button>
            )}
          </div>
        </motion.section>
      ))}

      {/* Call To Action */}
      <motion.section
        className="w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl px-6 md:px-24 py-16 snap-start shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={ctaImg}
          alt="Join Us"
          className="w-full sm:w-1/2 rounded-xl mb-6 sm:mb-0 object-cover"
        />
        <div className="md:ml-12 text-center md:text-left flex-1">
          <h2 className="text-5xl sm:text-6xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">
            Take Action Today
          </h2>
          <p className="mb-8 text-xl sm:text-2xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed tracking-wide">
            Start your journey today—calculate your carbon footprint, discover actionable tips, and join our community of eco-conscious changemakers.
          </p>
          {/* <button onClick={handleViewTeam} className={buttonClass + " mt-4"}>
            View Team
          </button> */}
        </div>
      </motion.section>
    </div>
  );
}
