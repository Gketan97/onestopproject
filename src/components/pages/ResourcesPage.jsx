import React from 'react';
import { FileText, Mail, Map, Link as LinkIcon, ChevronRight } from 'lucide-react';

// --- Data for the Resource Cards ---
const resourcesData = [
    {
        icon: FileText,
        title: "The Ultimate Resume Kit",
        description: "The exact template that unlocked interviews at Amazon, Flipkart, and more.",
        bgUrl: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=2071&auto=format&fit=crop",
        topmateUrl: "https://topmate.io/your-profile/1"
    },
    {
        icon: Mail,
        title: "12,000+ HR Contacts",
        description: "A curated list of HR professionals and recruiters from top companies in India.",
        bgUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
        topmateUrl: "https://topmate.io/your-profile/2"
    },
    {
        icon: Map,
        title: "60-Day Analytics Roadmap",
        description: "A step-by-step guide to mastering the skills for a top-tier analytics role.",
        bgUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        topmateUrl: "https://topmate.io/your-profile/3"
    },
    {
        icon: LinkIcon,
        title: "Discounted LinkedIn Premium",
        description: "Unlock the full power of LinkedIn with an exclusive discount for our community.",
        bgUrl: "https://images.unsplash.com/photo-1611944212129-29955ae40213?q=80&w=2070&auto=format&fit=crop",
        topmateUrl: "https://topmate.io/your-profile/4"
    }
];

// --- Resource Card for Desktop Grid ---
const ResourceCard = ({ resource }) => {
    const IconComponent = resource.icon;
    return (
        <a 
            href={resource.topmateUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="cursor-pointer group w-full block"
        >
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 group-hover:border-orange-500/50 group-hover:shadow-xl group-hover:shadow-orange-500/10 group-hover:-translate-y-1 h-full flex flex-col">
                <div className="relative w-full h-40">
                    <img src={resource.bgUrl} alt={resource.title} className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent size={48} className="text-orange-400" />
                    </div>
                </div>
                <div className="p-4 text-left flex flex-col flex-grow">
                    <h3 className="font-bold text-white text-lg">{resource.title}</h3>
                    <p className="text-gray-400 text-sm mt-1 flex-grow">{resource.description}</p>
                    <div className="mt-4">
                        <span className="w-full text-center px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors text-sm inline-block">
                            Download Now
                        </span>
                        <p className="text-center text-gray-500 text-xs mt-2">via Topmate</p>
                    </div>
                </div>
            </div>
        </a>
    );
};

// --- Resource List Item for Mobile ---
const ResourceListItem = ({ resource }) => {
    const IconComponent = resource.icon;
    return (
        <a
            href={resource.topmateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 transition-colors hover:bg-gray-800"
        >
            <div className="bg-gray-800 p-3 rounded-full">
                <IconComponent size={24} className="text-orange-400" />
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
                        Career-Boosting Tools
                    </h1>
                    <p className="text-gray-400 mt-4 max-w-3xl mx-auto">
                        Handpicked resources, delivered via our Topmate service, to give you an edge in your job search.
                    </p>
                </div>

                {/* --- RESPONSIVE RESOURCE LIST --- */}

                {/* Mobile View: Vertical List */}
                <div className="md:hidden space-y-4">
                     {resourcesData.map((resource, index) => (
                        <ResourceListItem key={index} resource={resource} />
                    ))}
                </div>

                {/* Desktop View: Grid */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resourcesData.map((resource, index) => (
                        <ResourceCard key={index} resource={resource} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResourcesPage;
