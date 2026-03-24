import React from 'react';

export const decisionTree = {
  stage1: [
    // --- Diagnostic Question ---
    {
      id: "start",
      question: "What is the biggest challenge in your career right now?",
      options: [
        { text: "I'm not sure what career path is right for me.", nextQuestionId: "exploration_1" },
        { text: "I know my path, but I'm missing key skills.", nextQuestionId: "upskilling_1" },
        { text: "I'm getting interviews, but not passing them.", nextQuestionId: "interview_1" },
        { text: "My job search feels disorganized and ineffective.", nextQuestionId: "job_hunt_1" },
      ],
      insight: "Pinpointing your main obstacle helps us provide the most relevant guidance.",
    },

    // --- 1. Exploration Module ---
    { id: "exploration_1", question: "What's your primary career motivation?", options: [{ text: "Building something new.", nextQuestionId: "exploration_2" }, { text: "Solving complex problems.", nextQuestionId: "exploration_2" }, { text: "Leading teams and strategy.", nextQuestionId: "exploration_2" }], insight: "This helps us understand what drives you." },
    { id: "exploration_2", question: "Which work environment do you prefer?", options: [{ text: "A fast-paced startup.", nextQuestionId: "exploration_3" }, { text: "A large, established corporation.", nextQuestionId: "exploration_3" }, { text: "Freelance or remote work.", nextQuestionId: "exploration_3" }], insight: "Your preferred environment is a key factor in job satisfaction." },
    { id: "exploration_3", question: "How do you feel about taking risks in your career?", options: [{ text: "I'm risk-averse and prefer stability.", nextQuestionId: "exploration_4" }, { text: "I'm open to calculated risks for high rewards.", nextQuestionId: "exploration_4" }, { text: "I thrive on risk and uncertainty.", nextQuestionId: "exploration_4" }], insight: "Your risk tolerance can point towards different types of roles and companies." },
    { id: "exploration_4", question: "What kind of impact do you want to make?", options: [{ text: "Impact on a small, dedicated team.", nextQuestionId: "exploration_5" }, { text: "Impact on millions of users.", nextQuestionId: "exploration_5" }, { text: "Impact on a specific industry.", nextQuestionId: "exploration_5" }], insight: "The scale of impact you desire is an important career compass." },
    { id: "exploration_5", question: "Which of these activities energizes you the most?", options: [{ text: "Creative brainstorming and ideation.", nextQuestionId: null }, { text: "Deep, focused analytical work.", nextQuestionId: null }, { text: "Collaborating and communicating with others.", nextQuestionId: null }], insight: "Aligning your work with what energizes you is crucial for long-term fulfillment." },

    // --- 2. Upskilling Module ---
    { id: "upskilling_1", question: "Which area of skill development is your priority?", options: [{ text: "Technical skills (e.g., coding).", nextQuestionId: "upskilling_2" }, { text: "Soft skills (e.g., communication).", nextQuestionId: "upskilling_2" }, { text: "Industry-specific knowledge.", nextQuestionId: "upskilling_2" }], insight: "Focusing on one area at a time leads to more effective learning." },
    { id: "upskilling_2", question: "How do you prefer to learn?", options: [{ text: "Structured online courses.", nextQuestionId: "upskilling_3" }, { text: "Hands-on projects.", nextQuestionId: "upskilling_3" }, { text: "Mentorship and 1-on-1 guidance.", nextQuestionId: "upskilling_3" }], insight: "Your learning style determines the best resources for you." },
    { id: "upskilling_3", question: "What is your budget for upskilling?", options: [{ text: "Free resources only.", nextQuestionId: "upskilling_4" }, { text: "A modest budget for courses/books.", nextQuestionId: "upskilling_4" }, { text: "Willing to invest significantly in a certification or bootcamp.", nextQuestionId: "upskilling_4" }], insight: "Budget constraints help us recommend realistic options." },
    { id: "upskilling_4", question: "How much time can you commit per week?", options: [{ text: "1-5 hours.", nextQuestionId: "upskilling_5" }, { text: "5-10 hours.", nextQuestionId: "upskilling_5" }, { text: "10+ hours (intensive).", nextQuestionId: "upskilling_5" }], insight: "Time commitment is a practical factor in choosing a learning path." },
    { id: "upskilling_5", question: "What is the primary goal of this upskilling?", options: [{ text: "To get a promotion in my current role.", nextQuestionId: null }, { text: "To pivot to a new career field.", nextQuestionId: null }, { text: "To become a recognized expert.", nextQuestionId: null }], insight: "The end goal shapes the skills you should prioritize." },

    // --- 3. Interview Readiness Module ---
    { id: "interview_1", question: "What part of the interview process is most challenging?", options: [{ text: "Technical coding challenges.", nextQuestionId: "interview_2" }, { text: "System design questions.", nextQuestionId: "interview_2" }, { text: "Behavioral questions.", nextQuestionId: "interview_2" }], insight: "Knowing your weakness is the first step to turning it into a strength." },
    { id: "interview_2", question: "How do you prepare for behavioral interviews?", options: [{ text: "I use the STAR method for my stories.", nextQuestionId: "interview_3" }, { text: "I just 'wing it' and answer naturally.", nextQuestionId: "interview_3" }, { text: "I'm not sure how to prepare for them.", nextQuestionId: "interview_3" }], insight: "A structured approach to behavioral questions can make a huge difference." },
    { id: "interview_3", question: "How many of your past experiences have you written down as STAR stories?", options: [{ text: "None, I do it on the fly.", nextQuestionId: "interview_4" }, { text: "1-3 stories.", nextQuestionId: "interview_4" }, { text: "5+ stories ready to go.", nextQuestionId: "interview_4" }], insight: "Having a bank of prepared stories saves you from thinking under pressure." },
    { id: "interview_4", question: "How comfortable are you with salary negotiations?", options: [{ text: "Very comfortable, I know my worth.", nextQuestionId: "interview_5" }, { text: "Somewhat, but I could be better.", nextQuestionId: "interview_5" }, { text: "Not at all, I find it very stressful.", nextQuestionId: "interview_5" }], insight: "Negotiation is a skill you can learn to significantly increase your compensation." },
    { id: "interview_5", question: "Do you prepare questions to ask the interviewer?", options: [{ text: "Yes, I always have a list of thoughtful questions.", nextQuestionId: null }, { text: "Sometimes, if I remember.", nextQuestionId: null }, { text: "No, I usually just ask about next steps.", nextQuestionId: null }], insight: "Asking insightful questions shows your engagement and intelligence." },

    // --- 4. Job Hunt Strategy Module ---
    { id: "job_hunt_1", question: "What is the biggest frustration in your job search?", options: [{ text: "Sending applications but getting no replies.", nextQuestionId: "job_hunt_2" }, { text: "Not sure how to find the right companies.", nextQuestionId: "job_hunt_2" }, { text: "Struggling with networking.", nextQuestionId: "job_hunt_2" }], insight: "A targeted strategy is more effective than applying everywhere." },
    { id: "job_hunt_2", question: "How tailored is your resume for each role?", options: [{ text: "Highly tailored for every application.", nextQuestionId: "job_hunt_3" }, { text: "I have a few versions I use.", nextQuestionId: "job_hunt_3" }, { text: "I use the same one for everything.", nextQuestionId: "job_hunt_3" }], insight: "Customization helps you get past automated filters." },
    { id: "job_hunt_3", question: "How are you leveraging your professional network?", options: [{ text: "I'm actively seeking referrals.", nextQuestionId: "job_hunt_4" }, { text: "I occasionally ask for connections.", nextQuestionId: "job_hunt_4" }, { text: "I'm not using my network at all.", nextQuestionId: "job_hunt_4" }], insight: "A referral is the single best way to get an interview." },
    { id: "job_hunt_4", question: "How do you track your applications?", options: [{ text: "Using a spreadsheet or a tool.", nextQuestionId: "job_hunt_5" }, { text: "I keep track in my head.", nextQuestionId: "job_hunt_5" }, { text: "I don't have a system for tracking.", nextQuestionId: "job_hunt_5" }], insight: "An organized job hunt prevents missed opportunities." },
    { id: "job_hunt_5", question: "How much of your job search time is spent on 'cold' applications vs. networking?", options: [{ text: "Mostly applications (80%+).", nextQuestionId: null }, { text: "A healthy mix of both (50/50).", nextQuestionId: null }, { text: "Mostly networking (80%+).", nextQuestionId: null }], insight: "Shifting focus from cold applications to networking can dramatically improve results." },
  ],
};

