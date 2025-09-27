import React from 'react'

const Test = () => {
    return (
        <div className="min-h-screen bg-brand-bg text-brand-text">
            <h1 className="text-4xl font-bold">Build with AI responsibly</h1>
            <p className="text-brand-secondary mt-2">
                Build trusted and secure AI with guidance for responsible design...
            </p>
            <button className="mt-6 px-6 py-3 rounded-lg text-white font-medium 
                     bg-gradient-to-r from-brand-blue1 to-brand-blue2 
                     hover:opacity-90 transition">
                Build Responsible AI
            </button>

            <div className="mt-10 p-6 rounded-xl bg-brand-surface shadow-lg">
                <h2 className="font-semibold">Build responsible models</h2>
                <p className="text-brand-secondary mt-2">Tools and guidance...</p>
            </div>
        </div>

    )
}

export default Test
