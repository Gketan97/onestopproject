import Link from 'next/link';
export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '40px' }}>
      <div style={{ textAlign: 'center', maxWidth: '560px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '16px' }}>
          OneStopCareers
        </p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ink1)', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '16px' }}>
          AI Analytics<br />
          <span style={{ background: 'linear-gradient(135deg, var(--blue), #99BBFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Case Platform
          </span>
        </h1>
        <p style={{ color: 'var(--ink3)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
          Master analytical judgment through real business investigations.
        </p>
        <Link href="/case/makemytrip_revenue_leak" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--orange)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
          Start MakeMyTrip Case →
        </Link>
      </div>
    </main>
  );
}
