import pandas as pd

funnel = pd.read_csv('case_data/aggregates/funnel_by_week_channel.csv')
cohort = pd.read_csv('case_data/raw/cohort_summary.csv')
comp   = pd.read_csv('case_data/aggregates/competitor_price_summary.csv')

print("=== CHANNEL CONVERSION (problem period) ===")
prob = funnel[funnel['week'] >= '2024-07']
print(prob.groupby('channel')['overall_conversion'].mean().sort_values(ascending=False).to_string())

print("\n=== SESSION MIX SHIFT ===")
pre  = funnel[funnel['week'] < '2024-07']
prob = funnel[funnel['week'] >= '2024-07']
for ch in ['organic_search', 'returning_direct', 'paid_social']:
    pre_share  = pre[pre['channel']==ch]['sessions'].sum()  / pre['sessions'].sum()
    prob_share = prob[prob['channel']==ch]['sessions'].sum() / prob['sessions'].sum()
    print(f"  {ch:<25} Pre: {pre_share:.1%}  ->  Problem: {prob_share:.1%}")

print("\n=== COHORT QUALITY: paid_social Jul-Aug ===")
print(cohort[cohort['channel']=='paid_social'][
    ['acquisition_month','month0_booking_rate','month1_retention_rate','avg_net_revenue_per_user_inr']
].to_string(index=False))

print("\n=== COMPETITOR PRICING (problem period, key routes) ===")
key = comp[(comp['is_problem_period']==True) & (comp['route_id'].isin(['ROUTE_DEL-BOM','ROUTE_BOM-BLR','ROUTE_DEL-BLR']))]
print(key[['route_id','avg_price_gap_pct','pct_pmt_cheaper']].to_string(index=False))
