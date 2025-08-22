import React, { useState } from "react";

const ReferrerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    position: "",
    resume: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace with your actual Google Apps Script URL
      const response = await fetch(
        "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
        {
          method: "POST",
          mode: "no-cors", // Google Apps Script requires this for CORS
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("Form submitted:", response);
      alert("Referral submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        position: "",
        resume: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong while submitting!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Become a Referrer
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn Profile"
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="text"
            name="position"
            placeholder="Position for Referral"
            value={formData.position}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="text"
            name="resume"
            placeholder="Resume Link"
            value={formData.resume}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              isSubmitting ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Referral"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReferrerForm;
