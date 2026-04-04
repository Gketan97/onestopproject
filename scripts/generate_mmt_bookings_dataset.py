# ============================================================
# MMT BOOKINGS/DAU CASE STUDY — SYNTHETIC DATA GENERATOR
# Generates 5 CSVs reflecting 4 compounding root causes.
# Anomaly onset: Week 5 of 12.
# Root causes:
#   1. Choice overload from homestay expansion (35% of drop)
#   2. Review fatigue / decision paralysis (28% of drop)
#   3. HVT behavioral shift to packages (22% of drop)
#   4. Visa uncertainty on international travel (15% of drop)
# ============================================================

import csv
import random
import math
import os

random.seed(42)

OUTPUT_DIR = "public/cases/mmt_bookings_drop/dataset"
os.makedirs(OUTPUT_DIR, exist_ok=True)

WEEKS = 12
ANOMALY_WEEK = 5

# ── COHORT DEFINITIONS ───────────────────────────────────────
COHORTS = {
    "HVT": {
        "share_pre": 0.15, "share_post": 0.13,
        "cvr_pre": 0.142, "cvr_post": 0.111,
        "abv_pre": 618, "abv_post": 601,
        "tenure_min": 180, "tenure_max": 900,
        "channels": ["direct", "organic"],
        "categories": ["vacation", "tourist", "business"],
        "review_dwell_pre": 48, "review_dwell_post": 192,
        "listings_viewed_pre": 4.1, "listings_viewed_post": 11.3,
        "serp_bounce_pre": 0.19, "serp_bounce_post": 0.34,
        "package_visit_pre": 0.08, "package_visit_post": 0.31,
        "intl_share": 0.28,
    },
    "Mission": {
        "share_pre": 0.25, "share_post": 0.22,
        "cvr_pre": 0.106, "cvr_post": 0.084,
        "abv_pre": 280, "abv_post": 271,
        "tenure_min": 60, "tenure_max": 540,
        "channels": ["organic", "direct", "paid"],
        "categories": ["business", "tourist"],
        "review_dwell_pre": 66, "review_dwell_post": 168,
        "listings_viewed_pre": 3.2, "listings_viewed_post": 6.8,
        "serp_bounce_pre": 0.12, "serp_bounce_post": 0.21,
        "package_visit_pre": 0.04, "package_visit_post": 0.08,
        "intl_share": 0.11,
    },
    "DealSeeker": {
        "share_pre": 0.40, "share_post": 0.42,
        "cvr_pre": 0.051, "cvr_post": 0.050,
        "abv_pre": 112, "abv_post": 108,
        "tenure_min": 0, "tenure_max": 180,
        "channels": ["paid", "referral"],
        "categories": ["budget", "tourist"],
        "review_dwell_pre": 246, "review_dwell_post": 312,
        "listings_viewed_pre": 8.3, "listings_viewed_post": 9.1,
        "serp_bounce_pre": 0.21, "serp_bounce_post": 0.24,
        "package_visit_pre": 0.02, "package_visit_post": 0.03,
        "intl_share": 0.04,
    },
    "Explorer": {
        "share_pre": 0.20, "share_post": 0.23,
        "cvr_pre": 0.023, "cvr_post": 0.022,
        "abv_pre": 95, "abv_post": 92,
        "tenure_min": 0, "tenure_max": 60,
        "channels": ["paid", "referral", "organic"],
        "categories": ["tourist", "vacation", "budget"],
        "review_dwell_pre": 108, "review_dwell_post": 114,
        "listings_viewed_pre": 6.1, "listings_viewed_post": 6.8,
        "serp_bounce_pre": 0.44, "serp_bounce_post": 0.47,
        "package_visit_pre": 0.01, "package_visit_post": 0.02,
        "intl_share": 0.08,
    },
}

TOTAL_USERS = 11500

def lerp(pre, post, week):
    """Linear interpolation from pre to post value starting at ANOMALY_WEEK."""
    if week < ANOMALY_WEEK:
        return pre
    progress = min(1.0, (week - ANOMALY_WEEK) / (WEEKS - ANOMALY_WEEK))
    return pre + (post - pre) * progress

def jitter(val, pct=0.08):
    return val * (1 + random.uniform(-pct, pct))

# ── GENERATE USERS ───────────────────────────────────────────
print("Generating users...")
users = []
user_id = 1

# Pre-anomaly user base — 10M DAU represented as 10000 users
pre_anomaly_users = 10000
post_anomaly_new_users = 1500  # +15% DAU = mostly low-LTV new users

