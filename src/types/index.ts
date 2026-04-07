export interface CaseConfig {
  slug: string
  title: string
  company: string
  metric: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  phases: string[]
}

export const CASE_CONFIGS: Record<string, CaseConfig> = {
  'makemytrip-dau': {
    slug: 'makemytrip-dau',
    title: 'The Conversion Gap',
    company: 'MakeMyTrip',
    metric: 'Bookings/DAU –13.4%',
    difficulty: 'advanced',
    duration: '60–90 min',
    phases: ['charter', 'scoping', 'investigation', 'hypothesis', 'diagnosis', 'recommendation', 'debrief'],
  },
  'revenue-leak': {
    slug: 'revenue-leak',
    title: 'Revenue Leak Investigation',
    company: 'E-Commerce Platform',
    metric: '18% GMV drop in 72hrs',
    difficulty: 'intermediate',
    duration: '45–60 min',
    phases: ['charter', 'scoping', 'investigation', 'hypothesis', 'diagnosis', 'recommendation', 'debrief'],
  },
}
