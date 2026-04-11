# OSC CODE QUALITY CONTRACT v1.0
# FAANG-level standards. Every file must comply.
# Violations go to DEBT_REGISTER.md

---

## 1. TYPESCRIPT RULES

- Explicit return types on all exported functions
- No `any` — use `unknown` and narrow, or define interfaces
- No non-null assertions (!) without a comment
- Props interfaces defined above component, not inline
- No implicit any from missing types

## 2. NAMING CONVENTIONS

- Components:      PascalCase
- Hooks:           camelCase, prefix `use`
- Stores:          camelCase, suffix `Store`
- Constants:       SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase, no I-prefix
- Files:           PascalCase for components, camelCase for utils/hooks

## 3. COMPONENT FILE STRUCTURE (in order)

  1. External imports
  2. Internal imports
  3. Types/interfaces
  4. Constants
  5. Helper functions (small only, else extract to lib/)
  6. Component definition
  7. Export

## 4. FORBIDDEN PATTERNS

  NEVER:
    style={{ color: '#00D4FF' }}           // raw hex
    className="text-blue-500"             // Tailwind color scale
    React.FC<Props>                        // use function syntax
    <div onClick={fn} role="button">      // fake button

  ALWAYS:
    style={{ color: 'var(--accent-primary)' }}
    className={cn('base', condition && 'extra', className)}
    function MyComp({ className }: Props) {
    <Button variant="primary" onClick={fn}>

## 5. ZUSTAND RULES

- All stores use persist middleware with unique name key
- Never mutate state directly
- Always destructure only what you need from stores
- Selectors use shallow for object slices
- Reset functions must use exact initialState object

## 6. ROUTING RULES

- All routes: lazy() + Suspense with PageLoader fallback
- Route params typed: useParams<{ slug: string }>()
- Redirects always use replace: true
- Phase guard logic in usePhaseGate hook only, never inline

## 7. PERFORMANCE RULES

- Framer Motion: viewport={{ once: true }} on all scroll animations
- Ambient orbs: fixed (not absolute) to avoid reflow
- Lists: key by stable ID, never array index for dynamic lists
- Zustand: never subscribe to whole store

## 8. FILE SIZE LIMITS

- Component:  250 lines max
- Page:       400 lines max
- Store:      150 lines max
- Function:   40 lines max

## 9. IMPORT ORDER

  1. React core
  2. External libs (alphabetical)
  3. Internal stores and hooks
  4. Internal components
  5. Internal lib and types
  6. Styles (last)

## 10. PHASE COMPONENT STANDARDS

Every phase component must:
- Accept onComplete: () => void prop
- Accept caseConfig: CaseConfig prop
- Show MobileGate if window.innerWidth < 1024
- Use usePhaseGate for access control
- Call phaseCompleted() only after real user interaction
- Show progress indicator (phase X of Y)
- End with Button variant="primary" Complete CTA
