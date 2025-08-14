import React from 'react';
import { Link } from 'react-router-dom';
import { stages, testimonials, whyItWorks } from '../../data/appData';

const HomePage = () => {
  return (
    <main className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col items-center flex-grow z-10">
      <section className="text-center py-16 md:py-24 max-w-4xl">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-white drop-shadow-lg">
          <span className="gradient-text">Your Career Struggle</span>
          <br />
          Ends Here.
        </h2>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto opacity-80">
          A trusted platform to guide your professional journey with clarity, not confusion.
        </p>
        <div className="mt-8 md:mt-12">
          <Link to="/decision-tree" className="px-8 py-4 brand-button font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50">
            Start Your Journey
          </Link>
        </div>
      </section>
      
      <section className="mt-12 md:mt-16 w-full">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 dark-theme-text">
          How It Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, index) => (
            <Link
              key={index}
              to="/decision-tree"
              className="group text-left dark-theme-card-bg p-6 rounded-xl dark-theme-border border-2 transition-all duration-300 ease-in-out hover:dark-theme-card-hover focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <div className="flex items-center mb-4 space-x-4">
                <div className="p-3 rounded-full bg-white text-black shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <stage.icon size="1.5rem" />
                </div>
                <h4 className="text-xl font-bold text-white">{stage.title}</h4>
              </div>
              <p className="text-gray-400">{stage.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 md:mt-16 w-full text-center max-w-5xl">
        <h3 className="text-2xl sm:text-3xl font-bold mb-8 dark-theme-text">
          The OneStop Difference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {whyItWorks.map((item, index) => (
             <div key={index} className="flex flex-col items-start p-6 rounded-xl dark-theme-card-bg dark-theme-border border-2 shadow-lg">
                <div className="p-3 rounded-full bg-gray-700 text-orange-400 mb-4 shadow-lg">
                    <item.icon size="1.75rem" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 md:mt-16 w-full text-center max-w-4xl">
        <h3 className="text-2xl sm:text-3xl font-bold mb-8 dark-theme-text">
          What Our Users Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="dark-theme-card-bg p-6 rounded-xl dark-theme-border border-2 shadow-lg">
              <p className="text-gray-400 mb-4 italic">"{testimonial.quote}"</p>
              <div className="text-center">
                <p className="text-white font-bold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
