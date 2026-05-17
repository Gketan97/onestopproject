"""
PlanMyTrip Case Study — Data Generator
"The Growth Trap"

Run: python generate_case_data.py
Output: creates /case_data/ folder with all CSV files + JSON aggregates

Hidden root cause embedded:
- Traffic mix shift: paid_social/UAC goes from 8% to 19% of sessions
- These users convert at 1.4% vs 4.8% for organic returning users
- Aggregate drops from 4.2% to 2.9% — entirely explained by mix, not performance
- Secondary: TripEase price gap on DEL-BOM, BOM-BLR, DEL-BLR routes
- Secondary: Android payment UI experiment causes small (-0.8pp) checkout drop
"""

import pandas as pd
import numpy as np
import json
import os
from datetime import datetime, timedelta

np.random.seed(42)
os.makedirs('case_data/raw', exist_ok=True)
os.makedirs('case_data/aggregates', exist_ok=True)
os.makedirs('case_data/metadata', exist_ok=True)

# ── Date setup ─────────────────────────────────────────────────
START = datetime(2024, 4, 1)
PROBLEM_START = datetime(2024, 7, 1)
CAMPAIGN_LAUNCH = datetime(2024, 7, 12)
END = datetime(2024, 8, 31)

BASELINE_WEEKS = 13  # Apr-Jun
PROBLEM_WEEKS = 8    # Jul-Aug

print("Generating PlanMyTrip case study data...")
print("=" * 50)

# ══════════════════════════════════════════════════
# TABLE 1: USERS (5,000 rows)
# ══════════════════════════════════════════════════
print("\n[1/10] Generating users...")

N_USERS = 5000
channels = ['organic_search', 'returning_direct', 'paid_search', 'paid_social', 'email_push', 'referral']

# Pre-period users (3,200) — mostly organic/returning
pre_channels = np.random.choice(
    channels,
    size=3200,
    p=[0.32, 0.30, 0.18, 0.08, 0.09, 0.03]
)

# Problem period users (1,800) — shifted toward paid_social
prob_channels = np.random.choice(
    channels,
    size=1800,
    p=[0.22, 0.20, 0.14, 0.28, 0.10, 0.06]
)

all_channels = np.concatenate([pre_channels, prob_channels])

# Registration dates
pre_reg_dates = [START + timedelta(days=np.random.randint(0, 91)) for _ in range(3200)]
prob_reg_dates = [PROBLEM_START + timedelta(days=np.random.randint(0, 61)) for _ in range(1800)]
all_reg_dates = pre_reg_dates + prob_reg_dates

# City tier — problem period users more tier2/3
def assign_tier(channel, period):
    if period == 'problem' and channel == 'paid_social':
        return np.random.choice(['tier1', 'tier2', 'tier3'], p=[0.30, 0.45, 0.25])
    elif period == 'problem':
        return np.random.choice(['tier1', 'tier2', 'tier3'], p=[0.48, 0.36, 0.16])
    else:
        return np.random.choice(['tier1', 'tier2', 'tier3'], p=[0.55, 0.30, 0.15])

tier1_cities = ['DEL', 'BOM', 'BLR', 'HYD', 'MAA', 'CCU']
tier2_cities = ['JAI', 'LKO', 'IXC', 'BHO', 'NAG', 'VTZ', 'CJB', 'ATQ']
tier3_cities = ['IXB', 'GAU', 'BBI', 'VNS', 'SXR', 'GOP']

def assign_city(tier):
    if tier == 'tier1':
        return np.random.choice(tier1_cities)
    elif tier == 'tier2':
        return np.random.choice(tier2_cities)
    else:
        return np.random.choice(tier3_cities)

# User segments
def assign_segment(channel, period):
    if channel == 'paid_social' and period == 'problem':
        return 'new_campaign'
    elif channel == 'returning_direct':
        return 'returning_organic'
    elif channel in ['organic_search', 'paid_search'] and period == 'pre':
        return np.random.choice(['returning_organic', 'new_organic'], p=[0.6, 0.4])
    elif channel == 'email_push':
        return 'returning_organic'
    else:
        return 'new_organic'

# Lifetime bookings by segment
def assign_lifetime_bookings(segment):
    if segment == 'returning_organic':
        return np.random.randint(2, 9)
    elif segment == 'new_campaign':
        return 0
    else:
        return np.random.randint(0, 3)

users_data = []
for i in range(N_USERS):
    period = 'pre' if i < 3200 else 'problem'
    channel = all_channels[i]
    reg_date = all_reg_dates[i]
    tier = assign_tier(channel, period)
    city = assign_city(tier)
    segment = assign_segment(channel, period)
    lifetime_bkgs = assign_lifetime_bookings(segment)
    is_corporate = channel == 'returning_direct' and np.random.random() < 0.18
    device = np.random.choice(['android', 'ios', 'web'], p=[0.52, 0.28, 0.20])
    
    # App version at registration
    if reg_date < datetime(2024, 6, 24):
        app_ver = np.random.choice(['8.2.1', '8.3.0', '8.3.2'])
    elif reg_date < datetime(2024, 7, 8):
        app_ver = np.random.choice(['8.3.2', '8.4.0'])
    elif reg_date < datetime(2024, 8, 5):
        app_ver = np.random.choice(['8.4.0', '8.4.1'])
    else:
        app_ver = np.random.choice(['8.4.1', '8.4.2'])
    
    if device == 'web':
        app_ver = None
    
    # First/last booking dates
    if lifetime_bkgs > 0:
        first_bkg = reg_date - timedelta(days=np.random.randint(30, 365))
        last_bkg = reg_date - timedelta(days=np.random.randint(0, 90))
    else:
        first_bkg = None
        last_bkg = None
    
    users_data.append({
        'user_id': f'USR_{i+1:05d}',
        'registration_date': reg_date.strftime('%Y-%m-%d'),
        'acquisition_channel': channel,
        'origin_city_code': city if np.random.random() > 0.03 else None,  # 3% null
        'city_tier': tier,
        'device_type': device,
        'app_version_at_registration': app_ver,
        'is_corporate': is_corporate,
        'total_bookings_lifetime': lifetime_bkgs,
        'first_booking_date': first_bkg.strftime('%Y-%m-%d') if first_bkg else None,
        'last_booking_date': last_bkg.strftime('%Y-%m-%d') if last_bkg else None,
        'user_segment': 'corporate' if is_corporate else segment,
        'period': period
    })

users_df = pd.DataFrame(users_data)
users_df.to_csv('case_data/raw/users.csv', index=False)
print(f"  ✓ users.csv — {len(users_df)} rows")

# ══════════════════════════════════════════════════
# TABLE 2: SESSIONS (25,000 rows)
# ══════════════════════════════════════════════════
print("\n[2/10] Generating sessions...")

sessions_data = []
session_counter = 1

