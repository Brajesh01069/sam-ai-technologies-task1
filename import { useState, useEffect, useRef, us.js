import { useState, useEffect, useRef, useCallback } from "react";

const LANGUAGES = [
  { code: "auto", name: "Auto Detect" },
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ur", name: "Urdu" },
  { code: "ar", name: "Arabic" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "ru", name: "Russian" },
  { code: "tr", name: "Turkish" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "no", name: "Norwegian" },
  { code: "cs", name: "Czech" },
  { code: "sk", name: "Slovak" },
  { code: "ro", name: "Romanian" },
  { code: "hu", name: "Hungarian" },
  { code: "el", name: "Greek" },
  { code: "bg", name: "Bulgarian" },
  { code: "hr", name: "Croatian" },
  { code: "sr", name: "Serbian" },
  { code: "uk", name: "Ukrainian" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "tl", name: "Filipino" },
  { code: "sw", name: "Swahili" },
  { code: "he", name: "Hebrew" },
  { code: "fa", name: "Persian" },
  { code: "bn", name: "Bengali" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "mr", name: "Marathi" },
  { code: "gu", name: "Gujarati" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
  { code: "ne", name: "Nepali" },
  { code: "si", name: "Sinhala" },
  { code: "km", name: "Khmer" },
  { code: "lo", name: "Lao" },
  { code: "my", name: "Burmese" },
  { code: "ka", name: "Georgian" },
  { code: "am", name: "Amharic" },
  { code: "yo", name: "Yoruba" },
  { code: "ig", name: "Igbo" },
  { code: "ha", name: "Hausa" },
  { code: "af", name: "Afrikaans" },
  { code: "sq", name: "Albanian" },
  { code: "hy", name: "Armenian" },
  { code: "az", name: "Azerbaijani" },
  { code: "eu", name: "Basque" },
  { code: "be", name: "Belarusian" },
  { code: "bs", name: "Bosnian" },
  { code: "ca", name: "Catalan" },
  { code: "et", name: "Estonian" },
  { code: "ga", name: "Irish" },
  { code: "is", name: "Icelandic" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "mk", name: "Macedonian" },
  { code: "mt", name: "Maltese" },
  { code: "sl", name: "Slovenian" },
  { code: "cy", name: "Welsh" },
];

const TRANSLATION_MODES = [
  { id: "standard", label: "Standard", icon: "⚡" },
  { id: "professional", label: "Professional", icon: "💼" },
  { id: "business", label: "Business", icon: "📊" },
  { id: "legal", label: "Legal", icon: "⚖️" },
  { id: "medical", label: "Medical", icon: "🏥" },
  { id: "academic", label: "Academic", icon: "🎓" },
  { id: "technical", label: "Technical", icon: "⚙️" },
  { id: "casual", label: "Casual", icon: "💬" },
  { id: "formal", label: "Formal", icon: "🎩" },
  { id: "marketing", label: "Marketing", icon: "📣" },
];

const TABS = ["translate", "document", "image", "history", "analytics", "assistant"];

function NeuralBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const NODE_COUNT = 55;
    nodesRef.current = Array.from({ length: NODE_COUNT }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
      bright: Math.random() > 0.85,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        n.pulse += n.pulseSpeed;

        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          n.vx += (dx / dist) * 0.015;
          n.vy += (dy / dist) * 0.015;
          const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
          if (speed > 1.5) { n.vx /= speed; n.vy /= speed; }
        }
      });

      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            const alpha = (1 - d / 110) * 0.25;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      nodes.forEach((n) => {
        const glow = (Math.sin(n.pulse) + 1) / 2;
        const alpha = n.bright ? 0.6 + glow * 0.4 : 0.2 + glow * 0.15;
        const r = n.r + (n.bright ? glow * 1.5 : 0);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

function GlassCard({ children, style = {}, className = "" }) {
  return (
    <div className={className} style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 16,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function ConfidenceBar({ score }) {
  const color = score > 85 ? "#4ade80" : score > 65 ? "#facc15" : "#f87171";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 99 }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 12, color, fontWeight: 600, minWidth: 36 }}>{score}%</span>
    </div>
  );
}

