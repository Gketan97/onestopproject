"""
MMT Revenue Leak — Synthetic Dataset Generator
Generates 10 relational tables, ~81k rows total.
Anomaly: Dynamic pricing bug deployed at week 16.
Bug causes checkout price to be 22-35% higher than search price.
"""

import pandas as pd
import numpy as np
from faker import Faker
import os
import random
from datetime import datetime, timedelta

fake = Faker('en_IN')
np.random.seed(42)
random.seed(42)

# ─────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────

ANOMALY_WEEK = 16
TOTAL_WEEKS = 26
START_DATE = datetime(2024, 1, 1)

N_USERS = 4000
N_SUPPLIERS = 120
N_SESSIONS = 12000
N_SEARCH_EVENTS = 18000
N_HOTEL_VIEWS = 15000
N_BOOKING_ATTEMPTS = 6000
N_BOOKINGS = 4000
N_PAYMENTS = 4000
N_PRICE_LOGS = 10000
N_INVENTORY_LOGS = 8000

CITIES = [
    'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa',
    'Dubai', 'Singapore', 'Bangkok', 'London', 'New York'
]
DOMESTIC_CITIES = CITIES[:10]
INTERNATIONAL_CITIES = CITIES[10:]

OUTPUT_DIR = 'public/cases/makemytrip_revenue_leak/dataset'
os.makedirs(OUTPUT_DIR, exist_ok=True)

def week_to_date(week: int) -> datetime:
    return START_DATE + timedelta(weeks=week - 1)

def random_week() -> int:
    # Traffic increases over time (12% growth)
    weights = [1 + 0.012 * w for w in range(1, TOTAL_WEEKS + 1)]
    return random.choices(range(1, TOTAL_WEEKS + 1), weights=weights)[0]

# ─────────────────────────────────────────────────────────────
# 1. USERS
# ─────────────────────────────────────────────────────────────

print("Generating users...")
user_ids = [f"USR{str(i).zfill(6)}" for i in range(1, N_USERS + 1)]

users = pd.DataFrame({
    'user_id': user_ids,
    'signup_date': [
        (START_DATE - timedelta(days=random.randint(0, 730))).strftime('%Y-%m-%d')
        for _ in range(N_USERS)
    ],
    'city': random.choices(CITIES, k=N_USERS),
    'device_type': random.choices(
        ['mobile', 'desktop', 'tablet'],
        weights=[0.65, 0.28, 0.07],
        k=N_USERS
    ),
    'user_segment': random.choices(
        ['new', 'returning', 'vip'],
        weights=[0.35, 0.55, 0.10],
        k=N_USERS
    ),
})

# Inject ~3% missing city values (noise)
null_indices = random.sample(range(N_USERS), int(N_USERS * 0.03))
users.loc[null_indices, 'city'] = None

users.to_csv(f'{OUTPUT_DIR}/users.csv', index=False)
print(f"  users: {len(users)} rows")

# ─────────────────────────────────────────────────────────────
# 2. SUPPLIERS
# ─────────────────────────────────────────────────────────────

print("Generating suppliers...")
hotel_ids = [f"HTL{str(i).zfill(4)}" for i in range(1, N_SUPPLIERS + 1)]

suppliers = pd.DataFrame({
    'hotel_id': hotel_ids,
    'hotel_name': [fake.company() + ' Hotel' for _ in range(N_SUPPLIERS)],
    'city': (
        random.choices(DOMESTIC_CITIES, k=int(N_SUPPLIERS * 0.75)) +
        random.choices(INTERNATIONAL_CITIES, k=int(N_SUPPLIERS * 0.25))
    ),
    'star_rating': random.choices([2, 3, 4, 5], weights=[0.1, 0.35, 0.40, 0.15], k=N_SUPPLIERS),
    'is_domestic': (
        [True] * int(N_SUPPLIERS * 0.75) +
        [False] * int(N_SUPPLIERS * 0.25)
    ),
    'supplier_tier': random.choices(
        ['budget', 'standard', 'premium'],
        weights=[0.25, 0.55, 0.20],
        k=N_SUPPLIERS
    ),
})