for _, user in users_df.iterrows():
    reg_date = datetime.strptime(user['registration_date'], '%Y-%m-%d')
    
    # Sessions per user based on segment
    if user['user_segment'] == 'returning_organic':
        n_sessions = np.random.randint(3, 9)
    elif user['user_segment'] == 'new_campaign':
        n_sessions = np.random.randint(2, 6)  # Browse more, book less
    elif user['user_segment'] == 'corporate':
        n_sessions = np.random.randint(2, 7)
    else:
        n_sessions = np.random.randint(1, 5)
    
    for _ in range(n_sessions):
        # Session date — spread across period
        days_range = (END - max(reg_date, START)).days
        if days_range <= 0:
            continue
        session_date = max(reg_date, START) + timedelta(days=np.random.randint(0, days_range))
        
        # Determine if problem period
        is_problem = session_date >= PROBLEM_START
        is_campaign_period = session_date >= CAMPAIGN_LAUNCH
        
        # Platform matches device type mostly
        if user['device_type'] == 'android':
            platform = np.random.choice(['android_app', 'mobile_web'], p=[0.92, 0.08])
        elif user['device_type'] == 'ios':
            platform = np.random.choice(['ios_app', 'mobile_web'], p=[0.90, 0.10])
        else:
            platform = np.random.choice(['mobile_web', 'desktop_web'], p=[0.60, 0.40])
        
        # App version based on date
        if platform in ['android_app']:
            if session_date < datetime(2024, 6, 24):
                app_ver = np.random.choice(['8.2.1', '8.3.0', '8.3.2'], p=[0.1, 0.3, 0.6])
            elif session_date < datetime(2024, 7, 8):
                app_ver = np.random.choice(['8.3.2', '8.4.0'], p=[0.4, 0.6])
            elif session_date < datetime(2024, 8, 5):
                app_ver = np.random.choice(['8.4.0', '8.4.1'], p=[0.35, 0.65])
            else:
                app_ver = np.random.choice(['8.4.1', '8.4.2'], p=[0.25, 0.75])
        elif platform == 'ios_app':
            app_ver = np.random.choice(['9.1.0', '9.1.1', '9.2.0'])
        else:
            app_ver = None
        
        # Channel attribution — tracking regression in 8.4.0 and 8.4.1
        has_tracking_bug = app_ver in ['8.4.0', '8.4.1'] and platform == 'android_app'
        if has_tracking_bug and np.random.random() < 0.08:
            channel_attr = None  # Tracking gap
        else:
            channel_attr = user['acquisition_channel']
        
        # Session duration
        duration_mins = np.random.exponential(12)
        start_hour = np.random.choice(range(8, 23), p=[0.04,0.06,0.08,0.10,0.10,0.09,0.09,0.08,0.07,0.07,0.06,0.05,0.04,0.04,0.03])
        start_ts = session_date.replace(hour=start_hour, minute=np.random.randint(0,60))
        end_ts = start_ts + timedelta(minutes=max(1, duration_mins))
        
        # Introduce timestamp bug (0.3%)
        if np.random.random() < 0.003:
            end_ts, start_ts = start_ts, end_ts
        
        had_search = np.random.random() < 0.72  # 28% sessions no search
        
        sessions_data.append({
            'session_id': f'SES_{session_counter:07d}',
            'user_id': user['user_id'],
            'session_start_ts': start_ts.strftime('%Y-%m-%d %H:%M:%S'),
            'session_end_ts': end_ts.strftime('%Y-%m-%d %H:%M:%S'),
            'platform': platform,
            'app_version': app_ver,
            'is_new_user_session': _ == 0,
            'channel_attribution': channel_attr,
            'city_of_session': user['origin_city_code'],
            'session_had_search': had_search,
            'session_had_booking': False,  # Updated later
            'user_segment': user['user_segment'],
            'is_problem_period': is_problem,
            'is_campaign_period': is_campaign_period,
        })
        session_counter += 1

sessions_df = pd.DataFrame(sessions_data)
sessions_df.to_csv('case_data/raw/sessions.csv', index=False)
print(f"  ✓ sessions.csv — {len(sessions_df)} rows")

# ══════════════════════════════════════════════════
# TABLE 3: SEARCH EVENTS (18,000 rows)
# ══════════════════════════════════════════════════
print("\n[3/10] Generating search events...")

# Routes with competitive dynamics
metro_metro_routes = ['DEL-BOM', 'BOM-BLR', 'DEL-BLR', 'DEL-HYD', 'BOM-HYD', 'BLR-HYD']
leisure_routes = ['DEL-GOI', 'BOM-COK', 'BLR-MYQ', 'DEL-JAI']
tier2_routes = ['JAI-DEL', 'LKO-DEL', 'IXC-DEL', 'BHO-BOM']

# TripEase has price advantage on first 3 metro routes during problem period
tripease_cheaper_routes = ['DEL-BOM', 'BOM-BLR', 'DEL-BLR']

search_sessions = sessions_df[sessions_df['session_had_search'] == True]

searches_data = []
search_counter = 1

for _, session in search_sessions.iterrows():
    n_searches = np.random.choice([1, 2, 3], p=[0.72, 0.22, 0.06])
    
    for _ in range(n_searches):
        session_ts = datetime.strptime(session['session_start_ts'], '%Y-%m-%d %H:%M:%S')
        search_ts = session_ts + timedelta(minutes=np.random.randint(1, 8))
        
        # Route selection based on user origin
        city = session['city_of_session'] or 'DEL'
        if city in ['DEL', 'BOM', 'BLR']:
            route = np.random.choice(metro_metro_routes + leisure_routes, p=[0.15,0.15,0.12,0.10,0.08,0.07,0.10,0.07,0.07,0.09])
        elif city in tier2_cities:
            route = np.random.choice(tier2_routes + metro_metro_routes[:3], p=[0.30,0.25,0.20,0.10,0.08,0.04,0.03])
        else:
            route = np.random.choice(metro_metro_routes, p=[0.25,0.20,0.18,0.15,0.12,0.10])
        
        origin, dest = route.split('-')
        
        # Booking window — campaign users search further out (lower intent)
        if session['user_segment'] == 'new_campaign':
            bkg_window = max(1, int(np.random.exponential(32)))
        elif session['user_segment'] == 'corporate':
            bkg_window = max(1, int(np.random.normal(12, 5)))
        else:
            bkg_window = max(1, int(np.random.exponential(18)))
        
        travel_date = search_ts.date() + timedelta(days=bkg_window)
        
        # Price generation
        base_price = np.random.randint(3500, 9000)
        
        # Competitor price — TripEase cheaper on specific routes during problem period
        is_problem = session['is_problem_period']
        if route in tripease_cheaper_routes and is_problem:
            price_gap = np.random.uniform(0.08, 0.16)  # PMT 8-16% more expensive
            competitor_price = int(base_price / (1 + price_gap))
        else:
            price_gap = np.random.uniform(-0.04, 0.06)  # PMT competitive
            competitor_price = int(base_price / (1 + price_gap))
        
        # Null competitor price (scraping gaps)
        if np.random.random() < 0.12:
            competitor_price = None
            price_gap = None
        
        # Listing click rate — THE KEY METRIC
        # By segment and period:
        segment = session['user_segment']
        if segment == 'new_campaign':
            click_rate = 0.44  # Low intent browsers
        elif segment == 'returning_organic' or segment == 'corporate':
            click_rate = 0.74
        elif is_problem and route in tripease_cheaper_routes:
            click_rate = 0.58  # Pricing puts them off
        else:
            click_rate = 0.67
        
        had_click = np.random.random() < click_rate
        
        # Route ID — 1.8% null for tier2 airports
        if origin in tier2_cities and np.random.random() < 0.018:
            route_id = None
        else:
            route_id = f'ROUTE_{route}'
        
        # Duplicate search (0.4%)
        searches_data.append({
            'search_id': f'SCH_{search_counter:07d}',
            'session_id': session['session_id'],
            'user_id': session['user_id'],
            'search_ts': search_ts.strftime('%Y-%m-%d %H:%M:%S'),
            'origin_code': origin,
            'destination_code': dest,
            'travel_date': travel_date.strftime('%Y-%m-%d'),
            'booking_window_days': bkg_window,
            'trip_type': np.random.choice(['oneway', 'roundtrip'], p=[0.62, 0.38]),
            'pax_count': np.random.choice([1, 2, 3, 4], p=[0.55, 0.30, 0.10, 0.05]),
            'results_returned': np.random.randint(4, 18) if np.random.random() > 0.03 else 0,
            'pmt_cheapest_price': base_price,
            'competitor_cheapest_price': competitor_price,
            'price_gap_pct': round(price_gap, 3) if price_gap else None,
            'had_listing_click': had_click,
            'route_id': route_id,
            'user_segment': segment,
            'is_problem_period': is_problem,
        })
        
        # Duplicate event (0.4%)
        if np.random.random() < 0.004:
            dup = searches_data[-1].copy()
            dup['search_id'] = f'SCH_{search_counter:07d}'  # Same ID = duplicate
            searches_data.append(dup)
        
        search_counter += 1

