export const decisionTree = {
  stage1: [
    {
      question: "What's your primary career motivation?",
      options: [
        { text: "Building something new and innovative.", nextQuestionId: "q1_a1" },
        { text: "Solving complex problems and helping others.", nextQuestionId: "q1_a2" },
        { text: "Leading teams and shaping strategy.", nextQuestionId: "q1_a3" },
        { text: "Financial stability and growth.", nextQuestionId: "q1_a4" },
      ],
      insight: "Understanding your core motivation helps us filter for roles that will truly energize you. Some people are driven by creation, others by impact, and a few by leadership or security.",
    },
    {
      id: "q1_a1",
      question: "Great. Do you prefer working with code or visual design?",
      options: [
        { text: "I love coding and building the technical foundation.", nextQuestionId: "q2_a1" },
        { text: "I prefer visual design and user experience.", nextQuestionId: "q2_a2" },
      ],
      insight: "This choice helps us narrow down creative roles to either technical or artistic paths, ensuring the next questions are highly relevant.",
    },
    {
      id: "q1_a2",
      question: "Understood. Is your strength in data analysis or human-to-human interaction?",
      options: [
        { text: "I enjoy analyzing data to find insights.", nextQuestionId: "q2_a3" },
        { text: "I'm best at communicating and working with people.", nextQuestionId: "q2_a4" },
      ],
      insight: "Impact can be measured in many ways. This helps us distinguish between a more analytical, data-driven approach versus a social, people-centric one.",
    },
    {
      id: "q1_a3",
      question: "Excellent. Is your leadership style more focused on people or product direction?",
      options: [
        { text: "I enjoy mentoring and developing team members.", nextQuestionId: "q2_a5" },
        { text: "I'm passionate about defining the product vision.", nextQuestionId: "q2_a6" },
      ],
      insight: "Leadership roles can vary widely. We are pinpointing whether you thrive as a people manager or as a strategic visionary.",
    },
    {
      id: "q1_a4",
      question: "Noted. Are you looking for roles with high growth potential or a stable, reliable path?",
      options: [
        { text: "I want a path with high earning potential and upward mobility.", nextQuestionId: "q2_a7" },
        { text: "I prefer a stable career with good benefits and work-life balance.", nextQuestionId: "q2_a8" },
      ],
      insight: "This helps us understand your priorities regarding career pace and stability, guiding us toward either high-risk, high-reward roles or more established, secure options.",
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
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6a6 6 0 0 0-6-6v6H6a6 6 0 0 0 0 12h12a6 6 0 0 0 0-12h-6"/></svg>
    ),
  },
  {
    title: 'Stage 2: Upskilling',
    description: 'Identify skill gaps and find the best courses and resources to advance your knowledge.',
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 19V5M5 12h14"/></svg>
    ),
  },
];