export const testimonials = [
  {
    quote: "Before onestopcareers, I was lost. The decision tree gave me the clarity I needed to pivot my career and find a path I'm truly passionate about. It's a game-changer!",
    name: "Jane D.",
    role: "Marketing Manager"
  },
  {
    quote: "The personalized roadmap helped me identify my skill gaps and find the right courses. I felt so much more confident in my job hunt.",
    name: "Alex P.",
    role: "Software Engineer"
  },
];

export const stages = [
  {
    title: 'Stage 1: Exploration',
    description: 'Discover your strengths, passions, and potential career paths with our guided decision tree.',
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
        <path d="m12 12-2 5h4l-2 5"/>
      </svg>
    ),
  },
  {
    title: 'Stage 2: Upskilling',
    description: 'Identify skill gaps and find the best courses and resources to advance your knowledge.',
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 20V10"/>
        <path d="M18 20V4"/>
        <path d="M6 20V16"/>
      </svg>
    ),
  },
  {
    title: 'Stage 3: Interview Readiness',
    description: 'Practice common questions and build the confidence to ace your next interview.',
    icon: (props) => (
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
       </svg>
    ),
  },
   {
    title: 'Stage 4: Job Hunt Strategy',
    description: 'Learn how to network, tailor your resume, and effectively track your applications.',
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m3 11 18-5v12L3 14v-3z"/>
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
      </svg>
    ),
  },
];

export const whyItWorks = [
    {
        title: 'Hyper-Personalized Pathways',
        description: 'Our dynamic system adapts to your answers, ensuring the guidance you receive is uniquely yours. No more generic advice.',
        icon: (props) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
                <path d="M6 3v18"/>
                <path d="M18 3v18"/>
                <path d="M10 12H6"/>
                <path d="M14 12h4"/>
                <path d="M10 6H6"/>
                <path d="M14 18h4"/>
                <path d="M10 18h-4"/>
                <path d="M14 6h4"/>
            </svg>
        ),
    },
    {
        title: 'Data-Driven Clarity',
        description: 'We translate your career ambiguity into actionable, data-backed recommendations, so you can make your next move with confidence.',
        icon: (props) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
                <path d="M12 20V10"/>
                <path d="M18 20V4"/>
                <path d="M6 20V16"/>
            </svg>
        ),
    },
    {
        title: 'Actionable Ecosystem',
        description: 'We bridge the gap between insight and action, connecting you directly to curated resources, job opportunities, and mentors.',
        icon: (props) => (
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
                <path d="M18 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8"/>
                <path d="m14 9 7.5 7.5"/>
                <path d="m21 11-5 5"/>
             </svg>
        ),
    }
];
