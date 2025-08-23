import React, { useState, useEffect } from 'react';

const ReferrerForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Separate state variables for each input field
    const [referrerName, setReferrerName] = useState('');
    const [referrerEmail, setReferrerEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [currentCompany, setCurrentCompany] = useState('');
    const [designation, setDesignation] = useState('');
    const [experience, setExperience] = useState('');

    const [isFreeEmail, setIsFreeEmail] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copy Link');

    const freeEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'zoho.com', 'protonmail.com', 'yandex.com'];

    useEffect(() => {
        setIsVisible(true);
    }, []);
    
    useEffect(() => {
        if (referrerEmail) {
            const domain = referrerEmail.split('@')[1];
            setIsFreeEmail(freeEmailProviders.includes(domain));
        } else {
            setIsFreeEmail(false);
        }
    }, [referrerEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            referrerName,
            referrerEmail,
            contactNumber,
            linkedinUrl,
            currentCompany,
            designation,
            experience
        };

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbzqn78oMYFVEIbq4xDY735xbqv9N2GY0X3jMSHzinNqhNdunPql6JA-eTUyMczwgx9d/exec', {
                method: 'POST',
                body: new URLSearchParams(formData),
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                alert('Failed to submit. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong. Please try again later.');
        }
    };

    const handleCopyLink = () => {
        const urlToCopy = window.location.href;
        navigator.clipboard.writeText(urlToCopy).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy Link'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const PageContainer = ({ children }) => (
        <div className={`w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow z-10 flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {children}
        </div>
    );

    if (isSubmitted) {
        return (
            <PageContainer>
                <div className="bg-[#2a2a2a] border border-gray-700 w-full max-w-3xl p-8 rounded-2xl text-center">
                    <div className="p-6 bg-green-900 bg-opacity-50 border border-green-700 text-green-300 rounded-lg">
                        <h3 className="text-xl font-semibold">Thank You for Joining!</h3>
                        <p className="mt-2">Your LinkedIn profile will now be listed on our referrals page for visitors to connect with you.</p>
                    </div>

                    <div className="mt-8 p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <h4 className="text-lg font-semibold text-white">Spread the Word!</h4>
                        <p className="text-gray-400 mt-2">Know someone else who would be a great referrer? Share this page.</p>
                        <button onClick={handleCopyLink} className="mt-4 inline-flex items-center justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500">
                            {copyButtonText}
                        </button>
                    </div>

                    <div className="mt-8 text-center space-y-4">
                        <a href="/" className="inline-block w-full md:w-auto px-6 py-2 brand-button text-sm font-bold rounded-lg bg-gray-700 hover:bg-gray-600 text-white">
                            &larr; Go back to Website
                        </a>
                        <p className="text-xs text-gray-500">
                            If you wish to drop out of this program, please email us at <a href="mailto:info.careerclub99@gmail.com" className="underline hover:text-orange-500">info.careerclub99@gmail.com</a>.
                        </p>
                    </div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="relative bg-[#2a2a2a] border border-gray-700 w-full max-w-4xl p-6 sm:p-8 rounded-2xl">
                <a href="/" className="absolute top-4 left-4 text-sm text-gray-400 hover:text-orange-500 transition-colors">
                    &larr; Go back
                </a>
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Become a Referrer</h1>
                    <p className="text-gray-400 mt-3">Help others, build your network, and create an impact by referring relevant profiles.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <label htmlFor="referrerName" className="block text-sm font-medium text-gray-300">Name</label>
                            <input type="text" id="referrerName" name="referrerName" value={referrerName} onChange={(e) => setReferrerName(e.target.value)} required className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                        </div>

                        <div>
                            <label htmlFor="referrerEmail" className="block text-sm font-medium text-gray-300">Email ID (Company email preferred)</label>
                            <input type="email" id="referrerEmail" name="referrerEmail" value={referrerEmail} onChange={(e) => setReferrerEmail(e.target.value)} onBlur={() => {
                                const domain = referrerEmail.split('@')[1];
                                setIsFreeEmail(freeEmailProviders.includes(domain));
                            }} required className={`mt-2 block w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${isFreeEmail ? 'border-yellow-500' : 'border-gray-600'}`} />
                            {isFreeEmail && <p className="mt-1 text-xs text-yellow-500">Please consider using your company email for faster validation.</p>}
                            <p className="mt-1 text-xs text-gray-500">Your email will never be shared publicly.</p>
                        </div>

                        <div>
                            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300">Contact Number</label>
                            <input type="tel" id="contactNumber" name="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required pattern="[0-9]{10}" title="Please enter a 10-digit contact number" className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                            <p className="mt-1 text-xs text-gray-500">Your contact number is kept confidential.</p>
                        </div>

                        <div>
                            <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-300">LinkedIn Profile URL</label>
                            <input type="url" id="linkedinUrl" name="linkedinUrl" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} required placeholder="https://linkedin.com/in/your-profile" className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                        </div>

                        <div>
                            <label htmlFor="currentCompany" className="block text-sm font-medium text-gray-300">Current Company Name</label>
                            <input type="text" id="currentCompany" name="currentCompany" value={currentCompany} onChange={(e) => setCurrentCompany(e.target.value)} required className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                        </div>

                        <div>
                            <label htmlFor="designation" className="block text-sm font-medium text-gray-300">Designation</label>
                            <input type="text" id="designation" name="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} required className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="experience" className="block text-sm font-medium text-gray-300">Years of Experience</label>
                            <select id="experience" name="experience" value={experience} onChange={(e) => setExperience(e.target.value)} required className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition">
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
                        <button type="submit" className="w-full md:w-1/2 inline-flex justify-center py-3 px-8 border border-transparent shadow-lg text-base font-semibold rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500 transition-transform transform hover:scale-105">
                            Become a Referrer
                        </button>
                    </div>
                </form>
            </div>
        </PageContainer>
    );
};

export default ReferrerForm;