searches_df = pd.DataFrame(searches_data)
searches_df.to_csv('case_data/raw/search_events.csv', index=False)
print(f"  ✓ search_events.csv — {len(searches_df)} rows")

# ══════════════════════════════════════════════════
# TABLE 4: BOOKINGS (3,200 rows)
# ══════════════════════════════════════════════════
print("\n[4/10] Generating bookings...")

# Only from searches with listing clicks
clicked_searches = searches_df[searches_df['had_listing_click'] == True].copy()

bookings_data = []
booking_counter = 1

# Conversion rates by segment — THE HIDDEN PATTERN
conversion_rates = {
    'returning_organic': 0.48,   # High intent, loyal
    'corporate': 0.55,           # Highest intent
    'new_organic': 0.22,         # Decent but new
    'new_campaign': 0.08,        # Low intent — the root cause
}

airlines = ['6E', 'SG', 'AI', 'UK', 'G8', 'I5']
payment_methods = ['UPI', 'debit_card', 'credit_card', 'netbanking', 'wallet']
coupon_codes = ['FLASH40', 'MONSOON30', 'SAVE500', 'FIRST200', 'PMT100', None]

for _, search in clicked_searches.iterrows():
    segment = search['user_segment']
    base_conv = conversion_rates.get(segment, 0.20)
    
    # Price gap penalty
    if search['price_gap_pct'] and search['price_gap_pct'] > 0.08:
        base_conv *= 0.75  # 25% penalty for big price gap
    
    # Only create booking attempt if user "reaches checkout"
    if np.random.random() > base_conv:
        continue
    
    # Booking status
    is_problem = search['is_problem_period']
    
    # Coupon usage — higher during problem period
    coupon_prob = 0.54 if is_problem else 0.31
    use_coupon = np.random.random() < coupon_prob
    coupon = np.random.choice(coupon_codes[:-1]) if use_coupon else None
    
    # Null coupon code tracking gap (8% of coupon users)
    if use_coupon and np.random.random() < 0.08:
        coupon = None
    
    discount = 0
    if use_coupon:
        if is_problem:
            discount = np.random.choice([400, 500, 600, 800, 1000], p=[0.20, 0.25, 0.25, 0.20, 0.10])
        else:
            discount = np.random.choice([200, 300, 400, 500], p=[0.30, 0.35, 0.25, 0.10])
    
    price = search['pmt_cheapest_price'] or 5500
    payment_method = np.random.choice(payment_methods, p=[0.48, 0.22, 0.18, 0.08, 0.04])
    
    # Booking status — new_campaign users have higher abandonment
    if segment == 'new_campaign':
        status = np.random.choice(['confirmed', 'abandoned', 'failed', 'pending'], p=[0.38, 0.48, 0.10, 0.04])
    else:
        status = np.random.choice(['confirmed', 'abandoned', 'failed', 'pending'], p=[0.67, 0.25, 0.05, 0.03])
    
    bkg_ts = datetime.strptime(search['search_ts'], '%Y-%m-%d %H:%M:%S') + timedelta(minutes=np.random.randint(2, 15))
    
    bookings_data.append({
        'booking_id': f'BKG_{booking_counter:06d}',
        'user_id': search['user_id'],
        'session_id': search['session_id'],
        'search_id': search['search_id'],
        'booking_ts': bkg_ts.strftime('%Y-%m-%d %H:%M:%S'),
        'route_id': search['route_id'],
        'airline_code': np.random.choice(airlines, p=[0.35, 0.25, 0.18, 0.12, 0.06, 0.04]),
        'travel_date': search['travel_date'],
        'booking_window_days': search['booking_window_days'],
        'price': price,
        'coupon_code': coupon,
        'discount_amount': discount,
        'booking_status': status,
        'payment_method': payment_method,
        'is_new_user_booking': search['user_segment'] in ['new_campaign', 'new_organic'],
        'user_segment': segment,
        'is_problem_period': is_problem,
    })
    
    # Duplicate booking (1.2%)
    if np.random.random() < 0.012:
        dup = bookings_data[-1].copy()
        bookings_data.append(dup)
    
    booking_counter += 1

bookings_df = pd.DataFrame(bookings_data)
bookings_df.to_csv('case_data/raw/bookings.csv', index=False)
print(f"  ✓ bookings.csv — {len(bookings_df)} rows")

# ══════════════════════════════════════════════════
# TABLE 5: PAYMENTS (3,800 rows)
# ══════════════════════════════════════════════════
print("\n[5/10] Generating payments...")

payments_data = []
payment_counter = 1

# Only bookings that didn't abandon
non_abandoned = bookings_df[bookings_df['booking_status'] != 'abandoned']

for _, bkg in non_abandoned.iterrows():
    bkg_ts = datetime.strptime(bkg['booking_ts'], '%Y-%m-%d %H:%M:%S')
    pay_ts = bkg_ts + timedelta(minutes=np.random.randint(1, 5))
    
    # Payment success rate — small decline in problem period
    success_rate = 0.912 if bkg['is_problem_period'] else 0.921
    
    # Determine success
    if bkg['booking_status'] == 'confirmed':
        status = 'success'
        gateway_code = 'SUCCESS'
        failure_reason = None
    elif bkg['booking_status'] == 'pending':
        status = 'pending'
        gateway_code = 'PENDING'
        failure_reason = None
    else:
        # Failed booking — payment failed
        status = 'failed'
        gateway_code = np.random.choice(['TIMEOUT', 'DECLINED', 'INSUFFICIENT_FUNDS', 'BANK_ERROR'])
        failure_reasons = {
            'TIMEOUT': 'Payment gateway timeout',
            'DECLINED': 'Card declined by bank',
            'INSUFFICIENT_FUNDS': 'Insufficient balance',
            'BANK_ERROR': 'Bank server error'
        }
        failure_reason = failure_reasons[gateway_code]
    
    amount = bkg['price'] - bkg['discount_amount']
    
    payments_data.append({
        'payment_id': f'PAY_{payment_counter:06d}',
        'booking_id': bkg['booking_id'],
        'user_id': bkg['user_id'],
        'payment_ts': pay_ts.strftime('%Y-%m-%d %H:%M:%S'),
        'payment_method': bkg['payment_method'],
        'amount': amount,
        'payment_status': status,
        'gateway_response_code': gateway_code,
        'failure_reason': failure_reason,
        'is_retry': False,
        'is_problem_period': bkg['is_problem_period'],
    })
    
    # Retry for failed payments (18% retry rate, 44% of retries succeed)
    if status == 'failed' and np.random.random() < 0.18:
        retry_success = np.random.random() < 0.44
        payments_data.append({
            'payment_id': f'PAY_{payment_counter:06d}R',
            'booking_id': bkg['booking_id'],
            'user_id': bkg['user_id'],
            'payment_ts': (pay_ts + timedelta(minutes=np.random.randint(1, 10))).strftime('%Y-%m-%d %H:%M:%S'),
            'payment_method': bkg['payment_method'],
            'amount': amount,
            'payment_status': 'success' if retry_success else 'failed',
            'gateway_response_code': 'SUCCESS' if retry_success else gateway_code,
            'failure_reason': None if retry_success else failure_reason,
            'is_retry': True,
            'is_problem_period': bkg['is_problem_period'],
        })
    
    payment_counter += 1

payments_df = pd.DataFrame(payments_data)
payments_df.to_csv('case_data/raw/payments.csv', index=False)
print(f"  ✓ payments.csv — {len(payments_df)} rows")

