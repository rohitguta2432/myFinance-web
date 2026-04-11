"use client";

import { useState, useRef, useEffect } from 'react';

// ─── TYPES ───────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── QUICK SUGGESTION CHIPS ─────────────────────────
const QUICK_SUGGESTIONS = [
  "What's my savings rate?",
  "How can I save on taxes?",
  "How much emergency fund do I need?",
  "Am I on track for retirement?",
  "Is my insurance cover enough?",
];

// ─── FAQ DATA ────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "What is MyFinancial?",
    a: "MyFinancial is a free personal financial planning tool that helps you understand your finances, optimize taxes, and plan for the future — all based on your unique profile."
  },
  {
    q: "Is my data safe?",
    a: "Absolutely! Your financial data is stored locally on your device and is never shared with third parties. We use bank-grade encryption for any data transmission."
  },
  {
    q: "How does tax optimization work?",
    a: "We compare Old vs New tax regimes based on your income, deductions (80C, 80D, 80CCD, HRA), and suggest the one that saves you the most. We also recommend investment strategies to maximize tax savings."
  },
  {
    q: "What is an emergency fund?",
    a: "An emergency fund is liquid savings covering 3-6 months of expenses. It protects you from unexpected costs like medical bills, job loss, or car repairs without touching your investments."
  },
  {
    q: "How much life insurance do I need?",
    a: "A good rule of thumb is 10-15x your annual income. We calculate your exact gap based on your income, loans, dependents, and existing coverage."
  },
  {
    q: "What is asset allocation?",
    a: "It's the strategy of splitting your investments across equity, debt, gold, and real estate to balance risk and returns based on your age, goals, and risk tolerance."
  },
  {
    q: "Can Kira give specific stock tips?",
    a: "No — Kira provides general financial guidance, not specific stock or mutual fund recommendations. For personalized investment advice, consult a SEBI-registered financial advisor."
  },
];

// ─── BUILD FINANCIAL CONTEXT FROM USER DATA ──────────
function buildFinancialContext(user: Record<string, unknown> | undefined) {
  if (!user) return {};
  const n = (key: string) => (user[key] as number) || 0;
  return {
    name: user.name,
    age: user.age,
    city: user.city,
    grossIncome: `₹${n('grossIncome').toLocaleString('en-IN')}/year`,
    monthlyTakeHome: `₹${n('takeHomePay').toLocaleString('en-IN')}`,
    monthlyExpenses: `₹${n('monthlyExpenses').toLocaleString('en-IN')}`,
    monthlySurplus: `₹${n('monthlySurplus').toLocaleString('en-IN')}`,
    monthlyEMI: `₹${n('monthlyEMI').toLocaleString('en-IN')}`,
    liquidSavings: `₹${n('liquidAssets').toLocaleString('en-IN')}`,
    emergencyFundMonths: user.liquidMonths,
    totalInvestments: `₹${n('totalFinancialAssets').toLocaleString('en-IN')}`,
    netWorth: `₹${n('netWorth').toLocaleString('en-IN')}`,
    equityAllocation: `${user.equityPct}%`,
    targetEquity: `${user.targetEquityPct}%`,
    existingLifeCover: `₹${n('existingTermCover').toLocaleString('en-IN')}`,
    requiredLifeCover: `₹${n('requiredCover').toLocaleString('en-IN')}`,
    healthCover: `₹${n('existingHealthCover').toLocaleString('en-IN')}`,
    recommendedHealthCover: `₹${n('cityHealthBenchmark').toLocaleString('en-IN')}`,
    invested80C: `₹${n('invested80C').toLocaleString('en-IN')}`,
    npsContribution: `₹${n('npsContribution').toLocaleString('en-IN')}`,
    taxRegime: user.taxRegime,
    currentSIP: `₹${n('currentSIP').toLocaleString('en-IN')}/month`,
    emiToIncomeRatio: `${user.emiRatio}%`,
    debtToIncome: `${user.dti}%`,
    ownsHome: user.ownsHome ? 'Yes' : 'No',
    currentRent: `₹${n('currentRent').toLocaleString('en-IN')}/month`,
    retirementAge: user.retirementAge,
  };
}

// ─── DARK THEME TOKENS ───────────────────────────────
const T = {
  panelBg: 'rgba(15, 23, 42, 0.97)',
  panelBorder: 'rgba(51, 65, 85, 0.6)',
  panelShadow: '0 25px 60px rgba(0,0,0,.6), 0 0 40px rgba(13,148,136,.15)',
  headerBg: 'linear-gradient(135deg, rgba(13,148,136,.2), rgba(2,132,199,.15))',
  headerBorder: 'rgba(51,65,85,.5)',
  titleColor: '#F1F5F9',
  msgBotBg: 'rgba(30, 41, 59, 0.8)',
  msgBotBorder: 'rgba(51,65,85,.5)',
  msgBotColor: '#CBD5E1',
  inputBg: '#1E293B',
  inputBorder: '#334155',
  inputColor: '#F1F5F9',
  inputBarBg: 'rgba(7,11,20,.5)',
  inputBarBorder: 'rgba(51,65,85,.4)',
  sendDisabledBg: '#1E293B',
  sendDisabledColor: '#475569',
  codeBg: '#1E293B',
  tabBg: 'rgba(30,41,59,.6)',
  tabActiveBg: 'rgba(13,148,136,.15)',
  tabColor: '#94A3B8',
  tabActiveColor: '#0D9488',
  faqBg: 'rgba(30,41,59,.5)',
  faqBorder: 'rgba(51,65,85,.4)',
  faqQColor: '#E2E8F0',
  faqAColor: '#94A3B8',
  faqHoverBg: 'rgba(13,148,136,.08)',
};

