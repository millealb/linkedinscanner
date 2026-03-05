import { useState } from "react";

const POSITIONS = {
  finance_ops: {
    label: "Finance Operations Control Analyst",
    prompt: `You are a strict and experienced recruiter evaluating candidates for a Finance Operations Control Analyst role at a fintech/payments company. You are known for being direct, accurate, and hard to impress.

## WHAT THIS ROLE IS
This is a transaction reconciliation and financial control role in a payments/fintech company. The person will work with high-volume digital transaction data, identify discrepancies between payment providers and internal systems, and support operational and P&L decisions.

## WHAT THIS ROLE IS NOT
- It is NOT a collections role (chasing payments from clients)
- It is NOT an accounts payable/receivable role (processing invoices)
- It is NOT a traditional accounting role (journal entries, general ledger)
- It is NOT an audit role (compliance checking)

## AUTOMATIC DISQUALIFIERS — cap score at 20 if any apply
- Experience is limited to AR/AP, collections, invoice processing, or traditional accounting with NO transaction-level reconciliation
- No evidence of working with high-volume digital transaction data (payments, transfers, provider settlements)
- Less than 2 years of relevant experience
- Background is 100% traditional banking or corporate accounting with zero fintech/payments exposure

## SCORING CRITERIA (apply strictly)

SECTOR FIT (0-30 points):
- 25-30: Direct fintech, payments, PSP, acquirer, or digital wallet experience
- 15-24: Some fintech/payments adjacent exposure (e-commerce finance, digital banking)
- 5-14: Traditional finance but with clear exposure to digital transaction environments
- 0-4: Pure traditional banking, corporate accounting, or collections

TECHNICAL FIT (0-30 points):
- 25-30: Transaction reconciliation between providers and internal systems, large datasets, SQL or BI tools
- 15-24: Some reconciliation experience but not at transaction level
- 5-14: General finance ops, Excel-heavy, some data work but no transaction reconciliation
- 0-4: AR/AP processing, invoice matching, collections only

DECISION-MAKING & IMPACT (0-20 points):
- 15-20: Evidence of identifying issues that impacted P&L, proposed process improvements, escalated operational risks
- 8-14: Some analytical work beyond execution, cross-functional collaboration
- 0-7: Pure execution role, no evidence of analytical impact

SOFT SKILLS & POTENTIAL (0-20 points):
- 15-20: Fast career progression, leadership signals, proactive problem-solver
- 8-14: Solid performer, some growth
- 0-7: Stagnant trajectory, limited growth signals

## CRITICAL REMINDER
A candidate with years in collections, AR/AP, and invoice processing at big companies is NOT a good fit. Those are impressive companies but the WORK TYPE is wrong. Score them max 20. Do not be swayed by brand names.

Return ONLY a JSON object, no markdown, no extra text:
{
  "score": <number 0-100>,
  "verdict": "<STRONG FIT | GOOD FIT | POSSIBLE FIT | WEAK FIT | NO FIT>",
  "summary": "<2-3 sentence summary in English>",
  "strengths": ["<strength>", "<strength>", "<strength>"],
  "gaps": ["<gap>", "<gap>"],
  "recommendation": "<one direct sentence: move forward or not and why>"
}`
  },
  sales_exec: {
    label: "Sales Executive - Tupay",
    prompt: `You are a strict and experienced recruiter evaluating candidates for a Sales Executive role at Tupay, a payments company in Latin America. You are known for being direct, accurate, and hard to impress.

## WHAT THIS ROLE IS
A hunter/farmer sales role focused on acquiring and growing merchants for a payment facilitator/aggregator. This person needs to own the full sales cycle, understand the payments ecosystem deeply, and build long-term commercial relationships. Senior role — 3+ years required.

## WHAT THIS ROLE IS NOT
- It is NOT a generic B2B sales role — payments industry knowledge is MANDATORY
- It is NOT an account management role focused only on retention
- A great salesperson from outside payments will NOT qualify — sector is non-negotiable

## AUTOMATIC DISQUALIFIERS — cap score at 20 if any apply
- Zero experience in the payments industry (PSP, acquirer, payment facilitator, aggregator, fintech payments)
- Less than 3 years of sales or business development experience
- No evidence of hunting new clients (purely account management or inbound only)
- No commercial results or sales track record mentioned

## SCORING CRITERIA (apply strictly)

PAYMENTS INDUSTRY FIT (0-35 points) — MOST IMPORTANT:
- 30-35: Direct experience at PSP, payment facilitator, acquirer, aggregator, or fintech payments (dLocal, Adyen, Stripe, Mercado Pago, PayRetailers, Kushki, etc.)
- 20-29: Fintech sales adjacent to payments (digital wallets, banking-as-a-service) with merchant acquiring knowledge
- 10-19: Financial services sales (banks) with some payments exposure
- 0-9: No payments experience — automatic disqualifier

SALES TRACK RECORD (0-25 points):
- 20-25: Clear hunting experience, quota attainment, new merchant acquisition, pipeline ownership
- 12-19: Mix of hunting and farming, some results mentioned
- 5-11: Mostly account management, limited new business development
- 0-4: No evidence of sales results

SENIORITY & EXPERIENCE (0-20 points):
- 16-20: 5+ years in payments sales, senior progression
- 10-15: 3-5 years relevant experience
- 4-9: 2-3 years, junior for the role
- 0-3: Under 2 years

MARKET KNOWLEDGE & RELATIONSHIPS (0-20 points):
- 16-20: Active portfolio in LATAM payments/fintech, existing merchant relationships
- 10-15: Good network in financial services, some payments market knowledge
- 4-9: General B2B relationships, limited payments network
- 0-3: No relevant commercial network

## CRITICAL REMINDER
A great salesperson with zero payments experience scores MAX 25. Payments industry experience is non-negotiable. Do not compensate with transferable sales skills — the industry is the hard filter.

Return ONLY a JSON object, no markdown, no extra text:
{
  "score": <number 0-100>,
  "verdict": "<STRONG FIT | GOOD FIT | POSSIBLE FIT | WEAK FIT | NO FIT>",
  "summary": "<2-3 sentence summary in English>",
  "strengths": ["<strength>", "<strength>", "<strength>"],
  "gaps": ["<gap>", "<gap>"],
  "recommendation": "<one direct sentence: move forward or not and why>"
}`
  }
};

