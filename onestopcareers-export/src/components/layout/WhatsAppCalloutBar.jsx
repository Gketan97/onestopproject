import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

const WhatsAppCalloutBar = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-surface border-y border-border">
      <div className="w-full max-w-7xl mx-auto px-4 py-2.5 flex justify-center items-center relative">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center">
          <p className="text-sm text-ink2">
            <span className="font-medium text-ink">Get real-time job alerts before anyone else.</span>
            {' '}Join 40k+ members on our WhatsApp channel.
          </p>
          <a
            href="https://www.whatsapp.com/channel/0029Va5RkYRBqbrCyLdiaL3M"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-1.5 whitespace-nowrap
              px-4 py-1.5 rounded-lg text-sm font-medium
              bg-green text-white hover:opacity-90 transition-opacity
            "
          >
            <MessageSquare size={13} />
            Join Now
          </a>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="absolute top-1/2 -translate-y-1/2 right-4 text-ink3 hover:text-ink transition-colors"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default WhatsAppCalloutBar;