/**
 * Converts plain markdown-like text to safe HTML.
 * Only applies: **bold**, *em*, `code`, newlines, bullet points.
 * Input is from our own renderMarkdown function and AWS Bedrock API responses —
 * no raw user HTML is passed through, so XSS is not a concern here.
 */
function renderMarkdown(text: string, codeBg: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(
      /`(.*?)`/g,
      `<code style="background:${codeBg};padding:1px 5px;border-radius:4px;font-size:11px">$1</code>`
    )
    .replace(/\n- /g, '\n• ')
    .replace(/\n/g, '<br/>');
}

// ─── CHAT WIDGET COMPONENT ──────────────────────────
export default function ChatWidget({ user }: { user?: Record<string, unknown> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'faq'>('chat');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm **Kira** — your personal financial advisor.\n\nAsk me anything about your finances. I'll give you personalized advice based on your financial profile.\n\nWhat would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, activeTab]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    setInput('');
    setShowSuggestions(false);

    const userMsg: ChatMessage = { role: 'user', content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const financialContext = buildFinancialContext(user);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history, financialContext }),
      });

      const data = (await res.json()) as { reply?: string };

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.reply ||
            "I couldn't get a response. Please try again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I couldn't process your request right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const fontFamily = "var(--font-display, 'DM Sans', sans-serif)";

  return (
    <>
      <style>{`
        @keyframes meraFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes meraPulse {
          0% { box-shadow: 0 0 0 0 rgba(13,148,136,.5); }
          70% { box-shadow: 0 0 0 14px rgba(13,148,136,0); }
          100% { box-shadow: 0 0 0 0 rgba(13,148,136,0); }
        }
        @keyframes meraSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes meraTyping {
          0%, 80%, 100% { transform: scale(0); opacity: .5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .mera-msg-enter {
          animation: meraSlideUp .3s ease forwards;
        }
        .mera-faq-item {
          transition: background .2s;
        }
        .mera-scrollbar::-webkit-scrollbar { width: 4px; }
        .mera-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .mera-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(13,148,136,.3);
          border-radius: 4px;
        }
        .kira-float-btn {
          animation: meraFloat 3s ease-in-out infinite, meraPulse 2s infinite;
        }
        .kira-float-btn:hover { transform: scale(1.1); }
      `}</style>

      {/* ─── FLOATING BUTTON ─────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Kira AI Assistant"
          className="kira-float-btn"
          style={{
            position: 'fixed',
            bottom: 80,
            right: 24,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0D9488, #0284C7)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            color: 'white',
            zIndex: 9999,
            boxShadow: '0 8px 32px rgba(13,148,136,.45)',
          }}
        >
          🧠
        </button>
      )}

      {/* ─── CHAT PANEL ──────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 24,
            width: 380,
            height: 560,
            borderRadius: 20,
            background: T.panelBg,
            border: `1px solid ${T.panelBorder}`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: T.panelShadow,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9999,
            animation: 'meraSlideUp .35s cubic-bezier(.34,1.56,.64,1) forwards',
            fontFamily,
          }}
        >
          {/* ─── HEADER ────────────────────────────────── */}
          <div
            style={{
              padding: '14px 16px',
              background: T.headerBg,
              borderBottom: `1px solid ${T.headerBorder}`,
              display: 'flex',
              alignItems: 'center',
              gap: 11,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #0D9488, #0284C7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                boxShadow: '0 4px 15px rgba(13,148,136,.4)',
                flexShrink: 0,
              }}
            >
              🧠
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: T.titleColor,
                  fontFamily: 'var(--font-serif, Georgia, serif)',
                }}
              >
                Kira
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: '#0D9488',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#22C55E',
                    display: 'inline-block',
                  }}
                />
                Your Financial Advisor
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: 'rgba(239,68,68,.12)',
                border: '1px solid rgba(239,68,68,.25)',
                color: '#EF4444',
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'sans-serif',
              }}
            >
              ✕
            </button>
          </div>

          {/* ─── TABS ─────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              padding: '6px 14px',
              gap: 6,
              borderBottom: `1px solid ${T.headerBorder}`,
            }}
          >
            {(['chat', 'faq'] as const).map((tabId) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily,
                  background: activeTab === tabId ? T.tabActiveBg : 'transparent',
                  color: activeTab === tabId ? T.tabActiveColor : T.tabColor,
                  transition: 'all .2s',
                }}
              >
                {tabId === 'chat' ? '💬 Chat' : '❓ FAQ'}
              </button>
            ))}
          </div>

          {/* ─── CHAT TAB ──────────────────────────────── */}
          {activeTab === 'chat' && (
            <>
              {/* MESSAGES AREA */}
              <div
                className="mera-scrollbar"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '14px 14px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className="mera-msg-enter"
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                    }}
                  >
                    {/* Safe: renderMarkdown only applies bold/em/code/br to text from our API */}
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius:
                          msg.role === 'user'
                            ? '14px 14px 4px 14px'
                            : '14px 14px 14px 4px',
                        background:
                          msg.role === 'user'
                            ? 'linear-gradient(135deg, #0D9488, #0284C7)'
                            : T.msgBotBg,
                        border:
                          msg.role === 'user'
                            ? 'none'
                            : `1px solid ${T.msgBotBorder}`,
                        color: msg.role === 'user' ? '#fff' : T.msgBotColor,
                        fontSize: 13,
                        lineHeight: 1.65,
                      }}
                      // Safe: renderMarkdown only applies known safe HTML tags (strong/em/code/br)
                      // Input comes from AWS Bedrock API, not raw user HTML
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(msg.content, T.codeBg),
                      }}
                    />
                  </div>
                ))}

                {/* TYPING INDICATOR */}
                {isLoading && (
                  <div
                    className="mera-msg-enter"
                    style={{ alignSelf: 'flex-start', maxWidth: '85%' }}
                  >
                    <div
                      style={{
                        padding: '12px 18px',
                        borderRadius: '14px 14px 14px 4px',
                        background: T.msgBotBg,
                        border: `1px solid ${T.msgBotBorder}`,
                        display: 'flex',
                        gap: 5,
                        alignItems: 'center',
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: '#0D9488',
                            display: 'inline-block',
                            animation: `meraTyping 1.4s ${i * 0.16}s infinite ease-in-out both`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* QUICK SUGGESTIONS */}
              {showSuggestions && messages.length <= 1 && (
                <div
                  style={{
                    padding: '0 14px 8px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                  }}
                >
                  {QUICK_SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 20,
                        background: 'rgba(13,148,136,.1)',
                        border: '1px solid rgba(13,148,136,.25)',
                        color: '#0D9488',
                        fontSize: 11,
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily,
                        transition: 'all .2s',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.background = 'rgba(13,148,136,.2)';
                        el.style.borderColor = 'rgba(13,148,136,.5)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.background = 'rgba(13,148,136,.1)';
                        el.style.borderColor = 'rgba(13,148,136,.25)';
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* INPUT BAR */}
              <div
                style={{
                  padding: '10px 14px 14px',
                  borderTop: `1px solid ${T.inputBarBorder}`,
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  background: T.inputBarBg,
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Kira anything..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    background: T.inputBg,
                    border: `1px solid ${T.inputBorder}`,
                    borderRadius: 12,
                    padding: '10px 14px',
                    color: T.inputColor,
                    fontSize: 13,
                    fontFamily,
                    outline: 'none',
                    transition: 'border-color .2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0D9488';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = T.inputBorder;
                  }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background:
                      input.trim() && !isLoading
                        ? 'linear-gradient(135deg, #0D9488, #0284C7)'
                        : T.sendDisabledBg,
                    border: 'none',
                    color: input.trim() && !isLoading ? '#fff' : T.sendDisabledColor,
                    fontSize: 16,
                    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all .2s',
                    flexShrink: 0,
                  }}
                >
                  ➤
                </button>
              </div>
            </>
          )}

          {/* ─── FAQ TAB ───────────────────────────────── */}
          {activeTab === 'faq' && (
            <div
              className="mera-scrollbar"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px 14px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: T.tabColor,
                  marginBottom: 4,
                  fontWeight: 500,
                }}
              >
                Frequently Asked Questions
              </div>
              {FAQ_ITEMS.map((faq, idx) => (
                <div
                  key={idx}
                  className="mera-faq-item"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: expandedFaq === idx ? T.faqHoverBg : T.faqBg,
                    border: `1px solid ${T.faqBorder}`,
                    cursor: 'pointer',
                    transition: 'all .2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: T.faqQColor,
                        lineHeight: 1.4,
                      }}
                    >
                      {faq.q}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: '#0D9488',
                        transform: expandedFaq === idx ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform .2s',
                        flexShrink: 0,
                      }}
                    >
                      ▾
                    </span>
                  </div>
                  {expandedFaq === idx && (
                    <div
                      style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: `1px solid ${T.faqBorder}`,
                        fontSize: 12,
                        lineHeight: 1.7,
                        color: T.faqAColor,
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}

              {/* Ask Kira link */}
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button
                  onClick={() => setActiveTab('chat')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 20,
                    background: 'linear-gradient(135deg, #0D9488, #0284C7)',
                    border: 'none',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily,
                    transition: 'opacity .2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.85';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  💬 Ask Kira for more help
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
