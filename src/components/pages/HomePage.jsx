import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Users } from 'lucide-react';

// --- Data for Page Sections ---
const whyItWorks = [
  {
    icon: ShieldCheck,
    title: "Verified Paths, Not Random Noise",
    description:
      "Tired of generic YouTube advice and unverified content? We provide curated, proven strategies from industry insiders, cutting through the clutter to give you a clear path forward.",
  },
  {
    icon: Zap,
    title: "Personalized Journeys, Not Generic Templates",
    description:
      "Your career is unique. We ditch the one-size-fits-all approach of expensive courses for personalized guidance tailored to your specific goals and challenges.",
  },
  {
    icon: Users,
    title: "Real Mentors, Not Just Creators",
    description:
      "Connect with a trusted network of professionals who have actually been there. Get actionable insights and direct support from people who have achieved what you're aiming for.",
  },
];

const testimonials = [
  {
    pullQuote: "I started receiving calls within one week.",
    quote:
      "I started receiving calls within one week after using this format. Kinda worked like magic for me. Now my resume is created from a recruiter's perspective, not from my own, and I just feel so confident!",
    name: "Rajni",
    role: "Mentee",
    avatar: "https://placehold.co/100x100/F97316/FFFFFF?text=R",
  },
  {
    pullQuote: "He gave valuable insights on how to build a career.",
    quote:
      "Ketan is an expert in Product and Analytics. He gave valuable insights on how to build a career in Product Management and shared helpful strategies for interview preparation, networking, and salary negotiation.",
    name: "Leon Jose",
    role: "Product Management Aspirant",
    avatar: "https://placehold.co/100x100/F97316/FFFFFF?text=LJ",
  },
  {
    pullQuote: "He didn't just teach me how to book interviews, but how to crack them.",
    quote:
      "I liked the way Ketan tackled everything during our one-on-one call. He didn't just teach me how to book interviews but also how to approach and crack them using first principles.",
    name: "Pallav Joshi",
    role: "Mentee",
    avatar: "https://placehold.co/100x100/F97316/FFFFFF?text=PJ",
  },
  {
    pullQuote: "His insights truly made a difference in shaping my career plans.",
    quote:
      "Ketan is incredibly helpful when it comes to career planning... He has a natural ability to listen, understand your goals, and offer practical advice that works. His insights truly made a difference.",
    name: "Aditya Gupta",
    role: "Career Transition Aspirant",
    avatar: "https://placehold.co/100x100/F97316/FFFFFF?text=AG",
  },
];

// --- Custom Hook for Scroll Animations ---
const useInView = (options) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isInView];
};

// --- Animated Background Component ---
const AnimatedBackground = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
    <canvas id="ascend-canvas" className="w-full h-full"></canvas>
  </div>
);

// --- Testimonial Card Component ---
const TestimonialCard = ({ testimonial }) => (
  <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col h-full">
    <div className="flex items-center mb-4">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="w-12 h-12 rounded-full border-2 border-gray-600"
      />
      <div className="ml-4">
        <p className="text-white font-bold">{testimonial.name}</p>
        <p className="text-sm text-gray-500">{testimonial.role}</p>
      </div>
    </div>
    <p className="text-white font-semibold mb-2 text-lg">"{testimonial.pullQuote}"</p>
    <p className="text-gray-400 italic text-sm flex-grow">"{testimonial.quote}"</p>
  </div>
);

// --- Main HomePage Component ---
const HomePage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [whyRef, whyInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Canvas background animation
  useEffect(() => {
    const canvas = document.getElementById('ascend-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    const numParticles = 100;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 100,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(Math.random() * 1 + 0.5),
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10 || p.x > canvas.width + 10) p.vx *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    const animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const scriptURL =
      'https://script.google.com/macros/s/AKfycbwVnxhMo46kezcormu5_4Q6vsLiQRXrq1gvMR8Yqr7fjHtGAhY692KHB27JLkHxGDXI/exec';
    const formData = new FormData();
    formData.append('email', email);

    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-black text-[#e0e0e0] relative isolate"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <AnimatedBackground />

      <main className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col items-center flex-grow z-10 relative">
        {/* ============================= HERO SECTION ============================= */}
        <section className="text-center py-20 md:py-28 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-white drop-shadow-lg">
            Your Career Struggle <br /> Ends Here.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            A trusted platform to guide your professional journey with clarity, not confusion.
          </p>
          <p className="mt-8 text-orange-400 font-semibold">
            Our AI-powered career agent is coming soon to diagnose your career and put you in the
            right direction.
          </p>

          {/* Updated Email Form Layout */}
          <div className="mt-8">
            {!isSubmitted ? (
              <form
                onSubmit={handleEmailSubmit}
                className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for early access"
                  required
                  className="flex-1 px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Notify Me'}
                </button>
              </form>
            ) : (
              <div className="text-green-400 font-semibold p-4 bg-green-900/50 rounded-lg">
                You're on the list! We'll let you know the moment we launch.
              </div>
            )}
          </div>
        </section>
        {/* ============================= END HERO SECTION ============================= */}

        {/* WHY IT WORKS SECTION */}
        <section
          ref={whyRef}
          className={`mt-16 md:mt-20 w-full text-center max-w-5xl transition-all duration-1000 ${
            whyInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 dark-theme-text">
            Cut Through the Noise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {whyItWorks.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-start p-6 rounded-xl bg-[#2a2a2a] border border-gray-700 shadow-lg"
                >
                  <div className="p-3 rounded-full bg-gray-700 text-orange-400 mb-4 shadow-lg">
                    {IconComponent && <IconComponent size="1.75rem" />}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section
          ref={testimonialsRef}
          className={`mt-16 md:mt-20 w-full transition-all duration-1000 ${
            testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center dark-theme-text">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
