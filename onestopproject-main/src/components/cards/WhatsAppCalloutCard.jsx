

// src/components/cards/WhatsAppCalloutCard.jsx

import React from 'react';

const WhatsAppCalloutCard = () => {
  return (
    <div className="col-span-full bg-gray-800/50 rounded-lg border border-gray-700 p-6 my-3 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <div className="flex-grow mb-4 sm:mb-0">
          <h3 className="font-bold text-white text-lg">Join Our Developer Community!</h3>
          <p className="text-gray-400 text-sm mt-2">Connect with peers, share knowledge, and find your next opportunity on WhatsApp.</p>
        </div>
        <a 
          href="https://chat.whatsapp.com/your-community-invite-link" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-center"
        >
          Join Now
        </a>
      </div>
    </div>
  );
};

export default WhatsAppCalloutCard;
