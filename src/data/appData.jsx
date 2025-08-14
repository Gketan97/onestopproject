// =================================================================
// FILE: src/data/appData.jsx
// REASON: Provide new, consistent SVG icons and add more stages to fix missing content.
// =================================================================
import React from 'react';

export const decisionTree = {
  stage1: [
    // --- Initial Questions ---
    {
      question: "What's your primary career motivation?",
      options: [
        { text: "Building something new and innovative.", nextQuestionId: "q1_a1" },
        { text: "Solving complex problems and helping others.", nextQuestionId: "q1_a2" },
        { text: "Leading teams and shaping strategy.", nextQuestionId: "q1_a3" },
        { text: "Financial stability and growth.", nextQuestionId: "q1_a4" },
      ],
      insight: "Understanding your core motivation helps us filter for roles that will truly energize you.",
    },
    // ... other initial questions from before ...

    // --- Interview Readiness Questions ---
    {
      id: "interview_start",
      question: "How confident are you about technical interviews?",
      options: [
        { text: "Very confident, I just need a refresher.", nextQuestionId: "interview_q2" },
        { text: "Somewhat confident, but need practice.", nextQuestionId: "interview_q3" },
        { text: "Not confident at all, I need to start from basics.", nextQuestionId: "interview_q4" },
      ],
      insight: "Assessing your confidence helps us tailor the preparation intensity.",
    },
    {
      id: "interview_q2",
      question: "Which area needs the most focus for your refresher?",
      options: [
        { text: "Data Structures & Algorithms.", nextQuestionId: "job_hunt_start" },
        { text: "System Design and Architecture.", nextQuestionId: "job_hunt_start" },
        { text: "Behavioral and situational questions.", nextQuestionId: "job_hunt_start" },
      ],
      insight: "Pinpointing a specific area makes your preparation more efficient.",
    },
    {
      id: "interview_q3",
      question: "What type of practice would be most helpful?",
      options: [
        { text: "Mock interviews with peers.", nextQuestionId: "job_hunt_start" },
        { text: "Solving coding challenges online.", nextQuestionId: "job_hunt_start" },
        { text: "Reviewing company-specific interview questions.", nextQuestionId: "job_hunt_start" },
      ],
      insight: "The right practice method can significantly boost your performance.",
    },
    {
      id: "interview_q4",
      question: "What's your preferred way to learn foundational concepts?",
      options: [
        { text: "Structured online courses.", nextQuestionId: "job_hunt_start" },
        { text: "Reading books and technical articles.", nextQuestionId: "job_hunt_start" },
        { text: "Hands-on projects and building.", nextQuestionId: "job_hunt_start" },
      ],
      insight: "Your learning style determines the best resources for you.",
    },
    {
      id: "interview_q5",
      question: "Have you prepared your 'Tell me about yourself' pitch?",
      options: [
        { text: "Yes, it's polished and ready.", nextQuestionId: "job_hunt_start" },
        { text: "I have a rough idea, but it needs work.", nextQuestionId: "job_hunt_start" },
        { text: "No, I haven't started on it yet.", nextQuestionId: "job_hunt_start" },
      ],
      insight: "This is your first impression—it's crucial to get it right.",
    },

    // --- Job Hunt Strategy Questions ---
    {
      id: "job_hunt_start",
      question: "How are you currently finding job opportunities?",
      options: [
        { text: "Mainly through online job boards (LinkedIn, Indeed).", nextQuestionId: "job_hunt_q2" },
        { text: "Networking and referrals.", nextQuestionId: "job_hunt_q3" },
        { text: "Company career pages directly.", nextQuestionId: "job_hunt_q4" },
      ],
      insight: "A multi-channel approach is often the most effective job hunt strategy.",
    },
    {
      id: "job_hunt_q2",
      question: "What is the biggest challenge with online applications?",
      options: [
        { text: "Not hearing back after applying.", nextQuestionId: null },
        { text: "Tailoring my resume for each application.", nextQuestionId: null },
        { text: "Finding roles that truly match my skills.", nextQuestionId: null },
      ],
      insight: "Identifying the bottleneck helps us suggest targeted solutions.",
    },
    {
      id: "job_hunt_q3",
      question: "How actively are you growing your professional network?",
      options: [
        { text: "Very actively, I connect with people weekly.", nextQuestionId: null },
        { text: "Somewhat, I attend events occasionally.", nextQuestionId: null },
        { text: "Not actively, I find it difficult.", nextQuestionId: null },
      ],
      insight: "Your network is one of your most powerful career assets.",
    },
    {
      id: "job_hunt_q4",
      question: "Do you customize your application for each company?",
      options: [
        { text: "Yes, I write a new cover letter and tweak my resume.", nextQuestionId: null },
        { text: "Sometimes, for roles I'm very interested in.", nextQuestionId: null },
        { text: "No, I use the same resume for all applications.", nextQuestionId: null },
      ],
      insight: "Personalization can dramatically increase your response rate.",
    },
    {
      id: "job_hunt_q5",
      question: "How do you track your job applications?",
      options: [
        { text: "Using a spreadsheet or a dedicated tool.", nextQuestionId: null },
        { text: "I keep track in my head or with email flags.", nextQuestionId: null },
        { text: "I don't have a system for tracking.", nextQuestionId: null },
      ],
      insight: "An organized job hunt prevents missed opportunities and helps you follow up effectively.",
    },
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
