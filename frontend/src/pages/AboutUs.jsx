import React from "react";
import AboutSection from "../components/AboutSection";
import missionImg from "../assets/mission.jpg";
import visionImg from "../assets/vision.jpg";
import whatwedoImg from "../assets/whatwedo.jpg";
import importanceImg from "../assets/importanceImg.jpg";
import teamImg from "../assets/team.jpg";
import ctaImg from "../assets/ctaImg.jpg";
import { motion } from "framer-motion";

export default function AboutUs() {
  const buttonClass =
    "px-5 py-3 sm:px-6 sm:py-3 rounded-xl shadow-lg text-white font-semibold text-sm sm:text-base md:text-lg " +
    "bg-[linear-gradient(315deg,#003153_0%,#1B1B1B_74%)] hover:scale-105 hover:shadow-blue-500/50 transition-all duration-300";

  const sections = [
    {
      title: "Our Mission",
      description:
        "Our mission is to empower individuals and organizations to understand, track, and reduce their carbon footprint, contributing to a sustainable future for our planet.",
      image: missionImg,
      reverse: false,
    },
    {
      title: "Our Vision",
      description:
        "We envision a world where everyone makes environmentally conscious choices and collectively reduces global carbon emissions.",
      image: visionImg,
      reverse: true,
    },
    {
      title: "What We Do",
      description:
        "Calculate carbon emissions from daily activities, travel, energy use, and purchases. Suggest actionable ways to reduce your carbon footprint. Track progress over time with dashboards and personalized insights.",
      image: whatwedoImg,
      reverse: false,
    },
    {
      title: "Why It Matters",
      description:
        "Small actions collectively make a big difference. By understanding your carbon footprint, you can make informed decisions that protect the environment and fight climate change.",
      image: importanceImg,
      reverse: true,
    },
    {
      title: "Meet Our Team",
      description:
        "Our team of environmental enthusiasts, developers, and sustainability experts are committed to making climate action easy and effective.",
      image: teamImg,
      reverse: false,
    },
  ];

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

      {/* Sections alternating left/right images */}
      {sections.map((sec, idx) => (
        <motion.section
          key={idx}
          className={`w-full flex flex-col sm:flex-row ${sec.reverse ? "sm:flex-row-reverse" : ""
            } items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 md:px-24 py-12 rounded-2xl snap-start`}
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{sec.title}</h2>
            <p className="text-lg sm:text-xl md:text-2xl opacity-90">{sec.description}</p>
          </div>
        </motion.section>
      ))}

      {/* Call to Action */}
      <motion.section
        className="w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-green-700 to-green-500 rounded-2xl px-6 md:px-24 py-12 snap-start"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img src={ctaImg} alt="Join Us" className="w-full md:w-1/3 rounded-xl mb-6 md:mb-0" />
        <div className="md:ml-12 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">Take Action Today</h2>
          <p className="mb-4">
            Start your journey today—calculate your carbon footprint, discover actionable tips, and join our community of eco-conscious changemakers.
          </p>
          <button
            onClick={() => {
              // Redirect to Home page and scroll to Quick Log
              window.location.href = "/#quick-log";
            }}
            className={buttonClass}
          >
            Quick Log
          </button>


        </div>
      </motion.section>
    </div>
  );
}
