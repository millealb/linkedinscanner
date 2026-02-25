import { useState } from "react";

const SYSTEM_PROMPT = `You are an expert recruiter assistant evaluating candidates for a Finance Operations Control Analyst role.

JOB DESCRIPTION:
Finance Operations Control Analyst responsible for high-volume transaction reconciliation, balance validations, data analysis and financial integrity.

Key Responsibilities:
- Daily high-volume reconciliation of transactions from various payment providers and internal systems
- Investigation and flagging of transaction-level discrepancies
- Support balance calculations and periodic reconciliations
- Ad-hoc financial analysis, data queries, and reporting

Requirements:
- Bachelor's degree in Finance, Accounting, Business, or related field
- 1-3 years in finance operations or reconciliation
- Strong Excel proficiency
- Ability to work with large, complex datasets

HIRING MANAGER CRITERIA:
- Minimum 2 years of relevant experience (not just AR/AP or pure accounting)
- Preferred background: fintech, payments, or operational finance
- Must show initiative, propose solutions and have exposure to P&L impact
- Soft skills: fast thinking, problem-solving, energy and growth potential
- SQL, BI or automation tools are a plus
- Potential and attitude valued over perfect technical match

Return ONLY a JSON object, no markdown, no extra text:
{
  "score": <number 0-100>,
  "verdict": "<STRONG FIT | GOOD FIT | POSSIBLE FIT | WEAK FIT | NO FIT>",
  "summary": "<2-3 sentence summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "recommendation": "<one clear sentence on whether to move forward and why>"
}`;

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
  const color = score >= 75 ? "#16a34a" : score >= 55 ? "#d97706" : "#dc2626";

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
  const [profile, setProfile] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!profile.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ text: `${SYSTEM_PROMPT}\n\nEvaluate this candidate profile:\n\n${profile}` }] 
            }],
            generationConfig: { temperature: 0.3 }
          })
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("Error analyzing the profile. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const verdict = result ? verdictConfig[result.verdict] || verdictConfig["POSSIBLE FIT"] : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'DM Sans', sans-serif", color: "#111827", padding: "40px 20px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 720, margin: "0 auto 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span style={{ fontSize: 13, color: "#9ca3af", letterSpacing: 3, fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>FINANCE OPS · CANDIDATE SCANNER</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0, color: "#111827", letterSpacing: -0.5 }}>Finance Operations Control Analyst</h1>
        <p style={{ color: "#6b7280", margin: "6px 0 0", fontSize: 14 }}>Paste the candidate's LinkedIn profile and get the analysis instantly.</p>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto 24px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>LINKEDIN PROFILE</span>
          </div>
          <textarea
            value={profile} onChange={e => setProfile(e.target.value)}
            placeholder="Paste the full LinkedIn profile text here (experience, education, skills, etc.)..."
            style={{ width: "100%", minHeight: 180, background: "transparent", border: "none", outline: "none", padding: "20px", color: "#374151", fontSize: 14, lineHeight: 1.6, resize: "vertical", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
          />
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
          <p style={{ color: "#9ca3af", marginTop: 16, fontSize: 14 }}>Evaluating profile against position criteria...</p>
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
              <div style={{ display: "inline-block", background: "#fff", color: verdict.color, border: `1px solid ${verdict.border}`, borderRadius: 8, padding: "4px 14px", fontSize: 12, fontWeight: 700, letterSpacing: 2, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>{result.verdict}</div>
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
