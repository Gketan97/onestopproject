// ============================================================
// MMT BOOKINGS/DAU CASE — TEACHING CONTENT
// 7 milestones. 4 root causes. No single villain.
// Adaptive pedagogy: teach concept → MCQ → open question
// ============================================================

import type { MilestoneTeachingContent } from '@/types';

export const MMT_BOOKINGS_TEACHING_CONTENT: Record<string, MilestoneTeachingContent> = {

  // ──────────────────────────────────────────────────────────
  // M1 — PROBLEM SCOPING
  // ──────────────────────────────────────────────────────────
  problem_scoping: {
    milestoneType: 'problem_scoping',

    arjunIntro: `Before we look at a single number, I want to tell you something. The CEO just sent you a message: "Bookings per DAU dropped 13% over 60 days. DAU is up 15%. I need a full brief by Friday." Most analysts open a dashboard immediately. The good ones ask three questions first: Is this drop real? What is the shape of the decline? Who is affected? Let me show you why these questions matter more than any query you could run.`,

    concepts: [
      {
        heading: 'Bookings/DAU is a ratio. Ratios can fall three ways.',
        body: 'Bookings/DAU = Total Bookings ÷ DAU. That means the ratio can decline because bookings fell, because DAU rose faster than bookings, or because both moved but in unfavorable proportions. We know DAU grew 15% and bookings are flat. So the denominator grew while the numerator held still. This is a mix shift problem — not necessarily a product failure. The first thing to establish is whether this is structural or behavioral.',
        analogy: 'If a restaurant serves 100 meals a day to 100 customers, its meals-per-customer ratio is 1.0. If they add 50 new customers who only order drinks, the ratio drops to 0.67 — even though the restaurant did nothing wrong and existing customers behaved identically.',
      },
      {
        heading: 'The shape of the decline tells you the mechanism.',
        body: 'A cliff drop — sudden fall on a single day — means an event: a bug, a deployment, an outage. A gradual slide over 60 days means a structural or behavioral change compounding over time. Our 13% drop happened over 60 days. That is a slide, not a cliff. This immediately rules out bugs and outages as the primary cause and points toward product changes, inventory changes, or user behavior evolution.',
        analogy: 'If your car fuel efficiency drops 30% overnight, that is a leak. If it drops 15% over three months, that is gradual wear — a different diagnosis and a different fix.',
      },
      {
        heading: 'Verify the data before you diagnose the product.',
        body: 'Before investigating root causes, ask: Is the drop real? Check for pipeline issues, logging changes, dashboard filter changes, and definition drift. A 13% drop that turns out to be a dashboard misconfiguration wastes a week of investigation. Confirm the same drop appears in at least two independent data sources — revenue data, booking confirmation emails, payment processor data — before treating it as real.',
      },
    ],

    checkpointQuestion: 'DAU grew 15% and total bookings held flat. Bookings/DAU fell 13%. What does this pattern most likely indicate before any further investigation?',

    options: [
      {
        id: 'a',
        text: 'The product experience degraded and users are failing to complete bookings',
        isCorrect: false,
        explanation: 'Possible, but premature. DAU growth outpacing bookings is consistent with a mix shift — new users with different behavior entering the platform — without any product degradation. You need cohort-level data to distinguish these explanations.',
      },
      {
        id: 'b',
        text: 'New user growth is diluting the platform average — lower-converting users now make up a larger share of DAU',
        isCorrect: true,
        explanation: 'Correct. When DAU grows faster than bookings, the most parsimonious explanation is mix shift — new users who convert at a lower rate entering the platform. This is the weighted average trap. It does not mean existing users are not also degrading, but mix shift must be sized first.',
      },
      {
        id: 'c',
        text: 'There is a data pipeline issue causing bookings to be undercounted',
        isCorrect: false,
        explanation: 'Always worth checking — but the gradual 60-day decline shape makes a pipeline issue unlikely. Pipeline issues typically cause cliff drops on specific dates, not gradual slides.',
      },
      {
        id: 'd',
        text: 'Seasonal factors are reducing travel demand',
        isCorrect: false,
        explanation: 'Seasonality would affect DAU as well as bookings. If DAU is growing 15% during the same period, seasonal demand reduction is not the explanation.',
      },
    ],

    openQuestion: {
      question: `You have confirmed the drop is real. DAU grew 15%, bookings flat, revenue fell 16.5%. Before running any query — write your preliminary hypothesis in one paragraph. What do you think is happening and why? What would confirm or falsify your hypothesis?`,
      placeholder: `My hypothesis is... This would be confirmed by... This would be falsified if...`,
      rubric: `A strong answer forms a specific hypothesis (not just "something changed"), identifies what data would confirm it, and identifies what data would falsify it. The falsifying condition is the harder and more important part — most analysts only think about confirmation. A strong answer also notes that DAU growth driven by low-LTV users is a mix shift hypothesis that needs to be sized before concluding product degradation.`,
      revealAfterAttempts: 2,
      correctAnswerReveal: `Strong preliminary hypothesis: "DAU growth of 15% is being driven by a new user acquisition campaign that is bringing in lower-converting users — Deal Seekers and Explorers. These users have historically lower CVR. As their share of DAU increases, the blended platform CVR falls even if existing user behavior is unchanged. This is a mix shift, not a product failure. It would be confirmed by cohort-level CVR showing stable conversion for long-tenure users and lower CVR for new users. It would be falsified if long-tenure, high-intent users are ALSO converting less — which would indicate a product or supply problem, not just a mix shift." Note: the real case has BOTH effects happening simultaneously, which is what makes it complex.`,
    },

    investigationNudge: `Good framing. Now run the north star trend query and the L0 metrics query. When you see the numbers, I want you to do one thing before typing anything: write down whether the revenue drop is proportional to the booking drop. Revenue fell 16.5% but bookings are flat. What does that arithmetic tell you that the headline metric does not?`,

    commitPrompt: 'Write your problem scoping finding. Include: the metric and its change, the time window, the shape of the decline (cliff vs slide), what the revenue vs booking discrepancy tells you, and your top hypothesis heading into cohort analysis.',

    commitDepthQuestion: 'You scoped the problem as a Bookings/DAU decline. But revenue fell more than bookings — 16.5% vs flat bookings. What does that gap tell you about which users are most affected? And how does that change your investigation priority?',
  },

  // ──────────────────────────────────────────────────────────
  // M2 — KPI SELECTION
  // ──────────────────────────────────────────────────────────
  kpi_selection: {
    milestoneType: 'kpi_selection',

    arjunIntro: `You have confirmed the drop is real and formed a preliminary hypothesis. Now we need to read the KPI dashboard — but I want to teach you something about how good analysts read dashboards before you look at a single number. Most people look for the metric that is most broken. The best analysts look for the pattern across metrics — which ones moved together, which moved in opposite directions, and what the combinations imply about the mechanism.`,

    concepts: [
      {
        heading: 'Review dwell time increasing is a trust signal, not an engagement signal.',
        body: 'When users spend more time reading reviews, most PMs celebrate it as engagement. It is not. It means users do not trust the listing card enough to make a decision from it. They are compensating for weak surface-level signals by going deeper. If review dwell time for HVT users increased 140% — from 48 seconds to 192 seconds — that tells you the listing cards stopped communicating quality reliably. Something broke in how quality is surfaced.',
        analogy: 'When you trust a restaurant, you glance at the menu and order. When you do not trust it, you spend 20 minutes reading Zomato reviews first. MakeMyTrip users reading 4x more reviews means they stopped trusting what the cards tell them.',
      },
      {
        heading: 'Cohort CVR tells you who is affected. The combination tells you why.',
        body: 'If HVT CVR drops from 14.2% to 11.1% while DealSeeker CVR holds flat at 5.0%, the problem is not platform-wide — it is specific to high-intent, high-value users. That specificity is your most important clue. Ask: what is different about HVT users that would make them more sensitive to this change? What do they need from the platform that DealSeekers do not?',
      },
      {
        heading: 'The weighted average trap hides cohort-level failures.',
        body: 'Platform-wide CVR of 7.1% is a weighted average across 4 cohorts. If DealSeekers are 40% of DAU with 5% CVR and HVT are 13% with 11.1% CVR, the average masks the HVT collapse. Always decompose aggregates before concluding anything. A stable average can hide a dramatic failure in your most valuable cohort if that cohort is small enough.',
      },
    ],

    checkpointQuestion: 'HVT users now spend 192 seconds on reviews versus 48 seconds before. DealSeeker review dwell is stable. What is the most accurate interpretation?',

    options: [
      {
        id: 'a',
        text: 'HVT users are more engaged and finding reviews more useful',
        isCorrect: false,
        explanation: 'Increased review dwell in the context of declining CVR is not positive engagement — it is compensatory behavior. Users are reading more reviews because the listing card is not giving them what they need to decide. If review dwell correlated with higher CVR, that would support this interpretation. It does not.',
      },
      {
        id: 'b',
        text: 'HVT users no longer trust the listing card to communicate quality — they are compensating by reading reviews',
        isCorrect: true,
        explanation: 'Correct. This is the trust signal interpretation. HVT users previously trusted the surface-level signals — star rating, brand, photos — enough to decide quickly. Something changed that broke that trust. The most likely cause: ranking changes surfacing unfamiliar or lower-quality listings, forcing users to verify quality manually through reviews.',
      },
      {
        id: 'c',
        text: 'Review quality improved so users find them more valuable',
        isCorrect: false,
        explanation: 'Review quality improvement would affect all cohorts similarly. DealSeeker dwell is stable. A platform-wide review quality improvement would not produce a cohort-specific dwell increase.',
      },
      {
        id: 'd',
        text: 'HVT users are comparison shopping across more properties',
        isCorrect: false,
        explanation: 'Comparison shopping would increase listings viewed per session — which is also happening. But review dwell specifically indicates trust deficit, not just comparison. The two signals together (more listings viewed + more review dwell) indicate both choice overload and trust breakdown.',
      },
    ],

    openQuestion: {
      question: `You have access to 8 dimensions to explore: gender, listing category, price tier, platform tenure, device, geography, acquisition channel, and booking intent. You can only investigate 3 dimensions deeply before the CFO meeting. Which 3 do you prioritise and why? Walk through your reasoning explicitly.`,
      placeholder: `I would prioritise dimension 1 because...\nDimension 2 because...\nDimension 3 because...\nI would deprioritise X because...`,
      rubric: `A strong answer prioritises dimensions that are most likely to segment the problem given what is already known. The strongest answer prioritises: (1) platform tenure — because long-tenure users being most affected is the clearest signal of product degradation vs mix shift, (2) listing category — because homestay expansion happened and category is the direct proxy for that change, (3) price tier or booking intent — because revenue fell more than bookings, pointing to high-value users. Weak answers pick device or geography first without reasoning tied to the known signals.`,
      revealAfterAttempts: 2,
      correctAnswerReveal: `Strong prioritisation: (1) Platform tenure — long-tenure users are habitual, high-intent users. If they are dropping, something degraded for people who know the platform well. (2) Listing category — a major inventory change happened. Category is the most direct proxy. (3) Price tier or booking intent — revenue fell more than volume, meaning high-paying users are the signal. Device, gender, and geography are lower priority because they are unlikely to segment the problem cleanly given what we already know.`,
    },

    investigationNudge: `Good prioritisation. Now run the cohort CVR comparison query. When you see the results, do not just read the numbers — tell me which cohorts moved and which held stable, and what the pattern tells you about the mechanism. Is this affecting all users or specific ones?`,

    commitPrompt: 'Add a KPI finding to your case study. State which cohorts are degraded, which are stable, what the review dwell data tells you about user trust, and your leading hypothesis heading into funnel diagnosis.',

    commitDepthQuestion: 'You identified HVT as the most affected cohort. Is the HVT CVR drop a funnel problem — they are trying to book but failing — or a behavioral problem — they are not trying as hard as before? What data from the KPI dashboard distinguishes these two explanations?',
  },

  // ──────────────────────────────────────────────────────────
  // M3 — FUNNEL DIAGNOSIS
  // ──────────────────────────────────────────────────────────
  funnel_diagnosis: {
    milestoneType: 'funnel_diagnosis',

    arjunIntro: `Now we go into the funnel. But I want to change how you think about funnel stages. Most analysts describe a funnel stage as a drop-off number — "SERP to listing click fell from 79% to 68%." That tells me nothing useful. What I need to know is: what specific behavior changed at that stage? Are users scrolling without clicking? Clicking and going back? Spending more time on reviews? Opening Google Maps mid-session? Each of those is a different problem with a different fix.`,

    concepts: [
      {
        heading: 'Every funnel stage has micro-behaviors. The drop-off rate is just the headline.',
        body: 'At the search results page, a drop in SERP-to-click rate could mean: users are scrolling further before clicking (content not compelling at the top), clicking and immediately going back (listing does not match intent), or leaving the platform entirely. Scroll depth, time to first click, back-button rate, and external app opens are the micro-behaviors that reveal which mechanism is operating. A 1% improvement in time-to-first-click at the top of results is worth more than a 5% improvement in overall SERP engagement.',
        analogy: 'A doctor does not just note "patient has a fever." They measure when it started, how fast it rose, which part of the body is affected. The fever is the headline. The micro-behaviors are the diagnosis.',
      },
      {
        heading: 'Time to first click increasing from 8 to 23 seconds is a choice overload signal.',
        body: 'When HVT users clicked a result in 8 seconds previously, they were finding what they wanted at the top. At 23 seconds, they are scrolling through irrelevant options before finding something worth clicking. This is choice overload — not from too many options in the abstract, but from the wrong options appearing first. The ranking algorithm is surfacing listings that HVT users have to scroll past before finding relevant results.',
      },
      {
        heading: 'Payment abandonment after fee reveal is a distinct failure from search abandonment.',
        body: 'Deal Seeker payment abandonment rising from 14% to 22% is mechanistically separate from HVT SERP bounce. Deal Seekers are reaching payment — they found what they wanted and intended to book. The abandonment is triggered by a price mismatch: nightly rate shown on the listing card versus total price including resort fees at payment. This is a transparency problem, not a discovery problem. These require completely different fixes.',
      },
    ],

    checkpointQuestion: 'HVT scroll depth on the results page increased from 22% to 67% before first click. Time to first click went from 8 to 23 seconds. What is the most specific and accurate interpretation?',

    options: [
      {
        id: 'a',
        text: 'HVT users are more carefully evaluating options before committing',
        isCorrect: false,
        explanation: 'This is the optimistic interpretation. But in the context of declining CVR, more scrolling before clicking indicates friction — the right options are not appearing at the top of results. Careful evaluation would correlate with higher CVR. It does not.',
      },
      {
        id: 'b',
        text: 'The ranking algorithm is surfacing irrelevant listings at the top of HVT results — users must scroll past them to find relevant options',
        isCorrect: true,
        explanation: 'Correct. When scroll depth increases from 22% to 67% alongside time-to-click tripling, the most direct interpretation is that the content at the top of the page stopped being relevant. HVT users are having to scroll further to find properties that match their intent. This is consistent with the homestay expansion — budget and homestay listings now dominate top results due to CTR-weighted ranking.',
      },
      {
        id: 'c',
        text: 'HVT users are comparing more options before deciding — healthy behavior',
        isCorrect: false,
        explanation: 'Comparison shopping would increase listings viewed per session. But the specific combination of high scroll depth AND low time-to-first-click-to-booking suggests friction, not healthy comparison. If users were comparing and finding good options, CVR would not drop.',
      },
      {
        id: 'd',
        text: 'The results page has a UX bug causing slow loading',
        isCorrect: false,
        explanation: 'A loading bug would affect all cohorts similarly. DealSeeker and Explorer behavior is largely stable. Cohort-specific scroll depth increase is a content relevance signal, not a technical performance signal.',
      },
    ],

    openQuestion: {
      question: `Walk me through the funnel stage by stage for the HVT cohort. At each stage — search, results page, listing detail, payment — tell me: what specific micro-behavior would you look at, and what pattern would indicate a problem versus healthy behavior?`,
      placeholder: `Search stage: I would look at... A problem would look like... Healthy would look like...\nResults page: ...\nListing detail: ...\nPayment: ...`,
      rubric: `A strong answer goes beyond drop-off rates to name specific micro-behaviors at each stage. Search: query completion rate, search suggestion usage, landmark resolution rate. Results: scroll depth, time to first click, SERP bounce, filters applied. Detail: back-button rate, review dwell time, photo time, external map opens. Payment: abandonment rate, fee-reveal abandonment specifically. A weak answer describes stages as "conversion rate at X" without naming the micro-behaviors.`,
      revealAfterAttempts: 2,
      correctAnswerReveal: `Stage-by-stage for HVT: Search — look at premium keyword interpretation rate (did "luxury beachfront" return luxury results?), currently 61%→29%. Results — scroll depth (22%→67%), time to first click (8s→23s), SERP bounce (19%→34%), filters applied (2.1→0.3 because premium filters were removed). Listing detail — back-button rate (38%→61%), review dwell (48s→192s), amenity section time (4s→14s). Payment — relatively healthy for HVT (8%→9%). The funnel breaks at results and listing detail — discovery and trust, not payment.`,
    },

    investigationNudge: `Run the SERP behavior query and the listing detail behavior query. Before you look at the results, write your prediction: if choice overload is the primary driver, what specific numbers would you expect to see at the results stage versus the detail stage?`,

    commitPrompt: 'Add a funnel finding to your case study. Name the specific funnel stages where the problem is concentrated for each cohort, the micro-behaviors that reveal the mechanism, and how these map to your hypothesis about root causes.',

    commitDepthQuestion: 'You identified SERP behavior as the main breakdown point for HVT. But deal seeker abandonment is at payment — a completely different stage. What does it mean for your solution design that two cohorts are breaking at completely different funnel stages? Does that change how you prioritise fixes?',
  },

  // ──────────────────────────────────────────────────────────
  // M4 — ROOT CAUSE
  // ──────────────────────────────────────────────────────────
  root_cause: {
    milestoneType: 'root_cause',

    arjunIntro: `This is the hardest milestone. You have found patterns in the funnel. Now you need to identify the mechanisms — the actual causes. I want to tell you something upfront: this case has four root causes, not one. A junior analyst finds the most obvious one and stops. A senior analyst finds all four, sizes their contribution, and does not stop until the causes add up to approximately 100% of the drop. If your causes explain 60%, you have missed 40% of the story.`,

    concepts: [
      {
        heading: 'Multiple simultaneous causes require sizing, not just naming.',
        body: 'When a metric drops due to four concurrent causes, you cannot prioritise solutions without knowing each cause\'s contribution. Cause A contributing 35% of the drop deserves more engineering effort than Cause D contributing 15% — even if Cause D is easier to fix. The sizing formula: Contribution % = (Cohort DAU share × CVR drop × Average Booking Value) ÷ Total revenue drop. Run this for each cause before recommending anything.',
      },
      {
        heading: 'The four causes in this case are mechanistically distinct.',
        body: 'Choice overload (Cause 1) breaks at the results page — users cannot find relevant options. Review fatigue (Cause 2) breaks at the detail page — users cannot trust listing cards. HVT package shift (Cause 3) is behavioral — users have not left the platform, they are booking differently. Visa uncertainty (Cause 4) breaks before the funnel even starts — users explore but never intend to book. Each requires a different intervention at a different point in the journey.',
        analogy: 'A hospital with falling patient satisfaction might be failing for four reasons: long wait times, poor doctor communication, bad food, and confusing discharge paperwork. Each needs a different department to fix. Knowing all four — and their relative weight — is what separates a good operations analyst from a great one.',
      },
      {
        heading: 'Behavioral shifts are not product failures — but they still require product responses.',
        body: 'HVT users shifting toward packages and international travel is not a product failure — it is user behavior evolving. But if the platform does not evolve with it, those users will complete the package booking on a competitor. A behavioral shift is an opportunity disguised as a problem. The right response is not to fix what broke but to build what is missing.',
      },
    ],

    checkpointQuestion: 'You have identified that HVT CVR dropped from 14.2% to 11.1% (a 3.1pp drop). HVT users are 13% of current DAU. Average booking value is $601. Total revenue drop is $4.1M/day. What percentage of the revenue drop does HVT CVR decline explain?',

    options: [
      {
        id: 'a',
        text: 'Approximately 25% of the revenue drop',
        isCorrect: false,
        explanation: 'Check your arithmetic. HVT contribution = 13% DAU share × 3.1pp CVR drop × $601 ABV. Compare to total revenue drop to get contribution percentage.',
      },
      {
        id: 'b',
        text: 'Approximately 52% of the revenue drop',
        isCorrect: true,
        explanation: 'Correct. HVT: 13% × 3.1pp × $601 = ~$24.19 per 100 DAU. At 11.5M DAU that is approximately $2.78M/day impact from HVT CVR drop alone — approximately 52% of the $4.1M daily revenue drop. This is why HVT is P0 despite being only 13% of DAU.',
      },
      {
        id: 'c',
        text: 'Approximately 13% of the revenue drop — proportional to their DAU share',
        isCorrect: false,
        explanation: 'Revenue contribution is not proportional to DAU share — it is proportional to DAU share × CVR × ABV. HVT has 3x the ABV of DealSeekers, so a 3.1pp CVR drop for HVT has dramatically more revenue impact than the same drop for DealSeekers.',
      },
      {
        id: 'd',
        text: 'Cannot calculate without knowing total DAU',
        isCorrect: false,
        explanation: 'You can calculate proportional contribution without knowing absolute DAU. Use relative shares and the revenue impact formula.',
      },
    ],

    openQuestion: {
      question: `State all four root causes in your own words. For each one: name the mechanism, name the cohort most affected, identify the funnel stage where it breaks, and give your estimate of its contribution to the total drop. Your four contributions should sum to approximately 100%.`,
      placeholder: `Cause 1: [mechanism] — affects [cohort] — breaks at [funnel stage] — contribution ~X%\nCause 2: ...\nCause 3: ...\nCause 4: ...\nTotal: ~100%`,
      rubric: `A strong answer names all four causes with specific mechanisms — not vague descriptions. Choice overload: ranking algorithm surfacing budget/homestay listings to HVT users, removing relevant options from top of results, causing scroll depth increase and SERP bounce. Review fatigue: listing cards failing to surface quality signals, forcing users into compensatory review reading, increasing dwell and reducing decision confidence. HVT package shift: behavioral migration to bundled products, not a product failure but a product gap. Visa uncertainty: international search sessions ending without booking intent due to visa approval anxiety. Contribution estimates: 35%, 28%, 22%, 15% approximately.`,
      revealAfterAttempts: 2,
      correctAnswerReveal: `The four root causes: (1) Choice overload from homestay expansion — ~35% of drop. The ranking algorithm update (Week 5) gave higher weight to CTR signals. Homestays with high browse volume now rank above premium hotels for HVT searches. HVT users scroll 3x further before clicking, SERP bounce up 15pp. (2) Review fatigue and decision paralysis — ~28% of drop. Premium filter removal (Week 6) eliminated the shortcut HVT users used to filter quality. They now compensate by reading reviews 4x longer. Review dwell increase is a trust deficit signal. (3) HVT behavioral shift to packages — ~22% of drop. Package page visits up 2.8x for HVT. These users have not left — they are booking differently. The platform has not surfaced packages prominently in their journey. (4) Visa uncertainty on international travel — ~15% of drop. International search CVR dropped 9.1% to 5.2%. Visa concern exits increased 3.1x. Users explore destinations but delay booking until visa is confirmed.`,
    },

    investigationNudge: `Run the root cause contribution query. Before you look at the waterfall output, I want you to write down what you expect each cause to contribute as a percentage. Then compare your prediction to the data. Where were you surprised?`,

    commitPrompt: 'Write your root cause finding. Name all four causes with their mechanisms, affected cohorts, funnel stage of failure, and contribution percentages. Show that your contributions sum to approximately 100%.',

    commitDepthQuestion: 'You have four root causes. Three are product or supply failures. One — the HVT package shift — is a behavioral evolution. How does that distinction change your recommendation? Should you fix the behavioral shift or adapt to it?',
  },

  // ──────────────────────────────────────────────────────────
  // M5 — IMPACT SIZING
  // ──────────────────────────────────────────────────────────
  impact_sizing: {
    milestoneType: 'impact_sizing',

    arjunIntro: `You have found four root causes. Now the CFO is going to ask you one question before she agrees to fund any of your solutions: how much is this costing us per day, and what is the recovery potential for each fix? Impact sizing is not about being precise — precision is impossible here. It is about being credible. A number with stated assumptions and a bounded range is worth ten times a precise-sounding number with no methodology behind it.`,

    concepts: [
      {
        heading: 'Size each cause separately before summing.',
        body: 'Total revenue impact = Sum of (Cohort DAU share × CVR drop × ABV × total DAU) for each cause. Do not size the total drop first and then allocate — this introduces correlation errors. Size each cause independently using its affected cohort, the CVR drop attributable to that cause, and that cohort\'s average booking value. Then check: do the causes sum to the observed total? If they sum to 60%, you have either missed a cause or double-counted.',
      },
      {
        heading: 'Recovery projection is different from loss calculation.',
        body: 'Loss = revenue not earned during the problem period. Recovery = additional revenue per day if the fix works. These are different numbers used by different stakeholders. The CFO wants the loss — it justifies emergency priority. The Head of Product wants the recovery rate — it determines which fix to ship first. For each solution, estimate: what percentage of the CVR drop does this fix address, and how quickly will the recovery compound?',
        analogy: 'A leaking pipe costs you $200/day in water. Fixing the leak stops the $200/day loss — that is the recovery. The water already lost is a sunk cost. The CFO cares about the $200/day going forward, not the water already in the drain.',
      },
      {
        heading: 'State assumptions before presenting numbers.',
        body: 'Every impact estimate rests on assumptions. "I assumed HVT DAU share returns to 15% within 4 weeks of fixing ranking" is an assumption — state it. "I assumed 60% of the CVR recovery materialises within the first experiment wave" is an assumption — state it. A stakeholder who challenges your number will respect you more if you anticipated the challenge and bounded your estimate with explicit assumptions.',
      },
    ],

    checkpointQuestion: 'Cause 1 (choice overload) affects HVT users — 13% of DAU, CVR dropped 3.1pp from ranking changes. ABV is $601. Daily DAU is 11.5M. What is the daily revenue impact of Cause 1?',

    options: [
      {
        id: 'a',
        text: 'Approximately $1.2M/day',
        isCorrect: false,
        explanation: 'Check the arithmetic: 13% × 11.5M = 1.495M HVT users. 3.1% × 1.495M = 46,345 lost bookings/day. But Cause 1 is approximately 35% of HVT\'s CVR drop. Recalculate with the cause-specific CVR impact.',
      },
      {
        id: 'b',
        text: 'Approximately $760K/day',
        isCorrect: true,
        explanation: 'Correct. HVT DAU: 13% × 11.5M = 1.495M. Cause 1 drives ~35% of the 3.1pp HVT CVR drop = 1.085pp. Lost bookings: 1.085% × 1.495M = 16,220/day. Revenue: 16,220 × $601 = approximately $760K/day. Multiply by 60 days = approximately $45.6M total loss from this cause alone.',
      },
      {
        id: 'c',
        text: 'Approximately $2.1M/day',
        isCorrect: false,
        explanation: 'This would be the total HVT revenue impact across all causes — not the Cause 1 specific impact. Each cause needs to be sized with its specific contribution to the CVR drop.',
      },
      {
        id: 'd',
        text: 'Cannot calculate — need booking value by cause, not overall ABV',
        isCorrect: false,
        explanation: 'Using overall HVT ABV is a reasonable approximation. The causes affect the same users, so the ABV is consistent. You can use overall HVT ABV with the cause-specific CVR delta.',
      },
    ],

    openQuestion: {
      question: `Size all four root causes. For each one, calculate: daily revenue impact, 60-day total loss, and estimated daily recovery if the fix works. Then rank the four solutions by recovery ROI — recovery per week of engineering effort. Show your working.`,
      placeholder: `Cause 1: Daily impact = ... 60-day loss = ... Recovery = ... ROI rank = ...\nCause 2: ...\nCause 3: ...\nCause 4: ...\nMy recommendation for which to fix first:`,
      rubric: `A strong answer sizes all four causes using consistent methodology, shows arithmetic, states assumptions explicitly, and produces a priority ranking based on recovery per engineering week. The ranking should reflect both impact and implementation speed. Ranking/UX fix (Cause 1) and review surface fix (Cause 2) should rank P0 because they have high impact and relatively fast implementation. Package surfacing (Cause 3) is P1. Visa confidence layer (Cause 4) is P1-P2 depending on engineering capacity. A weak answer sizes only one or two causes or ranks without showing the sizing math.`,
      revealAfterAttempts: 2,
      correctAnswerReveal: `Sizing: Cause 1 (choice overload): ~$760K/day, ~$45.6M over 60 days, recovery ~$600K/day. Cause 2 (review fatigue): ~$590K/day, ~$35.4M over 60 days, recovery ~$480K/day. Cause 3 (HVT package shift): ~$460K/day, ~$27.6M over 60 days, recovery ~$300K/day (partial — behavioral). Cause 4 (visa uncertainty): ~$290K/day, ~$17.4M over 60 days, recovery ~$200K/day. Total: ~$2.1M/day, ~$126M over 60 days. Priority: Cause 1 (fastest to ship, highest impact), Cause 2 (fast, high impact), Cause 3 (medium effort, behavioral), Cause 4 (complex, new feature).`,
    },

    investigationNudge: `Run the revenue loss by cause query and the recovery projection query. When you see the waterfall output, check whether your pre-calculated estimates were in the right range. Where were you off, and why?`,

    commitPrompt: 'Write your impact finding. Show daily revenue loss per cause, 60-day total, and recovery projection per fix. State your top two assumptions explicitly.',

    commitDepthQuestion: 'Your sizing shows Cause 1 has the highest daily impact at $760K/day. But Cause 3 — HVT behavioral shift to packages — suggests users are not broken, just evolving. If you fix Cause 1 and 2 but not Cause 3, what happens to HVT over the next 6 months?',
  },

  // ──────────────────────────────────────────────────────────
  // M6 — SOLUTION DESIGN
  // ──────────────────────────────────────────────────────────
  solution_design: {
    milestoneType: 'solution_design',

    arjunIntro: `You have sized the impact. Now design the solutions. I have one rule for this milestone: every solution must map to exactly one root cause. If your solution says "improve the user experience," I will send it back. If it says "restore segment-aware ranking for HVT searches to reduce budget listing share in top-5 results from 41% back to below 20%," we can talk. Specificity is not pedantry — it is what makes the difference between a solution that gets funded and one that gets filed.`,

    concepts: [
      {
        heading: 'Every solution needs a rollback plan before it gets shipped.',
        body: 'Before proposing any fix, ask: if this makes things worse, how quickly can we undo it? A ranking change that harms DealSeeker CVR while helping HVT needs to be detectable within 48 hours and reversible within hours. Define your rollback trigger before the experiment starts — not after you see bad numbers. A solution without a rollback plan is a bet, not an engineering decision.',
      },
      {
        heading: 'Define the success metric before you design the solution.',
        body: 'How will you know the ranking fix worked? "HVT CVR goes back up" is not specific enough. "HVT SERP-to-click rate returns to within 5pp of baseline within 14 days of deployment, with no more than 2pp decline in DealSeeker CVR" is specific enough. Without pre-committed success thresholds, teams declare victory too early or hold on too long. The metric, the target, and the timeframe must all be defined before the first line of code is written.',
      },
      {
        heading: 'Behavioral shifts need product expansion, not product fixes.',
        body: 'The HVT package shift cannot be fixed — it can only be served. Users are moving toward bundled travel products. The solution is not to bring them back to standalone hotel booking; it is to make MakeMyTrip the best place to complete the bundled booking they already want to do. Surface packages earlier in the HVT journey, personalise package recommendations, and measure success by total booking value per HVT session — not just hotel CVR.',
      },
    ],

    checkpointQuestion: 'You propose restoring premium filters to the search results page. What is the most important guardrail metric to monitor during the experiment?',

    options: [
      {
        id: 'a',
        text: 'Overall platform CVR',
        isCorrect: false,
        explanation: 'Overall CVR is too aggregated — it would take weeks to show a statistically significant signal for a cohort-specific fix. You need the primary metric to be cohort-specific.',
      },
      {
        id: 'b',
        text: 'HVT CVR as primary metric, DealSeeker CVR as guardrail',
        isCorrect: true,
        explanation: 'Correct. The fix targets HVT — so HVT CVR is the primary metric. DealSeeker CVR is the guardrail: if premium filter restoration causes DealSeekers to see fewer budget options and their CVR drops, that is a negative side effect that must be detected and trigger a rollback. Guardrail metrics protect the users you are not trying to help.',
      },
      {
        id: 'c',
        text: 'Time to first click on the results page',
        isCorrect: false,
        explanation: 'Time to first click is a good leading indicator — if it improves, CVR will likely follow. But it is a leading indicator, not a success metric. The success metric must be directly tied to the business outcome you are trying to move.',
      },
      {
        id: 'd',
        text: 'Budget listing impressions',
        isCorrect: false,
        explanation: 'Budget listing impressions would decrease if premium filters are restored — but this is an output of the fix, not a measure of success. Measuring the mechanism rather than the outcome is a common experiment design error.',
      },
    ],

    openQuestion: {
      question: `Design solutions for all four root causes. For each solution write: (1) what specifically changes in the product, (2) primary success metric with target and timeframe, (3) guardrail metric, (4) rollback trigger, (5) estimated engineering effort in weeks.`,
      placeholder: `Solution 1 (Choice overload):\n  Product change: ...\n  Primary metric: ... target ... within ...\n  Guardrail: ...\n  Rollback trigger: ...\n  Engineering effort: ...\n\nSolution 2: ...\nSolution 3: ...\nSolution 4: ...`,
      rubric: `A strong answer designs four distinct solutions, each tied to one cause. Solution 1: segment-aware ranking restoring premium/luxury listings to top-5 for HVT searches, target HVT SERP-to-click recovery to within 5pp of baseline in 14 days. Solution 2: AI review summary on listing cards showing top 3 pros/cons and cleanliness/location scores, target HVT review dwell returning to under 90 seconds. Solution 3: package surfacing for HVT — personalised package recommendations on search results and listing detail pages, target HVT total session booking value. Solution 4: visa confidence layer — eligibility, timeline, protection guarantee — target international search-to-booking CVR. A weak answer designs one or two vague solutions without specific metrics.`,
      revealAfterAttempts: 2,
      correctAnswerReveal: `Solution 1 — Intent-aware ranking: Restore segment-aware ranking logic. HVT searches surface premium/luxury/boutique in top 5. Budget/homestay listings ranked by segment affinity, not global CTR. Primary metric: HVT SERP-to-click rate back above 75% in 14 days. Guardrail: DealSeeker CVR must not drop more than 1pp. Rollback: if DealSeeker CVR drops 2pp in 48 hours. Effort: 3 weeks. Solution 2 — AI review summary: ML-generated 3-bullet summary on listing cards (top pros, cleanliness score, location score). Primary metric: HVT review dwell under 90 seconds. Guardrail: listing detail page bounce must not increase. Effort: 5 weeks. Solution 3 — Package surfacing: Personalised package shelf on HVT search results. Primary metric: HVT total booking value per session. Guardrail: hotel standalone CVR must not drop. Effort: 6 weeks. Solution 4 — Visa confidence layer: Visa eligibility widget, document checklist, refund guarantee. Primary metric: international search-to-booking CVR back above 7%. Guardrail: customer support ticket volume. Effort: 8 weeks.`,
    },

    investigationNudge: `Write out your four solutions. For each one, I will challenge you on one thing: what is the biggest risk of this solution, and what would make you roll it back immediately?`,

    commitPrompt: 'Write your solution recommendation. For each of the four solutions include what changes, the primary metric with target, the guardrail, and the rollback trigger. Prioritise them by recovery ROI.',

    commitDepthQuestion: 'Your four solutions require 3, 5, 6, and 8 weeks of engineering respectively. The CEO wants something shipped in 2 weeks. What do you do? Is there an interim solution that does not require full engineering effort but stops the bleeding faster?',
  },

  // ──────────────────────────────────────────────────────────
  // M7 — STAKEHOLDER REVIEW
  // ──────────────────────────────────────────────────────────
  stakeholder_review: {
    milestoneType: 'stakeholder_review',

    arjunIntro: `You have done the analysis. Now you defend it in front of three stakeholders who all have different concerns, different incentives, and different ways of challenging you. The CFO wants to know how much this cost and whether your solutions are worth the investment. The Head of Product will challenge whether your solutions are specific enough to build. The Head of Growth will challenge whether you have correctly diagnosed the DAU mix shift. Each of them is doing their job. Your job is to answer them with data, not with authority.`,

    concepts: [
      {
        heading: 'Prepare for the three hardest questions before you walk into the room.',
        body: 'Every stakeholder review has three predictable challenge types: methodology challenge ("how do you know this is causal and not correlation?"), assumption challenge ("what if your sizing is wrong by 2x?"), and recommendation challenge ("what is the downside risk of this solution?"). Prepare your answers to all three before the meeting. An analyst who answers these without hesitation is trusted with the next investigation.',
      },
      {
        heading: 'The Growth Lead will challenge your mix shift diagnosis.',
        body: 'Priya Nair runs Growth. She will argue that DAU growth is healthy and the Bookings/DAU decline is expected — new users always convert lower. Your response needs to be specific: "New user dilution explains approximately 40% of the drop. The remaining 60% is long-tenure, high-intent user CVR declining — and that is not expected from mix shift alone. Here is the cohort-level data." The distinction matters because the solutions are different.',
        analogy: 'If a restaurant\'s average spend per table drops, it could be because more tables are occupied by coffee drinkers versus dinner guests (mix shift), or because dinner guests are ordering fewer courses (behavioural change). The fix for mix shift is different from the fix for ordering behaviour. Priya will argue it is mix shift. You need to show it is both.',
      },
      {
        heading: 'Defend the finding, not your ego.',
        body: 'When a stakeholder challenges your conclusion, your job is to either show data that supports it, or update your view based on information they provide. If Rohan says "we shipped the ranking change 6 weeks ago and tested it on 5% traffic with no CVR impact," that is new information that should update your hypothesis. Do not defend your analysis because you worked hard on it. The investigation is in service of the business decision, not the analyst.',
      },
    ],

    checkpointQuestion: 'The Head of Growth says: "Bookings/DAU decline is expected. We acquired 1.5M new users last quarter, all lower LTV. The metric will recover naturally as they mature." What is the correct response?',

    options: [
      {
        id: 'a',
        text: 'Agree — mix shift from new user acquisition is the primary driver and will self-correct',
        isCorrect: false,
        explanation: 'Mix shift is a real contributor — approximately 40% of the drop. But long-tenure user CVR is also declining, which does not self-correct. Agreeing entirely concedes the investigation findings without data.',
      },
      {
        id: 'b',
        text: 'Acknowledge the mix shift contribution, show the long-tenure CVR data, and quantify how much of the drop each explains',
        isCorrect: true,
        explanation: 'Correct. "You are right that new user dilution contributes to the decline — we estimate approximately 40% of the drop. But long-tenure users (180d+) show CVR declining from 12.1% to 9.4% — these are your habitual, highest-LTV users. That decline does not self-correct with user maturation. Here is the cohort data." This acknowledges the valid point while defending the finding with specificity.',
      },
      {
        id: 'c',
        text: 'Push back firmly — mix shift is not the explanation because DAU growth does not cause CVR decline',
        isCorrect: false,
        explanation: 'Mix shift absolutely can cause CVR decline — this is the weighted average trap. Pushing back without acknowledging the valid point damages credibility. The correct move is to acknowledge mix shift as a real contributor while showing it is not sufficient to explain the full drop.',
      },
      {
        id: 'd',
        text: 'Ask the Growth team to share their LTV projections for the new cohort before responding',
        isCorrect: false,
        explanation: 'Asking for more data before responding is deflection, not analysis. You have the data needed to respond. Use it.',
      },
    ],

    openQuestion: {
      question: `Write your two-sentence executive summary for the CEO. It must be clear enough that someone who has not read the analysis can understand the situation in 15 seconds. No jargon. No hedging. Specific numbers.`,
      placeholder: `Executive summary: ...`,
      rubric: `A strong two-sentence summary: sentence 1 states what happened and the magnitude with specific numbers. Sentence 2 states the cause and the recommended action. Example structure: "Metric X declined Y% due to [specific causes], costing approximately $Z in revenue. We are fixing this by [specific actions] with expected recovery of W% within N weeks." No passive voice. No qualifications. No jargon like "user journey optimisation."`,
      revealAfterAttempts: 2,
      correctAnswerReveal: `Strong executive summary: "MakeMyTrip's Bookings per DAU declined 13% over 60 days driven by four compounding causes — ranking changes surfacing irrelevant listings to high-value users, review information gaps causing decision paralysis, high-value travellers shifting to packages the platform does not yet surface, and visa uncertainty blocking international bookings — costing approximately $2.1M per day in lost revenue. We are shipping segment-aware ranking and AI review summaries within 3 weeks to recover approximately $1.3M/day, followed by package surfacing and a visa confidence layer to address the remaining causes."`,
    },

    investigationNudge: `Three stakeholders are ready. Kavita (CFO) will challenge your revenue sizing. Rohan (Head of Product) will challenge your solution specificity. Priya (Growth) will challenge your mix shift diagnosis. Answer each one using only data from your investigation board.`,

    commitPrompt: 'Write your final case study summary. Three sentences maximum: what was the problem, what caused it (with contribution percentages), and what you are recommending in priority order.',

    commitDepthQuestion: 'Rohan asks: "Your ranking fix will take 3 weeks. In the meantime we are losing $760K per day from Cause 1 alone. Is there anything we can ship in 48 hours that stops the bleeding faster?" What is your answer?',
  },
};

export function getMMTBookingsTeachingContent(
  milestoneType: string
): MilestoneTeachingContent | null {
  return MMT_BOOKINGS_TEACHING_CONTENT[milestoneType] ?? null;
}
