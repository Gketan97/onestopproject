import React from 'react';

// --- Data for the Mentor Cards ---
const mentorsData = [
    {
        id: 1,
        name: "Ketan Goel",
        description: "Analytics Lead | Career Mentor",
        company: "Meesho",
        avatarUrl: "https://raw.githubusercontent.com/Gketan97/onestopproject/rollback-aug_18_186/ketan%20Image.jpeg", 
        topmateUrl: "https://topmate.io/ketan_goel_analytics_expert/page/mFvABxpBEr",
    },
    // Add more mentors here in the future
];

// --- Mentor Card Component (Now a Direct Link) ---
const MentorCard = ({ mentor }) => (
    <a 
        href={mentor.topmateUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="cursor-pointer group w-full block"
    >
        <div className="bg-[#2a2a2a] border border-orange-500/40 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] group-hover:-translate-y-1">
            <img 
                src={mentor.avatarUrl} 
                alt={mentor.name} 
                className="w-full h-56 object-cover"
            />
            <div className="p-4 text-left">
                <h3 className="font-bold text-white text-lg">{mentor.name}</h3>
                <p className="text-gray-400 text-sm mt-1 truncate">{mentor.description}</p>
            </div>
        </div>
    </a>
);

// --- Main Mentors Page Component ---
const MentorsPage = () => {
    return (
        <div className="bg-black min-h-screen text-white">
            <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        Connect with Industry Experts
                    </h1>
                    <p className="text-gray-400 mt-4 max-w-3xl mx-auto">
                        Get personalized guidance from top professionals to accelerate your career growth. Book a 1:1 session today.
                    </p>
                </div>

                {/* --- RESPONSIVE MENTOR GRID --- */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {mentorsData.map((mentor) => (
                        <MentorCard key={mentor.id} mentor={mentor} />
                    ))}
                    {/* Add more MentorCard components here as you onboard new mentors */}
                </div>

                {/* Coming Soon Message */}
                <div className="text-center mt-12 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h3 className="font-bold text-white text-lg">Adding more mentors soon!</h3>
                    <p className="text-gray-400 text-sm mt-2">We are in the process of onboarding experts from Software Engineering, Data Science, and other domains.</p>
                </div>
            </div>
        </div>
    );
};

export default MentorsPage;