suppliers.to_csv(f'{OUTPUT_DIR}/suppliers.csv', index=False)
print(f"  suppliers: {len(suppliers)} rows")

# ─────────────────────────────────────────────────────────────
# 3. SESSIONS
# ─────────────────────────────────────────────────────────────

print("Generating sessions...")
session_ids = [f"SES{str(i).zfill(7)}" for i in range(1, N_SESSIONS + 1)]
session_weeks = [random_week() for _ in range(N_SESSIONS)]

session_starts = []
session_ends = []
for w in session_weeks:
    base = week_to_date(w)
    start = base + timedelta(
        days=random.randint(0, 6),
        hours=random.randint(8, 23),
        minutes=random.randint(0, 59)
    )
    duration = random.randint(60, 2400)  # seconds
    end = start + timedelta(seconds=duration) if random.random() > 0.15 else None
    session_starts.append(start.strftime('%Y-%m-%d %H:%M:%S'))
    session_ends.append(end.strftime('%Y-%m-%d %H:%M:%S') if end else None)

sessions = pd.DataFrame({
    'session_id': session_ids,
    'user_id': random.choices(user_ids, k=N_SESSIONS),
    'session_start': session_starts,
    'session_end': session_ends,
    'week_number': session_weeks,
    'channel': random.choices(
        ['organic', 'paid', 'direct', 'referral'],
        weights=[0.40, 0.30, 0.20, 0.10],
        k=N_SESSIONS
    ),
})

sessions.to_csv(f'{OUTPUT_DIR}/sessions.csv', index=False)
print(f"  sessions: {len(sessions)} rows")

# ─────────────────────────────────────────────────────────────
# 4. SEARCH EVENTS
# ─────────────────────────────────────────────────────────────

print("Generating search events...")
search_ids = [f"SCH{str(i).zfill(7)}" for i in range(1, N_SEARCH_EVENTS + 1)]

# Map sessions to weeks for search events
session_week_map = dict(zip(sessions['session_id'], sessions['week_number']))
search_session_ids = random.choices(session_ids, k=N_SEARCH_EVENTS)
search_weeks = [session_week_map[sid] for sid in search_session_ids]

is_domestic_list = random.choices([True, False], weights=[0.72, 0.28], k=N_SEARCH_EVENTS)
destinations = [
    random.choice(DOMESTIC_CITIES) if dom else random.choice(INTERNATIONAL_CITIES)
    for dom in is_domestic_list
]

# Base search prices by domestic/international
search_prices = []
for dom in is_domestic_list:
    if dom:
        price = np.random.lognormal(mean=8.5, sigma=0.4)  # ~5k-15k INR
        price = max(1500, min(price, 25000))
    else:
        price = np.random.lognormal(mean=9.8, sigma=0.5)  # ~15k-80k INR
        price = max(8000, min(price, 120000))
    search_prices.append(round(price, 2))

search_events = pd.DataFrame({
    'search_id': search_ids,
    'session_id': search_session_ids,
    'destination': destinations,
    'check_in_date': [
        (week_to_date(w) + timedelta(days=random.randint(7, 90))).strftime('%Y-%m-%d')
        for w in search_weeks
    ],
    'check_out_date': [
        (week_to_date(w) + timedelta(days=random.randint(10, 95))).strftime('%Y-%m-%d')
        for w in search_weeks
    ],
    'search_price_shown': search_prices,
    'is_domestic': is_domestic_list,
    'week_number': search_weeks,
})

search_events.to_csv(f'{OUTPUT_DIR}/search_events.csv', index=False)
print(f"  search_events: {len(search_events)} rows")

# ─────────────────────────────────────────────────────────────
# 5. HOTEL VIEWS
# ─────────────────────────────────────────────────────────────

print("Generating hotel views...")
view_ids = [f"VEW{str(i).zfill(7)}" for i in range(1, N_HOTEL_VIEWS + 1)]