# ══════════════════════════════════════════════════
# TABLE 6: EXPERIMENTS (4 experiments)
# ══════════════════════════════════════════════════
print("\n[6/10] Generating experiments...")

experiments_data = []
exp_counter = 1

experiment_specs = [
    {
        'id': 'EXP_PAYMENT_UI_V2',
        'name': 'Payment Method Selector Redesign',
        'launch': datetime(2024, 6, 24),
        'platform': 'android_app',
        'app_versions': ['8.4.0', '8.4.1'],
        'treatment_pct': 0.50,
        'effect': 'small_negative',  # -0.8pp checkout-to-payment
    },
    {
        'id': 'EXP_SORT_ALGO_V3',
        'name': 'Flight Ranking Algorithm V3',
        'launch': datetime(2024, 7, 15),
        'platform': 'all',
        'app_versions': None,
        'treatment_pct': 0.38,  # SRM: should be 0.30 — bug!
        'effect': 'unclear',
    },
    {
        'id': 'EXP_PRICE_NUDGE',
        'name': 'Social Proof Price Nudge',
        'launch': datetime(2024, 8, 1),
        'platform': 'all',
        'app_versions': None,
        'treatment_pct': 0.20,
        'effect': 'small_positive',  # +1.2pp listing click
    },
    {
        'id': 'EXP_COUPON_GATE',
        'name': 'Email Verification Before Coupon',
        'launch': datetime(2024, 8, 8),
        'platform': 'all',
        'app_versions': None,
        'treatment_pct': 0.40,
        'effect': 'negative_new_users',  # -4.1pp checkout start for new users
    },
]

for exp in experiment_specs:
    # Eligible users
    eligible_users = users_df.copy()
    
    if exp['app_versions']:
        eligible_users = eligible_users[
            eligible_users['app_version_at_registration'].isin(exp['app_versions'])
        ]
    
    if len(eligible_users) == 0:
        eligible_users = users_df.sample(min(500, len(users_df)))
    
    n_expose = min(len(eligible_users), int(len(eligible_users) * 0.80))
    exposed = eligible_users.sample(n_expose)
    
    for _, user in exposed.iterrows():
        variant = 'treatment' if np.random.random() < exp['treatment_pct'] else 'control'
        
        exp_date = exp['launch'] + timedelta(days=np.random.randint(0, 14))
        
        if exp['app_versions']:
            app_ver = np.random.choice(exp['app_versions'])
        elif user['device_type'] == 'android':
            app_ver = np.random.choice(['8.4.0', '8.4.1', '8.4.2'])
        elif user['device_type'] == 'ios':
            app_ver = '9.1.1'
        else:
            app_ver = None
        
        experiments_data.append({
            'exposure_id': f'EXP_{exp_counter:07d}',
            'experiment_id': exp['id'],
            'experiment_name': exp['name'],
            'user_id': user['user_id'],
            'variant': variant,
            'exposure_ts': exp_date.strftime('%Y-%m-%d %H:%M:%S'),
            'platform': user['device_type'] + '_app' if user['device_type'] != 'web' else 'mobile_web',
            'app_version': app_ver,
            'expected_effect': exp['effect'],
        })
        exp_counter += 1

experiments_df = pd.DataFrame(experiments_data)
experiments_df.to_csv('case_data/raw/experiments.csv', index=False)
print(f"  ✓ experiments.csv — {len(experiments_df)} rows")

# ══════════════════════════════════════════════════
# TABLE 7: COMPETITOR PRICE SNAPSHOTS
# ══════════════════════════════════════════════════
print("\n[7/10] Generating competitor prices...")

competitor_data = []
snap_counter = 1

routes_to_track = metro_metro_routes + leisure_routes[:2]
date_range = [START + timedelta(days=i) for i in range((END - START).days + 1)]

for route in routes_to_track:
    for snap_date in date_range[::3]:  # Every 3 days
        for time_bucket in ['morning', 'evening']:
            travel_date = snap_date + timedelta(days=np.random.randint(7, 45))
            
            pmt_price = np.random.randint(3800, 9500)
            
            # TripEase cheaper on 3 routes during problem period
            is_problem = snap_date >= PROBLEM_START
            if route in tripease_cheaper_routes and is_problem:
                gap_pct = np.random.uniform(0.08, 0.16)
                te_price = int(pmt_price / (1 + gap_pct))
            else:
                gap_pct = np.random.uniform(-0.05, 0.06)
                te_price = int(pmt_price / (1 + gap_pct))
            
            competitor_data.append({
                'snapshot_id': f'SNAP_{snap_counter:06d}',
                'snapshot_date': snap_date.strftime('%Y-%m-%d'),
                'time_bucket': time_bucket,
                'route_id': f'ROUTE_{route}',
                'travel_date': travel_date.strftime('%Y-%m-%d'),
                'pmt_cheapest_price': pmt_price,
                'tripease_cheapest_price': te_price,
                'price_gap_pct': round(gap_pct, 3),
                'pmt_is_cheaper': pmt_price <= te_price,
                'is_problem_period': is_problem,
            })
            snap_counter += 1

competitor_df = pd.DataFrame(competitor_data)
competitor_df.to_csv('case_data/raw/competitor_price_snapshots.csv', index=False)
print(f"  ✓ competitor_price_snapshots.csv — {len(competitor_df)} rows")

# ══════════════════════════════════════════════════
# TABLE 8: SUPPORT TICKETS
# ══════════════════════════════════════════════════
print("\n[8/10] Generating support tickets...")

tickets_data = []
ticket_counter = 1

confirmed_bookings = bookings_df[bookings_df['booking_status'] == 'confirmed']

for _, bkg in confirmed_bookings.iterrows():
    contact_rate = 0.084 if bkg['is_problem_period'] else 0.061
    
    if np.random.random() > contact_rate:
        continue
    
    is_problem = bkg['is_problem_period']
    
    # Tag distribution — payment_failure higher in problem period
    if is_problem:
        primary_tag = np.random.choice(
            ['payment_failure', 'refund_status', 'cancellation', 'booking_not_confirmed', 'other'],
            p=[0.29, 0.22, 0.18, 0.16, 0.15]
        )
    else:
        primary_tag = np.random.choice(
            ['cancellation', 'itinerary_change', 'refund_status', 'payment_failure', 'other'],
            p=[0.28, 0.22, 0.18, 0.16, 0.16]
        )
    
    # Noisy secondary tags
    secondary_tags = {
        'payment_failure': ['money_deducted_booking_not_confirmed', 'payment_declined', 'upi_failure', 'timeout_error', 'bank_error'],
        'refund_status': ['refund_pending', 'refund_not_received', 'partial_refund', 'refund_timeline'],
        'cancellation': ['cancellation_fee_dispute', 'cancellation_not_processed', 'free_cancellation_claim'],
        'booking_not_confirmed': ['pnr_not_received', 'ticket_not_generated', 'booking_pending'],
        'other': ['seat_selection', 'meal_preference', 'baggage_query', 'name_correction']
    }
    
    secondary_tag = np.random.choice(secondary_tags.get(primary_tag, ['other']))
    
    bkg_ts = datetime.strptime(bkg['booking_ts'], '%Y-%m-%d %H:%M:%S')
    created_ts = bkg_ts + timedelta(hours=np.random.randint(1, 48))
    
    tickets_data.append({
        'ticket_id': f'TKT_{ticket_counter:06d}',
        'user_id': bkg['user_id'],
        'booking_id': bkg['booking_id'],
        'created_ts': created_ts.strftime('%Y-%m-%d %H:%M:%S'),
        'channel': np.random.choice(['chat', 'email', 'phone', 'app'], p=[0.45, 0.28, 0.18, 0.09]),
        'primary_tag': primary_tag,
        'secondary_tag': secondary_tag,
        'csat_score': np.random.choice([1, 2, 3, 4, 5, None], p=[0.12, 0.18, 0.25, 0.22, 0.15, 0.08]),
        'resolution_time_hours': round(np.random.exponential(18), 1),
        'is_problem_period': is_problem,
    })
    ticket_counter += 1

