// src/components/layout/WhatsAppCalloutBar.jsx

import React from 'react';
import { MessageSquare } from 'lucide-react';

const WhatsAppCalloutBar = () => {
  return (
    <div className="bg-gray-800/50 border-y border-gray-700/50 mt-8">
      <div className="w-full max-w-7xl mx-auto p-3 flex flex-col sm:flex-row justify-center items-center text-center gap-2 sm:gap-4">
        <p className="text-sm text-gray-300">
          <span className="font-bold text-white">Never miss an opportunity.</span> Join our WhatsApp community for instant job updates!
        </p>
        <a
          href="https://chat.whatsapp.com/your-community-invite-link" // <-- IMPORTANT: Update this link
          target="_blank"
          rel="noopener noreferrer"
          className="brand-button text-sm font-bold px-4 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap"
        >
          <MessageSquare size={14} />
          Join Now
        </a>
      </div>
    </div>
  );
};

export default WhatsAppCalloutBar;