# Sample from search events
view_search_ids = random.choices(search_ids, k=N_HOTEL_VIEWS)
search_price_map = dict(zip(search_events['search_id'], search_events['search_price_shown']))
search_week_map = dict(zip(search_events['search_id'], search_events['week_number']))
search_domestic_map = dict(zip(search_events['search_id'], search_events['is_domestic']))

# Hotel views — price slightly varies from search (normal behaviour)
view_prices = [
    round(search_price_map[sid] * np.random.uniform(0.97, 1.03), 2)
    for sid in view_search_ids
]

# Assign hotels — prefer domestic hotels for domestic searches
view_hotel_ids = []
domestic_hotels = suppliers[suppliers['is_domestic'] == True]['hotel_id'].tolist()
intl_hotels = suppliers[suppliers['is_domestic'] == False]['hotel_id'].tolist()

for sid in view_search_ids:
    if search_domestic_map.get(sid, True):
        view_hotel_ids.append(random.choice(domestic_hotels))
    else:
        view_hotel_ids.append(random.choice(intl_hotels))

hotel_views = pd.DataFrame({
    'view_id': view_ids,
    'search_id': view_search_ids,
    'hotel_id': view_hotel_ids,
    'listed_price': view_prices,
    'week_number': [search_week_map[sid] for sid in view_search_ids],
})

hotel_views.to_csv(f'{OUTPUT_DIR}/hotel_views.csv', index=False)
print(f"  hotel_views: {len(hotel_views)} rows")

# ─────────────────────────────────────────────────────────────
# 6. BOOKING ATTEMPTS
# ─────────────────────────────────────────────────────────────

print("Generating booking attempts...")
attempt_ids = [f"ATT{str(i).zfill(7)}" for i in range(1, N_BOOKING_ATTEMPTS + 1)]

attempt_view_ids = random.choices(view_ids, k=N_BOOKING_ATTEMPTS)
view_week_map = dict(zip(hotel_views['view_id'], hotel_views['week_number']))
view_price_map = dict(zip(hotel_views['view_id'], hotel_views['listed_price']))
view_search_map = dict(zip(hotel_views['view_id'], hotel_views['search_id']))

attempt_weeks = [view_week_map[vid] for vid in attempt_view_ids]
base_prices = [view_price_map[vid] for vid in attempt_view_ids]

checkout_prices = []
price_deltas = []
abandoned_list = []
abandonment_reasons = []

for i, (vid, week, base_price) in enumerate(zip(attempt_view_ids, attempt_weeks, base_prices)):
    if week >= ANOMALY_WEEK:
        # ANOMALY: buggy algorithm inflates checkout price 22-35%
        # Only affects domestic hotels (is_domestic=True searches)
        sid = view_search_map[vid]
        is_dom = search_domestic_map.get(sid, True)

        if is_dom and random.random() < 0.78:
            # Bug active
            multiplier = np.random.uniform(1.22, 1.35)
            checkout_price = round(base_price * multiplier, 2)
            delta = round((checkout_price - base_price) / base_price, 4)

            # High abandonment due to price shock
            abandon = random.random() < 0.72
            reason = 'price_shock' if abandon else None
        else:
            # Normal behaviour
            checkout_price = round(base_price * np.random.uniform(0.99, 1.02), 2)
            delta = round((checkout_price - base_price) / base_price, 4)
            abandon = random.random() < 0.22
            reason = random.choices(
                [None, 'timeout', 'error'],
                weights=[0.80, 0.12, 0.08]
            )[0] if abandon else None
    else:
        # Pre-anomaly: normal behaviour
        checkout_price = round(base_price * np.random.uniform(0.99, 1.02), 2)
        delta = round((checkout_price - base_price) / base_price, 4)
        abandon = random.random() < 0.22
        reason = random.choices(
            [None, 'timeout', 'error'],
            weights=[0.80, 0.12, 0.08]
        )[0] if abandon else None

    checkout_prices.append(checkout_price)
    price_deltas.append(delta)
    abandoned_list.append(abandon)
    abandonment_reasons.append(reason)