tickets_df = pd.DataFrame(tickets_data)
tickets_df.to_csv('case_data/raw/support_tickets.csv', index=False)
print(f"  ✓ support_tickets.csv — {len(tickets_df)} rows")

# ══════════════════════════════════════════════════
# TABLE 9: MARKETING SPEND
# ══════════════════════════════════════════════════
print("\n[9/10] Generating marketing spend...")

spend_data = []
channels_def = {
    'organic_search': {'type': 'organic', 'base_spend': 0},
    'returning_direct': {'type': 'organic', 'base_spend': 0},
    'paid_search': {'type': 'paid_search', 'base_spend': 18000000},
    'paid_social': {'type': 'paid_social', 'base_spend': 8000000},
    'email_push': {'type': 'owned', 'base_spend': 500000},
    'referral': {'type': 'referral', 'base_spend': 2000000},
    'app_install_uac': {'type': 'app_install', 'base_spend': 0},
}

week_starts = []
d = START
while d <= END:
    if d.weekday() == 0:
        week_starts.append(d)
    d += timedelta(days=1)

for week_start in week_starts:
    is_problem = week_start >= PROBLEM_START
    is_campaign = week_start >= CAMPAIGN_LAUNCH
    
    for channel, props in channels_def.items():
        if props['base_spend'] == 0 and channel not in ['organic_search', 'returning_direct']:
            base = 0
        else:
            base = props['base_spend']
        
        # Problem period: paid_social and app_install campaigns ramped up significantly
        if is_campaign and channel == 'paid_social':
            spend = int(base * 3.5 + np.random.normal(0, 500000))
        elif is_campaign and channel == 'app_install_uac':
            spend = int(25000000 + np.random.normal(0, 2000000))
        elif is_problem and channel == 'paid_search':
            spend = int(base * 1.2 + np.random.normal(0, 1000000))
        elif base == 0:
            spend = 0
        else:
            spend = int(base + np.random.normal(0, base * 0.1))
        
        spend = max(0, spend)
        
        # Derive attributed sessions and bookings based on conversion rates
        if channel in ['organic_search', 'returning_direct']:
            sessions_attr = 0
            bookings_attr = 0
            cpl = None
        else:
            sessions_per_rupee = np.random.uniform(0.002, 0.008)
            sessions_attr = int(spend * sessions_per_rupee) if spend > 0 else 0
            
            if channel == 'paid_social' or channel == 'app_install_uac':
                booking_conv = 0.014 if is_campaign else 0.018
            elif channel == 'paid_search':
                booking_conv = 0.031
            else:
                booking_conv = 0.025
            
            bookings_attr = int(sessions_attr * booking_conv)
            cpl = round(spend / bookings_attr, 0) if bookings_attr > 0 else None
        
        spend_data.append({
            'week_start_date': week_start.strftime('%Y-%m-%d'),
            'channel_id': channel,
            'channel_type': props['type'],
            'spend_inr': spend,
            'sessions_attributed': sessions_attr,
            'bookings_attributed': bookings_attr,
            'cost_per_booking_inr': cpl,
            'is_problem_period': is_problem,
        })

spend_df = pd.DataFrame(spend_data)
spend_df.to_csv('case_data/raw/marketing_spend.csv', index=False)
print(f"  ✓ marketing_spend.csv — {len(spend_df)} rows")

# ══════════════════════════════════════════════════
# TABLE 10: COHORT SUMMARY (pre-aggregated)
# ══════════════════════════════════════════════════
print("\n[10/10] Generating cohort summary...")

cohort_data = []

months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08']
cohort_channels = ['organic', 'paid_search', 'paid_social', 'email_push']

for month in months:
    for channel in cohort_channels:
        is_problem_cohort = month in ['2024-07', '2024-08']
        
        # Base cohort size
        if is_problem_cohort and channel == 'paid_social':
            cohort_size = np.random.randint(18000, 25000)
        elif is_problem_cohort:
            cohort_size = np.random.randint(8000, 14000)
        elif channel == 'paid_social':
            cohort_size = np.random.randint(3000, 6000)
        else:
            cohort_size = np.random.randint(6000, 15000)
        
        # Month-0 booking rate
        if channel == 'paid_social' and is_problem_cohort:
            month0_rate = round(np.random.uniform(0.09, 0.13), 3)  # LOW — key signal
        elif channel == 'paid_social':
            month0_rate = round(np.random.uniform(0.15, 0.20), 3)
        elif channel == 'organic':
            month0_rate = round(np.random.uniform(0.24, 0.30), 3)
        else:
            month0_rate = round(np.random.uniform(0.18, 0.26), 3)
        
        # Month-1 retention
        if channel == 'paid_social' and is_problem_cohort:
            month1_retention = round(np.random.uniform(0.06, 0.10), 3)  # VERY LOW
        elif channel == 'paid_social':
            month1_retention = round(np.random.uniform(0.10, 0.15), 3)
        elif channel == 'organic':
            month1_retention = round(np.random.uniform(0.19, 0.25), 3)
        else:
            month1_retention = round(np.random.uniform(0.13, 0.20), 3)
        
        # Net revenue per user
        if channel == 'paid_social' and is_problem_cohort:
            net_rev_per_user = round(np.random.uniform(75, 120), 0)  # VERY LOW
        elif channel == 'paid_social':
            net_rev_per_user = round(np.random.uniform(140, 180), 0)
        elif channel == 'organic':
            net_rev_per_user = round(np.random.uniform(260, 310), 0)
        else:
            net_rev_per_user = round(np.random.uniform(180, 250), 0)
        
        cohort_data.append({
            'acquisition_month': month,
            'channel': channel,
            'cohort_size': cohort_size,
            'month0_booking_rate': month0_rate,
            'month1_retention_rate': month1_retention,
            'avg_net_revenue_per_user_inr': net_rev_per_user,
            'avg_discount_per_booking_inr': round(np.random.uniform(300, 700) if channel == 'paid_social' else np.random.uniform(200, 450), 0),
            'is_problem_cohort': is_problem_cohort,
        })

cohort_df = pd.DataFrame(cohort_data)
cohort_df.to_csv('case_data/raw/cohort_summary.csv', index=False)
print(f"  ✓ cohort_summary.csv — {len(cohort_df)} rows")

# ══════════════════════════════════════════════════
# AGGREGATE TABLE 1: funnel_by_week_channel
# The KEY table that reveals the root cause
# ══════════════════════════════════════════════════
print("\n[AGG 1] Computing funnel_by_week_channel...")

# Join sessions → searches → bookings
session_search = sessions_df.merge(
    searches_df.drop_duplicates('search_id'),
    on='session_id', how='left', suffixes=('', '_search')
)

session_search_booking = session_search.merge(
    bookings_df[bookings_df['booking_status'] == 'confirmed'][['search_id', 'booking_id', 'discount_amount', 'price']].drop_duplicates('search_id'),
    on='search_id', how='left'
)

session_search_booking['week'] = pd.to_datetime(
    session_search_booking['session_start_ts']
).dt.to_period('W').astype(str)

session_search_booking['channel'] = session_search_booking['channel_attribution'].fillna('unknown')

agg_funnel = session_search_booking.groupby(['week', 'channel']).agg(
    sessions=('session_id', 'nunique'),
    searches=('search_id', lambda x: x.dropna().nunique()),
    listing_clicks=('had_listing_click', lambda x: x.fillna(False).sum()),
    confirmed_bookings=('booking_id', lambda x: x.dropna().nunique()),
    total_discount=('discount_amount', 'sum'),
    total_revenue=('price', 'sum'),
).reset_index()

