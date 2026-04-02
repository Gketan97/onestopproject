// src/data/validateCase.js
export function validateCase(caseConfig) {
  const { impact } = caseConfig.data;
  const computed =
    impact.churnedUsers *
    impact.avgOrderValue *
    impact.ordersPerWeek *
    impact.weeksInYear;

  const delta = Math.abs(computed - impact.annual) / impact.annual;

  if (delta > 0.01) {
    throw new Error(
      `[${caseConfig.id}] Math inconsistency: computed ₹${computed.toLocaleString('en-IN')} ≠ stated ₹${impact.annual.toLocaleString('en-IN')}`
    );
  }

  console.log(`[${caseConfig.id}] ✓ Math validated`);
}