booking_attempts = pd.DataFrame({
    'attempt_id': attempt_ids,
    'view_id': attempt_view_ids,
    'user_id': random.choices(user_ids, k=N_BOOKING_ATTEMPTS),
    'checkout_price': checkout_prices,
    'price_delta_pct': price_deltas,
    'abandoned': abandoned_list,
    'abandonment_reason': abandonment_reasons,
    'week_number': attempt_weeks,
})

booking_attempts.to_csv(f'{OUTPUT_DIR}/booking_attempts.csv', index=False)
print(f"  booking_attempts: {len(booking_attempts)} rows")

# ─────────────────────────────────────────────────────────────
# 7. BOOKINGS
# ─────────────────────────────────────────────────────────────

print("Generating bookings...")

# Only non-abandoned attempts become bookings
completed_attempts = booking_attempts[booking_attempts['abandoned'] == False].copy()
completed_attempts = completed_attempts.sample(min(N_BOOKINGS, len(completed_attempts)), random_state=42)

booking_ids = [f"BKG{str(i).zfill(7)}" for i in range(1, len(completed_attempts) + 1)]

attempt_checkout_map = dict(zip(booking_attempts['attempt_id'], booking_attempts['checkout_price']))
attempt_week_map = dict(zip(booking_attempts['attempt_id'], booking_attempts['week_number']))

# Commission varies by week — declines post-anomaly as value mix shifts
booking_values = [attempt_checkout_map[aid] for aid in completed_attempts['attempt_id']]
commission_pcts = []
revenues = []

for i, (aid, bval) in enumerate(zip(completed_attempts['attempt_id'], booking_values)):
    week = attempt_week_map[aid]
    # Commission slightly lower post-anomaly (cheaper hotels complete more)
    if week >= ANOMALY_WEEK:
        comm = np.random.uniform(0.09, 0.13)
    else:
        comm = np.random.uniform(0.11, 0.16)
    commission_pcts.append(round(comm, 4))
    revenues.append(round(bval * comm, 2))

# Map view → search → domestic
attempt_view_map_local = dict(zip(booking_attempts['attempt_id'], booking_attempts['view_id']))

def get_is_domestic(aid):
    vid = attempt_view_map_local.get(aid)
    if vid is None:
        return True
    sid = view_search_map.get(vid)
    if sid is None:
        return True
    return bool(search_domestic_map.get(sid, True))

bookings = pd.DataFrame({
    'booking_id': booking_ids,
    'attempt_id': completed_attempts['attempt_id'].values,
    'user_id': completed_attempts['user_id'].values,
    'hotel_id': [
        view_hotel_ids[view_ids.index(attempt_view_map_local[aid])]
        if attempt_view_map_local.get(aid) in view_ids else random.choice(hotel_ids)
        for aid in completed_attempts['attempt_id']
    ],
    'booking_value': booking_values,
    'platform_commission_pct': commission_pcts,
    'revenue': revenues,
    'week_number': [attempt_week_map[aid] for aid in completed_attempts['attempt_id']],
    'is_domestic': [get_is_domestic(aid) for aid in completed_attempts['attempt_id']],
})

bookings.to_csv(f'{OUTPUT_DIR}/bookings.csv', index=False)
print(f"  bookings: {len(bookings)} rows")

# ─────────────────────────────────────────────────────────────
# 8. PAYMENTS
# ─────────────────────────────────────────────────────────────

print("Generating payments...")
payment_ids = [f"PAY{str(i).zfill(7)}" for i in range(1, len(bookings) + 1)]

payments = pd.DataFrame({
    'payment_id': payment_ids,
    'booking_id': bookings['booking_id'].values,
    'payment_method': random.choices(
        ['upi', 'card', 'netbanking', 'wallet'],
        weights=[0.45, 0.30, 0.15, 0.10],
        k=len(bookings)
    ),
    'payment_status': random.choices(
        ['success', 'failed', 'refunded'],
        weights=[0.94, 0.04, 0.02],
        k=len(bookings)
    ),
    'amount': bookings['booking_value'].values,
    'week_number': bookings['week_number'].values,
})

