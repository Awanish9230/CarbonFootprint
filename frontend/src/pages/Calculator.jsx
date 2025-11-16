import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import ItemCard from "../components/ItemCard";
import SearchBar from "../components/SearchBar";

export default function Calculator() {
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState("");
    const [searched, setSearched] = useState(false); // track if a search has been made

    // Fetch items by search
    const handleSearch = async (q) => {
        try {
            const res = await api.get(`/items/search?q=${q}`);
            setItems(res.data);
            setSearched(true); // mark that user performed a search
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <motion.div
            className="max-w-7xl mx-auto p-8 min-h-screen  bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-300 dark:border-gray-700     shadow-xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Carbon Footprint Calculator
            </h1>

            {/* SearchBar with autocomplete */}
            <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />

            {items.length > 0 ? (
                <>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Showing results for "<b>{query}</b>". Consider greener alternatives below!
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item, index) => (
                            <motion.div
                                key={item._id}
                                className="bg-white text-gray-900 rounded-2xl shadow-  bg-white text-gray-900  rounded-2xl shadow-lg overflow-hidden  hover:shadow-blue-500/50 transition-all duration-300 dark:bg-gradient-to-br   dark:from-gray-900 dark:via-gray-800 dark:to-black    dark:text-whitelg overflow-hidden hover:shadow-blue-500/50 transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-white"
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <ItemCard item={item} />
                            </motion.div>
                        ))}
                    </div>
                </>
            ) : searched && query.trim() ? (
                // Better animated error
                <motion.div
                    className="flex flex-col items-center justify-center p-8   bg-gray-100 text-gray-800   border-2 border-gray-200 rounded-2xl shadow-lg mt-6 dark:bg-gray-800 dark:text-gray-200   dark:border-gray-700"

                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" // cute empty box icon
                        alt="No results"
                        className="w-24 h-24 mb-4"
                    />
                    <h3 className="text-xl font-bold text-cyan-400 mb-2 text-center">
                        Oops! No results found
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-center">We couldn't find any item matching "<b>{query}</b>".</p>

                </motion.div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">
                    Search for an item to see results.
                </p>
            )}


        </motion.div>
    );
}
