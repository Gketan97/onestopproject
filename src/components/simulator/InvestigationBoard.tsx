// ============================================================
// INVESTIGATION BOARD
// Persistent left panel showing case findings, hypotheses,
// insights, and solutions as they accumulate.
// ============================================================

'use client';

import type { InvestigationBoard as BoardType } from '@/types';

interface Props {
  board: BoardType;
}

export function InvestigationBoard({ board }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ink3)',
            marginBottom: '4px',
          }}
        >
          Investigation Board
        </p>
        {board.problem && (
          <p style={{ fontSize: '12px', color: 'var(--ink2)', lineHeight: 1.5 }}>
            {board.problem}
          </p>
        )}
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <BoardSection
          title="Findings"
          color="var(--blue)"
          items={board.findings.map(f => ({
            text: f.text,
            badge: f.confidence,
            badgeColor: f.confidence === 'high'
              ? 'var(--green)'
              : f.confidence === 'medium'
              ? 'var(--orange)'
              : 'var(--ink3)',
          }))}
          emptyText="No findings yet"
        />

        <BoardSection
          title="Hypotheses"
          color="var(--orange)"
          items={board.hypotheses.map(h => ({
            text: h.text,
            badge: h.status,
            badgeColor: h.status === 'supported'
              ? 'var(--green)'
              : h.status === 'rejected'
              ? 'var(--red)'
              : 'var(--ink3)',
          }))}
          emptyText="No hypotheses yet"
        />

        <BoardSection
          title="Insights"
          color="var(--green)"
          items={board.insights.map(i => ({
            text: i.text,
          }))}
          emptyText="No insights yet"
        />

        <BoardSection
          title="Solutions"
          color="var(--orange)"
          items={board.solutions.map(s => ({
            text: s.text,
            badge: s.effort,
            badgeColor: s.effort === 'low'
              ? 'var(--green)'
              : s.effort === 'medium'
              ? 'var(--orange)'
              : 'var(--red)',
            sub: s.estimatedImpact
              ? `Impact: ${s.estimatedImpact}`
              : undefined,
          }))}
          emptyText="No solutions yet"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BOARD SECTION
// ─────────────────────────────────────────────────────────────

interface SectionItem {
  text: string;
  badge?: string;
  badgeColor?: string;
  sub?: string;
}

interface SectionProps {
  title: string;
  color: string;
  items: SectionItem[];
  emptyText: string;
}

function BoardSection({ title, color, items, emptyText }: SectionProps) {
  return (
    <div>
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: '3px',
            height: '12px',
            background: color,
            borderRadius: '2px',
          }}
        />
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ink3)',
          }}
        >
          {title}
        </span>
        {items.length > 0 && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: color,
              background: `${color}18`,
              padding: '1px 6px',
              borderRadius: '10px',
            }}
          >
            {items.length}
          </span>
        )}
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <p
          style={{
            fontSize: '11px',
            color: 'var(--ink4)',
            fontStyle: 'italic',
            paddingLeft: '11px',
          }}
        >
          {emptyText}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '8px 10px',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-sm)',
                animation: 'fadeIn 0.3s ease-out',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--ink2)',
                    lineHeight: 1.5,
                    flex: 1,
                  }}
                >
                  {item.text}
                </p>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 600,
                      color: item.badgeColor ?? 'var(--ink3)',
                      background: `${item.badgeColor ?? 'var(--ink3)'}18`,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      flexShrink: 0,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              {item.sub && (
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--ink3)',
                    marginTop: '4px',
                  }}
                >
                  {item.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
