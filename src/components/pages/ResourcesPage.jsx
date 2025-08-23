import React from 'react';
import { FileText, Mail, Map, Link as LinkIcon, ChevronRight } from 'lucide-react';

// --- Data for the Resource Cards ---
const resourcesData = [
    {
        icon: <FileText size={24} className="text-orange-400" />,
        title: "Download Ketan's Resume",
        description: "Downlaod Ketan's Resume that was shortlisted in 50+ product companies along with Youtube video Tutorial",
        ctaText: "Download",
        topmateUrl: "https://topmate.io/ketan_goel_analytics_expert/1639667?utm_source=public_profile&utm_campaign=ketan_goel_analytics_expert" // Replace with your actual Topmate URL
    },
    {
        icon: <Mail size={24} className="text-orange-400" />,
        title: " Download 12,000+ HR Email List ",
        description: "Access a curated list of HR professionals and recruiters from over 12,000 top companies in India.",
        ctaText: "Download",
        topmateUrl: "https://topmate.io/ketan_goel_analytics_expert/1622508?utm_source=public_profile&utm_campaign=ketan_goel_analytics_expert" // Replace with your actual Topmate URL
    },
    {
        icon: <Map size={24} className="text-orange-400" />,
        title: "60-Day Analytics Roadmap",
        description: "A step-by-step guide to mastering the skills needed to land a top-tier analytics role in just two months.",
        ctaText: "Download",
        topmateUrl: "https://topmate.io/ketan_goel_analytics_expert/521790?utm_source=public_profile&utm_campaign=ketan_goel_analytics_expert" // Replace with your actual Topmate URL
    },
    {
        icon: <LinkIcon size={24} className="text-orange-400" />,
        title: "Discounted LinkedIn Premium",
        description: "Unlock the full power of LinkedIn with an exclusive discount on a Premium subscription for our community members.",
        ctaText: "Get access",
        topmateUrl: "https://topmate.io/ketan_goel_analytics_expert/1454472?utm_source=public_profile&utm_campaign=ketan_goel_analytics_expert" // Replace with your actual Topmate URL
    }
];

// --- Reusable Resource Card Component (for Desktop) ---
const ResourceCard = ({ resource }) => {
    return (
        <div className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-6 flex flex-col items-start h-full transition-transform transform hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10">
            <div className="bg-gray-800 p-3 rounded-full mb-4">
                {resource.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
            <p className="text-gray-400 text-sm flex-grow mb-6">{resource.description}</p>
            <a
                href={resource.topmateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center mt-auto px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors"
            >
                {resource.ctaText}
            </a>
        </div>
    );
};

// --- Reusable Resource List Item Component (for Mobile) ---
const ResourceListItem = ({ resource }) => {
    return (
        <a
            href={resource.topmateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 transition-colors hover:bg-gray-800"
        >
            <div className="bg-gray-800 p-3 rounded-full">
                {resource.icon}
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-white">{resource.title}</h3>
                <p className="text-gray-400 text-xs mt-1">{resource.description}</p>
            </div>
            <ChevronRight size={20} className="text-gray-500 flex-shrink-0" />
        </a>
    );
};


// --- Main Resources Page Component ---
const ResourcesPage = () => {
    return (
        <div className="bg-black min-h-screen text-white">
            <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        Exclusive Tools to Fast-Track Your Career
                    </h1>
                    <p className="text-gray-400 mt-4 max-w-3xl mx-auto">
                        Handpicked resources, delivered via our Topmate service, to give you an edge in your job search.
                    </p>
                </div>

                {/* Desktop View: 2x2 Grid (Hidden on mobile) */}
                <div className="hidden md:grid grid-cols-2 gap-8">
                    {resourcesData.map((resource, index) => (
                        <ResourceCard key={index} resource={resource} />
                    ))}
                </div>

                {/* Mobile View: Compact List (Hidden on desktop) */}
                <div className="md:hidden space-y-4">
                     {resourcesData.map((resource, index) => (
                        <ResourceListItem key={index} resource={resource} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResourcesPage;