const verdictConfig = {
  "STRONG FIT": { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  "GOOD FIT": { color: "#65a30d", bg: "#f7fee7", border: "#d9f99d" },
  "POSSIBLE FIT": { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  "WEAK FIT": { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
  "NO FIT": { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <span style={{ fontSize: 32, fontWeight: 800, color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 11, color: "#9ca3af", letterSpacing: 2, fontFamily: "'DM Mono', monospace" }}>SCORE</span>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedPosition, setSelectedPosition] = useState("finance_ops");
  const [profile, setProfile] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!profile.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    const prompt = POSITIONS[selectedPosition].prompt;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `${prompt}\n\nEvaluate this candidate profile:\n\n${profile}` }]
            }],
            generationConfig: { temperature: 0.1 }
          })
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("Error analyzing the profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verdict = result ? verdictConfig[result.verdict] || verdictConfig["POSSIBLE FIT"] : null;
  const position = POSITIONS[selectedPosition];

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'DM Sans', sans-serif", color: "#111827", padding: "40px 20px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 720, margin: "0 auto 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span style={{ fontSize: 13, color: "#9ca3af", letterSpacing: 3, fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>TUPAY · CANDIDATE SCANNER</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0, color: "#111827", letterSpacing: -0.5 }}>LinkedIn Profile Scanner</h1>
        <p style={{ color: "#6b7280", margin: "6px 0 0", fontSize: 14 }}>Select a position, paste the candidate's LinkedIn profile, and get the analysis instantly.</p>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto 20px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {Object.entries(POSITIONS).map(([key, pos]) => (
            <button key={key}
              onClick={() => { setSelectedPosition(key); setResult(null); setProfile(""); }}
              style={{
                flex: 1, padding: "12px 16px", borderRadius: 12,
                border: selectedPosition === key ? "2px solid #3b82f6" : "2px solid #e5e7eb",
                background: selectedPosition === key ? "#eff6ff" : "#fff",
                color: selectedPosition === key ? "#1d4ed8" : "#6b7280",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                fontWeight: selectedPosition === key ? 600 : 400,
                cursor: "pointer", transition: "all 0.15s ease", textAlign: "left",
                boxShadow: selectedPosition === key ? "0 0 0 1px #bfdbfe" : "none"
              }}>
              <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 3, color: selectedPosition === key ? "#3b82f6" : "#9ca3af" }}>
                {key === "finance_ops" ? "FINANCE OPS" : "SALES"}
              </div>
              {pos.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto 24px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>LINKEDIN PROFILE</span>
            <span style={{ fontSize: 12, color: "#3b82f6", fontFamily: "'DM Mono', monospace" }}>→ {position.label.toUpperCase()}</span>
          </div>
          <textarea value={profile} onChange={e => setProfile(e.target.value)}
            placeholder="Paste the full LinkedIn profile text here (experience, education, skills, etc.)..."
            style={{ width: "100%", minHeight: 180, background: "transparent", border: "none", outline: "none", padding: "20px", color: "#374151", fontSize: 14, lineHeight: 1.6, resize: "vertical", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
          <div style={{ padding: "12px 20px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={analyze} disabled={loading || !profile.trim()}
              style={{ background: loading || !profile.trim() ? "#e5e7eb" : "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: loading || !profile.trim() ? "#9ca3af" : "#fff", border: "none", borderRadius: 10, padding: "10px 28px", fontSize: 14, fontWeight: 600, cursor: loading || !profile.trim() ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              {loading ? "Analyzing..." : "Analyze candidate →"}
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", padding: "40px 0" }}>
          <div style={{ display: "inline-block", width: 32, height: 32, border: "3px solid #e5e7eb", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <p style={{ color: "#9ca3af", marginTop: 16, fontSize: 14 }}>Evaluating profile against {position.label} criteria...</p>
        </div>
      )}

      {error && (
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 16, color: "#dc2626", fontSize: 14 }}>{error}</div>
        </div>
      )}

      {result && verdict && (
        <div style={{ maxWidth: 720, margin: "0 auto", animation: "fadeIn 0.4s ease" }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }`}</style>

          <div style={{ background: verdict.bg, border: `1px solid ${verdict.border}`, borderRadius: 16, padding: 28, marginBottom: 16, display: "flex", alignItems: "center", gap: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <ScoreRing score={result.score} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                <div style={{ display: "inline-block", background: "#fff", color: verdict.color, border: `1px solid ${verdict.border}`, borderRadius: 8, padding: "4px 14px", fontSize: 12, fontWeight: 700, letterSpacing: 2, fontFamily: "'DM Mono', monospace" }}>{result.verdict}</div>
                <div style={{ fontSize: 12, color: "#9ca3af", fontFamily: "'DM Mono', monospace" }}>{position.label}</div>
              </div>
              <p style={{ margin: 0, color: "#4b5563", fontSize: 14, lineHeight: 1.7 }}>{result.summary}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 11, color: "#16a34a", letterSpacing: 3, fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>✓ STRENGTHS</div>
              {result.strengths?.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ color: "#16a34a", fontSize: 12, marginTop: 2, flexShrink: 0 }}>●</span>
                  <span style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 11, color: "#ea580c", letterSpacing: 3, fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>✗ GAPS</div>
              {result.gaps?.map((g, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ color: "#ea580c", fontSize: 12, marginTop: 2, flexShrink: 0 }}>●</span>
                  <span style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>{g}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 3, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>→ RECOMMENDATION</div>
            <p style={{ margin: 0, color: "#111827", fontSize: 14, lineHeight: 1.7, fontWeight: 500 }}>{result.recommendation}</p>
          </div>

          <div style={{ textAlign: "center", marginTop: 24, paddingBottom: 40 }}>
            <button onClick={() => { setResult(null); setProfile(""); }}
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "#fff", borderRadius: 12, padding: "14px 36px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3, boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}>
              + Analyze another candidate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