payments.to_csv(f'{OUTPUT_DIR}/payments.csv', index=False)
print(f"  payments: {len(payments)} rows")

# ─────────────────────────────────────────────────────────────
# 9. PRICE LOGS
# ─────────────────────────────────────────────────────────────

print("Generating price logs...")
log_ids = [f"LOG{str(i).zfill(7)}" for i in range(1, N_PRICE_LOGS + 1)]
log_weeks = [random_week() for _ in range(N_PRICE_LOGS)]
log_hotel_ids = random.choices(hotel_ids, k=N_PRICE_LOGS)

algorithm_versions = []
base_prices_log = []
computed_prices_log = []
multipliers_log = []
logged_ats = []

for i, (week, hid) in enumerate(zip(log_weeks, log_hotel_ids)):
    base = np.random.lognormal(mean=8.5, sigma=0.4)
    base = round(max(1500, min(base, 30000)), 2)

    if week >= ANOMALY_WEEK:
        version = 'v1.3_buggy'
        # Buggy multiplier — erroneously high
        multiplier = round(np.random.uniform(1.22, 1.38), 4)
    else:
        version = 'v1.2'
        multiplier = round(np.random.uniform(0.95, 1.18), 4)

    computed = round(base * multiplier, 2)
    log_date = week_to_date(week) + timedelta(
        days=random.randint(0, 6),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59)
    )

    algorithm_versions.append(version)
    base_prices_log.append(base)
    computed_prices_log.append(computed)
    multipliers_log.append(multiplier)
    logged_ats.append(log_date.strftime('%Y-%m-%d %H:%M:%S'))

price_logs = pd.DataFrame({
    'log_id': log_ids,
    'hotel_id': log_hotel_ids,
    'algorithm_version': algorithm_versions,
    'base_price': base_prices_log,
    'computed_price': computed_prices_log,
    'multiplier': multipliers_log,
    'logged_at': logged_ats,
    'week_number': log_weeks,
})

price_logs.to_csv(f'{OUTPUT_DIR}/price_logs.csv', index=False)
print(f"  price_logs: {len(price_logs)} rows")

# ─────────────────────────────────────────────────────────────
# 10. INVENTORY LOGS
# ─────────────────────────────────────────────────────────────

print("Generating inventory logs...")
inv_ids = [f"INV{str(i).zfill(7)}" for i in range(1, N_INVENTORY_LOGS + 1)]
inv_weeks = [random_week() for _ in range(N_INVENTORY_LOGS)]
inv_hotel_ids = random.choices(hotel_ids, k=N_INVENTORY_LOGS)

# Supplier success rate stays STABLE — this is the red herring
# Users who blame supplier failures are wrong
booking_successes = []
failure_reasons = []

for week in inv_weeks:
    # Stable ~96% success rate throughout — no anomaly here
    success = random.random() < 0.96
    booking_successes.append(success)
    if not success:
        failure_reasons.append(random.choices(
            ['timeout', 'no_inventory', 'api_error'],
            weights=[0.50, 0.30, 0.20]
        )[0])
    else:
        failure_reasons.append(None)

inv_logged_ats = [
    (week_to_date(w) + timedelta(
        days=random.randint(0, 6),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59)
    )).strftime('%Y-%m-%d %H:%M:%S')
    for w in inv_weeks
]

inventory_logs = pd.DataFrame({
    'inv_id': inv_ids,
    'hotel_id': inv_hotel_ids,
    'rooms_available': np.random.randint(0, 50, size=N_INVENTORY_LOGS),
    'booking_success': booking_successes,
    'failure_reason': failure_reasons,
    'logged_at': inv_logged_ats,
    'week_number': inv_weeks,
})

inventory_logs.to_csv(f'{OUTPUT_DIR}/inventory_logs.csv', index=False)
print(f"  inventory_logs: {len(inventory_logs)} rows")

# ─────────────────────────────────────────────────────────────
# VALIDATION
# ─────────────────────────────────────────────────────────────

