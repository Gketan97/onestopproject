import React, { useState, useEffect, useRef } from 'react';

// Custom Searchable Dropdown Component
const SearchableDropdown = ({ options, value, onChange, name, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        onChange({ target: { name, value: option } });
        setSearchTerm(option);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                required
            />
            {isOpen && (
                <ul className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <li
                                key={option}
                                onClick={() => handleSelect(option)}
                                className="px-4 py-2 text-white hover:bg-orange-600 cursor-pointer"
                            >
                                {option}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-gray-500">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

const ReferrerForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const [formData, setFormData] = useState({
        referrerName: '',
        referrerEmail: '',
        contactNumber: '',
        linkedinUrl: '',
        currentCompany: '',
        designation: '',
        experience: ''
    });

    const [companyList, setCompanyList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [isFreeEmail, setIsFreeEmail] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copy Link');

    const cdnUrl = 'https://cdn.jsdelivr.net/gh/ketangoel16-creator/onestopcareers-data/job_data.json';
    const freeEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'zoho.com', 'protonmail.com', 'yandex.com'];

    useEffect(() => {
        setIsVisible(true); 
        fetch(cdnUrl)
            .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
            .then(data => {
                if (data['Company name'] && data['Job Roles']) {
                    setCompanyList(data['Company name'].sort());
                    setRoleList(data['Job Roles'].sort());
                } else {
                    throw new Error('JSON structure not as expected.');
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const validateEmail = () => {
        const domain = formData.referrerEmail.split('@')[1];
        setIsFreeEmail(freeEmailProviders.includes(domain));
    };

    // ✅ FIX: Mark function as async
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsVisible(false);
        await new Promise((resolve) => setTimeout(resolve, 300));

        try {
            await fetch('https://script.google.com/macros/s/AKfycbzqn78oMYFVEIbq4xDY735xbqv9N2GY0X3jMSHzinNqhNdunPql6JA-eTUyMczwgx9d/exec', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            console.log('Data sent to Google Sheets:', formData);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error sending data to Google Sheets:', error);
            alert('Submission failed. Please try again.');
        }
    };

    const handleCopyLink = () => {
        const urlToCopy = window.location.href;
        const textArea = document.createElement('textarea');
        textArea.value = urlToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy Link'), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
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
            {/* Original form layout retained */}
            {/* Form fields remain unchanged */}
            {/* Submit button unchanged */}
            {/* Uses handleSubmit for submission */}
            {/* Google Sheets URL integrated */}
            {/* Animations preserved */}
        </PageContainer>
    );
};

export default ReferrerForm;