agg_funnel['search_rate'] = (agg_funnel['searches'] / agg_funnel['sessions']).round(3)
agg_funnel['listing_click_rate'] = (agg_funnel['listing_clicks'] / agg_funnel['searches'].replace(0, np.nan)).round(3)
agg_funnel['overall_conversion'] = (agg_funnel['confirmed_bookings'] / agg_funnel['sessions']).round(4)
agg_funnel['avg_discount_per_booking'] = (agg_funnel['total_discount'] / agg_funnel['confirmed_bookings'].replace(0, np.nan)).round(0)

agg_funnel.to_csv('case_data/aggregates/funnel_by_week_channel.csv', index=False)
print(f"  ✓ funnel_by_week_channel.csv — {len(agg_funnel)} rows")

# ══════════════════════════════════════════════════
# AGGREGATE TABLE 2: funnel_by_user_segment
# ══════════════════════════════════════════════════
print("\n[AGG 2] Computing funnel_by_user_segment...")

agg_segment = session_search_booking.groupby(['week', 'user_segment']).agg(
    sessions=('session_id', 'nunique'),
    searches=('search_id', lambda x: x.dropna().nunique()),
    listing_clicks=('had_listing_click', lambda x: x.fillna(False).sum()),
    confirmed_bookings=('booking_id', lambda x: x.dropna().nunique()),
).reset_index()

agg_segment.columns = ['week', 'user_segment', 'sessions', 'searches', 'listing_clicks', 'confirmed_bookings']
agg_segment['listing_click_rate'] = (agg_segment['listing_clicks'] / agg_segment['searches'].replace(0, np.nan)).round(3)
agg_segment['overall_conversion'] = (agg_segment['confirmed_bookings'] / agg_segment['sessions']).round(4)
agg_segment['session_share'] = (agg_segment['sessions'] / agg_segment.groupby('week')['sessions'].transform('sum')).round(3)

agg_segment.to_csv('case_data/aggregates/funnel_by_user_segment.csv', index=False)
print(f"  ✓ funnel_by_user_segment.csv — {len(agg_segment)} rows")

# ══════════════════════════════════════════════════
# AGGREGATE TABLE 3: daily_kpi_summary
# ══════════════════════════════════════════════════
print("\n[AGG 3] Computing daily_kpi_summary...")

session_search_booking['date'] = pd.to_datetime(session_search_booking['session_start_ts']).dt.date

daily_kpi = session_search_booking.groupby('date').agg(
    total_sessions=('session_id', 'nunique'),
    search_sessions=('search_id', lambda x: x.dropna().nunique()),
    listing_clicks=('had_listing_click', lambda x: x.fillna(False).sum()),
    confirmed_bookings=('booking_id', lambda x: x.dropna().nunique()),
    total_revenue=('price', 'sum'),
    total_discount=('discount_amount', 'sum'),
).reset_index()

daily_kpi['search_to_booking_conversion'] = (daily_kpi['confirmed_bookings'] / daily_kpi['total_sessions']).round(4)
daily_kpi['listing_click_rate'] = (daily_kpi['listing_clicks'] / daily_kpi['search_sessions'].replace(0, np.nan)).round(3)
daily_kpi['gbv'] = daily_kpi['total_revenue']
daily_kpi['net_revenue'] = (daily_kpi['total_revenue'] * 0.055 - daily_kpi['total_discount']).round(0)
daily_kpi['avg_booking_value'] = (daily_kpi['total_revenue'] / daily_kpi['confirmed_bookings'].replace(0, np.nan)).round(0)
daily_kpi['net_revenue_per_booking'] = (daily_kpi['net_revenue'] / daily_kpi['confirmed_bookings'].replace(0, np.nan)).round(0)
daily_kpi['is_problem_period'] = pd.to_datetime(daily_kpi['date']) >= PROBLEM_START

daily_kpi.to_csv('case_data/aggregates/daily_kpi_summary.csv', index=False)
print(f"  ✓ daily_kpi_summary.csv — {len(daily_kpi)} rows")

# ══════════════════════════════════════════════════
# AGGREGATE TABLE 4: competitor_price_summary
# ══════════════════════════════════════════════════
print("\n[AGG 4] Computing competitor price summary...")

comp_agg = competitor_df.groupby(['route_id', 'is_problem_period']).agg(
    avg_pmt_price=('pmt_cheapest_price', 'mean'),
    avg_te_price=('tripease_cheapest_price', 'mean'),
    avg_price_gap_pct=('price_gap_pct', 'mean'),
    pct_pmt_cheaper=('pmt_is_cheaper', 'mean'),
    n_snapshots=('snapshot_id', 'count'),
).reset_index()

comp_agg['avg_pmt_price'] = comp_agg['avg_pmt_price'].round(0)
comp_agg['avg_te_price'] = comp_agg['avg_te_price'].round(0)
comp_agg['avg_price_gap_pct'] = comp_agg['avg_price_gap_pct'].round(3)
comp_agg['pct_pmt_cheaper'] = comp_agg['pct_pmt_cheaper'].round(3)

comp_agg.to_csv('case_data/aggregates/competitor_price_summary.csv', index=False)
print(f"  ✓ competitor_price_summary.csv — {len(comp_agg)} rows")

# ══════════════════════════════════════════════════
# AGGREGATE TABLE 5: experiment_readout
# ══════════════════════════════════════════════════
print("\n[AGG 5] Computing experiment readout...")

exp_readout = experiments_df.groupby(['experiment_id', 'experiment_name', 'variant', 'expected_effect']).agg(
    exposed_users=('user_id', 'nunique'),
).reset_index()

# Add simulated conversion metrics based on expected effects
def add_exp_metrics(row):
    base_conv = 0.038
    if row['expected_effect'] == 'small_negative' and row['variant'] == 'treatment':
        conv = base_conv * 0.979
        checkout_rate = 0.720
    elif row['expected_effect'] == 'small_positive' and row['variant'] == 'treatment':
        conv = base_conv * 1.032
        checkout_rate = 0.740
    elif row['expected_effect'] == 'negative_new_users' and row['variant'] == 'treatment':
        conv = base_conv * 0.891
        checkout_rate = 0.680
    else:
        conv = base_conv
        checkout_rate = 0.735
    return pd.Series({'simulated_conversion': round(conv, 4), 'simulated_checkout_rate': round(checkout_rate, 3)})

exp_readout[['simulated_conversion', 'simulated_checkout_rate']] = exp_readout.apply(add_exp_metrics, axis=1)
exp_readout['note'] = exp_readout['experiment_id'].map({
    'EXP_SORT_ALGO_V3': 'WARNING: Sample ratio mismatch — 38% exposure vs 30% expected. Results unreliable.',
    'EXP_PAYMENT_UI_V2': 'Small real effect on Android checkout-to-payment. Effect size too small to explain aggregate.',
    'EXP_PRICE_NUDGE': 'Positive effect on listing click rate. Keep live.',
    'EXP_COUPON_GATE': 'Significant negative effect on new user checkout. Roll back for new users.',
})

exp_readout.to_csv('case_data/aggregates/experiment_readout.csv', index=False)
print(f"  ✓ experiment_readout.csv — {len(exp_readout)} rows")

# ══════════════════════════════════════════════════
# METADATA: initial_dashboard.json
# ══════════════════════════════════════════════════
print("\nGenerating metadata files...")

# Compute actual baseline vs problem period metrics
pre_mask = ~session_search_booking['is_problem_period']
prob_mask = session_search_booking['is_problem_period']

def safe_div(a, b):
    return round(a / b, 4) if b > 0 else 0

pre_sessions = session_search_booking.loc[pre_mask, 'session_id'].nunique()
prob_sessions = session_search_booking.loc[prob_mask, 'session_id'].nunique()
pre_bookings = session_search_booking.loc[pre_mask, 'booking_id'].dropna().nunique()
prob_bookings = session_search_booking.loc[prob_mask, 'booking_id'].dropna().nunique()

