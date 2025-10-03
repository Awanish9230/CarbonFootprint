import React from "react";
import { motion } from "framer-motion";

export default function AboutSection({ title, description, image, reverse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col md:flex-row items-center my-12 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <img
        src={image}
        alt={title}
        className="w-full md:w-1/2 rounded-xl shadow-lg mb-6 md:mb-0"
      />
      <div className="md:w-1/2 md:px-12 text-center md:text-left">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-gray-300 dark:text-gray-200">{description}</p>
      </div>
    </motion.div>
  );
}
