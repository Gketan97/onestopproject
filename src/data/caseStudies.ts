export interface CaseStudyMeta {
  slug:        string
  title:       string
  company:     string
  description: string
  metric:      string
  difficulty:  'Beginner' | 'Intermediate' | 'Advanced'
  duration:    string
  phases:      number
  skills:      string[]
  available:   boolean
}

export const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug:        'makemytrip-dau-drop',
    title:       'MakeMyTrip — Bookings/DAU Investigation',
    company:     'MakeMyTrip',
    description: '8-phase investigation of an 18% booking decline. Segment by platform, isolate the iOS v8.3 regression, size the impact, and present board-ready recommendations.',
    metric:      '−18% Bookings/DAU over 60 days',
    difficulty:  'Advanced',
    duration:    '45 min',
    phases:      8,
    skills:      ['Segmentation', 'Funnel Analysis', 'Root Cause', 'Impact Sizing'],
    available:   true,
  },
  {
    slug:        'swiggy-order-drop',
    title:       'Swiggy — Order Rate Decline',
    company:     'Swiggy',
    description: 'Investigate a sudden drop in order rate across metro cities. Diagnose supply-side vs demand-side root causes.',
    metric:      '−12% Order Rate in 2 weeks',
    difficulty:  'Intermediate',
    duration:    '30 min',
    phases:      6,
    skills:      ['Cohort Analysis', 'Supply Metrics', 'A/B Testing'],
    available:   false,
  },
  {
    slug:        'flipkart-cart-abandonment',
    title:       'Flipkart — Cart Abandonment Spike',
    company:     'Flipkart',
    description: 'A pricing algorithm change caused unexpected cart abandonment. Trace the funnel and quantify revenue loss.',
    metric:      '+23% Cart Abandonment Rate',
    difficulty:  'Intermediate',
    duration:    '35 min',
    phases:      6,
    skills:      ['Pricing Analysis', 'Funnel Mapping', 'SQL Patterns'],
    available:   false,
  },
]

export const DIFFICULTY_VARIANT = {
  Beginner:     'green',
  Intermediate: 'amber',
  Advanced:     'cyan',
} as const satisfies Record<CaseStudyMeta['difficulty'], string>
