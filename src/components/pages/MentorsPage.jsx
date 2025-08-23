import React, { useState, useEffect } from 'react';

// --- Data for the Mentor Cards ---
const mentorsData = [
    {
        id: 1,
        isFeatured: true, // This is now the only mentor, featured by default
        name: "Ketan Goel",
        description: "Analytics Lead @ Meesho | Career Mentor",
        avatarUrl: "https://raw.githubusercontent.com/Gketan97/onestopproject/rollback-aug_18_186/ketan%20Image.jpeg", 
        bio: "As the Analytics Lead for Mall at Meesho, I use data to solve complex problems in brand discovery, pricing, and fraud detection. With over 5 years of experience working across Business, Product, and Data Science teams, I'm passionate about sharing my insights. I founded the Career Acceleration Club, a community of over 100k professionals, and regularly speak at universities to help individuals navigate their career challenges and create real-world impact.",
        services: [
            { name: "1:1 Mock Interview", description: "A realistic, 45-minute mock interview session focused on behavioral and product sense questions." },
            { name: "Resume Deep Dive", description: "We'll tear down and rebuild your resume line-by-line to make it FAANG-ready." }
        ],
        topmateUrl: "https://topmate.io/ketan_goel_analytics_expert",
    }
];

// --- Mentor Modal Component ---
const MentorModal = ({ mentor, onClose }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!mentor) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#1a1a1a] rounded-xl border border-gray-700 w-full max-w-lg max-h-[90vh] flex flex-col shadow-xl animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-6 text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-2xl">&times;</button>
                    <img 
                        src={mentor.avatarUrl} 
                        alt={mentor.name} 
                        className="w-24 h-24 rounded-lg mb-4 border-2 border-gray-600 object-cover mx-auto"
                    />
                    <h2 className="text-2xl font-bold text-white">{mentor.name}</h2>
                    <p className="text-orange-400 font-semibold">{mentor.description}</p>
                </header>
                
                <div className="p-6 overflow-y-auto flex-grow border-t border-gray-700">
                    <p className="text-gray-400 text-sm mb-6">{mentor.bio}</p>
                    
                    <h4 className="font-bold text-white mb-3">Services Offered</h4>
                    <ul className="space-y-3">
                        {mentor.services.map(service => (
                            <li key={service.name} className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400 mt-1 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <div>
                                    <h5 className="font-semibold text-white text-sm">{service.name}</h5>
                                    <p className="text-gray-500 text-xs">{service.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <footer className="p-6 border-t border-gray-700">
                    <a href={mentor.topmateUrl} target="_blank" rel="noopener noreferrer" className="w-full block text-center px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors">
                        Book a Session on Topmate
                    </a>
                </footer>
            </div>
        </div>
    );
};

// --- Featured Mentor Card (Horizontal Design) ---
const FeaturedMentorCard = ({ mentor, onClick }) => (
    <div onClick={onClick} className="cursor-pointer group w-full">
        <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-orange-500/10 group-hover:-translate-y-1 flex flex-col md:flex-row h-full">
            <img 
                src={mentor.avatarUrl} 
                alt={mentor.name} 
                className="w-full md:w-2/5 h-64 md:h-auto object-cover"
            />
            <div className="p-6 text-left flex flex-col justify-center">
                <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full self-start">Featured Mentor</span>
                <h3 className="font-bold text-white text-2xl mt-4">{mentor.name}</h3>
                <p className="text-gray-400 text-md mt-1">{mentor.description}</p>
                <p className="text-gray-400 text-sm mt-4 hidden md:block">{mentor.bio.substring(0, 150)}...</p>
                 <div className="mt-4 text-orange-500 text-sm font-bold">
                    View Profile & Services &rarr;
                </div>
            </div>
        </div>
    </div>
);


// --- Main Mentors Page Component ---
const MentorsPage = () => {
    const [selectedMentor, setSelectedMentor] = useState(null);
    const featuredMentor = mentorsData.find(m => m.isFeatured);

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

                {/* --- Featured Mentor Section --- */}
                <div className="flex justify-center">
                    <div className="w-full lg:w-2/3">
                        {featuredMentor && <FeaturedMentorCard mentor={featuredMentor} onClick={() => setSelectedMentor(featuredMentor)} />}
                    </div>
                </div>

                {/* Coming Soon Message */}
                <div className="text-center mt-12 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h3 className="font-bold text-white text-lg">Adding more mentors soon!</h3>
                    <p className="text-gray-400 text-sm mt-2">We are in the process of onboarding experts from Software Engineering, Data Science, and other domains.</p>
                </div>
            </div>

            {/* The Modal is rendered here */}
            <MentorModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} />
        </div>
    );
};

export default MentorsPage;