for cohort_name, cfg in COHORTS.items():
    count = int(pre_anomaly_users * cfg["share_pre"])
    for _ in range(count):
        tenure = random.randint(cfg["tenure_min"], cfg["tenure_max"])
        users.append({
            "user_id": user_id,
            "cohort": cohort_name,
            "tenure_days": tenure,
            "acquisition_channel": random.choice(cfg["channels"]),
            "city_tier": random.choice(["tier1", "tier1", "tier2", "resort"]),
            "avg_booking_value": round(jitter(cfg["abv_pre"]), 2),
            "joined_week": random.randint(1, 4),
        })
        user_id += 1

# Post-anomaly new users — mostly DealSeekers and Explorers
new_user_cohorts = ["DealSeeker"] * 600 + ["Explorer"] * 700 + ["Mission"] * 150
for cohort_name in new_user_cohorts:
    cfg = COHORTS[cohort_name]
    users.append({
        "user_id": user_id,
        "cohort": cohort_name,
        "tenure_days": random.randint(0, 30),
        "acquisition_channel": random.choice(["paid", "referral"]),
        "city_tier": random.choice(["tier1", "tier2"]),
        "avg_booking_value": round(jitter(cfg["abv_post"] * 0.85), 2),
        "joined_week": random.randint(5, 10),
    })
    user_id += 1

