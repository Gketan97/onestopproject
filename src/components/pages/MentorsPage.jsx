import React from 'react';

const mentorsData = [
  {
    id: 1,
    isFeatured: true,
    name: "Ketan Goel",
    description: "Analytics Lead @ Meesho | Career Mentor",
    avatarUrl: "https://raw.githubusercontent.com/Gketan97/onestopproject/rollback-aug_18_186/ketan%20Image.jpeg",
    bio: "As the Analytics Lead for Mall at Meesho, I use data to solve complex problems in brand discovery, pricing, and fraud detection. With over 5 years of experience working across Business, Product, and Data Science teams, I'm passionate about sharing my insights. I founded the Career Acceleration Club, a community of over 100k professionals, and regularly speak at universities to help individuals navigate their career challenges and create real-world impact.",
    topmateUrl: "https://topmate.io/ketan_goel_analytics_expert/page/mFvABxpBEr",
  }
];

const StandardMentorCard = ({ mentor }) => (
  <a href={mentor.topmateUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer group w-full block">
    <div className="bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-accent-border hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
      <img src={mentor.avatarUrl} alt={mentor.name} className="w-full h-48 object-cover" />
      <div className="p-4 text-left flex flex-col flex-grow">
        <h3 className="font-semibold text-ink text-base">{mentor.name}</h3>
        <p className="text-ink3 text-xs mt-1 flex-grow">{mentor.description}</p>
        <div className="mt-2 text-accent text-xs font-semibold self-end transition-colors group-hover:text-accent-dark">
          View Profile →
        </div>
      </div>
    </div>
  </a>
);

const FeaturedMentorCard = ({ mentor }) => (
  <a href={mentor.topmateUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer group w-full block">
    <div className="bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-accent-border hover:shadow-xl hover:-translate-y-1 flex flex-col md:flex-row h-full">
      <img src={mentor.avatarUrl} alt={mentor.name} className="w-full md:w-2/5 h-64 md:h-auto object-cover" />
      <div className="p-6 text-left flex flex-col justify-center">
        <span className="bg-accent-light text-accent text-xs font-semibold px-3 py-1 rounded-full self-start border border-accent-border">
          Featured Mentor
        </span>
        <h3 className="font-serif text-2xl text-ink mt-4">{mentor.name}</h3>
        <p className="text-ink2 text-sm mt-1">{mentor.description}</p>
        <p className="text-ink3 text-sm mt-4 hidden md:block leading-relaxed">
          {mentor.bio.substring(0, 150)}...
        </p>
        <div className="mt-4 text-accent text-sm font-semibold transition-colors group-hover:text-accent-dark">
          View Profile & Services →
        </div>
      </div>
    </div>
  </a>
);

const MentorsPage = () => {
  const featuredMentor = mentorsData.find(m => m.isFeatured);

  return (
    <div className="min-h-screen bg-bg">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <p className="label mb-3">1:1 guidance</p>
          <h1 className="font-serif text-3xl md:text-5xl text-ink leading-snug mb-4">
            Connect with industry experts
          </h1>
          <p className="text-ink2 mt-3 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Get personalised guidance from top professionals to accelerate your career growth. Book a 1:1 session today.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="w-full lg:w-2/3">
            {featuredMentor && <FeaturedMentorCard mentor={featuredMentor} />}
          </div>
        </div>

        <div className="text-center p-6 bg-surface border border-border rounded-xl">
          <h3 className="font-semibold text-ink text-lg mb-2">Adding more mentors soon</h3>
          <p className="text-ink3 text-sm leading-relaxed">
            We are onboarding experts from Software Engineering, Data Science, and Product Management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorsPage;
