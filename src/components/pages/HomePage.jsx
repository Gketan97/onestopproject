import React, { useEffect, useRef, useState } from "react";

const HomePage = () => {
  const canvasRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  // Canvas Background Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const colors = ["#ff6b6b", "#feca57", "#1dd1a1", "#54a0ff"];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.02;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < 100; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });
  }, []);

  // Intersection Observer for scroll animations
  const sectionRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Email subscription form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
        {
          method: "POST",
          body: new URLSearchParams({ email }),
        }
      );

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#1a1a1a] text-[#e0e0e0] overflow-hidden">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full -z-10"
      ></canvas>

      {/* Hero Section */}
      <section className="relative text-center flex flex-col justify-center items-center py-20 md:py-28 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Land Your Dream Job with{" "}
          <span className="text-orange-500">Clarity & Confidence</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Stop guessing. Use our AI-powered decision tools, resources, and
          mentorship to plan your next big career move.
        </p>

        {/* Subscription Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 w-full sm:w-80 rounded-lg text-black text-lg focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email Address"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg text-lg transition duration-300"
          >
            {status === "loading" ? "Submitting..." : "Get Started"}
          </button>
        </form>
        {status === "success" && (
          <p className="text-green-400 mt-4">
            ✅ Thanks for subscribing! Check your inbox.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-400 mt-4">
            ❌ Something went wrong. Please try again.
          </p>
        )}
      </section>

      {/* Why It Works Section */}
      <section
        ref={sectionRef}
        className={`transition-all duration-700 px-6 max-w-6xl mx-auto text-center ${
          isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Why It Works</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          We combine AI-driven tools, real-time job insights, and mentor-driven
          guidance to help you take the guesswork out of career planning.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-[#222] rounded-xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold mb-4">AI Decision Tree</h3>
            <p className="text-gray-400">
              Navigate complex choices with confidence using our AI-powered
              decision-making tools.
            </p>
          </div>
          <div className="p-6 bg-[#222] rounded-xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold mb-4">Job Resources</h3>
            <p className="text-gray-400">
              Access curated job opportunities, referral options, and resume
              tools.
            </p>
          </div>
          <div className="p-6 bg-[#222] rounded-xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold mb-4">Mentorship</h3>
            <p className="text-gray-400">
              Learn from experts who have walked the path you want to take.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