with open(f"{OUTPUT_DIR}/users.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=users[0].keys())
    writer.writeheader()
    writer.writerows(users)

print(f"  {len(users)} users written")

# ── GENERATE LISTINGS ────────────────────────────────────────
print("Generating listings...")
listings = []
listing_id = 1

# Pre-anomaly inventory
categories_pre = {
    "hotel": 2800, "resort": 600, "budget": 1200,
    "boutique": 400, "homestay": 200,
}

for category, count in categories_pre.items():
    tier = "luxury" if category == "resort" else \
           "premium" if category in ["hotel", "boutique"] else \
           "mid" if category == "hotel" else "budget"
    for _ in range(count):
        listings.append({
            "listing_id": listing_id,
            "category": category,
            "tier": tier if category != "hotel" else random.choice(["budget", "mid", "premium", "luxury"]),
            "avg_review_score": round(random.uniform(3.8, 4.9), 2),
            "onboarded_week": random.randint(1, 4),
            "city_tier": random.choice(["tier1", "tier1", "tier2", "resort"]),
            "has_landmark_tag": random.random() < 0.31,
            "amenities_complete": random.random() < 0.78,
        })
        listing_id += 1

# Week 5 homestay expansion — 340% increase in homestays
# These have lower review scores, weaker amenity data
for _ in range(2800):
    listings.append({
        "listing_id": listing_id,
        "category": "homestay",
        "tier": random.choice(["budget", "budget", "mid"]),
        "avg_review_score": round(random.uniform(2.9, 4.1), 2),
        "onboarded_week": random.randint(5, 8),
        "city_tier": random.choice(["tier2", "tier2", "resort", "tier1"]),
        "has_landmark_tag": random.random() < 0.08,
        "amenities_complete": random.random() < 0.34,
    })
    listing_id += 1

with open(f"{OUTPUT_DIR}/listings.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=listings[0].keys())
    writer.writeheader()
    writer.writerows(listings)

print(f"  {len(listings)} listings written")

# ── GENERATE SESSIONS ────────────────────────────────────────
print("Generating sessions...")
sessions = []
session_id = 1

user_lookup = {u["user_id"]: u for u in users}

for week in range(1, WEEKS + 1):
    is_post = week >= ANOMALY_WEEK
    progress = max(0, (week - ANOMALY_WEEK) / (WEEKS - ANOMALY_WEEK)) if is_post else 0

    for user in users:
        # Not every user is active every week
        active_prob = 0.35 if user["joined_week"] <= week else 0.0
        if user["joined_week"] > week:
            continue
        if random.random() > active_prob:
            continue

        cohort = user["cohort"]
        cfg = COHORTS[cohort]

        # CVR interpolated
        cvr = lerp(cfg["cvr_pre"], cfg["cvr_post"], week)
        converted = random.random() < cvr

        # Review dwell — increases post anomaly for HVT and Mission
        review_dwell_base = lerp(cfg["review_dwell_pre"], cfg["review_dwell_post"], week)
        review_dwell = int(jitter(review_dwell_base, 0.2))

        # Listings viewed — increases post anomaly (more browsing = choice overload)
        listings_viewed_base = lerp(cfg["listings_viewed_pre"], cfg["listings_viewed_post"], week)
        listings_viewed = max(1, int(jitter(listings_viewed_base, 0.15)))

        # SERP bounce
        serp_bounce_rate = lerp(cfg["serp_bounce_pre"], cfg["serp_bounce_post"], week)
        serp_bounce = random.random() < serp_bounce_rate

        # Package visit — HVT increasingly visits packages post Week 5
        package_visit_rate = lerp(cfg["package_visit_pre"], cfg["package_visit_post"], week)
        package_page_visited = random.random() < package_visit_rate

        # International session
        intl = random.random() < cfg["intl_share"]
        listing_category = "international" if intl else random.choice(cfg["categories"])

        # Visa concern exit — only for international sessions post Week 5
        visa_concern_exit = False
        if intl and is_post:
            visa_rate = min(0.38, 0.05 + progress * 0.33)
            visa_concern_exit = random.random() < visa_rate

        # Payment abandonment — Deal Seekers see hidden fees
        payment_abandoned = False
        if converted and cohort == "DealSeeker" and is_post:
            abandon_rate = lerp(0.14, 0.22, week)
            payment_abandoned = random.random() < abandon_rate
            if payment_abandoned:
                converted = False

        # External map — Mission users post Week 5
        opened_external_map = False
        if cohort == "Mission" and is_post:
            map_rate = lerp(0.11, 0.31, week)
            opened_external_map = random.random() < map_rate

        # Search query type
        query_weights = {
            "HVT": ["high_intent"] * 7 + ["medium_intent"] * 2 + ["browsing"] * 1,
            "Mission": ["high_intent"] * 6 + ["medium_intent"] * 3 + ["browsing"] * 1,
            "DealSeeker": ["high_intent"] * 3 + ["medium_intent"] * 5 + ["browsing"] * 2,
            "Explorer": ["browsing"] * 6 + ["medium_intent"] * 3 + ["high_intent"] * 1,
        }
        search_query_type = random.choice(query_weights[cohort])

        sessions.append({
            "session_id": session_id,
            "user_id": user["user_id"],
            "week": week,
            "cohort": cohort,
            "search_query_type": search_query_type,
            "listing_category": listing_category,
            "converted": converted,
            "review_dwell_seconds": review_dwell,
            "listings_viewed": listings_viewed,
            "serp_bounce": serp_bounce,
            "opened_external_map": opened_external_map,
            "payment_abandoned": payment_abandoned,
            "visa_concern_exit": visa_concern_exit,
            "package_page_visited": package_page_visited,
        })
        session_id += 1

with open(f"{OUTPUT_DIR}/sessions.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=sessions[0].keys())
    writer.writeheader()
    writer.writerows(sessions)

print(f"  {len(sessions)} sessions written")

# ── GENERATE SEARCH RESULTS ──────────────────────────────────
print("Generating search_results...")
search_results = []

for s in sessions:
    week = s["week"]
    cohort = s["cohort"]
    is_post = week >= ANOMALY_WEEK
    progress = max(0, (week - ANOMALY_WEEK) / (WEEKS - ANOMALY_WEEK)) if is_post else 0

    # Budget/homestay in top 5 — increases post Week 5 due to ranking algo change
    if cohort == "HVT":
        budget_top5_pre = 0.18
        budget_top5_post = 0.41
    elif cohort == "Mission":
        budget_top5_pre = 0.14
        budget_top5_post = 0.28
    else:
        budget_top5_pre = 0.51
        budget_top5_post = 0.54

    budget_in_top5 = round(lerp(budget_top5_pre, budget_top5_post, week) + random.uniform(-0.03, 0.03), 3)

    # Time to first click — HVT takes longer post anomaly (more scrolling)
    if cohort == "HVT":
        ttfc_pre, ttfc_post = 8, 23
    elif cohort == "Mission":
        ttfc_pre, ttfc_post = 11, 18
    else:
        ttfc_pre, ttfc_post = 14, 15

    time_to_first_click = max(3, int(jitter(lerp(ttfc_pre, ttfc_post, week), 0.2)))

    # Scroll depth — HVT scrolls more post anomaly
    if cohort == "HVT":
        scroll_pre, scroll_post = 0.22, 0.67
    else:
        scroll_pre, scroll_post = 0.38, 0.42

    scroll_depth = round(min(1.0, lerp(scroll_pre, scroll_post, week) + random.uniform(-0.05, 0.05)), 3)

    # Filters applied — drops post UI refresh at Week 6
    if cohort == "HVT":
        filters_pre, filters_post = 2.1, 0.3
    else:
        filters_pre, filters_post = 0.8, 0.5

    filters_applied = max(0, int(jitter(lerp(filters_pre, filters_post, week), 0.3)))
    premium_filter_available = week < 6  # removed in UI refresh Week 6

    # Rank 1 listing tier
    if is_post and cohort in ["HVT", "Mission"]:
        rank1_options = ["budget", "budget", "homestay", "mid", "premium"]
    else:
        rank1_options = ["premium", "luxury", "mid", "premium", "mid"]
    rank_1_listing_tier = random.choice(rank1_options)

    search_results.append({
        "session_id": s["session_id"],
        "week": week,
        "cohort": cohort,
        "rank_1_listing_tier": rank_1_listing_tier,
        "budget_in_top5_pct": budget_in_top5,
        "time_to_first_click_seconds": time_to_first_click,
        "scroll_depth_pct": scroll_depth,
        "filters_applied": filters_applied,
        "premium_filter_available": premium_filter_available,
    })

with open(f"{OUTPUT_DIR}/search_results.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=search_results[0].keys())
    writer.writeheader()
    writer.writerows(search_results)

print(f"  {len(search_results)} search result rows written")

# ── GENERATE BOOKINGS ────────────────────────────────────────
print("Generating bookings...")
bookings = []
booking_id = 1

converted_sessions = [s for s in sessions if s["converted"]]

for s in converted_sessions:
    cohort = s["cohort"]
    cfg = COHORTS[cohort]
    week = s["week"]

    abv = lerp(cfg["abv_pre"], cfg["abv_post"], week)
    revenue = round(jitter(abv, 0.25), 2)

    # HVT package shift — more bookings are packages post Week 5
    is_package = s["package_page_visited"] and random.random() < 0.6
    is_international = s["listing_category"] == "international"

    # Find a listing
    eligible = [l for l in listings
                if l["category"] != "homestay" or cohort in ["DealSeeker", "Explorer"]]
    listing = random.choice(eligible)

    bookings.append({
        "booking_id": booking_id,
        "user_id": s["user_id"],
        "listing_id": listing["listing_id"],
        "week": week,
        "cohort": cohort,
        "revenue_usd": revenue,
        "is_international": is_international,
        "is_package": is_package,
    })
    booking_id += 1

with open(f"{OUTPUT_DIR}/bookings.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=bookings[0].keys())
    writer.writeheader()
    writer.writerows(bookings)

print(f"  {len(bookings)} bookings written")

# ── SUMMARY STATS ────────────────────────────────────────────
print("\n" + "="*55)
print("DATASET GENERATION COMPLETE")
print("="*55)

pre_sessions = [s for s in sessions if s["week"] < ANOMALY_WEEK]
post_sessions = [s for s in sessions if s["week"] >= ANOMALY_WEEK]

pre_cvr = sum(1 for s in pre_sessions if s["converted"]) / len(pre_sessions)
post_cvr = sum(1 for s in post_sessions if s["converted"]) / len(post_sessions)

pre_review = sum(s["review_dwell_seconds"] for s in pre_sessions) / len(pre_sessions)
post_review = sum(s["review_dwell_seconds"] for s in post_sessions) / len(post_sessions)

pre_listings = sum(s["listings_viewed"] for s in pre_sessions) / len(pre_sessions)
post_listings = sum(s["listings_viewed"] for s in post_sessions) / len(post_sessions)

pre_visa = sum(1 for s in pre_sessions if s["visa_concern_exit"]) / len(pre_sessions)
post_visa = sum(1 for s in post_sessions if s["visa_concern_exit"]) / len(post_sessions)

pre_package = sum(1 for s in pre_sessions if s["package_page_visited"]) / len(pre_sessions)
post_package = sum(1 for s in post_sessions if s["package_page_visited"]) / len(post_sessions)

print(f"\nCVR:              {pre_cvr:.3f} → {post_cvr:.3f} ({((post_cvr-pre_cvr)/pre_cvr)*100:+.1f}%)")
print(f"Avg review dwell: {pre_review:.0f}s → {post_review:.0f}s ({((post_review-pre_review)/pre_review)*100:+.1f}%)")
print(f"Avg listings/session: {pre_listings:.1f} → {post_listings:.1f} ({((post_listings-pre_listings)/pre_listings)*100:+.1f}%)")
print(f"Visa exit rate:   {pre_visa:.3f} → {post_visa:.3f} ({((post_visa-pre_visa)/max(pre_visa,0.001))*100:+.1f}%)")
print(f"Package visit rate: {pre_package:.3f} → {post_package:.3f} ({((post_package-pre_package)/max(pre_package,0.001))*100:+.1f}%)")

print(f"\nFiles written to: {OUTPUT_DIR}/")
print(f"  users.csv        {len(users):,} rows")
print(f"  sessions.csv     {len(sessions):,} rows")
print(f"  listings.csv     {len(listings):,} rows")
print(f"  search_results.csv {len(search_results):,} rows")
print(f"  bookings.csv     {len(bookings):,} rows")
print(f"  Total:           {len(users)+len(sessions)+len(listings)+len(search_results)+len(bookings):,} rows")
