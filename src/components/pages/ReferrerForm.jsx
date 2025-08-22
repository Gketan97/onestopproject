import React, { useState, useEffect } from 'react';

const ReferrerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    designation: '',
    linkedin: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Handle input changes properly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // ✅ Submit form to Google Apps Script
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbzqn78oMYFVEIbq4xDY735xbqv9N2GY0X3jMSHzinNqhNdunPql6JA-eTUyMczwgx9d/exec',
        {
          method: 'POST',
          body: new URLSearchParams(formData)
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again later.');
    }

    setIsLoading(false);
  };

  // ✅ Inject external script for searchable dropdowns
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://script.google.com/macros/s/AKfycbz8OZ4wrUb6kwukysA5ucb9nXu_TE5yp1SIuU8PqUmbJiGWBdwUliU8pGsNpdkliCqN/exec';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      {!isSubmitted ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-4">Become a Referrer</h2>
          <p className="text-gray-600 text-center mb-6">
            Fill in the details to refer candidates and help them get placed.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Company (Searchable via external script) */}
            <div>
              <label className="block text-gray-700 mb-1">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                id="company-search"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                placeholder="Search company name"
                required
              />
            </div>

            {/* Designation (Searchable via external script) */}
            <div>
              <label className="block text-gray-700 mb-1">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                id="designation-search"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                placeholder="Search designation"
                required
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-gray-700 mb-1">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                placeholder="Enter LinkedIn profile link"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition duration-300"
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <h3 className="text-xl font-bold text-green-600 mb-4">Thank you for submitting!</h3>
          <p className="text-gray-700 mb-6">
            Your referral has been recorded successfully.
          </p>
          <div className="bg-orange-100 border border-orange-300 p-4 rounded-lg">
            <p className="mb-2 font-semibold">Help others by sharing this form:</p>
            <input
              type="text"
              readOnly
              value={window.location.href}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferrerForm;
