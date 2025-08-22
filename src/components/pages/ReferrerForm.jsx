import React, { useState, useEffect } from 'react';

// This component assumes Tailwind CSS is available in your project.

const ReferrerForm = () => {
    // State to manage form submission status
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // State for form input fields
    const [formData, setFormData] = useState({
        referrerName: '',
        referrerEmail: '',
        contactNumber: '',
        linkedinUrl: '',
        currentCompany: '',
        designation: '',
        experience: ''
    });

    // State for the dynamic dropdown/datalist options
    const [companyList, setCompanyList] = useState([]);
    const [roleList, setRoleList] = useState([]);

    // State for email validation
    const [isFreeEmail, setIsFreeEmail] = useState(false);

    // CDN URL for the job data
    const cdnUrl = 'https://cdn.jsdelivr.net/gh/ketangoel16-creator/onestopcareers-data/job_data.json';
    
    // List of common free email providers for validation
    const freeEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'zoho.com', 'protonmail.com', 'yandex.com'];

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        fetch(cdnUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data['Company name'] && data['Job Roles']) {
                    setCompanyList(data['Company name'].sort());
                    setRoleList(data['Job Roles'].sort());
                } else {
                    throw new Error('JSON structure is not as expected.');
                }
            })
            .catch(error => {
                console.error('Error fetching or parsing data:', error);
            });
    }, []); // Empty dependency array ensures this runs only once on mount

    // Handler for input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    // Handler for email validation on blur
    const validateEmail = () => {
        const domain = formData.referrerEmail.split('@')[1];
        if (freeEmailProviders.includes(domain)) {
            setIsFreeEmail(true);
        } else {
            setIsFreeEmail(false);
        }
    };

    // Handler for form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        setIsSubmitted(true);
    };

    // Handler for the "Copy Link" button
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert("Link copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    // Render the success message and share callout after submission
    if (isSubmitted) {
        return (
            <div className="bg-gray-900 border border-gray-700 w-full max-w-3xl p-8 rounded-2xl text-center">
                <div className="p-6 bg-green-900 bg-opacity-50 border border-green-700 text-green-300 rounded-lg">
                    <h3 className="text-xl font-semibold">Thank You for Joining!</h3>
                    <p className="mt-2">You are now part of our referrer community.</p>
                </div>
                
                <div className="mt-8 p-6 bg-gray-800 border border-gray-700 rounded-lg">
                    <h4 className="text-lg font-semibold text-white">Spread the Word!</h4>
                    <p className="text-gray-400 mt-2">Know someone else who would be a great referrer? Share this page with them.</p>
                    <button onClick={handleCopyLink} className="mt-4 inline-flex items-center justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500">
                        Copy Link
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <a href="/" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                        &larr; Go back to the main website
                    </a>
                </div>
            </div>
        );
    }

    // Render the form
    return (
        <div className="bg-gray-900 border border-gray-700 w-full max-w-3xl p-8 rounded-2xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white">Become a Referrer</h1>
                <p className="text-gray-400 mt-3">Join our platform to help others in the community and build your network.</p>
                <p className="text-orange-500 mt-2 text-sm">Create an impact by referring relevant profiles and helping them land their dream job.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="referrerName" className="block text-sm font-medium text-gray-300">Name</label>
                        <input type="text" id="referrerName" name="referrerName" value={formData.referrerName} onChange={handleInputChange} required className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                    </div>

                    <div>
                        <label htmlFor="referrerEmail" className="block text-sm font-medium text-gray-300">Email ID (Company email preferred)</label>
                        <input type="email" id="referrerEmail" name="referrerEmail" value={formData.referrerEmail} onChange={handleInputChange} onBlur={validateEmail} required className={`mt-2 block w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${isFreeEmail ? 'border-yellow-500' : 'border-gray-600'}`} />
                        {isFreeEmail && <p className="mt-2 text-xs text-yellow-500">Please consider using your company email for faster validation.</p>}
                    </div>

                    <div>
                        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300">Contact Number</label>
                        <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required pattern="[0-9]{10}" title="Please enter a 10-digit contact number" className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                    </div>

                    <div>
                        <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-300">LinkedIn Profile URL</label>
                        <input type="url" id="linkedinUrl" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange} required placeholder="https://linkedin.com/in/your-profile" className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                    </div>

                    <div>
                        <label htmlFor="currentCompany" className="block text-sm font-medium text-gray-300">Current Company Name</label>
                        <input list="company-list" id="currentCompany" name="currentCompany" value={formData.currentCompany} onChange={handleInputChange} required className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                        <datalist id="company-list">
                            {companyList.map(company => <option key={company} value={company} />)}
                        </datalist>
                    </div>

                    <div>
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-300">Designation</label>
                        <input list="role-list" id="designation" name="designation" value={formData.designation} onChange={handleInputChange} required className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                        <datalist id="role-list">
                            {roleList.map(role => <option key={role} value={role} />)}
                        </datalist>
                    </div>
                    
                    <div className="md:col-span-2">
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-300">Years of Experience</label>
                        <select id="experience" name="experience" value={formData.experience} onChange={handleInputChange} required className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition">
                            <option value="" disabled>Select your experience level</option>
                            <option value="intern">Intern</option>
                            <option value="fresher">Fresher</option>
                            <option value="0-1">0 - 1 Year</option>
                            <option value="1-2">1 - 2 Years</option>
                            <option value="2-4">2 - 4 Years</option>
                            <option value="4-7">4 - 7 Years</option>
                            <option value="7-10">7 - 10 Years</option>
                            <option value="10+">10+ Years</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 text-center">
                    <button type="submit" className="w-full md:w-auto inline-flex justify-center py-3 px-8 border border-transparent shadow-lg text-base font-semibold rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500 transition-transform transform hover:scale-105">
                        Become a Referrer
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReferrerForm;
