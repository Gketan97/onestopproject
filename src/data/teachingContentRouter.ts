// ============================================================
// TEACHING CONTENT ROUTER
// Returns correct content based on caseId + milestoneType
// ============================================================

import type { MilestoneTeachingContent } from '@/types';
import { MILESTONE_TEACHING_CONTENT } from './milestoneTeachingContent';
import { MMT_BOOKINGS_TEACHING_CONTENT } from './mmt_bookings_teaching_content';

export function getTeachingContent(
  milestoneType: string,
  caseId?: string
): MilestoneTeachingContent | null {
  if (caseId === 'mmt_bookings_drop') {
    return MMT_BOOKINGS_TEACHING_CONTENT[milestoneType] ?? null;
  }
  // Default: original MMT revenue leak case
  return MILESTONE_TEACHING_CONTENT[milestoneType] ?? null;
}