print("\n=== DATASET VALIDATION ===")

total_rows = sum([
    len(users), len(suppliers), len(sessions), len(search_events),
    len(hotel_views), len(booking_attempts), len(bookings),
    len(payments), len(price_logs), len(inventory_logs)
])
print(f"Total rows: {total_rows:,}")

# Check anomaly signal
pre = booking_attempts[booking_attempts['week_number'] < ANOMALY_WEEK]
post = booking_attempts[booking_attempts['week_number'] >= ANOMALY_WEEK]
print(f"\nAbandonment rate pre-week {ANOMALY_WEEK}:  {pre['abandoned'].mean()*100:.1f}%")
print(f"Abandonment rate post-week {ANOMALY_WEEK}: {post['abandoned'].mean()*100:.1f}%")

pre_rpb = bookings[bookings['week_number'] < ANOMALY_WEEK]['revenue'].mean()
post_rpb = bookings[bookings['week_number'] >= ANOMALY_WEEK]['revenue'].mean()
print(f"\nRevenue per booking pre-week {ANOMALY_WEEK}:  INR {pre_rpb:,.0f}")
print(f"Revenue per booking post-week {ANOMALY_WEEK}: INR {post_rpb:,.0f}")
print(f"RPB decline: {((post_rpb - pre_rpb) / pre_rpb * 100):.1f}%")

pre_price_delta = booking_attempts[booking_attempts['week_number'] < ANOMALY_WEEK]['price_delta_pct'].mean()
post_price_delta = booking_attempts[booking_attempts['week_number'] >= ANOMALY_WEEK]['price_delta_pct'].mean()
print(f"\nAvg price delta pre-week {ANOMALY_WEEK}:  {pre_price_delta*100:.1f}%")
print(f"Avg price delta post-week {ANOMALY_WEEK}: {post_price_delta*100:.1f}%")

supplier_success = inventory_logs['booking_success'].mean()
print(f"\nSupplier success rate (stable red herring): {supplier_success*100:.1f}%")

print("\n=== FILES WRITTEN ===")
for f in os.listdir(OUTPUT_DIR):
    path = f'{OUTPUT_DIR}/{f}'
    size_kb = os.path.getsize(path) / 1024
    rows = pd.read_csv(path).shape[0]
    print(f"  {f:<35} {rows:>6} rows  {size_kb:>7.1f} KB")

print("\nDone.")

# ─────────────────────────────────────────────────────────────
# CORRECTED VALIDATION — Revenue per SESSION (platform view)
# ─────────────────────────────────────────────────────────────

print("\n=== CORRECTED PLATFORM METRICS ===")

# Sessions per week
sessions_per_week = sessions.groupby('week_number')['session_id'].count()

# Revenue per week
revenue_per_week = bookings.groupby('week_number')['revenue'].sum()

# Revenue per session (true platform RPB proxy)
rps = (revenue_per_week / sessions_per_week).fillna(0)

pre_rps = rps[rps.index < ANOMALY_WEEK].mean()
post_rps = rps[rps.index >= ANOMALY_WEEK].mean()

print(f"Revenue per session pre-week 16:  INR {pre_rps:.2f}")
print(f"Revenue per session post-week 16: INR {post_rps:.2f}")
print(f"Revenue per session decline: {((post_rps - pre_rps) / pre_rps * 100):.1f}%")

# Booking conversion rate
pre_conv = bookings[bookings['week_number'] < ANOMALY_WEEK].shape[0] / \
           sessions[sessions['week_number'] < ANOMALY_WEEK].shape[0]
post_conv = bookings[bookings['week_number'] >= ANOMALY_WEEK].shape[0] / \
            sessions[sessions['week_number'] >= ANOMALY_WEEK].shape[0]

print(f"\nBooking conversion pre-week 16:  {pre_conv*100:.2f}%")
print(f"Booking conversion post-week 16: {post_conv*100:.2f}%")
print(f"Conversion decline: {((post_conv - pre_conv) / pre_conv * 100):.1f}%")
