// Sticky mission brief panel shown above Phase 2 content
import React, { useState } from 'react';
import SlackThread, { SlackMessage } from './SlackThread.jsx';

const SCHEMA_TABLES = [
  { name: 'prod.orders', cols: 'order_id, user_id, restaurant_id, cuisine_type, delivery_area, order_date, status, platform' },
  { name: 'prod.restaurants', cols: 'restaurant_id, name, cuisine_type, delivery_area, avg_rating, is_active' },
  { name: 'prod.restaurant_reviews', cols: 'review_id, restaurant_id, rating, review_date, suspicious_flag' },
  { name: 'prod.external_events', cols: 'event_id, event_type, platform, geography, event_date, discount_pct' },
];

export default function MissionBrief({ priyaFollowup }) {
  const [open, setOpen] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);

  return (
    <div className={`sticky top-[88px] z-40 bg-surface border border-border rounded-xl mb-3 shadow-card transition-all`}>
      {/* Header toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-phase2-bg text-phase2 border border-phase2-border font-mono text-[9px] font-semibold">Phase 2</span>
          <span className="text-sm font-medium text-ink">North Bangalore · Biryani orders down 34%</span>
        </div>
        <span className="font-mono text-[10px] text-ink3">{open ? '▲ Brief' : '▼ Brief'}</span>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-3.5 pb-3 border-t border-border pt-3">
          <SlackThread channel="analytics-incident · swiggy data team">
            <SlackMessage initials="PS" name="Priya S." meta="Mon 4:47 PM · Head of Analytics">
              Good news: overall orders are recovering. Bad news: North Bangalore is still lagging — specifically Biryani. Down 34% vs last Monday. Monday leadership review is in 2 days. Need root cause by EOD tomorrow.
            </SlackMessage>
            {priyaFollowup && (
              <SlackMessage initials="PS" name="Priya S." meta="just now">
                {priyaFollowup}
              </SlackMessage>
            )}
          </SlackThread>

          {/* Schema toggle */}
          <button
            onClick={() => setSchemaOpen(!schemaOpen)}
            className="flex items-center gap-1.5 font-mono text-[10px] text-ink3 hover:text-ink2 transition-colors mt-1"
          >
            <span>{schemaOpen ? '▼' : '▶'}</span>
            <span>Schema &amp; Tables · prod.swiggy · BigQuery</span>
          </button>

          {schemaOpen && (
            <div className="mt-2 bg-sql-bg rounded-lg p-3 font-mono text-[10px]">
              {SCHEMA_TABLES.map((t) => (
                <div key={t.name} className="mb-2 last:mb-0">
                  <p className="text-sql-str font-semibold">{t.name}</p>
                  <p className="text-sql-comment pl-2 leading-relaxed">{t.cols}</p>
                </div>
              ))}
              <p className="text-sql-kw mt-2 font-semibold">Explore tables (some dead ends):</p>
              <p className="text-sql-comment pl-2">weather.bangalore · prod.competitor_pricing · prod.delivery_partners · prod.app_sessions · prod.search_events · prod.cuisine_trends · prod.user_demographics · prod.marketing_spend · prod.calendar · prod.support_tickets</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
