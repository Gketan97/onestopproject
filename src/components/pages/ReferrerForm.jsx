import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';

// ---------- Stable, top-level components (critical fix) ----------
const PageContainer = ({ children, isVisible }) => (
<div
className={`w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow z-10 flex items-center justify-center transition-opacity duration-500 ${
isVisible ? 'opacity-100' : 'opacity-0'
}`}
>
{children}
</div>
);

// ---------- Searchable Dropdown (hardened) ----------
const SearchableDropdown = memo(({ options, value, onChange, name, placeholder }) => {
const [isOpen, setIsOpen] = useState(false);
const dropdownRef = useRef(null);

useEffect(() => {
const handleClickOutside = (event) => {
if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
setIsOpen(false);
}
};
document.addEventListener('mousedown', handleClickOutside);
return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

const filteredOptions = useMemo(() => {
const v = (value || '').toLowerCase();
return options.filter((option) => option.toLowerCase().includes(v));
}, [options, value]);

const handleSelect = useCallback(
(option) => {
onChange({ target: { name, value: option } });
setIsOpen(false);
},
[name, onChange]
);

return (
<div className="relative" ref={dropdownRef}>
<input
type="text"
name={name}
value={value}
onChange={(e) => {
onChange(e);
setIsOpen(true); // keep open while typing
}}
onFocus={() => setIsOpen(true)}
placeholder={placeholder}
className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
required
autoComplete="off"
/>
{isOpen && (
<ul className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto">
{filteredOptions.length > 0 ? (
filteredOptions.map((option) => (
<li
key={option}
// onMouseDown ensures selection runs before the input loses focus
onMouseDown={(e) => {
e.preventDefault();
handleSelect(option);
}}
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
});

// ---------- Main Form ----------
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
const freeEmailProviders = [
'gmail.com',
'yahoo.com',
'hotmail.com',
'outlook.com',
'aol.com',
'icloud.com',
'zoho.com',
'protonmail.com',
'yandex.com'
];

// Fade in + fetch dropdown data (with cleanup)
useEffect(() => {
setIsVisible(true);

const ac = new AbortController();
const { signal } = ac;

(async () => {
try {
const res = await fetch(cdnUrl, { signal });
if (!res.ok) throw new Error('Network response was not ok');
const data = await res.json();
if (data['Company name'] && data['Job Roles']) {
// sort copies to avoid mutating anything shared
setCompanyList([...data['Company name']].sort());
setRoleList([...data['Job Roles']].sort());
} else {
throw new Error('JSON structure not as expected.');
}
} catch (err) {
if (err.name !== 'AbortError') {
console.error('Error fetching data:', err);
}
}
})();

return () => ac.abort();
}, [cdnUrl]);

// Stable change handler
const handleInputChange = useCallback((e) => {
const { name, value } = e.target;
// normalize a bit
const v = typeof value === 'string' ? value : '';
setFormData((prev) => ({ ...prev, [name]: v }));
}, []);

const validateEmail = useCallback(() => {
const email = (formData.referrerEmail || '').trim().toLowerCase();
if (email.includes('@')) {
const domain = email.split('@')[1];
setIsFreeEmail(freeEmailProviders.includes(domain));
} else {
setIsFreeEmail(false);
}
}, [formData.referrerEmail, freeEmailProviders]);

const handleSubmit = useCallback(
async (e) => {
e.preventDefault();

// Optional: simple LinkedIn sanity check
const url = (formData.linkedinUrl || '').trim();
if (!/^https?:\/\/(www\.)?linkedin\.com\/.*$/i.test(url)) {
const proceed = window.confirm('Your LinkedIn URL does not look standard. Submit anyway?');
if (!proceed) return;
}

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
},
[formData]
);

const handleCopyLink = useCallback(async () => {
const urlToCopy = window.location.href;
try {
if (navigator.clipboard?.writeText) {
await navigator.clipboard.writeText(urlToCopy);
} else {
// fallback
const textArea = document.createElement('textarea');
textArea.value = urlToCopy;
document.body.appendChild(textArea);
textArea.select();
document.execCommand('copy');
document.body.removeChild(textArea);
}
setCopyButtonText('Copied!');
setTimeout(() => setCopyButtonText('Copy Link'), 2000);
} catch (err) {
console.error('Failed to copy text: ', err);
}
}, []);

if (isSubmitted) {
return (
<PageContainer isVisible={isVisible}>
<div className="bg-[#2a2a2a] border border-gray-700 w-full max-w-3xl p-8 rounded-2xl text-center">
<div className="p-6 bg-green-900 bg-opacity-50 border border-green-700 text-green-300 rounded-lg">
<h3 className="text-xl font-semibold">Thank You for Joining!</h3>
<p className="mt-2">
Your LinkedIn profile will now be listed on our referrals page for visitors to connect with you.
</p>
</div>
<div className="mt-8 p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
<h4 className="text-lg font-semibold text-white">Spread the Word!</h4>
<p className="text-gray-400 mt-2">Know someone else who would be a great referrer? Share this page.</p>
<button
onClick={handleCopyLink}
className="mt-4 inline-flex items-center justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500"
>
{copyButtonText}
</button>
</div>
<div className="mt-8 text-center space-y-4">
<a
href="/#referrals"
className="inline-block w-full md:w-auto px-6 py-2 brand-button text-sm font-bold rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
>
&larr; Go back to Referrals
</a>
<p className="text-xs text-gray-500">
If you wish to drop out of this program, please email us at{' '}
<a href="mailto:info.careerclub99@gmail.com" className="underline hover:text-orange-500">
info.careerclub99@gmail.com
</a>
.
</p>
</div>
</div>
</PageContainer>
);
}

return (
<PageContainer isVisible={isVisible}>
<div className="bg-[#2a2a2a] border border-gray-700 w-full max-w-4xl p-6 sm:p-8 rounded-2xl">
<div className="w-full mb-6">
<a
href="/#referrals"
className="inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-400 font-semibold transition-colors"
>
<svg
xmlns="http://www.w3.org/2000/svg"
width="16"
height="16"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
>
<path d="M19 12H5" />
<path d="m12 19-7-7 7-7" />
</svg>
Back to Referrals
</a>
</div>
<div className="text-center mb-10">
<h1 className="text-3xl md:text-4xl font-bold text-white">Become a Referrer</h1>
<p className="text-gray-400 mt-3">Help others, build your network, and create an impact by referring relevant profiles.</p>
</div>

<form onSubmit={handleSubmit} className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
<div>
<label htmlFor="referrerName" className="block text-sm font-medium text-gray-300">
Name
</label>
<input
type="text"
id="referrerName"
name="referrerName"
value={formData.referrerName}
onChange={handleInputChange}
required
className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
/>
</div>

<div>
<label htmlFor="referrerEmail" className="block text-sm font-medium text-gray-300">
Email ID (Company email preferred)
</label>
<input
type="email"
id="referrerEmail"
name="referrerEmail"
value={formData.referrerEmail}
onChange={handleInputChange}
onBlur={validateEmail}
required
className={`mt-2 block w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
isFreeEmail ? 'border-yellow-500' : 'border-gray-600'
}`}
/>
{isFreeEmail && (
<p className="mt-1 text-xs text-yellow-500">Please consider using your company email for faster validation.</p>
)}
<p className="mt-1 text-xs text-gray-500">Your email will never be shared publicly.</p>
</div>

<div>
<label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300">
Contact Number
</label>
<input
type="tel"
id="contactNumber"
name="contactNumber"
value={formData.contactNumber}
onChange={handleInputChange}
required
pattern="[0-9]{10}"
title="Please enter a 10-digit contact number"
className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
/>
<p className="mt-1 text-xs text-gray-500">Your contact number is kept confidential.</p>
</div>

<div>
<label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-300">
LinkedIn Profile URL
</label>
<input
type="url"
id="linkedinUrl"
name="linkedinUrl"
value={formData.linkedinUrl}
onChange={handleInputChange}
required
placeholder="https://linkedin.com/in/your-profile"
className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
/>
</div>

<div>
<label htmlFor="currentCompany" className="block text-sm font-medium text-gray-300">
Current Company Name
</label>
<SearchableDropdown
options={companyList}
value={formData.currentCompany}
onChange={handleInputChange}
name="currentCompany"
placeholder="Search or type company..."
/>
</div>

<div>
<label htmlFor="designation" className="block text-sm font-medium text-gray-300">
Designation
</label>
<SearchableDropdown
options={roleList}
value={formData.designation}
onChange={handleInputChange}
name="designation"
placeholder="Search or type role..."
/>
</div>

<div className="md:col-span-2">
<label htmlFor="experience" className="block text-sm font-medium text-gray-300">
Years of Experience
</label>
<select
id="experience"
name="experience"
value={formData.experience}
onChange={handleInputChange}
required
className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
>
<option value="" disabled>
Select your experience level
</option>
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
<button
type="submit"
className="w-full md:w-1/2 inline-flex justify-center py-3 px-8 border border-transparent shadow-lg text-base font-semibold rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500 transition-transform transform hover:scale-105"
>
Become a Referrer
</button>
</div>
</form>
</div>
</PageContainer>
);
};

export default ReferrerForm;
