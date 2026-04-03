// ============================================================
// MISTAKE DETECTOR
// Pattern matches common analytical fallacies.
// Runs after each user turn — feeds into AI prompt context.
// ============================================================

import type { AggregatedMetrics, InvestigationBoard } from '@/types';

export interface DetectedMistake {
  id: string;
  label: string;
  feedback: string;
}

export class MistakeDetector {
  detect(
    board: InvestigationBoard,
    metrics: AggregatedMetrics | null
  ): string[] {
    const mistakes: string[] = [];

    // M1: Jumping to root cause without funnel data
    if (
      board.hypotheses.length > 0 &&
      board.findings.length === 0
    ) {
      mistakes.push(
        'hypothesis_before_data: User proposed root cause before establishing any findings from data.'
      );
    }

    // M2: Blaming supplier failures when rate is stable
    const supplierHypothesis = board.hypotheses.find(h =>
      h.text.toLowerCase().includes('supplier') &&
      h.status === 'proposed'
    );
    if (supplierHypothesis && metrics) {
      const failureRate = metrics.metrics['failure_rate_avg'];
      if (typeof failureRate === 'number' && failureRate < 10) {
        mistakes.push(
          'supplier_blame_without_evidence: User suspects supplier failures but failure rate is stable below 10%.'
        );
      }
    }

    // M3: Concluding traffic caused revenue drop
    const trafficHypothesis = board.hypotheses.find(h =>
      h.text.toLowerCase().includes('traffic') &&
      h.text.toLowerCase().includes('drop')
    );
    if (trafficHypothesis) {
      mistakes.push(
        'traffic_revenue_conflation: Traffic is increasing — revenue per session is the actual declining metric.'
      );
    }

    // M4: Proposing solution before identifying root cause
    if (
      board.solutions.length > 0 &&
      board.insights.filter(i => i.milestoneId === 'm4_root_cause').length === 0
    ) {
      mistakes.push(
        'solution_before_root_cause: User proposed a solution before completing root cause analysis.'
      );
    }

    // M5: Vague impact estimate (no numbers)
    const vagueSolution = board.solutions.find(s =>
      s.estimatedImpact === '' ||
      s.estimatedImpact.toLowerCase().includes('significant') ||
      s.estimatedImpact.toLowerCase().includes('improve')
    );
    if (vagueSolution) {
      mistakes.push(
        'vague_impact_estimate: Solution impact is stated qualitatively. Push for INR amount or % conversion recovery.'
      );
    }

    return mistakes;
  }
}