dashboard = {
    "period_note": "Baseline = Apr-Jun 2024. Problem period = Jul 1 - Aug 25, 2024",
    "metrics": [
        {
            "name": "Search-to-Booking Conversion",
            "definition": "Confirmed paid bookings / Sessions with at least one flight search",
            "baseline": safe_div(pre_bookings, pre_sessions),
            "current": safe_div(prob_bookings, prob_sessions),
            "change_pct": round((safe_div(prob_bookings, prob_sessions) / safe_div(pre_bookings, pre_sessions) - 1) * 100, 1),
            "reliability": "reliable",
            "is_primary_metric": True
        },
        {
            "name": "Weekly Sessions",
            "definition": "Total app/web sessions",
            "baseline": round(pre_sessions / BASELINE_WEEKS),
            "current": round(prob_sessions / PROBLEM_WEEKS),
            "change_pct": round((prob_sessions/PROBLEM_WEEKS) / (pre_sessions/BASELINE_WEEKS) * 100 - 100, 1),
            "reliability": "reliable",
            "is_primary_metric": False
        },
        {
            "name": "App Installs (weekly)",
            "definition": "New app installs",
            "baseline": 590000,
            "current": 840000,
            "change_pct": 42.4,
            "reliability": "misleading",
            "misleading_reason": "Installs are a vanity metric. High install rate from low-intent users inflates this. Cost per first paid booking tells the real story.",
            "is_primary_metric": False
        },
        {
            "name": "Payment Success Rate",
            "definition": "Successful payments / Payment attempts",
            "baseline": 0.921,
            "current": 0.912,
            "change_pct": -1.0,
            "reliability": "misleading",
            "misleading_reason": "Denominator (payment attempts) grew as discounts drove more checkout completions. Absolute failures barely changed. Not the primary driver.",
            "is_primary_metric": False
        },
        {
            "name": "Marketing Spend (weekly)",
            "definition": "Total paid media spend",
            "baseline": 78000000,
            "current": 112000000,
            "change_pct": 43.6,
            "reliability": "reliable",
            "is_primary_metric": False
        },
        {
            "name": "Cost Per Install",
            "definition": "Marketing spend / App installs",
            "baseline": 132,
            "current": 133,
            "change_pct": 0.8,
            "reliability": "misleading",
            "misleading_reason": "Stable CPI appears efficient. But CPI does not measure booking intent. Cost per first paid booking rose from ₹892 to ₹1,840.",
            "is_primary_metric": False
        },
        {
            "name": "Listing Click Rate",
            "definition": "Sessions with ≥1 listing click / Search sessions",
            "baseline": 0.68,
            "current": 0.61,
            "change_pct": -10.3,
            "reliability": "reliable",
            "is_primary_metric": False,
            "investigation_note": "This is the largest funnel stage drop. Start here."
        },
        {
            "name": "Support Contact Rate",
            "definition": "Support tickets / Confirmed bookings",
            "baseline": 0.061,
            "current": 0.084,
            "change_pct": 37.7,
            "reliability": "incomplete",
            "misleading_reason": "Absolute tickets up. But rate per booking also rose — payment_failure tickets specifically increased 3x per booking. Real signal but not primary conversion driver.",
            "is_primary_metric": False
        }
    ]
}

with open('case_data/metadata/initial_dashboard.json', 'w') as f:
    json.dump(dashboard, f, indent=2)

# ══════════════════════════════════════════════════
# METADATA: stakeholder_quotes.json
# ══════════════════════════════════════════════════
stakeholders = {
    "stakeholders": [
        {
            "name": "Rohan Kapoor",
            "title": "CEO",
            "quote": "We've clearly lost share to TripEase on price. Customers are switching. I want to match their cashback or we accept the volume loss. Either way I need a decision this week.",
            "metric_they_watch": "Weekly paid bookings and estimated market share",
            "what_they_want": "Approve ₹25 crore additional discount budget",
            "blind_spot": "Does not distinguish volume from quality. Has not looked at net revenue per booking or cohort repeat rate."
        },
        {
            "name": "Priya Nair",
            "title": "VP Product",
            "quote": "I've been saying this since July — the payment UI experiment we launched in June is the problem. Checkout-to-payment conversion dropped right when we launched it. We need to roll it back immediately.",
            "metric_they_watch": "Checkout-to-payment conversion and payment success rate",
            "what_they_want": "Immediate rollback of EXP_PAYMENT_UI_V2",
            "blind_spot": "Experiment affected only 12% of users. iOS conversion is also down — proving it's not just the experiment. Effect size too small to explain aggregate."
        },
        {
            "name": "Siddharth Rao",
            "title": "VP Growth & Marketing",
            "quote": "The organic traffic quality is fine — I can show you that. It's the paid acquisition channels. TripEase is flooding the market with cashback and we're attracting their spillover traffic — low-intent users who just compare prices. This is a traffic quality problem.",
            "metric_they_watch": "Channel-level cost per booking and booking-to-60-day-repeat rate by channel",
            "what_they_want": "Shift spend from performance marketing to brand building",
            "blind_spot": "Partially right about traffic quality — but has not acknowledged that his own campaigns created the low-quality traffic problem."
        },
        {
            "name": "Anjali Mehta",
            "title": "Head of Analytics",
            "quote": "There was a step-change in conversion in the week of July 12. That's not a gradual seasonal drift. I need 48 hours to isolate whether it's a tracking issue, an experiment gone wrong, or a real business change. Please don't make decisions before I have the analysis.",
            "metric_they_watch": "Day-level funnel conversion with experiment exposure controls",
            "what_they_want": "48 hours to run proper root cause analysis before any decision",
            "blind_spot": "Closest to the truth. Needs to move faster — leadership is already making decisions."
        },
        {
            "name": "Vikram Shah",
            "title": "CFO",
            "quote": "I don't care about bookings. I care about contribution margin. We're spending ₹610 per booking in discounts to sustain volumes that used to be self-sustaining at ₹380. If this continues 6 more weeks, we miss Q2 by ₹180 crore. Cap the discount budget and find the real cause.",
            "metric_they_watch": "Contribution margin per booking and cumulative discount burn",
            "what_they_want": "Hard cap on discount budget; mandate root cause analysis before further spend",
            "blind_spot": "Financially correct diagnosis. Does not have a view on which operational lever to pull."
        },
        {
            "name": "Deepa Krishnan",
            "title": "Head of Customer Support",
            "quote": "Payment failure contacts are up 38%. Customers are calling us saying money was deducted but booking not confirmed. This is a trust problem. Engineering needs to treat this as P1.",
            "metric_they_watch": "Contact rate per booking and CSAT on payment failure contacts",
            "what_they_want": "Escalate payment failure as P1 to engineering",
            "blind_spot": "Absolute contact volume up — but driven partly by more bookings attempting payment. Rate per booking also rose, but payment failure is not the primary conversion driver."
        }
    ]
}

with open('case_data/metadata/stakeholder_quotes.json', 'w') as f:
    json.dump(stakeholders, f, indent=2)

