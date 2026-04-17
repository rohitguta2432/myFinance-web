"use client";

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAppTheme, type AppPalette } from '@/hooks/useAppTheme';
import {
  Users,
  Activity,
  CheckCircle2,
  Wallet,
  ChevronRight,
  ChevronLeft,
  X,
  Target,
  LayoutDashboard,
  Shield,
  LogOut,
  Download,
  Filter,
  Clock,
  FileText,
  TrendingUp,
} from 'lucide-react';

// ─── TYPES ───────────────────────────────────────────
interface AdminUser {
  id: string;
  name: string;
  email: string;
  city?: string;
  state?: string;
  pictureUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
  stepsCompleted: number;
  netWorth: number;
  monthlyIncome: number;
  savingsRate?: number;
}

interface AdminStats {
  totalUsers: number;
  activeToday: number;
  assessmentsCompleted: number;
  totalNetWorthTracked: number;
}

interface AuditLog {
  id: string;
  userName?: string;
  userEmail?: string;
  action: string;
  entity?: string;
  entityId?: string;
  details?: string;
  createdAt: string;
}

interface ActivityDay {
  date: string;
  logins: number;
  actions: number;
}

interface UserDetail {
  summary: {
    name: string;
    email: string;
    pictureUrl?: string;
    city?: string;
    state?: string;
    age?: number;
    createdAt: string;
    netWorth: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate?: number;
  };
  hasProfile: boolean;
  hasCashFlow: boolean;
  hasNetWorth: boolean;
  hasGoals: boolean;
  hasInsurance: boolean;
  hasTax: boolean;
  totalAssets: number;
  totalLiabilities: number;
  emiToIncomeRatio?: number;
  termLifeCover: number;
  healthCover: number;
  taxRegime?: string;
  taxSaved?: number;
  riskTolerance?: string;
  riskScore?: number;
  goals?: Array<{ name?: string; type?: string; targetAmount: number; horizonYears: number }>;
}

// ─── HELPERS ─────────────────────────────────────────
const fmt = (v: number | null | undefined): string => {
  if (v == null || isNaN(v)) return '₹0';
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`;
  return `${sign}₹${Math.round(abs)}`;
};

const fmtDate = (d: string | null | undefined): string =>
  d
    ? new Date(d).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const timeAgo = (d: string | null | undefined): string => {
  if (!d) return '—';
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? 'Just now' : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

// ─── THEME ───────────────────────────────────────────
const ACCENT = '#10B981';
const FONT = "var(--font-display, 'DM Sans', sans-serif)";

// Palette-derived helpers returned from useAppTheme()
// BG / SURFACE / BORDER / TEXT / TEXT2 / MUTED are sourced per-component.
function themeTokens(palette: AppPalette) {
  return {
    BG: palette.bg,
    SURFACE: palette.s1,
    BORDER: `1px solid ${palette.brd}`,
    TEXT: palette.txt,
    TEXT2: palette.txt2,
    MUTED: palette.mute,
  };
}

// Fetch helper using Next.js API proxy
const fetchAdmin = (path: string) =>
  fetch(`/api/proxy${path}`, { credentials: 'include' }).then((r) => {
    if (!r.ok) throw new Error('API error');
    return r.json();
  });

// ─── STAT CARD ───────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  iconBg,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  iconBg: string;
  accent?: boolean;
}) {
  const palette = useAppTheme();
  const { BG, SURFACE, BORDER, TEXT, MUTED } = themeTokens(palette);
  return (
    <div
      style={{
        borderRadius: 16,
        border: accent ? `1px solid ${ACCENT}55` : BORDER,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        background: accent ? `${ACCENT}18` : SURFACE,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: accent ? 'rgba(255,255,255,0.15)' : iconBg,
        }}
      >
        <Icon size={20} color={accent ? '#FFFFFF' : color} />
      </div>
      <div>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, color: accent ? 'rgba(255,255,255,0.75)' : MUTED }}>{label}</p>
        <p style={{ fontSize: 24, fontWeight: 700, color: accent ? '#FFFFFF' : TEXT, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{value}</p>
      </div>
    </div>
  );
}

// ─── GOAL RING ───────────────────────────────────────
function GoalRing({ pct }: { pct: number }) {
  const palette = useAppTheme();
  const { TEXT, MUTED } = themeTokens(palette);
  const r = 60, stroke = 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="75" cy="75" r={r} fill="none" stroke={palette.brd2} strokeWidth={stroke} />
        <circle
          cx="75" cy="75" r={r} fill="none"
          stroke={ACCENT} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
        <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: MUTED }}>Reached</span>
      </div>
    </div>
  );
}

// ─── STEP BADGE ──────────────────────────────────────
function StepBadge({ steps }: { steps: number }) {
  const style =
    steps === 6
      ? { bg: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}44` }
      : steps >= 4
      ? { bg: '#F59E0B20', color: '#F59E0B', border: '1px solid #F59E0B44' }
      : { bg: '#EF444420', color: '#EF4444', border: '1px solid #EF444444' };
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        padding: '4px 10px',
        borderRadius: 20,
        background: style.bg,
        color: style.color,
        border: style.border,
      }}
    >
      {steps}/6
    </span>
  );
}

