import React from 'react';
import { FileText, Mail, Map, Link as LinkIcon, ChevronRight } from 'lucide-react';

const resourcesData = [
  {
    icon: FileText,
    title: "The Ultimate Resume Kit",
    description: "The exact template that unlocked interviews at Amazon, Flipkart, and more — with video tutorial.",
    bgUrl: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=2071&auto=format&fit=crop",
    topmateUrl: "https://topmate.io/ketan_goel_analytics_expert/1639667?utm_source=spotlight&utm_campaign=ketan_goel_analytics_expert"
  },
  {
    icon: Mail,
    title: "12,000+ HR Email list",
    description: "A curated list of HR professionals and recruiters from top companies in India.",
    bgUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
    topmateUrl: "https://topmate.io/ketan_goel_analytics_expert/1622508?utm_source=spotlight&utm_campaign=ketan_goel_analytics_expert"
  },
  {
    icon: Map,
    title: "60-Day Analytics Roadmap",
    description: "A step-by-step guide to mastering the skills for a top-tier analytics role.",
    bgUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    topmateUrl: "https://topmate.io/ketan_goel_analytics_expert/521790?utm_source=spotlight&utm_campaign=ketan_goel_analytics_expert"
  },
  {
    icon: LinkIcon,
    title: "Discounted LinkedIn Premium",
    description: "Unlock the full power of LinkedIn with an exclusive discount for our community.",
    bgUrl: "https://images.unsplash.com/photo-1611944212129-29955ae40213?q=80&w=2070&auto=format&fit=crop",
    topmateUrl: "https://topmate.io/ketan_goel_analytics_expert/1454472?utm_source=spotlight&utm_campaign=ketan_goel_analytics_expert"
  }
];

const ResourceCard = ({ resource }) => {
  const IconComponent = resource.icon;
  return (
    <a href={resource.topmateUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer group w-full block">
      <div className="bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 group-hover:border-accent-border group-hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col">
        <div className="relative w-full h-40 overflow-hidden">
          <img
            src={resource.bgUrl}
            alt={resource.title}
            loading="lazy"
            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <IconComponent size={44} className="text-accent" />
          </div>
        </div>
        <div className="p-4 text-left flex flex-col flex-grow">
          <h3 className="font-semibold text-ink text-base mb-1">{resource.title}</h3>
          <p className="text-ink3 text-sm flex-grow leading-relaxed">{resource.description}</p>
          <div className="mt-4">
            <span className="w-full text-center px-4 py-2 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors text-sm inline-block">
              Download Now
            </span>
            <p className="text-center text-ink3 text-xs mt-2">via Topmate</p>
          </div>
        </div>
      </div>
    </a>
  );
};

const ResourceListItem = ({ resource }) => {
  const IconComponent = resource.icon;
  return (
    <a
      href={resource.topmateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 bg-surface border border-border rounded-xl p-4 transition-colors hover:border-accent-border"
    >
      <div className="bg-accent-light p-3 rounded-full border border-accent-border flex-shrink-0">
        <IconComponent size={22} className="text-accent" />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-ink text-sm">{resource.title}</h3>
        <p className="text-ink3 text-xs mt-0.5 leading-relaxed">{resource.description}</p>
      </div>
      <ChevronRight size={18} className="text-ink3 flex-shrink-0" />
    </a>
  );
};

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-bg">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="text-center mb-10">
          <p className="label mb-3">Career tools</p>
          <h1 className="font-serif text-3xl md:text-5xl text-ink mb-4">Explore our resources</h1>
          <p className="text-ink2 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Templates, contact lists, and roadmaps used by analysts who landed roles at Swiggy, Razorpay, and Flipkart.
          </p>
        </div>

        {/* Mobile: list */}
        <div className="md:hidden space-y-3">
          {resourcesData.map((resource, i) => (
            <ResourceListItem key={i} resource={resource} />
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {resourcesData.map((resource, i) => (
            <ResourceCard key={i} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
