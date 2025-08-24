import React from 'react';

// --- Data for the Mentor Cards ---
const mentorsData = [
    {
        id: 1,
        isFeatured: true, // Flag for the featured mentor
        name: "Ketan Goel",
        description: "Analytics Lead @ Meesho | Career Mentor",
        avatarUrl: "https://raw.githubusercontent.com/Gketan97/onestopproject/rollback-aug_18_186/ketan%20Image.jpeg", 
        bio: "As the Analytics Lead for Mall at Meesho, I use data to solve complex problems in brand discovery, pricing, and fraud detection. With over 5 years of experience working across Business, Product, and Data Science teams, I'm passionate about sharing my insights. I founded the Career Acceleration Club, a community of over 100k professionals, and regularly speak at universities to help individuals navigate their career challenges and create real-world impact.",
        topmateUrl: "https://topmate.io/ketan_goel_analytics_expert",
    }
];

// --- Standard Mentor Card (Direct Link) ---
const StandardMentorCard = ({ mentor }) => (
    <a href={mentor.topmateUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer group w-full block">
        <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-orange-500/10 group-hover:-translate-y-1 h-full flex flex-col">
            <img 
                src={mentor.avatarUrl} 
                alt={mentor.name} 
                className="w-full h-48 object-cover"
            />
            <div className="p-4 text-left flex flex-col flex-grow">
                <h3 className="font-bold text-white text-base">{mentor.name}</h3>
                <p className="text-gray-400 text-xs mt-1 flex-grow">{mentor.description}</p>
                 <div className="mt-2 text-orange-500 text-xs font-bold self-end">
                    View Profile &rarr;
                </div>
            </div>
        </div>
    </a>
);

// --- Featured Mentor Card (Direct Link) ---
const FeaturedMentorCard = ({ mentor }) => (
    <a href={mentor.topmateUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer group w-full col-span-1 md:col-span-2 lg:col-span-3 block">
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
    </a>
);


// --- Main Mentors Page Component ---
const MentorsPage = () => {
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
                        {featuredMentor && <FeaturedMentorCard mentor={featuredMentor} />}
                    </div>
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