function TranslateTab({ history, setHistory }) {
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [mode, setMode] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const [detectedLang, setDetectedLang] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setWordCount(sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0);
    setCharCount(sourceText.length);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (sourceText.trim().length > 2) {
      timerRef.current = setTimeout(() => translate(sourceText), 800);
    } else {
      setTranslatedText("");
      setConfidence(null);
      setDetectedLang(null);
    }
    return () => clearTimeout(timerRef.current);
  }, [sourceText, targetLang, mode]);

  const translate = async (text) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const srcLang = sourceLang === "auto" ? "auto-detected language" : LANGUAGES.find(l => l.code === sourceLang)?.name;
      const tgtLang = LANGUAGES.find(l => l.code === targetLang)?.name || "English";

      const prompt = `You are an expert AI translator. Translate the following text${sourceLang !== "auto" ? ` from ${srcLang}` : ""} to ${tgtLang}.
Translation mode: ${mode} (apply appropriate tone and vocabulary for this context).
${sourceLang === "auto" ? "Also detect the source language." : ""}

Text to translate:
"""
${text}
"""

Respond ONLY with a JSON object (no markdown, no backticks) in this exact format:
{
  "translation": "the translated text here",
  "detected_language": "language name if auto-detect was requested, otherwise null",
  "confidence": 92,
  "brief_note": "one sentence about any important cultural/linguistic nuances (optional, null if none)"
}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

      setTranslatedText(parsed.translation || "");
      setConfidence(parsed.confidence || 88);
      if (parsed.detected_language) setDetectedLang(parsed.detected_language);
      if (parsed.brief_note) setExplanation(parsed.brief_note);
      else setExplanation("");

      const newEntry = {
        id: Date.now(),
        sourceText: text,
        translatedText: parsed.translation,
        sourceLang: parsed.detected_language || srcLang,
        targetLang: tgtLang,
        mode,
        confidence: parsed.confidence || 88,
        timestamp: new Date().toLocaleString(),
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 49)]);
    } catch (e) {
      setTranslatedText("Translation error. Please try again.");
    }
    setLoading(false);
  };

  const swap = () => {
    if (sourceLang === "auto") return;
    const tmp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tmp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copy = () => { if (translatedText) navigator.clipboard.writeText(translatedText); };

  const getExplanation = async () => {
    if (!translatedText || !sourceText) return;
    setShowExplanation(true);
    setExplanation("Analyzing translation...");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 500,
          messages: [{
            role: "user",
            content: `Briefly explain (2-3 sentences) the key translation decisions made when translating this text in ${mode} mode. Source: "${sourceText}" → Translation: "${translatedText}". Focus on linguistic choices, idioms, or cultural adaptations.`
          }],
        }),
      });
      const data = await res.json();
      setExplanation(data.content?.[0]?.text || "");
    } catch { setExplanation("Could not fetch explanation."); }
  };

  const S = {
    container: { display: "flex", flexDirection: "column", gap: 16 },
    modeBar: { display: "flex", gap: 6, flexWrap: "wrap" },
    modeBtn: (active) => ({
      padding: "5px 12px", borderRadius: 99, fontSize: 12, cursor: "pointer",
      border: active ? "1px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.15)",
      background: active ? "rgba(255,255,255,0.12)" : "transparent",
      color: active ? "#fff" : "rgba(255,255,255,0.5)",
      transition: "all 0.2s",
    }),
    row: { display: "flex", gap: 12, alignItems: "center" },
    select: {
      flex: 1, padding: "10px 14px", background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
      color: "#fff", fontSize: 14, cursor: "pointer",
    },
    swapBtn: {
      padding: "10px 14px", background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
      color: "#fff", cursor: "pointer", fontSize: 18, flexShrink: 0,
    },
    panelRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    panel: {
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 14, padding: 16, position: "relative",
    },
    label: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" },
    textarea: {
      width: "100%", minHeight: 160, background: "transparent",
      border: "none", outline: "none", color: "#fff", fontSize: 15,
      resize: "vertical", fontFamily: "inherit", lineHeight: 1.6,
    },
    charCount: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8, textAlign: "right" },
    actionBtn: (variant) => ({
      padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
      border: variant === "primary" ? "none" : "1px solid rgba(255,255,255,0.2)",
      background: variant === "primary" ? "rgba(255,255,255,0.9)" : "transparent",
      color: variant === "primary" ? "#000" : "rgba(255,255,255,0.7)",
      fontWeight: variant === "primary" ? 600 : 400,
    }),
    loadingDot: {
      display: "inline-block", width: 6, height: 6, borderRadius: "50%",
      background: "rgba(255,255,255,0.6)", animation: "pulse 1.2s ease-in-out infinite",
    },
  };

  return (
    <div style={S.container}>
      <div style={S.modeBar}>
        {TRANSLATION_MODES.map(m => (
          <button key={m.id} style={S.modeBtn(mode === m.id)} onClick={() => setMode(m.id)}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      <div style={S.row}>
        <select value={sourceLang} onChange={e => setSourceLang(e.target.value)} style={S.select}>
          {LANGUAGES.map(l => <option key={l.code} value={l.code} style={{ background: "#111" }}>{l.name}</option>)}
        </select>
        <button onClick={swap} style={S.swapBtn} title="Swap languages">⇄</button>
        <select value={targetLang} onChange={e => setTargetLang(e.target.value)} style={S.select}>
          {LANGUAGES.filter(l => l.code !== "auto").map(l => (
            <option key={l.code} value={l.code} style={{ background: "#111" }}>{l.name}</option>
          ))}
        </select>
      </div>

      {detectedLang && (
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
          🔍 Detected: <span style={{ color: "rgba(255,255,255,0.75)" }}>{detectedLang}</span>
        </div>
      )}

      <div style={S.panelRow}>
        <div style={S.panel}>
          <div style={S.label}>Source text</div>
          <textarea
            style={S.textarea}
            placeholder="Type or paste text to translate..."
            value={sourceText}
            onChange={e => setSourceText(e.target.value)}
          />
          <div style={S.charCount}>{wordCount} words · {charCount} chars</div>
          {sourceText && (
            <button onClick={() => { setSourceText(""); setTranslatedText(""); setConfidence(null); }}
              style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 18 }}>
              ×
            </button>
          )}
        </div>

        <div style={S.panel}>
          <div style={S.label}>Translation</div>
          {loading ? (
            <div style={{ padding: "12px 0", display: "flex", gap: 6, alignItems: "center" }}>
              {[0, 150, 300].map(d => (
                <span key={d} style={{ ...S.loadingDot, animationDelay: `${d}ms` }} />
              ))}
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>Translating…</span>
            </div>
          ) : (
            <div style={{ fontSize: 15, color: translatedText ? "#fff" : "rgba(255,255,255,0.25)", lineHeight: 1.6, minHeight: 160, whiteSpace: "pre-wrap" }}>
              {translatedText || "Translation will appear here…"}
            </div>
          )}
          {confidence !== null && !loading && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>CONFIDENCE</div>
              <ConfidenceBar score={confidence} />
            </div>
          )}
          {translatedText && (
            <button onClick={copy}
              style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>
              Copy
            </button>
          )}
        </div>
      </div>

      {translatedText && !loading && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={S.actionBtn("secondary")} onClick={getExplanation}>💡 Explain translation</button>
          <button style={S.actionBtn("secondary")} onClick={() => {
            const text = `Source: ${sourceText}\n\nTranslation (${LANGUAGES.find(l => l.code === targetLang)?.name}): ${translatedText}`;
            const blob = new Blob([text], { type: "text/plain" });
            const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
            a.download = "translation.txt"; a.click();
          }}>⬇ Download</button>
        </div>
      )}

      {showExplanation && explanation && (
        <GlassCard style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Translation Insight</span>
            <button onClick={() => setShowExplanation(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>×</button>
          </div>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{explanation}</p>
        </GlassCard>
      )}
    </div>
  );
}

function DocumentTab() {
  const [file, setFile] = useState(null);
  const [targetLang, setTargetLang] = useState("en");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = (e) => { setFile(e.target.files[0]); setResult(""); };

  const translate = async () => {
    if (!file) return;
    setLoading(true); setProgress(0);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      setProgress(30);
      const tgtName = LANGUAGES.find(l => l.code === targetLang)?.name || "English";
      try {
        setProgress(60);
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1000,
            messages: [{
              role: "user",
              content: `Translate the following document text to ${tgtName}. Preserve the structure and formatting as much as possible. Return only the translated text:\n\n${text.substring(0, 3000)}`
            }],
          }),
        });
        const data = await res.json();
        setProgress(100);
        setResult(data.content?.[0]?.text || "Translation failed.");
      } catch { setResult("Translation error. Please try again."); }
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <select value={targetLang} onChange={e => setTargetLang(e.target.value)}
          style={{ flex: 1, padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 14 }}>
          {LANGUAGES.filter(l => l.code !== "auto").map(l => (
            <option key={l.code} value={l.code} style={{ background: "#111" }}>{l.name}</option>
          ))}
        </select>
      </div>

      <label style={{ display: "block", border: "2px dashed rgba(255,255,255,0.15)", borderRadius: 14, padding: "40px 20px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}>
        <input type="file" accept=".txt,.doc,.docx,.pdf" onChange={handleFile} style={{ display: "none" }} />
        <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginBottom: 6 }}>
          {file ? file.name : "Upload document to translate"}
        </div>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>TXT, DOC, DOCX, PDF supported</div>
      </label>

      {file && (
        <button onClick={translate} disabled={loading}
          style={{ padding: "12px 24px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 10, color: "#000", fontWeight: 700, fontSize: 15, cursor: loading ? "wait" : "pointer" }}>
          {loading ? `Translating… ${progress}%` : "Translate Document"}
        </button>
      )}

      {loading && (
        <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 99 }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "rgba(255,255,255,0.6)", borderRadius: 99, transition: "width 0.3s ease" }} />
        </div>
      )}

      {result && (
        <GlassCard style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Translated Document</span>
            <button onClick={() => {
              const blob = new Blob([result], { type: "text/plain" });
              const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
              a.download = `translated_${file.name}`; a.click();
            }} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, color: "#fff", fontSize: 12, cursor: "pointer" }}>
              ⬇ Download
            </button>
          </div>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{result}</p>
        </GlassCard>
      )}
    </div>
  );
}

function ImageTab() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [targetLang, setTargetLang] = useState("en");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(f);
    setResult(null);
  };

  const analyze = async () => {
    if (!file || !preview) return;
    setLoading(true);
    try {
      const base64 = preview.split(",")[1];
      const mediaType = file.type;
      const tgtName = LANGUAGES.find(l => l.code === targetLang)?.name || "English";

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
              {
                type: "text",
                text: `Extract ALL text visible in this image, then translate it to ${tgtName}. Respond ONLY with JSON (no backticks): {"extracted_text": "all text found in image", "translated_text": "translation of that text", "text_found": true/false}`
              }
            ]
          }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setResult(parsed);
    } catch { setResult({ error: "Analysis failed. Please try again." }); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <select value={targetLang} onChange={e => setTargetLang(e.target.value)}
        style={{ padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 14 }}>
        {LANGUAGES.filter(l => l.code !== "auto").map(l => (
          <option key={l.code} value={l.code} style={{ background: "#111" }}>{l.name}</option>
        ))}
      </select>

      <label style={{ display: "block", border: "2px dashed rgba(255,255,255,0.15)", borderRadius: 14, padding: preview ? "16px" : "40px 20px", textAlign: "center", cursor: "pointer" }}>
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        {preview ? (
          <img src={preview} alt="Upload" style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 10, objectFit: "contain" }} />
        ) : (
          <>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🖼</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginBottom: 6 }}>Upload image with text</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>JPG, PNG, WEBP — AI will extract and translate text</div>
          </>
        )}
      </label>

      {file && (
        <button onClick={analyze} disabled={loading}
          style={{ padding: "12px 24px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 10, color: "#000", fontWeight: 700, fontSize: 15, cursor: loading ? "wait" : "pointer" }}>
          {loading ? "Analyzing image…" : "Extract & Translate Text"}
        </button>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {result.error ? (
            <GlassCard style={{ padding: 16 }}><p style={{ color: "#f87171", margin: 0 }}>{result.error}</p></GlassCard>
          ) : result.text_found === false ? (
            <GlassCard style={{ padding: 16 }}><p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>No text detected in this image.</p></GlassCard>
          ) : (
            <>
              <GlassCard style={{ padding: 16 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Extracted Text</div>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{result.extracted_text}</p>
              </GlassCard>
              <GlassCard style={{ padding: 16 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Translation</div>
                <p style={{ color: "#fff", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{result.translated_text}</p>
              </GlassCard>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function HistoryTab({ history, setHistory }) {
  const [filter, setFilter] = useState("");
  const filtered = history.filter(h =>
    h.sourceText?.toLowerCase().includes(filter.toLowerCase()) ||
    h.translatedText?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          placeholder="Search history…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ flex: 1, padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none" }}
        />
        {history.length > 0 && (
          <button onClick={() => setHistory([])}
            style={{ padding: "10px 16px", background: "rgba(255,50,50,0.15)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 10, color: "#f87171", fontSize: 13, cursor: "pointer" }}>
            Clear All
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.25)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🕐</div>
          <p style={{ margin: 0 }}>No translations yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(item => (
            <GlassCard key={item.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, padding: "3px 8px", background: "rgba(255,255,255,0.08)", borderRadius: 99, color: "rgba(255,255,255,0.5)" }}>{item.sourceLang}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>→</span>
                    <span style={{ fontSize: 11, padding: "3px 8px", background: "rgba(255,255,255,0.08)", borderRadius: 99, color: "rgba(255,255,255,0.5)" }}>{item.targetLang}</span>
                    <span style={{ fontSize: 11, padding: "3px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 99, color: "rgba(255,255,255,0.35)" }}>{item.mode}</span>
                  </div>
                  <p style={{ margin: "0 0 4px", fontSize: 14, color: "rgba(255,255,255,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.sourceText}</p>
                  <p style={{ margin: 0, fontSize: 14, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.translatedText}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>{item.timestamp}</div>
                  {item.confidence && <div style={{ fontSize: 12, color: "#4ade80" }}>{item.confidence}%</div>}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsTab({ history }) {
  const totalWords = history.reduce((sum, h) => sum + (h.sourceText?.split(" ").length || 0), 0);
  const langCounts = {};
  history.forEach(h => {
    if (h.targetLang) langCounts[h.targetLang] = (langCounts[h.targetLang] || 0) + 1;
  });
  const topLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const avgConf = history.length ? Math.round(history.reduce((s, h) => s + (h.confidence || 0), 0) / history.length) : 0;
  const modeCounts = {};
  history.forEach(h => { if (h.mode) modeCounts[h.mode] = (modeCounts[h.mode] || 0) + 1; });

  const stat = (label, value, sub) => (
    <GlassCard style={{ padding: 20, textAlign: "center" }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{sub}</div>}
    </GlassCard>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {stat("Translations", history.length.toLocaleString())}
        {stat("Words Processed", totalWords.toLocaleString())}
        {stat("Avg Confidence", avgConf ? `${avgConf}%` : "—")}
      </div>

      {topLangs.length > 0 && (
        <GlassCard style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Top Target Languages</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topLangs.map(([lang, count]) => (
              <div key={lang} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 80, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{lang}</div>
                <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99 }}>
                  <div style={{ width: `${(count / history.length) * 100}%`, height: "100%", background: "rgba(255,255,255,0.5)", borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", minWidth: 28, textAlign: "right" }}>{count}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {Object.keys(modeCounts).length > 0 && (
        <GlassCard style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Translation Modes Used</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(modeCounts).map(([m, c]) => (
              <span key={m} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.08)", borderRadius: 99, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                {m} <span style={{ color: "rgba(255,255,255,0.4)" }}>({c})</span>
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {history.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.25)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ margin: 0 }}>Analytics will appear after your first translation</p>
        </div>
      )}
    </div>
  );
}

function AssistantTab() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your AI language assistant. I can help you with translation questions, explain idioms, compare languages, discuss cultural context, and much more. What would you like to know?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "You are an expert multilingual AI assistant specializing in translation, linguistics, cultural context, and language learning. Be concise, helpful, and insightful.",
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 480 }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%", padding: "12px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: 14, color: "#fff", lineHeight: 1.6,
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 5, padding: "12px 16px" }}>
            {[0, 150, 300].map(d => (
              <span key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.4)", display: "inline-block", animation: `pulse ${1.2}s ease-in-out ${d}ms infinite` }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 10, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask about languages, translations, cultural context…"
          style={{ flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "#fff", fontSize: 14, outline: "none" }}
        />
        <button onClick={send} disabled={!input.trim() || loading}
          style={{ padding: "12px 20px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 12, color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: !input.trim() || loading ? 0.4 : 1 }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("translate");
  const [history, setHistory] = useState([]);

  const tabLabels = {
    translate: "⚡ Translate",
    document: "📄 Document",
    image: "🖼 Image OCR",
    history: "🕐 History",
    analytics: "📊 Analytics",
    assistant: "🤖 AI Assistant",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #060608 0%, #0d0d12 50%, #060608 100%)",
      position: "relative",
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: "#fff",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmer { 0%{opacity:0.5} 50%{opacity:1} 100%{opacity:0.5} }
        select option { background:#111; color:#fff; }
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:99px}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2)}
        select{appearance:none;-webkit-appearance:none}
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <NeuralBackground />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(120,80,255,0.06) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 80% 80%, rgba(80,200,255,0.04) 0%, transparent 60%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36, paddingTop: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 12, animation: "float 4s ease-in-out infinite" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              boxShadow: "0 0 30px rgba(255,255,255,0.15)",
            }}>🌐</div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, background: "linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.6) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              NexusTranslate
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase" }}>
            AI-Powered Language Intelligence Platform
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
            {["100+ Languages", "Real-Time AI", "Enterprise Grade", "Claude Powered"].map(tag => (
              <span key={tag} style={{ fontSize: 11, padding: "4px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, color: "rgba(255,255,255,0.45)" }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Main Panel */}
        <GlassCard style={{ overflow: "hidden" }}>
          {/* Tab Bar */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", overflowX: "auto", padding: "0 8px" }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "14px 18px", background: "none", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: tab === t ? 600 : 400, whiteSpace: "nowrap",
                color: tab === t ? "#fff" : "rgba(255,255,255,0.4)",
                borderBottom: tab === t ? "2px solid rgba(255,255,255,0.7)" : "2px solid transparent",
                transition: "all 0.2s",
              }}>
                {tabLabels[t]}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: 24 }}>
            {tab === "translate" && <TranslateTab history={history} setHistory={setHistory} />}
            {tab === "document" && <DocumentTab />}
            {tab === "image" && <ImageTab />}
            {tab === "history" && <HistoryTab history={history} setHistory={setHistory} />}
            {tab === "analytics" && <AnalyticsTab history={history} />}
            {tab === "assistant" && <AssistantTab />}
          </div>
        </GlassCard>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
          Powered by Claude AI · {LANGUAGES.length - 1}+ languages · Real-time neural translation
        </div>
      </div>
    </div>
  );
}