# ══════════════════════════════════════════════════
# METADATA: root_cause_key.json (instructor only)
# ══════════════════════════════════════════════════
root_cause = {
    "access_level": "instructor_only",
    "primary_root_cause": {
        "name": "Traffic mix shift — low-intent app install campaign users",
        "description": "Paid social/UAC session share grew from 8% to 19% of total sessions after July 12 campaign launch. These users convert at 1.4% vs 4.8% for organic returning users. Within every segment, conversion is stable. The aggregate drops because the mix changed.",
        "evidence_tables": ["funnel_by_week_channel", "funnel_by_user_segment", "marketing_spend"],
        "contribution_to_drop": "~73% of the 1.3pp aggregate conversion decline"
    },
    "secondary_causes": [
        {
            "name": "TripEase price advantage on DEL-BOM, BOM-BLR, DEL-BLR routes",
            "description": "TripEase is 8-16% cheaper on these 3 routes during problem period. Causes genuine switching.",
            "evidence_tables": ["competitor_price_snapshots", "competitor_price_summary"],
            "contribution_to_drop": "~17%"
        },
        {
            "name": "Android payment UI experiment (EXP_PAYMENT_UI_V2)",
            "description": "Real but small -0.8pp effect on checkout-to-payment for Android 8.4.x users.",
            "evidence_tables": ["experiments", "experiment_readout"],
            "contribution_to_drop": "~8%"
        },
        {
            "name": "Coupon gate experiment (EXP_COUPON_GATE)",
            "description": "-4.1pp checkout start rate for new users in treatment group. Roll back immediately.",
            "evidence_tables": ["experiments", "experiment_readout"],
            "contribution_to_drop": "~5%"
        }
    ],
    "false_leads": [
        {
            "name": "Payment success rate decline",
            "why_misleading": "Denominator (payment attempts) increased. Rate barely moved. Not primary cause."
        },
        {
            "name": "Support ticket volume increase",
            "why_misleading": "Absolute volume up. But rate per booking also increased — real signal for payment UX. Not primary conversion driver."
        },
        {
            "name": "App installs at all-time high",
            "why_misleading": "Vanity metric. These installs came from low-intent users who don't convert."
        },
        {
            "name": "EXP_SORT_ALGO_V3",
            "why_misleading": "Sample ratio mismatch (38% vs 30%) makes results statistically invalid. Do not use for causal attribution."
        },
        {
            "name": "Discounting partially recovered bookings",
            "why_misleading": "Volume metric improved. Net revenue per booking collapsed from ₹342 to ₹248. CFO is right."
        }
    ],
    "how_to_find_it": [
        "Step 1: Look at daily_kpi_summary — conversion drops sharply week of July 12 (campaign launch date)",
        "Step 2: Open funnel_by_week_channel — compare organic vs paid_social conversion rates",
        "Step 3: Observe paid_social converts at 1.4% vs organic at 4.7-4.8% — and session share went from 8% to 19%",
        "Step 4: Compute mix shift contribution: 11pp share shift × 3.4pp conversion gap = ~0.37pp direct drag",
        "Step 5: Check funnel_by_user_segment — new_campaign users consistently low conversion both periods (rules out product change)",
        "Step 6: Check iOS conversion — also stable (rules out Android experiment as primary)"
    ]
}

with open('case_data/metadata/root_cause_key.json', 'w') as f:
    json.dump(root_cause, f, indent=2)

# ══════════════════════════════════════════════════
# METADATA: metric_dictionary.json
# ══════════════════════════════════════════════════
metrics = {
    "search_to_booking_conversion": {
        "definition": "Confirmed paid bookings divided by sessions with at least one flight search",
        "formula": "confirmed_bookings / search_sessions",
        "tables": ["sessions", "search_events", "bookings"],
        "common_mistake": "Using total booking attempts (including abandoned) in numerator. Always filter booking_status = confirmed.",
        "phase_visible": "phase1"
    },
    "listing_click_rate": {
        "definition": "Sessions where user clicked at least one flight listing / Total search sessions",
        "formula": "sessions_with_listing_click / search_sessions",
        "tables": ["search_events"],
        "investigation_note": "This is the first major funnel stage drop. Investigate by channel and user segment.",
        "phase_visible": "phase1"
    },
    "cost_per_booking": {
        "definition": "Total marketing spend for a channel / Paid bookings attributed to that channel",
        "formula": "channel_spend / attributed_confirmed_bookings",
        "tables": ["marketing_spend"],
        "common_mistake": "Confusing with cost per install. CPI does not measure booking intent.",
        "phase_visible": "phase2"
    },
    "net_revenue_per_booking": {
        "definition": "(Booking price × take rate) - discount applied",
        "formula": "(price × 0.055) - discount_amount",
        "tables": ["bookings"],
        "why_it_matters": "More meaningful than GBV when discounts vary. CFO's preferred metric.",
        "phase_visible": "phase1"
    },
    "session_mix": {
        "definition": "Share of total sessions attributed to each acquisition channel",
        "formula": "channel_sessions / total_sessions",
        "tables": ["sessions", "acquisition_channels"],
        "investigation_note": "Key diagnostic metric. If mix shifts toward low-converting channels, aggregate conversion drops even if within-channel performance is stable.",
        "phase_visible": "phase2"
    },
    "cohort_month1_retention": {
        "definition": "% of users who acquired in a given month and made another booking in the following month",
        "formula": "users_with_booking_in_month1 / cohort_size",
        "tables": ["cohort_summary"],
        "why_it_matters": "Distinguishes quality of acquisition. Low retention = low-quality cohort.",
        "phase_visible": "phase2"
    }
}

with open('case_data/metadata/metric_dictionary.json', 'w') as f:
    json.dump(metrics, f, indent=2)

# ══════════════════════════════════════════════════
# SUMMARY REPORT
# ══════════════════════════════════════════════════
print("\n" + "=" * 50)
print("DATA GENERATION COMPLETE")
print("=" * 50)

total_rows = (
    len(users_df) + len(sessions_df) + len(searches_df) +
    len(bookings_df) + len(payments_df) + len(experiments_df) +
    len(competitor_df) + len(tickets_df) + len(spend_df) + len(cohort_df)
)

print(f"\nTotal raw data rows: {total_rows:,}")
print(f"\nFiles created in case_data/:")
print(f"  raw/           — {len(os.listdir('case_data/raw'))} CSV files")
print(f"  aggregates/    — {len(os.listdir('case_data/aggregates'))} CSV files")
print(f"  metadata/      — {len(os.listdir('case_data/metadata'))} JSON files")

print(f"\nKey validation checks:")
pre_conv = safe_div(
    session_search_booking.loc[pre_mask, 'booking_id'].dropna().nunique(),
    session_search_booking.loc[pre_mask, 'session_id'].nunique()
)
prob_conv = safe_div(
    session_search_booking.loc[prob_mask, 'booking_id'].dropna().nunique(),
    session_search_booking.loc[prob_mask, 'session_id'].nunique()
)
print(f"  Baseline conversion:        {pre_conv:.1%}")
print(f"  Problem period conversion:  {prob_conv:.1%}")
print(f"  Conversion change:          {(prob_conv/pre_conv - 1)*100:.1f}%")

# Check channel mix shift
pre_paid_social = session_search_booking.loc[
    pre_mask & (session_search_booking['channel_attribution'] == 'paid_social'), 'session_id'
].nunique()
pre_total = session_search_booking.loc[pre_mask, 'session_id'].nunique()
prob_paid_social = session_search_booking.loc[
    prob_mask & (session_search_booking['channel_attribution'] == 'paid_social'), 'session_id'
].nunique()
prob_total = session_search_booking.loc[prob_mask, 'session_id'].nunique()

print(f"\n  Paid social session share (baseline):       {safe_div(pre_paid_social, pre_total):.1%}")
print(f"  Paid social session share (problem period): {safe_div(prob_paid_social, prob_total):.1%}")
print(f"\n  Root cause pattern: {'VISIBLE ✓' if safe_div(prob_paid_social, prob_total) > 0.15 else 'CHECK GENERATION'}")

print("\nNext steps:")
print("  1. Inspect case_data/aggregates/funnel_by_week_channel.csv")
print("     - paid_social should show ~1.4% conversion vs organic ~4.8%")
print("  2. Inspect case_data/aggregates/cohort_summary.csv")
print("     - Jul-Aug paid_social cohort should show ~₹90-120 net rev per user")
print("  3. Share case_data/ folder contents to embed in /cohort page")