// ─── USER DETAIL PANEL ───────────────────────────────
function UserDetailPanel({ userId, onClose }: { userId: string; onClose: () => void }) {
  const palette = useAppTheme();
  const { SURFACE, BORDER, TEXT, TEXT2, MUTED } = themeTokens(palette);
  const { data, isLoading } = useQuery<UserDetail>({
    queryKey: ['admin-user-detail', userId],
    queryFn: () => fetchAdmin(`/admin/users/${userId}`),
    enabled: !!userId,
  });

  const steps = data
    ? [
        { label: 'Profile', done: data.hasProfile },
        { label: 'Cash Flow', done: data.hasCashFlow },
        { label: 'Net Worth', done: data.hasNetWorth },
        { label: 'Goals', done: data.hasGoals },
        { label: 'Insurance', done: data.hasInsurance },
        { label: 'Tax', done: data.hasTax },
      ]
    : [];

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    inset: '0 0 0 auto',
    width: 440,
    background: SURFACE,
    borderLeft: BORDER,
    boxShadow: '-4px 0 40px rgba(0,0,0,0.4)',
    zIndex: 50,
    overflowY: 'auto',
    fontFamily: FONT,
  };

  return (
    <div style={panelStyle}>
      {isLoading ? (
        <div style={{ padding: 24 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ height: 32, background: palette.s2, borderRadius: 8, marginBottom: 12 }} />
          ))}
        </div>
      ) : !data ? null : (
        <>
          {/* Header */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              background: `${SURFACE}f5`,
              backdropFilter: 'blur(8px)',
              borderBottom: BORDER,
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              zIndex: 10,
            }}
          >
            <img
              src={
                data.summary.pictureUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(data.summary.name || 'U')}&background=10B981&color=fff&size=44`
              }
              style={{ width: 44, height: 44, borderRadius: '50%' }}
              alt=""
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {data.summary.name}
              </p>
              <p style={{ fontSize: 12, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {data.summary.email}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: 8,
                borderRadius: 8,
                background: 'transparent',
                border: 'none',
                color: MUTED,
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: 20 }}>
            {/* Meta tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {data.summary.city && (
                <span style={{ fontSize: 12, color: MUTED, padding: '4px 10px', borderRadius: 8, background: palette.s2, border: BORDER }}>
                  {data.summary.city}, {data.summary.state}
                </span>
              )}
              {data.summary.age && (
                <span style={{ fontSize: 12, color: MUTED, padding: '4px 10px', borderRadius: 8, background: palette.s2, border: BORDER }}>
                  Age {data.summary.age}
                </span>
              )}
              <span style={{ fontSize: 12, color: MUTED, padding: '4px 10px', borderRadius: 8, background: palette.s2, border: BORDER }}>
                Joined {fmtDate(data.summary.createdAt)}
              </span>
            </div>

            {/* Assessment Progress */}
            <DetailSection title="Assessment Progress">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {steps.map((st) => (
                  <div
                    key={st.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      padding: '8px 10px',
                      borderRadius: 12,
                      border: st.done ? `1px solid ${ACCENT}33` : BORDER,
                      background: st.done ? `${ACCENT}18` : palette.s2,
                      color: st.done ? ACCENT : MUTED,
                    }}
                  >
                    {st.done ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <div style={{ width: 14, height: 14, borderRadius: '50%', border: `1px solid ${MUTED}` }} />
                    )}
                    {st.label}
                  </div>
                ))}
              </div>
            </DetailSection>

            {/* Financial Summary */}
            <DetailSection title="Financial Summary">
              <DetailRow label="Net Worth" value={fmt(data.summary.netWorth)} highlight={data.summary.netWorth > 0} />
              <DetailRow label="Monthly Income" value={fmt(data.summary.monthlyIncome)} />
              <DetailRow label="Monthly Expenses" value={fmt(data.summary.monthlyExpenses)} />
              <DetailRow
                label="Savings Rate"
                value={`${data.summary.savingsRate?.toFixed(0) || 0}%`}
                highlight={(data.summary.savingsRate || 0) >= 20}
                warn={(data.summary.savingsRate || 0) < 10}
              />
              <DetailRow label="Total Assets" value={fmt(data.totalAssets)} />
              <DetailRow label="Total Liabilities" value={fmt(data.totalLiabilities)} warn={data.totalLiabilities > 0} />
              <DetailRow
                label="EMI/Income Ratio"
                value={`${data.emiToIncomeRatio?.toFixed(0) || 0}%`}
                warn={(data.emiToIncomeRatio || 0) > 40}
              />
            </DetailSection>

            {/* Insurance */}
            <DetailSection title="Insurance">
              <DetailRow label="Term Life Cover" value={data.termLifeCover > 0 ? fmt(data.termLifeCover) : 'No cover'} warn={data.termLifeCover === 0} />
              <DetailRow label="Health Cover" value={data.healthCover > 0 ? fmt(data.healthCover) : 'No cover'} warn={data.healthCover === 0} />
            </DetailSection>

            {/* Tax */}
            {data.taxRegime && (
              <DetailSection title="Tax">
                <DetailRow label="Regime" value={data.taxRegime.replace('_', ' ')} />
                {(data.taxSaved || 0) > 0 && <DetailRow label="Tax Saved" value={fmt(data.taxSaved)} highlight />}
              </DetailSection>
            )}

            {/* Goals */}
            {(data.goals?.length || 0) > 0 && (
              <DetailSection title={`Goals (${data.goals!.length})`}>
                {data.goals!.map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Target size={16} color={ACCENT} />
                      <span style={{ fontSize: 13, color: TEXT2 }}>{g.name || g.type}</span>
                    </div>
                    <span style={{ fontSize: 12, color: MUTED }}>
                      {fmt(g.targetAmount)} · {g.horizonYears}yr
                    </span>
                  </div>
                ))}
              </DetailSection>
            )}

            {/* Risk */}
            {data.riskTolerance && (
              <DetailSection title="Risk Profile">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '6px 12px',
                      borderRadius: 20,
                      ...(data.riskTolerance === 'AGGRESSIVE'
                        ? { background: '#EF444418', border: '1px solid #EF444433', color: '#EF4444' }
                        : data.riskTolerance === 'MODERATE'
                        ? { background: '#F59E0B18', border: '1px solid #F59E0B33', color: '#F59E0B' }
                        : { background: `${ACCENT}18`, border: `1px solid ${ACCENT}33`, color: ACCENT }),
                    }}
                  >
                    {data.riskTolerance}
                  </span>
                  {data.riskScore != null && (
                    <span style={{ fontSize: 13, color: MUTED }}>Score: {data.riskScore}</span>
                  )}
                </div>
              </DetailSection>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  const palette = useAppTheme();
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, color: palette.mute, marginBottom: 12 }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function DetailRow({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
  const palette = useAppTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontSize: 13, color: palette.mute }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          color: warn ? palette.danger : highlight ? ACCENT : palette.txt2,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── AUDIT LOGS VIEW ─────────────────────────────────
function AuditLogsView() {
  const palette = useAppTheme();
  const { SURFACE, BORDER, TEXT, MUTED } = themeTokens(palette);
  const { data: logs, isLoading } = useQuery<AuditLog[]>({
    queryKey: ['admin-audit-logs'],
    queryFn: () => fetchAdmin('/admin/audit-logs'),
    refetchInterval: 10000,
  });

  const actionColors: Record<string, { bg: string; color: string; border: string }> = {
    LOGIN: { bg: '#3B82F618', color: '#3B82F6', border: '#3B82F633' },
    SAVE_PROFILE: { bg: `${ACCENT}18`, color: ACCENT, border: `${ACCENT}33` },
    ADD_INCOME: { bg: `${ACCENT}18`, color: ACCENT, border: `${ACCENT}33` },
    ADD_EXPENSE: { bg: '#F59E0B18', color: '#F59E0B', border: '#F59E0B33' },
    ADD_ASSET: { bg: `${ACCENT}18`, color: ACCENT, border: `${ACCENT}33` },
    ADD_LIABILITY: { bg: '#F59E0B18', color: '#F59E0B', border: '#F59E0B33' },
    ADD_GOAL: { bg: `${ACCENT}18`, color: ACCENT, border: `${ACCENT}33` },
    SAVE_INSURANCE: { bg: '#A855F718', color: '#A855F7', border: '#A855F733' },
    SAVE_TAX: { bg: '#06B6D418', color: '#06B6D4', border: '#06B6D433' },
    DELETE_INCOME: { bg: '#EF444418', color: '#EF4444', border: '#EF444433' },
    DELETE_EXPENSE: { bg: '#EF444418', color: '#EF4444', border: '#EF444433' },
    DELETE_ASSET: { bg: '#EF444418', color: '#EF4444', border: '#EF444433' },
    DELETE_LIABILITY: { bg: '#EF444418', color: '#EF4444', border: '#EF444433' },
    DELETE_GOAL: { bg: '#EF444418', color: '#EF4444', border: '#EF444433' },
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: MUTED, marginBottom: 4 }}>
          System Logs
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEXT, letterSpacing: '-0.02em' }}>Audit Logs</h1>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Real-time activity feed — auto-refreshes every 10s</p>
      </div>

      <div style={{ background: SURFACE, borderRadius: 16, border: BORDER, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ height: 56, background: palette.s2, borderRadius: 12, marginBottom: 12 }} />
            ))}
          </div>
        ) : !logs?.length ? (
          <div style={{ padding: 48, textAlign: 'center', color: MUTED }}>
            <Clock size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: 13 }}>No audit logs yet. Logs appear as users interact with the app.</p>
          </div>
        ) : (
          <div>
            {logs.map((log) => {
              const ac = actionColors[log.action] || { bg: palette.s2, color: MUTED, border: palette.brd2 };
              return (
                <div
                  key={log.id}
                  style={{
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    borderBottom: BORDER,
                  }}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(log.userName || 'U')}&background=10B981&color=fff&size=40`}
                    style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}
                    alt=""
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{log.userName || 'Unknown'}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: 20,
                          background: ac.bg,
                          color: ac.color,
                          border: `1px solid ${ac.border}`,
                        }}
                      >
                        {log.action?.replace('_', ' ')}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: MUTED }}>
                      {log.entity && <span style={{ textTransform: 'capitalize' }}>{log.entity}</span>}
                      {log.entityId && <span> #{log.entityId}</span>}
                      {log.details && <span> — {log.details}</span>}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 12, color: MUTED }}>{timeAgo(log.createdAt)}</p>
                    <p style={{ fontSize: 12, color: palette.mute, opacity: 0.6 }}>{log.userEmail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── OVERVIEW VIEW ───────────────────────────────────
function OverviewView({
  stats,
  statsLoading,
  statsError,
  users,
  usersLoading,
  usersError,
  activity,
  activityError,
  onSelectUser,
}: {
  stats?: AdminStats;
  statsLoading: boolean;
  statsError?: boolean;
  users?: AdminUser[];
  usersLoading: boolean;
  usersError?: boolean;
  activity?: ActivityDay[];
  activityError?: boolean;
  onSelectUser: (id: string) => void;
}) {
  const palette = useAppTheme();
  const { BG, SURFACE, BORDER, TEXT, TEXT2, MUTED } = themeTokens(palette);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const perPage = 10;

  if (statsError || usersError || activityError) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, background: `${palette.danger}26`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span style={{ fontSize: 24, color: palette.danger }}>!</span>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Failed to load dashboard data</h3>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>Check your connection or try refreshing the page.</p>
        <button onClick={() => window.location.reload()} style={{ padding: '8px 20px', background: palette.s2, border: `1px solid ${palette.brd2}`, borderRadius: 8, color: TEXT, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  const filtered = (users || []).filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const pagedUsers = filtered.slice((page - 1) * perPage, page * perPage);
  const completionPct =
    stats && stats.totalUsers > 0
      ? Math.round((stats.assessmentsCompleted / stats.totalUsers) * 100)
      : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Section header */}
      <div>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: MUTED, marginBottom: 4 }}>
          Admin Intelligence
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEXT, letterSpacing: '-0.02em' }}>Fiscal Overview</h1>
      </div>

      {/* Stat cards */}
      {statsLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 112, background: SURFACE, borderRadius: 16, border: BORDER }} />
          ))}
        </div>
      ) : stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="#3B82F6" iconBg="#3B82F618" />
          <StatCard label="Active Today" value={stats.activeToday} icon={Activity} color={ACCENT} iconBg={`${ACCENT}18`} />
          <StatCard label="Assessments Done" value={stats.assessmentsCompleted} icon={CheckCircle2} color="#F59E0B" iconBg="#F59E0B18" />
          <StatCard label="Total Net Worth" value={fmt(stats.totalNetWorthTracked)} icon={Wallet} color={BG} iconBg="transparent" accent />
        </div>
      ) : null}

      {/* Activity chart + completion ring */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Activity chart */}
        <div style={{ background: SURFACE, borderRadius: 16, border: BORDER, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>User Activity</h3>
              <p style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Sign-ups & logins over time</p>
            </div>
            <span style={{ fontSize: 12, color: MUTED, border: BORDER, padding: '6px 12px', borderRadius: 8 }}>Last 7 Days</span>
          </div>
          <div style={{ height: 192, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, padding: '0 16px' }}>
            {(activity || []).length > 0 ? (
              activity!.map((day, i) => {
                const maxActions = Math.max(...activity!.map((d) => d.actions || 1), 1);
                const pct = Math.max(5, ((day.actions || 0) / maxActions) * 100);
                const loginPct = day.actions > 0 ? Math.max(20, (day.logins / day.actions) * 100) : 0;
                const label = new Date(day.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short' });
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: '100%', borderRadius: '4px 4px 0 0', background: `${ACCENT}28`, height: `${pct}%` }}>
                      <div style={{ width: '100%', borderRadius: '4px 4px 0 0', background: ACCENT, height: `${loginPct}%`, transition: 'height 0.5s' }} />
                    </div>
                    <span style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
                  </div>
                );
              })
            ) : (
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontSize: 13 }}>
                No activity data yet
              </div>
            )}
          </div>
        </div>

        {/* Completion ring */}
        <div style={{ background: SURFACE, borderRadius: 16, border: BORDER, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Completion Rate</h3>
            <TrendingUp size={20} color={ACCENT} />
          </div>
          <p style={{ fontSize: 12, color: MUTED, marginBottom: 16, textAlign: 'center' }}>
            Users who completed all 6 assessment steps.
          </p>
          <GoalRing pct={completionPct} />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 16, fontSize: 12, color: MUTED }}>
            <span>Done: <strong style={{ color: TEXT2 }}>{stats?.assessmentsCompleted || 0}</strong></span>
            <span>Total: <strong style={{ color: TEXT2 }}>{stats?.totalUsers || 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div style={{ background: SURFACE, borderRadius: 16, border: BORDER, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: BORDER, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>All Users</h3>
            <p style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Detailed breakdown of registered accounts</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search users..."
              style={{
                padding: '8px 12px',
                background: palette.s2,
                border: BORDER,
                borderRadius: 10,
                color: TEXT,
                fontSize: 13,
                outline: 'none',
                width: 180,
                fontFamily: FONT,
              }}
            />
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: MUTED,
                border: BORDER,
                padding: '8px 14px',
                borderRadius: 10,
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: FONT,
              }}
            >
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        {usersLoading ? (
          <div style={{ padding: 24 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 64, background: palette.s2, borderRadius: 12, marginBottom: 12 }} />
            ))}
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: BORDER }}>
                    {['User', 'City', 'Joined', 'Last Login', 'Steps', 'Net Worth', 'Income/mo', 'Savings %', ''].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: h === 'Net Worth' || h === 'Income/mo' || h === 'Savings %' || h === '' ? 'right' : h === 'Steps' ? 'center' : 'left',
                          padding: '12px 16px',
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: MUTED,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: `1px solid ${palette.brd}`, height: 68 }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img
                            src={
                              u.pictureUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=10B981&color=fff&size=40`
                            }
                            style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}
                            alt=""
                          />
                          <div>
                            <p style={{ fontWeight: 600, color: TEXT }}>{u.name}</p>
                            <p style={{ fontSize: 12, color: MUTED }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: TEXT2 }}>{u.city || '—'}</td>
                      <td style={{ padding: '12px 16px', color: TEXT2 }}>{fmtDate(u.createdAt)}</td>
                      <td style={{ padding: '12px 16px', color: TEXT2 }}>{timeAgo(u.lastLoginAt)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <StepBadge steps={u.stepsCompleted} />
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: TEXT2 }}>
                        {fmt(u.netWorth)}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: TEXT2 }}>
                        {fmt(u.monthlyIncome)}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span
                          style={{
                            fontVariantNumeric: 'tabular-nums',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 20,
                            fontSize: 12,
                            ...((u.savingsRate || 0) >= 40
                              ? { background: `${ACCENT}28`, color: ACCENT }
                              : (u.savingsRate || 0) >= 20
                              ? { background: `${ACCENT}18`, color: ACCENT }
                              : (u.savingsRate || 0) >= 10
                              ? { background: '#F59E0B18', color: '#F59E0B' }
                              : { background: '#EF444418', color: '#EF4444' }),
                          }}
                        >
                          {u.savingsRate?.toFixed(0) || 0}%
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => onSelectUser(u.id)}
                          style={{
                            color: ACCENT,
                            background: 'transparent',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: 12,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontFamily: FONT,
                          }}
                        >
                          View <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pagedUsers.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ padding: 40, textAlign: 'center', color: MUTED, fontSize: 13 }}>
                        {search ? 'No users match your search.' : 'No users yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ padding: '12px 24px', borderTop: BORDER, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 12, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Showing {pagedUsers.length} of {filtered.length} users
              </p>
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      background: 'transparent',
                      border: 'none',
                      color: MUTED,
                      cursor: page === 1 ? 'default' : 'pointer',
                      opacity: page === 1 ? 0.3 : 1,
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: FONT,
                        background: page === i + 1 ? ACCENT : 'transparent',
                        color: page === i + 1 ? '#FFFFFF' : MUTED,
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      background: 'transparent',
                      border: 'none',
                      color: MUTED,
                      cursor: page === totalPages ? 'default' : 'pointer',
                      opacity: page === totalPages ? 0.3 : 1,
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────
function Sidebar({
  activeTab,
  setActiveTab,
  onExport,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  onExport: () => void;
}) {
  const router = useRouter();
  const palette = useAppTheme();
  const { SURFACE, BORDER, TEXT, MUTED } = themeTokens(palette);
  const NAV = [
    { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
    { id: 'audit', label: 'Audit Logs', Icon: FileText },
  ];

  return (
    <aside
      style={{
        width: 224,
        flexShrink: 0,
        background: SURFACE,
        borderRight: BORDER,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        fontFamily: FONT,
      }}
    >
      {/* Brand */}
      <div style={{ padding: '20px', borderBottom: BORDER }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${ACCENT}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={20} color={ACCENT} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>MyFinancial</p>
            <p style={{ fontSize: 10, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: 12, paddingTop: 20 }}>
        {NAV.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: 4,
                background: active ? `${ACCENT}18` : 'transparent',
                color: active ? ACCENT : MUTED,
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                fontFamily: FONT,
                transition: 'all 0.15s',
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: 12, borderTop: BORDER }}>
        <button
          onClick={onExport}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 16px',
            borderRadius: 12,
            border: 'none',
            background: ACCENT,
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: 8,
            fontFamily: FONT,
          }}
        >
          <Download size={16} /> Export Data
        </button>
        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 14px',
            borderRadius: 12,
            border: 'none',
            background: 'transparent',
            color: MUTED,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: FONT,
          }}
        >
          <LogOut size={18} /> Back to App
        </button>
      </div>
    </aside>
  );
}

// ─── LOGIN FORM ──────────────────────────────────────
function LoginGate({ onAuth }: { onAuth: () => void }) {
  const palette = useAppTheme();
  const { BG, SURFACE, BORDER, TEXT, MUTED } = themeTokens(palette);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password }),
    });
    setLoading(false);
    if (res.ok) {
      onAuth();
    } else {
      setError('Invalid admin password');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          background: SURFACE,
          border: BORDER,
          borderRadius: 20,
          padding: 40,
          width: 360,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: `${ACCENT}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Shield size={28} color={ACCENT} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 6 }}>Admin Panel</h1>
          <p style={{ fontSize: 13, color: MUTED }}>MyFinancial — Restricted Access</p>
        </div>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              background: palette.s2,
              border: BORDER,
              borderRadius: 12,
              color: TEXT,
              fontSize: 14,
              outline: 'none',
              marginBottom: 12,
              boxSizing: 'border-box',
              fontFamily: FONT,
            }}
          />
          {error && (
            <p style={{ fontSize: 13, color: palette.danger, marginBottom: 12, textAlign: 'center' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: ACCENT,
              border: 'none',
              borderRadius: 12,
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: FONT,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN ADMIN PAGE ─────────────────────────────────
export default function AdminPage() {
  const palette = useAppTheme();
  const { BG, SURFACE, BORDER, TEXT } = themeTokens(palette);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading, isError: statsError } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: () => fetchAdmin('/admin/stats'),
    enabled: authenticated,
  });

  const { data: users, isLoading: usersLoading, isError: usersError } = useQuery<AdminUser[]>({
    queryKey: ['admin-users'],
    queryFn: () => fetchAdmin('/admin/users'),
    enabled: authenticated,
  });

  const { data: activity, isError: activityError } = useQuery<ActivityDay[]>({
    queryKey: ['admin-activity'],
    queryFn: () => fetchAdmin('/admin/activity?days=7'),
    enabled: authenticated,
  });

  const handleExport = useCallback(() => {
    if (!users) return;
    const rows = [
      ['Name', 'Email', 'City', 'Joined', 'Steps', 'Net Worth', 'Monthly Income', 'Savings Rate'],
      ...users.map((u) => [
        u.name,
        u.email,
        u.city || '',
        fmtDate(u.createdAt),
        `${u.stepsCompleted}/6`,
        u.netWorth,
        u.monthlyIncome,
        `${u.savingsRate?.toFixed(0) || 0}%`,
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'myfinance-users.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [users]);

  if (!authenticated) {
    return <LoginGate onAuth={() => setAuthenticated(true)} />;
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: BG,
        fontFamily: FONT,
        color: TEXT,
      }}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onExport={handleExport} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            height: 56,
            borderBottom: BORDER,
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            background: `${SURFACE}cc`,
            backdropFilter: 'blur(8px)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 700, color: TEXT, flex: 1 }}>Admin Dashboard</h2>
        </header>

        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {activeTab === 'audit' ? (
            <AuditLogsView />
          ) : (
            <OverviewView
              stats={stats}
              statsLoading={statsLoading}
              statsError={statsError}
              users={users}
              usersLoading={usersLoading}
              usersError={usersError}
              activity={activity}
              activityError={activityError}
              onSelectUser={setSelectedUserId}
            />
          )}
        </main>
      </div>

      {/* Detail panel */}
      {selectedUserId && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
            onClick={() => setSelectedUserId(null)}
          />
          <UserDetailPanel userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
        </>
      )}
    </div>
  );
}
