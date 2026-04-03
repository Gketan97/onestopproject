// ============================================================
// MILESTONE TEACHING CONTENT
// Static, authored content for all 7 milestones.
// Arjun's voice throughout. Max 3 concepts per milestone.
// This is the "UpGrad layer" — teach before investigate.
// ============================================================

import type { MilestoneTeachingContent } from '@/types';

export const MILESTONE_TEACHING_CONTENT: Record<string, MilestoneTeachingContent> = {

  // ──────────────────────────────────────────────────────────
  // M1 — PROBLEM SCOPING
  // ──────────────────────────────────────────────────────────
  problem_scoping: {
    milestoneType: 'problem_scoping',

    arjunIntro: `Before we touch any data, I want to show you something. The single most expensive mistake analysts make is jumping straight into SQL without first understanding what the metric actually means. Let me show you why "Revenue per Booking declined 18%" is not a problem statement — it's a symptom. A good analyst knows the difference.`,

    concepts: [
      {
        heading: 'A metric is a fraction. Fractions can move three ways.',
        body: 'RPB = Revenue ÷ Bookings. That means RPB can decline because revenue fell, because bookings rose, or because both moved in opposite directions. Each of these has a completely different root cause and fix. If you confuse them, you will investigate the wrong thing.',
        analogy: 'If your salary-per-hour drops, it could mean your salary fell, you worked more hours, or both. You would not know which to fix without checking both numbers first.',
      },
      {
        heading: 'Traffic growing while RPB falls is a specific signal.',
        body: 'We know traffic grew 12%. That tells us this is not a demand problem — people are coming. The problem is somewhere between arrival and completed booking. This eliminates one class of explanations before we run a single query.',
        analogy: 'A restaurant with more customers but lower revenue per table is not failing to attract people — something is happening at the table.',
      },
      {
        heading: 'Define the metric before you measure it.',
        body: 'RPB can be calculated as net revenue per booking, gross booking value per booking, or platform commission per booking. These give different numbers. Before investigating, you must confirm which definition your company uses — otherwise your numbers will not match the CFO\'s numbers in the board meeting.',
      },
    ],

    checkpointQuestion: 'Traffic grew 12% and RPB declined 18%. Which explanation can we eliminate right now, before running any query?',

    options: [
      {
        id: 'a',
        text: 'Users are not visiting the platform',
        isCorrect: true,
        explanation: 'Correct. Traffic grew 12% — so demand and visits are up. We can eliminate any explanation that requires fewer users coming to the platform.',
      },
      {
        id: 'b',
        text: 'The checkout flow might be broken',
        isCorrect: false,
        explanation: 'We cannot eliminate this yet. A broken checkout could cause users to abandon, reducing bookings and therefore RPB. We need data to rule this out.',
      },
      {
        id: 'c',
        text: 'Commission rates were renegotiated lower',
        isCorrect: false,
        explanation: 'We cannot eliminate this yet. Lower commission rates would reduce revenue per booking without affecting traffic. This is still a live hypothesis.',
      },
      {
        id: 'd',
        text: 'Cheaper hotels are converting at higher rates',
        isCorrect: false,
        explanation: 'We cannot eliminate this yet. A mix shift toward cheaper hotels would lower average RPB even if everything else is working. This needs data.',
      },
    ],

    investigationNudge: `Good — you understand what the metric is measuring. Now let's see what the data actually shows. Run the revenue trend query first. Before you look at the results, tell me: what do you expect to see if RPB is genuinely declining versus if bookings are just growing faster than revenue?`,

    commitPrompt: 'Write your problem statement for the Investigation Board. It must include: the specific metric declining, the time window, what is NOT the cause based on what we know, and what remains unknown.',

    commitDepthQuestion: 'You wrote a finding, but I want to push you. You said RPB declined — but what exactly does that mean for the business? Is it that fewer high-value bookings completed, or that the same bookings are generating less revenue? How does the data distinguish between these?',
  },

  // ──────────────────────────────────────────────────────────
  // M2 — KPI SELECTION
  // ──────────────────────────────────────────────────────────
  kpi_selection: {
    milestoneType: 'kpi_selection',

    arjunIntro: `You have scoped the problem. Now we need to read the health of the business across multiple dimensions before we start slicing. Most analysts make a mistake here — they look at the KPI that matches their hypothesis and ignore the ones that don't. That is confirmation bias. Let me show you how to read a KPI dashboard like an investigator, not a storyteller.`,

    concepts: [
      {
        heading: 'Leading indicators move before the outcome. Lagging indicators move after.',
        body: 'Session-to-search rate tells you if users are engaging. Attempt-to-booking rate tells you if they are converting. Revenue per booking tells you how much you made. The first two are leading indicators — if they fall, RPB will fall soon. RPB itself is a lagging indicator. Always find the leading indicators first.',
        analogy: 'A fever is a lagging indicator — it tells you something already went wrong. A sore throat is a leading indicator — it comes first. Doctors treat the infection, not the fever.',
      },
      {
        heading: 'A healthy KPI can still hide a problem.',
        body: 'If supplier success rate is 96%, that sounds healthy. But if it was 98% three months ago, that 2pp drop at scale could matter. Always compare KPIs to their baseline, not to an abstract threshold. The question is not "is this number good" — it is "has this number changed?"',
      },
      {
        heading: 'Stable KPIs are evidence, not absence of information.',
        body: 'When you see a KPI that has not moved, that is data. It tells you the problem is not in that part of the funnel. Stable supplier success rate eliminates supplier failures as the root cause. Treat stability as a clue, not a non-finding.',
      },
    ],

    checkpointQuestion: 'You see that session-to-search rate is stable, but attempt-to-booking rate dropped sharply. What does this tell you about where the problem is?',

    options: [
      {
        id: 'a',
        text: 'The problem is happening after users view hotels but before they complete booking',
        isCorrect: true,
        explanation: 'Correct. Users are reaching the platform and searching normally. The drop happens when they try to book — which narrows the investigation to the checkout flow specifically.',
      },
      {
        id: 'b',
        text: 'The problem is in how users discover the platform',
        isCorrect: false,
        explanation: 'No — session-to-search rate is stable, which means users who arrive are engaging normally. The discovery and search experience is not the problem.',
      },
      {
        id: 'c',
        text: 'The problem is with supplier inventory availability',
        isCorrect: false,
        explanation: 'Possibly, but we cannot conclude this yet. A stable session-to-search rate tells us nothing about supplier inventory. We need the supplier data to say this.',
      },
      {
        id: 'd',
        text: 'We cannot tell anything without more data',
        isCorrect: false,
        explanation: 'We can tell quite a lot. The stable upstream metrics + dropping downstream metric points clearly to the checkout stage. Not knowing everything is different from knowing nothing.',
      },
    ],

    investigationNudge: `Run the KPI snapshot query. When you see the results, I want you to do one thing before you type anything: rank the KPIs from most changed to least changed. Which one has moved the most? That is where your investigation should focus next.`,

    commitPrompt: 'Add a finding to the board. State which KPIs are healthy, which are degraded, and what the degraded KPIs tell you about where in the funnel the problem lives.',

    commitDepthQuestion: 'You listed some KPIs as degraded. But I want you to go deeper — are these degraded KPIs causes or symptoms? For example, if attempt-to-booking rate fell, is that causing RPB to fall, or is something else causing both of them to fall?',
  },

  // ──────────────────────────────────────────────────────────
  // M3 — FUNNEL DIAGNOSIS
  // ──────────────────────────────────────────────────────────
  funnel_diagnosis: {
    milestoneType: 'funnel_diagnosis',

    arjunIntro: `We know the problem is in the funnel somewhere. Now we need to find the exact stage — and more importantly, when it started. These are two separate questions and most analysts conflate them. Let me show you why "when" is often more important than "where."`,

    concepts: [
      {
        heading: 'The funnel is a chain. The weakest link determines throughput.',
        body: 'Sessions → Searches → Views → Attempts → Bookings. Each stage has a conversion rate. The stage with the biggest drop from baseline is your investigation target — not the lowest absolute number. A stage that converts 40% normally but now converts 20% is the problem, even if another stage converts only 30%.',
      },
      {
        heading: 'A step-change in Week 16 means an event, not a trend.',
        body: 'If a metric declines gradually over months, it suggests a structural shift — changing user behavior, increasing competition, seasonal patterns. If it drops suddenly in a specific week, it suggests an event — a deployment, a policy change, a bug. These require completely different investigations.',
        analogy: 'If your car\'s fuel efficiency drops 1% per month, that\'s wear and tear. If it drops 30% overnight, that\'s a leak. You would not treat these the same way.',
      },
      {
        heading: 'Segment the drop before you explain it.',
        body: 'If checkout attempts dropped 30%, the next question is: for which users? Domestic or international? Mobile or desktop? New or returning? A drop concentrated in one segment tells you far more than an overall average. Averages hide stories.',
      },
    ],

    checkpointQuestion: 'You see that view-to-attempt rate is 72% (baseline 71%) but attempt-to-booking rate dropped from 65% to 38%. What is the correct conclusion?',

    options: [
      {
        id: 'a',
        text: 'The problem is in the checkout flow — users are attempting but not completing',
        isCorrect: true,
        explanation: 'Correct. View-to-attempt is essentially unchanged — users are clicking through to checkout normally. The collapse is specifically in attempt-to-booking, which means something in the checkout experience is causing abandonment.',
      },
      {
        id: 'b',
        text: 'The problem is that fewer users are viewing hotels',
        isCorrect: false,
        explanation: 'No. View-to-attempt held at 72%, which means hotel views are converting to checkout attempts at the same rate as before. The hotel detail page is not the problem.',
      },
      {
        id: 'c',
        text: 'Both stages are equally problematic',
        isCorrect: false,
        explanation: 'No. A 1pp change in view-to-attempt is noise. A 27pp collapse in attempt-to-booking is a signal. Treating them equally would waste investigation time.',
      },
      {
        id: 'd',
        text: 'We need more data before concluding anything',
        isCorrect: false,
        explanation: 'The data is clear enough to direct the investigation. Waiting for more data when you already have a strong signal is a form of analysis paralysis.',
      },
    ],

    investigationNudge: `Run the funnel weekly trend query. When you see it, I want you to identify two things: the exact week the drop started, and whether it was gradual or sudden. Write those two observations before you form any hypothesis about why.`,

    commitPrompt: 'Add a finding to the board. State the exact funnel stage where the problem is concentrated, the magnitude of the change, and the week it started. Be specific with numbers.',

    commitDepthQuestion: 'You identified the stage and timing. Now I want you to think about this: you said the drop started in Week 16. What kinds of events happen at a company in a single week that could cause a sudden change in checkout completion rates? List at least three possibilities before we look at more data.',
  },

  // ──────────────────────────────────────────────────────────
  // M4 — ROOT CAUSE
  // ──────────────────────────────────────────────────────────
  root_cause: {
    milestoneType: 'root_cause',

    arjunIntro: `This is the hardest milestone. Everyone wants to jump to a root cause. The discipline is in eliminating hypotheses with data before you commit to one. I have seen analysts at senior levels in good companies confidently present a root cause that was wrong because they stopped investigating after finding a plausible explanation. Let me show you the elimination method.`,

    concepts: [
      {
        heading: 'A good hypothesis is falsifiable. If you cannot disprove it, it is not useful.',
        body: 'For every hypothesis you form, ask: what data would I need to see to rule this out? "Supplier failures caused the drop" is falsifiable — look at the supplier success rate. If it is stable, the hypothesis is dead. This is how you investigate efficiently instead of chasing stories.',
      },
      {
        heading: 'The red herring is designed into this case. Supplier failures look plausible.',
        body: 'Supplier failures are a classic culprit for checkout abandonment. But before blaming suppliers, calculate: what failure rate would be needed to explain a 27pp drop in attempt-to-booking? If the observed failure rate is 4%, can that mathematically produce the observed effect? Do the arithmetic first.',
        analogy: 'A detective does not arrest the most suspicious-looking person. They check if the suspect\'s alibi is physically possible given the timeline.',
      },
      {
        heading: 'Price shock at checkout is a specific, measurable phenomenon.',
        body: 'When a user sees ₹5,000 at search and ₹6,800 at checkout, they experience price shock. This is measured by comparing search_price_shown to checkout_price in the booking_attempts table. A systematic gap between these two numbers — especially if it appeared suddenly — is your smoking gun.',
      },
    ],

    checkpointQuestion: 'Supplier success rate is 4.2% failure rate throughout the entire 26-week period, including after Week 16. What does this tell you?',

    options: [
      {
        id: 'a',
        text: 'Supplier failures are not the root cause — eliminate this hypothesis',
        isCorrect: true,
        explanation: 'Correct. The failure rate is stable before and after Week 16. If suppliers caused the drop, we would see an increase in failures starting Week 16. Stable failure rate = supplier hypothesis eliminated.',
      },
      {
        id: 'b',
        text: 'Supplier failures might still be the cause — 4.2% is significant',
        isCorrect: false,
        explanation: '4.2% is stable — it did not change at Week 16. For suppliers to explain the drop, the failure rate would need to increase at Week 16. It did not. The absolute level does not matter; the change does.',
      },
      {
        id: 'c',
        text: 'We need to look at individual supplier failure rates, not the aggregate',
        isCorrect: false,
        explanation: 'While segmentation can be useful, the aggregate tells us enough to eliminate the hypothesis. If aggregate failure rate is stable, no single supplier failure pattern can explain a platform-wide 27pp drop.',
      },
      {
        id: 'd',
        text: 'We should investigate supplier failures and pricing simultaneously',
        isCorrect: false,
        explanation: 'Investigating eliminated hypotheses wastes time. The discipline of root cause analysis is sequential elimination. Supplier failures are eliminated — move to the next hypothesis.',
      },
    ],

    investigationNudge: `Good. Suppliers are eliminated. Now run the pricing anomaly query. Before you look at the result, write down your prediction: if there is a pricing bug deployed in Week 16, what specific pattern would you expect to see in the data between search price and checkout price?`,

    commitPrompt: 'Write the root cause finding. It must include: the hypothesis you eliminated and why, the mechanism of the actual root cause, the specific data evidence that confirms it, and when it started.',

    commitDepthQuestion: 'You identified a pricing bug. But I want to understand your reasoning more deeply. How do you know this is a bug and not an intentional pricing change? What evidence in the data distinguishes between "the algorithm was changed on purpose" and "the algorithm has a bug"?',
  },

  // ──────────────────────────────────────────────────────────
  // M5 — IMPACT SIZING
  // ──────────────────────────────────────────────────────────
  impact_sizing: {
    milestoneType: 'impact_sizing',

    arjunIntro: `You have found the root cause. Now you need to answer the CFO's question before she asks it: how much did this cost us? Impact sizing is not about being precise — it is about being credible. A number with stated assumptions is worth ten times a precise-sounding number with no methodology. Let me show you how analysts size impact in a way that survives a board room.`,

    concepts: [
      {
        heading: 'Impact = lost volume × unit value. Both need a baseline.',
        body: 'To calculate revenue lost, you need: how many more bookings should have completed if the bug had not existed, and what was each booking worth. The baseline is the pre-bug period. The delta is the difference between actual and expected at baseline rates.',
        analogy: 'If a factory normally produces 1,000 units per day and a machine failure reduces this to 600, the impact is 400 units × price per unit. You need both the baseline and the failure to calculate loss.',
      },
      {
        heading: 'State your assumptions explicitly. This is not weakness — it is credibility.',
        body: 'Every impact estimate rests on assumptions. "I assumed weekly bookings would have stayed at the Week 1-15 average" is an assumption. State it. A CFO who challenges your number will respect you more if you anticipated the challenge and bounded your estimate.',
      },
      {
        heading: 'Recovery projection is different from loss calculation.',
        body: 'Loss = what we lost during the bug period. Recovery = what we gain per week if the bug is fixed. These are different numbers and both are needed. The CFO wants to know the damage. The Head of Product wants to know the urgency of the fix.',
      },
    ],

    checkpointQuestion: 'You calculate that attempt-to-booking rate dropped from 65% to 38% post Week 16, and weekly attempts are ~230. What is the estimated number of lost bookings per week?',

    options: [
      {
        id: 'a',
        text: 'Approximately 62 lost bookings per week',
        isCorrect: true,
        explanation: 'Correct. (65% - 38%) × 230 attempts = 27% × 230 = 62.1 lost bookings per week. This is the right methodology: delta in conversion rate × volume at that stage.',
      },
      {
        id: 'b',
        text: 'Approximately 87 lost bookings per week',
        isCorrect: false,
        explanation: 'This would be 38% × 230 = 87, which is actual bookings happening — not lost bookings. Lost bookings = the difference between what should have happened and what did.',
      },
      {
        id: 'c',
        text: 'Approximately 150 lost bookings per week',
        isCorrect: false,
        explanation: 'This would require the entire attempt volume to be lost, which is not the case. 62% of attempts are still converting — only the incremental drop needs to be counted.',
      },
      {
        id: 'd',
        text: 'Cannot calculate without knowing the average booking value',
        isCorrect: false,
        explanation: 'You can calculate lost bookings without booking value. Lost bookings = delta conversion rate × attempts. Booking value is needed for lost revenue, not lost bookings.',
      },
    ],

    investigationNudge: `Run the revenue lost estimate query and the recovery projection query. When you see the numbers, I want you to do something before writing anything: sense-check the output. Does the weekly loss number feel right given what we know about RPB and booking volume? If it feels off, tell me why.`,

    commitPrompt: 'Write the impact finding. Include: total estimated revenue loss over the bug period, weekly loss run rate, estimated weekly recovery if fixed, and the two most important assumptions your calculation rests on.',

    commitDepthQuestion: 'Your impact estimate is based on the assumption that booking volume would have stayed flat. But traffic grew 12% during this period. How does that change your estimate? Should you adjust the baseline, and if so, in which direction?',
  },

  // ──────────────────────────────────────────────────────────
  // M6 — SOLUTION DESIGN
  // ──────────────────────────────────────────────────────────
  solution_design: {
    milestoneType: 'solution_design',

    arjunIntro: `You have found the problem and sized the damage. Now comes the part most analysts get wrong: the solution. Analysts think their job is to find the problem. Stakeholders think the analyst's job is to fix it. The truth is: your job is to propose a solution specific enough to be actionable, humble enough to acknowledge what you do not know, and rigorous enough to measure whether it worked.`,

    concepts: [
      {
        heading: 'Every solution needs a rollback plan.',
        body: 'Before proposing any fix, ask: if this fix makes things worse, how quickly can we undo it? A solution without a rollback plan is a bet, not an engineering decision. For a pricing algorithm bug, the immediate fix is a rollback to the last known good version — this should happen before any investigation into why the bug was introduced.',
      },
      {
        heading: 'Define success before you implement.',
        body: 'How will you know the fix worked? "RPB goes back up" is not specific enough. "Attempt-to-booking rate returns to 60-65% within two weeks of rollback, measured on domestic hotel bookings" is specific enough. Without this, you cannot declare success or detect if a new problem appears.',
      },
      {
        heading: 'Propose a detection mechanism, not just a fix.',
        body: 'The real question is: why did a pricing algorithm bug reach production and stay undetected for 6+ weeks? A good solution includes both the fix and the monitoring that would have caught this faster. Price delta monitoring — alerting when checkout price exceeds search price by more than 5% — is a permanent improvement.',
      },
    ],

    checkpointQuestion: 'You propose rolling back to v1.2 of the pricing algorithm. What is the most important thing to measure in the 48 hours after the rollback?',

    options: [
      {
        id: 'a',
        text: 'Attempt-to-booking conversion rate for domestic hotels',
        isCorrect: true,
        explanation: 'Correct. This is the metric that broke. If the rollback fixed the bug, this metric should recover toward the 65% baseline within 48 hours. Measuring the exact broken metric is how you confirm the fix worked.',
      },
      {
        id: 'b',
        text: 'Total revenue for the day',
        isCorrect: false,
        explanation: 'Total revenue is a lagging indicator — it will lag the fix by days and is influenced by many factors. You need the leading indicator (conversion rate) to confirm the fix is working in real time.',
      },
      {
        id: 'c',
        text: 'The pricing algorithm logs to confirm v1.2 is running',
        isCorrect: false,
        explanation: 'Confirming the rollback was applied is necessary but not sufficient. The pricing logs tell you what version is running, not whether it is working correctly. You need the user-facing metric.',
      },
      {
        id: 'd',
        text: 'Supplier success rate',
        isCorrect: false,
        explanation: 'Supplier success rate was stable throughout and was not the root cause. Measuring it post-fix tells you nothing about whether the fix worked.',
      },
    ],

    investigationNudge: `Now write out your solution proposal. Think about three things: the immediate fix, the success metric, and the detection improvement. Do not write about what caused the bug — focus only on what you are proposing and how you will know it worked.`,

    commitPrompt: 'Write your solution to the board. Include: immediate fix with rollback plan, primary success metric with target and timeframe, and one monitoring improvement that prevents this class of bug in future.',

    commitDepthQuestion: 'Your solution proposes rolling back to v1.2. But here is a harder question: v1.3 was presumably deployed for a reason — some intended improvement. If you roll back, do you lose that improvement? How would you handle that trade-off in a real conversation with the engineering team?',
  },

  // ──────────────────────────────────────────────────────────
  // M7 — STAKEHOLDER REVIEW
  // ──────────────────────────────────────────────────────────
  stakeholder_review: {
    milestoneType: 'stakeholder_review',

    arjunIntro: `You have done the investigation. Now you defend it. This is where analytics becomes a contact sport. Stakeholders — especially CFOs and PMs — are not trying to be difficult. They are doing their job, which is to pressure-test conclusions before committing resources to them. The analyst who cannot defend their work under questioning is not trusted. Let me show you what to expect.`,

    concepts: [
      {
        heading: 'Anticipate the three hardest questions before you walk in.',
        body: 'Every stakeholder review has three moments: the challenge on your methodology ("how do you know?"), the challenge on your assumptions ("what if you are wrong about X?"), and the challenge on your recommendation ("what is the downside?"). Prepare for all three. The analyst who answers these without hesitation is the one who gets trusted with the next investigation.',
      },
      {
        heading: 'Confidence is not the same as certainty.',
        body: 'You do not need to be certain to be credible. "I am 80% confident this is a pricing bug based on the data pattern — here is what would change my view" is stronger than either "I am sure" or "I cannot be sure." Epistemic honesty builds trust.',
      },
      {
        heading: 'Defend the finding, not your ego.',
        body: 'When a stakeholder challenges your conclusion, your job is to either show them data that supports it, or update your view based on new information they provide. Never defend a finding because you worked hard on it. The investigation is in service of the business, not the analyst.',
      },
    ],

    checkpointQuestion: 'The CFO says: "You concluded a pricing bug caused this. How do you know it was not just that competitor pricing got more competitive during this period?" What is the correct response?',

    options: [
      {
        id: 'a',
        text: 'Acknowledge the alternative hypothesis and show why the data rules it out',
        isCorrect: true,
        explanation: 'Correct. The right move is: "Good question. If competitor pricing caused this, we would expect to see search-to-view drop as users find better prices elsewhere. Instead, search-to-view held flat — users were engaging normally until checkout. The drop is specifically at checkout, where we see price inflation in our own platform. This pattern points to an internal issue, not competitive pressure."',
      },
      {
        id: 'b',
        text: 'Say you did not look at competitor data and cannot rule it out',
        isCorrect: false,
        explanation: 'While honest, this concedes the point without fighting it. You have data that argues against the competitor hypothesis — use it. Abandoning a well-supported finding because you lack perfect information is not good analysis.',
      },
      {
        id: 'c',
        text: 'Ask the CFO why she thinks competitor pricing changed',
        isCorrect: false,
        explanation: 'This deflects rather than answers. The CFO asked you a question — answer it with your data before asking for more context.',
      },
      {
        id: 'd',
        text: 'Agree that competitor pricing could be a factor and widen the investigation',
        isCorrect: false,
        explanation: 'Widening the investigation at the board meeting is the wrong moment. You have strong evidence for your conclusion. The right move is to defend it, not abandon it under first pressure.',
      },
    ],

    investigationNudge: `The stakeholder panel is ready. You will face three challenges — from the CFO on impact sizing, from the Head of Product on root cause evidence, and from the Data Science Lead on methodology. Answer each one using your Investigation Board. Remember: defend the finding, not your ego.`,

    commitPrompt: 'Write a final summary for the board. In three sentences: what was the problem, what caused it, and what you are recommending. No hedging. No qualifications. Just the conclusion.',

    commitDepthQuestion: 'Your summary says to roll back the algorithm. The Head of Product is going to ask: "What is the risk of the rollback itself causing a new problem?" What is your answer?',
  },
};

// ──────────────────────────────────────────────────────────
// UTILITY — get content by milestone type
// ──────────────────────────────────────────────────────────

export function getTeachingContent(
  milestoneType: string
): MilestoneTeachingContent | null {
  return MILESTONE_TEACHING_CONTENT[milestoneType] ?? null;
}
