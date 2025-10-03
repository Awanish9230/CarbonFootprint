import React from "react";
import { motion } from "framer-motion";
import anirudhImg from "../assets/anirudh.jpg";
import arushiImg from "../assets/arushi.jpg";
import shantanuImg from "../assets/shantanu.jpg";
import arthImg from "../assets/arth.jpg";
import awanishImg from "../assets/awanish.jpg";

const teamMembers = [
    {
        name: "Anirudh Singh",
        role: "Frontend Developer",
        img: anirudhImg,
        desc: "Focused on building responsive and user-friendly UI with React.",
    },
    {
        name: "Arushi Sharma",
        role: "UI/UX Designer",
        img: arushiImg,
        desc: "Designing engaging interfaces and ensuring great user experience.",
    },
    {
        name: "Shantanu Raj",
        role: "Backend Developer",
        img: shantanuImg,
        desc: "Developing robust backend APIs and handling database operations.",
    },
    {
        name: "Arth Saxena",
        role: "Data & Analytics",
        img: arthImg,
        desc: "Works on analyzing carbon footprint data and insights.",
    },
    {
        name: "Awanish Kumar Verma",
        role: "Project Lead",
        img: awanishImg,
        desc: "Managing project workflow, integrations, and deployment.",
    },
];

export default function TeamSection() {
    return (
        <motion.section
            id="team-section"
            className="py-16 w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >

            <div className="max-w-7xl mx-auto px-6 text-center border-2 border-gray-300 dark:border-gray-600 rounded-3xl shadow-xl p-10">
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-12">
                    Meet Our Team
                </h2>

                {/* Row 1: First 3 members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {teamMembers.slice(0, 3).map((member, index) => (
                        <motion.div
                            key={index}
                            className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-lg overflow-hidden hover:shadow-blue-500/50 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                                <p className="text-sm text-blue-400 mb-3">{member.role}</p>
                                <p className="text-gray-300 text-sm">{member.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Row 2: Last 2 members centered */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 justify-center max-w-3xl mx-auto">
                    {teamMembers.slice(3).map((member, index) => (
                        <motion.div
                            key={index}
                            className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-lg overflow-hidden hover:shadow-blue-500/50 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                                <p className="text-sm text-blue-400 mb-3">{member.role}</p>
                                <p className="text-gray-300 text-sm">{member.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
