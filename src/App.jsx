import { useState, useEffect } from "react";

const LANGS = [
  { code:"en", name:"English",   flag:"🇬🇧" },
  { code:"fr", name:"Français",  flag:"🇫🇷" },
  { code:"es", name:"Español",   flag:"🇪🇸" },
  { code:"pt", name:"Português", flag:"🇵🇹" },
  { code:"ar", name:"العربية",   flag:"🇸🇦" },
  { code:"zh", name:"中文",       flag:"🇨🇳" },
  { code:"de", name:"Deutsch",   flag:"🇩🇪" },
  { code:"ru", name:"Русский",   flag:"🇷🇺" },
];

const EMERGENCY_KW = [
  "chest pain","chest tightness","cant breathe","can't breathe","cannot breathe",
  "difficulty breathing","heart attack","stroke","seizure","unconscious",
  "not breathing","choking","severe bleeding","anaphylaxis","overdose",
];

const EMERGENCY = {
  en:{ n:"911 / 999 / 112", m:"Call emergency services immediately!" },
  fr:{ n:"15 / 18 / 112",  m:"Appelez les secours immédiatement!" },
  es:{ n:"112",             m:"¡Llame a emergencias ahora!" },
  pt:{ n:"112",             m:"Ligue para emergências imediatamente!" },
  ar:{ n:"911 / 112",       m:"اتصل بالطوارئ فوراً!" },
  zh:{ n:"120 / 112",       m:"立即拨打急救电话！" },
  de:{ n:"112",             m:"Rufen Sie sofort den Notruf!" },
  ru:{ n:"103 / 112",       m:"Немедленно вызовите скорую!" },
};

const FACTS = [
  "💓 Your heart beats about 100,000 times every single day.",
  "🤧 A sneeze travels at up to 160 km/h — your body's fastest reflex.",
  "💧 Your brain is 73% water. Staying hydrated literally helps you think.",
  "🔬 The human body contains approximately 37 trillion cells.",
  "💪 Your bones are, gram for gram, stronger than steel.",
  "🌬️ You take roughly 20,000 breaths every day without even thinking.",
  "✨ Your skin completely replaces itself about every 27 days.",
  "🧠 Your brain generates about 23 watts — enough to power a dim bulb.",
  "🩸 Your blood travels about 19,000 km through your vessels every day.",
  "👁️ The human eye can distinguish around 10 million different colours.",
];

const QUOTES = [
  "Whatever brought you here today — checking on yourself was the right thing to do.",
  "Your body is always speaking. HealAura helps you listen.",
  "Taking care of yourself is one of the bravest things you can do.",
  "Small steps toward your health are never small — they always matter.",
];

const DURATIONS = [
  "Just started (under 1 hour)",
  "A few hours ago",
  "1–2 days ago",
  "3–7 days ago",
  "Over a week ago",
  "Over a month ago",
];

const REGION_PARTS = {
  head:      ["head"],
  neck:      ["neck"],
  chest:     ["chest"],
  abdomen:   ["abdomen"],
  back:      ["chest","abdomen"],
  arms:      ["larm","rarm"],
  legs:      ["lleg","rleg"],
  full_body: ["head","neck","chest","abdomen","larm","rarm","lleg","rleg"],
  none:      [],
};

const REGION_LABELS = {
  head:"Head", neck:"Neck / Throat", chest:"Chest", abdomen:"Abdomen",
  back:"Back / Spine", arms:"Arms", legs:"Legs", full_body:"Full Body",
};

// ── Built-in Symptom Engine ───────────────────────────────────
const SYMPTOM_DB = [
  {
    keywords: ["headache","head pain","migraine","head hurts","throbbing head"],
    region: "head",
    conditions: ["Tension headache", "Migraine", "Dehydration"],
    meaning: "Headaches are very common and usually not serious. They can be triggered by stress, lack of sleep, dehydration, or tension in your neck and shoulders. Migraines may come with sensitivity to light or sound.",
    recommendation: "monitor",
    tips: ["Drink at least 2 glasses of water right now. Dehydration is one of the most common causes of headaches. Rest in a quiet, dark room if possible and avoid screens for a while. A gentle massage on your temples and the back of your neck can also bring relief.",],
  },
  {
    keywords: ["fever","temperature","hot","chills","sweating","feverish"],
    region: "full_body",
    conditions: ["Viral infection", "Common cold or flu", "Mild infection"],
    meaning: "A fever is your body's natural defence mechanism — it means your immune system is actively fighting something off. This is usually a sign of a viral or bacterial infection and is often accompanied by fatigue and body aches.",
    recommendation: "monitor",
    tips: ["Rest as much as possible and drink plenty of fluids — water, herbal tea, or clear broth. Keep yourself cool with a damp cloth on your forehead. If your fever goes above 39.5°C (103°F) or lasts more than 3 days, see a doctor soon.",],
  },
  {
    keywords: ["cough","coughing","sore throat","throat pain","throat hurts","scratchy throat"],
    region: "chest",
    conditions: ["Common cold", "Throat infection", "Mild respiratory infection"],
    meaning: "A cough or sore throat is usually caused by a viral infection like the common cold or flu. Your throat may feel raw or scratchy and you might notice some mild difficulty swallowing. These symptoms are very common and usually resolve on their own within a week.",
    recommendation: "monitor",
    tips: ["Gargle with warm salt water several times a day — this reduces inflammation and kills bacteria. Stay warm, drink warm fluids like honey and lemon tea, and get plenty of rest. Avoid cold drinks and air conditioning where possible.",],
  },
  {
    keywords: ["stomach","nausea","vomiting","stomach ache","stomach pain","belly","abdominal","diarrhoea","diarrhea","digestive"],
    region: "abdomen",
    conditions: ["Gastroenteritis", "Food intolerance", "Indigestion"],
    meaning: "Stomach discomfort, nausea, or digestive issues are very common and are usually caused by something you ate, a mild stomach bug, or stress. Your digestive system is sensitive and can react to many things including food, anxiety, and infections.",
    recommendation: "monitor",
    tips: ["Avoid solid foods for a few hours and sip small amounts of water or clear fluids regularly to stay hydrated. When you feel ready to eat, start with bland foods like rice, toast, or bananas. Avoid dairy, fatty foods, and caffeine until you feel better.",],
  },
  {
    keywords: ["tired","fatigue","exhausted","weakness","no energy","weak","lethargy","lethargic"],
    region: "full_body",
    conditions: ["Sleep deprivation", "Anaemia", "Viral infection"],
    meaning: "Fatigue and weakness can have many causes — from simply not getting enough sleep to nutritional deficiencies or a viral illness. Your body might be telling you it needs rest and recovery time.",
    recommendation: "monitor",
    tips: ["Prioritise sleep — aim for 7 to 9 hours tonight. Eat a balanced meal with iron-rich foods like beans, leafy greens, or meat. Reduce screen time before bed and try to limit caffeine after midday. If fatigue persists for more than 2 weeks, see a doctor.",],
  },
  {
    keywords: ["back pain","back ache","lower back","spine","backache"],
    region: "back",
    conditions: ["Muscle strain", "Poor posture", "Lumbar tension"],
    meaning: "Back pain is one of the most common complaints worldwide. It is usually caused by muscle tension, poor posture, or strain from physical activity. In most cases it improves with rest and gentle movement.",
    recommendation: "monitor",
    tips: ["Apply a warm compress or heating pad to the affected area for 15–20 minutes. Avoid sitting in one position for too long — get up and walk around every hour. Gentle stretching and over-the-counter pain relief like ibuprofen can help. If pain is severe or shoots down your leg, see a doctor.",],
  },
  {
    keywords: ["dizziness","dizzy","lightheaded","vertigo","spinning","faint","fainting"],
    region: "head",
    conditions: ["Dehydration", "Low blood pressure", "Inner ear issue"],
    meaning: "Dizziness and lightheadedness often occur when your blood pressure drops suddenly, when you're dehydrated, or when you stand up too quickly. Inner ear issues can also cause a spinning sensation known as vertigo.",
    recommendation: "monitor",
    tips: ["Sit or lie down immediately to avoid falling. Drink water slowly and avoid sudden movements. If the dizziness is severe, comes with hearing loss, or doesn't improve after resting, please see a doctor soon.",],
  },
  {
    keywords: ["rash","itching","itch","skin","hives","allergy","allergic"],
    region: "full_body",
    conditions: ["Allergic reaction", "Contact dermatitis", "Heat rash"],
    meaning: "Skin rashes and itching are usually caused by an allergic reaction to something you touched, ate, or were exposed to. They can also be caused by heat, dry skin, or insect bites. Most mild rashes clear up on their own.",
    recommendation: "doctor",
    tips: ["Avoid scratching the affected area as this can worsen irritation and cause infection. Apply a cool damp cloth to soothe the skin. Try to identify what you may have come into contact with recently. If the rash is spreading rapidly or you have difficulty breathing, seek urgent care immediately.",],
  },
  {
    keywords: ["eye","eyes","blurry","vision","red eye","eye pain","watery eyes"],
    region: "head",
    conditions: ["Conjunctivitis", "Eye strain", "Dry eyes"],
    meaning: "Eye discomfort, redness, or blurry vision can be caused by screen fatigue, allergies, or conjunctivitis (pink eye). These are usually not serious but should be monitored closely.",
    recommendation: "doctor",
    tips: ["Rest your eyes by following the 20-20-20 rule — every 20 minutes, look at something 20 feet away for 20 seconds. Avoid rubbing your eyes. If you wear contact lenses, remove them. If vision becomes significantly blurry or you experience sudden eye pain, see a doctor promptly.",],
  },
  {
    keywords: ["leg","legs","knee","ankle","foot","feet","joint","joints","swollen","swelling"],
    region: "legs",
    conditions: ["Muscle strain", "Joint inflammation", "Fluid retention"],
    meaning: "Pain or swelling in the legs, knees, or ankles is often caused by overuse, minor injury, or inflammation of the joints. Sitting or standing for long periods can also cause fluid to build up in the lower limbs.",
    recommendation: "monitor",
    tips: ["Elevate your legs above heart level when resting to reduce swelling. Apply ice wrapped in a cloth for 15 minutes at a time during the first 48 hours. Avoid strenuous activity and wear comfortable, supportive footwear. If swelling is severe or painful to touch, see a doctor.",],
  },
  {
    keywords: ["arm","arms","shoulder","elbow","wrist","hand","hands","numb","numbness","tingling"],
    region: "arms",
    conditions: ["Muscle strain", "Nerve compression", "Poor circulation"],
    meaning: "Pain, numbness, or tingling in the arms, hands, or shoulders is often caused by a compressed nerve, poor posture, or repetitive strain. Sleeping in an awkward position can also temporarily cut off circulation.",
    recommendation: "monitor",
    tips: ["Gently stretch and rotate the affected area. Avoid leaning on the arm or maintaining positions that feel uncomfortable. If numbness is persistent, affects both sides of the body, or comes with weakness, please see a doctor soon.",],
  },
  {
    keywords: ["cold","flu","runny nose","blocked nose","stuffy","sneezing","congestion"],
    region: "head",
    conditions: ["Common cold", "Influenza", "Seasonal allergies"],
    meaning: "Cold and flu symptoms are extremely common and are caused by viral infections. Runny nose, sneezing, and congestion are your immune system's way of trying to flush out the virus. Most people recover within 7 to 10 days.",
    recommendation: "monitor",
    tips: ["Rest at home and stay warm. Drink warm fluids like soup, tea with honey, and plenty of water. A saline nasal spray can help relieve congestion. Avoid going out in cold air and wash your hands frequently to avoid spreading the virus.",],
  },
  {
    keywords: ["anxiety","stress","panic","worried","worry","nervous","mental","depression","sad","mood"],
    region: "full_body",
    conditions: ["Stress response", "Anxiety", "Emotional fatigue"],
    meaning: "Anxiety, stress, and low mood are real health concerns that deserve attention. Your mental health affects your physical health deeply. Feeling overwhelmed, nervous, or persistently sad can have many causes including life pressures, hormonal changes, or underlying conditions.",
    recommendation: "doctor",
    tips: ["Take slow, deep breaths — inhale for 4 counts, hold for 4, exhale for 4. This activates your body's calm response. Try to talk to someone you trust about how you're feeling. Reduce caffeine and prioritise sleep. Please consider speaking to a mental health professional — reaching out is a sign of strength.",],
  },
];

function analyseSymptoms(symptoms, followUp) {
  const text = symptoms.toLowerCase();
  
  let matched = SYMPTOM_DB.find(s => s.keywords.some(k => text.includes(k)));
  
  if (!matched) {
    matched = {
      region: "full_body",
      conditions: ["General discomfort", "Possible mild illness", "Stress-related symptoms"],
      meaning: "Based on what you've described, your symptoms don't clearly point to one specific condition. This could be due to a combination of factors including mild illness, stress, fatigue, or something your body is adjusting to. It's important to pay attention to how your symptoms develop over the next 24 to 48 hours.",
      recommendation: followUp.severity >= 7 ? "doctor" : "monitor",
      tips: ["Rest well tonight and make sure you're drinking enough water throughout the day. Eat light, nutritious meals and avoid alcohol and caffeine. Monitor your symptoms over the next 24 hours and note any changes. If your symptoms worsen or new symptoms appear, please see a doctor.",],
    };
  }

  const rec = followUp.severity >= 8 ? "urgent" : followUp.severity >= 5 ? matched.recommendation : "monitor";
  
  const recText = {
    monitor: "Monitor at home —",
    doctor:  "See a doctor soon —",
    urgent:  "Seek urgent care —",
  }[rec];

  const recReason = {
    monitor: "your symptoms appear mild and can be managed at home with rest and care.",
    doctor:  "your symptoms would benefit from a professional evaluation to rule out anything more serious.",
    urgent:  "given the severity you've described, we strongly recommend seeing a doctor or visiting urgent care today.",
  }[rec];

  return {
    region: matched.region,
    conditions: matched.conditions,
    result: `**Understanding Your Symptoms**\nBased on what you've shared, your symptoms are most commonly associated with ${matched.conditions.join(", ")}. ${matched.meaning}\n\n**What This Could Mean**\nGiven that you've had these symptoms for ${followUp.duration?.toLowerCase() || "some time"} with a severity of ${followUp.severity} out of 10${followUp.age ? ` and you are ${followUp.age} years old` : ""}, this gives us a clearer picture of what your body might be going through. ${followUp.conditions && followUp.conditions !== "none" ? `With your existing condition of ${followUp.conditions}, it's especially important to monitor how things develop.` : "Most people in this situation recover well with proper rest and self-care."}\n\n**Our Recommendation**\n${recText} ${recReason}\n\n**What You Can Do Right Now**\n${matched.tips[0]}\n\n**A Gentle Reminder**\nHealAura provides general wellness guidance only — it is not a medical diagnosis. Please consult a qualified healthcare professional for proper assessment, especially if your symptoms persist or worsen.`,
  };
}

function EKGLine() {
  return (
    <div style={{ width:"100%", maxWidth:"380px", margin:"0 auto" }}>
      <svg viewBox="0 0 380 65" width="100%" style={{ overflow:"visible" }}>
        <path
          d="M0,32 L55,32 L67,29 L77,32 L95,32 L112,5 L119,60 L128,32 L145,18 L160,32 L200,32 L212,29 L222,32 L240,32 L257,5 L264,60 L273,32 L290,18 L305,32 L380,32"
          fill="none" stroke="#7C6BB0" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ animation:"revealEKG 2.8s ease-in-out infinite" }}
        />
      </svg>
    </div>
  );
}

function BodyMap({ region = "none", dark }) {
  const parts = REGION_PARTS[region] || [];
  const on   = (p) => parts.includes(p);
  const fill = (p) => on(p) ? "#7C6BB0" : (dark ? "#1E1A2E" : "#DDD8F0");
  const glow = (p) => on(p) ? "drop-shadow(0 0 10px rgba(124,107,176,0.65))" : "none";
  const s    = (p) => ({ fill:fill(p), filter:glow(p), transition:"fill 0.6s,filter 0.6s" });
  return (
    <div style={{ textAlign:"center", flexShrink:0 }}>
      <svg viewBox="0 0 100 255" width="110" height="255" style={{ overflow:"visible" }}>
        <ellipse cx="50" cy="20" rx="18" ry="19" {...s("head")} />
        <rect x="43" y="38" width="14" height="12" rx="3" {...s("neck")} />
        <rect x="20" y="50" width="60" height="50" rx="7" {...s("chest")} />
        <rect x="22" y="100" width="56" height="44" rx="7" {...s("abdomen")} />
        <rect x="2"  y="50" width="17" height="75" rx="8" {...s("larm")} />
        <rect x="81" y="50" width="17" height="75" rx="8" {...s("rarm")} />
        <rect x="23" y="144" width="24" height="100" rx="10" {...s("lleg")} />
        <rect x="53" y="144" width="24" height="100" rx="10" {...s("rleg")} />
      </svg>
      {region !== "none" && (
        <div style={{ fontSize:"11px", fontFamily:"'DM Sans',sans-serif", color:"#7C6BB0", fontWeight:"700", marginTop:"8px", textTransform:"uppercase", letterSpacing:"0.6px" }}>
          📍 {REGION_LABELS[region]}
        </div>
      )}
    </div>
  );
}

function ResultText({ text, primary }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*\n]+\*\*)/g);
  const els   = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p.startsWith("**") && p.endsWith("**")) {
      els.push(
        <h3 key={`h${i}`} style={{ fontSize:"13px", fontWeight:"700", color:primary, marginBottom:"7px", marginTop:i>0?"22px":"0", textTransform:"uppercase", letterSpacing:"0.9px", fontFamily:"'DM Sans',sans-serif" }}>
          {p.slice(2,-2)}
        </h3>
      );
    } else if (p.trim()) {
      els.push(
        <p key={`p${i}`} style={{ lineHeight:"1.88", fontSize:"15px", fontFamily:"'DM Sans',sans-serif", marginBottom:"4px" }}>
          {p.trim()}
        </p>
      );
    }
  }
  return <div>{els}</div>;
}

export default function HealAura() {
  const [screen,     setScreen]     = useState("welcome");
  const [dark,       setDark]       = useState(false);
  const [lang,       setLang]       = useState("en");
  const [showLang,   setShowLang]   = useState(false);
  const [symptoms,   setSymptoms]   = useState("");
  const [step,       setStep]       = useState(0);
  const [followUp,   setFollowUp]   = useState({ age:"", duration:"", severity:5, conditions:"" });
  const [results,    setResults]    = useState(null);
  const [bodyRegion, setBodyRegion] = useState("none");
  const [speaking,   setSpeaking]   = useState(false);
  const [factIdx,    setFactIdx]    = useState(0);
  const [quoteIdx]                  = useState(() => Math.floor(Math.random() * QUOTES.length));

  const selLang = LANGS.find(l => l.code === lang);

  useEffect(() => {
    if (screen !== "loading") return;
    const iv = setInterval(() => setFactIdx(f => (f + 1) % FACTS.length), 3000);
    return () => clearInterval(iv);
  }, [screen]);

  useEffect(() => {
    if (screen === "loading") {
      setTimeout(() => {
        const analysis = analyseSymptoms(symptoms, followUp);
        setBodyRegion(analysis.region);
        setResults(analysis.result);
        setScreen("results");
      }, 4000);
    }
  }, [screen]);

  const isEmergency = (t) => EMERGENCY_KW.some(k => t.toLowerCase().includes(k));

  const handleSymptomNext = () => {
    if (!symptoms.trim()) return;
    if (isEmergency(symptoms)) setScreen("emergency");
    else { setStep(0); setScreen("followup"); }
  };

  const handleVoice = () => {
    if (!window.speechSynthesis) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const clean = results?.replace(/\*\*(.*?)\*\*/g, "$1") || "";
    const u = new SpeechSynthesisUtterance(clean);
    u.lang  = "en-US"; u.rate = 0.88; u.pitch = 1.05;
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const handleDownload = () => {
    const clean = results?.replace(/\*\*(.*?)\*\*/g, "[$1]") || "";
    const blob  = new Blob([
      `HEALAURA — SYMPTOM ANALYSIS REPORT\nGenerated: ${new Date().toLocaleString()}\n\n${"━".repeat(40)}\n` +
      `SYMPTOMS  : ${symptoms}\nAGE       : ${followUp.age||"Not specified"}\nDURATION  : ${followUp.duration}\nSEVERITY  : ${followUp.severity}/10\nCONDITIONS: ${followUp.conditions||"None"}\n${"━".repeat(40)}\n\n${clean}\n\n${"━".repeat(40)}\n` +
      `DISCLAIMER: This is wellness guidance only — not a medical diagnosis.\nAlways consult a qualified healthcare professional.\n${"━".repeat(40)}`
    ], { type:"text/plain" });
    const url = URL.createObjectURL(blob);
    const a   = Object.assign(document.createElement("a"), { href:url, download:"HealAura-Report.txt" });
    a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => {
    window.speechSynthesis?.cancel(); setSpeaking(false);
    setScreen("welcome"); setSymptoms(""); setStep(0);
    setFollowUp({ age:"", duration:"", severity:5, conditions:"" });
    setResults(null); setBodyRegion("none");
  };

  const P   = "#7C6BB0", PL = "#9B8DC4", ACC = "#E8936A", DNG = "#C0392B";
  const bg  = dark
    ? "linear-gradient(145deg,#0D0A1A 0%,#130F24 55%,#0A0814 100%)"
    : "linear-gradient(145deg,#F0EDF8 0%,#EAE6F5 52%,#F5F0FF 100%)";
  const surf = dark ? "#16122A" : "#FFFFFF";
  const card = dark ? "#1E1A30" : "#F2EEF9";
  const bord = dark ? "#2A2440" : "#D8D0EE";
  const txt  = dark ? "#E0DBF0" : "#1E1830";
  const mut  = dark ? "#8878B8" : "#7A7090";

  const followSteps = [
    { q:"How old are you?",                hint:"Age helps us give more accurate guidance.",        f:"age",        type:"input",   ph:"e.g. 28" },
    { q:"When did your symptoms start?",   hint:"Select the option that best fits.",                f:"duration",   type:"options" },
    { q:"How severe does it feel?",        hint:"1 = barely noticeable  ·  10 = worst imaginable", f:"severity",   type:"slider"  },
    { q:"Any existing medical conditions?",hint:"e.g. diabetes, asthma — or type 'none'.",         f:"conditions", type:"input",   ph:"e.g. Asthma, or None" },
  ];

  const btnP = { background:`linear-gradient(135deg,${P},${PL})`, color:"#fff", border:"none", borderRadius:"12px", padding:"15px 28px", fontSize:"16px", fontFamily:"'Lora',Georgia,serif", fontWeight:"600", cursor:"pointer", width:"100%", marginTop:"18px" };
  const btnS = { background:"transparent", border:`1.5px solid ${bord}`, color:mut, borderRadius:"12px", padding:"13px 28px", fontSize:"15px", fontFamily:"'DM Sans',sans-serif", cursor:"pointer", width:"100%", marginTop:"10px" };
  const btnD = { background:`linear-gradient(135deg,${ACC},#F0A882)`, color:"#fff", border:"none", borderRadius:"12px", padding:"15px 28px", fontSize:"16px", fontFamily:"'Lora',Georgia,serif", fontWeight:"600", cursor:"pointer", width:"100%", marginTop:"10px" };

  return (
    <div style={{ minHeight:"100vh", background:bg, color:txt, fontFamily:"'Lora',Georgia,serif", transition:"background 0.4s,color 0.4s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp    {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes heartbeat {0%,100%{transform:scale(1)}14%{transform:scale(1.15)}28%{transform:scale(1)}42%{transform:scale(1.08)}70%{transform:scale(1)}}
        @keyframes pulseRing {0%,100%{box-shadow:0 0 0 0 rgba(124,107,176,0.4)}50%{box-shadow:0 0 0 22px rgba(124,107,176,0)}}
        @keyframes revealEKG {0%{clip-path:inset(0 100% 0 0);opacity:1}68%{clip-path:inset(0 0% 0 0);opacity:1}83%{opacity:0.35}100%{clip-path:inset(0 0% 0 0);opacity:0}}
        @keyframes factIn    {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.42s ease both}
        .fi{animation:factIn 0.5s ease both}
        .hl:hover{opacity:.87;transform:translateY(-2px);transition:opacity .2s,transform .2s}
        .hf:hover{opacity:.7;transition:opacity .2s}
        textarea:focus,input[type=text]:focus{border-color:${P}!important;outline:none;box-shadow:0 0 0 3px rgba(124,107,176,0.15)}
        input[type=range]{-webkit-appearance:none;width:100%;height:6px;border-radius:3px;background:${bord};outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:${P};cursor:pointer;box-shadow:0 2px 10px rgba(124,107,176,0.45)}
        .opt{border:1.5px solid ${bord};border-radius:10px;padding:12px 14px;background:${card};color:${txt};font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all .2s;text-align:left;line-height:1.4}
        .opt:hover{border-color:${P}}
        .opt.sel{border-color:${P};background:rgba(124,107,176,0.13);color:${P};font-weight:600}
        .li:hover{background:${card}}
      `}</style>

      {/* HEADER */}
      <header style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 24px", background:dark?"rgba(13,10,26,0.88)":"rgba(255,255,255,0.78)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${bord}`, position:"sticky", top:0, zIndex:50 }}>
        <div onClick={reset} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"24px", animation:"heartbeat 2.4s ease infinite" }}>💜</span>
          <span style={{ fontFamily:"'Lora',serif", fontWeight:"700", fontSize:"22px", letterSpacing:"-0.4px" }}>
            Heal<span style={{ color:ACC }}>Aura</span>
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ position:"relative" }}>
            <button onClick={() => setShowLang(!showLang)}
              style={{ background:card, border:`1px solid ${bord}`, borderRadius:"8px", padding:"7px 12px", cursor:"pointer", color:txt, fontSize:"13px", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:"5px" }}>
              {selLang?.flag} {selLang?.name} <span style={{ fontSize:"9px", opacity:.55 }}>▾</span>
            </button>
            {showLang && (
              <div style={{ position:"absolute", top:"calc(100% + 5px)", right:0, background:surf, border:`1px solid ${bord}`, borderRadius:"12px", boxShadow:"0 14px 40px rgba(0,0,0,0.18)", zIndex:200, minWidth:"158px", overflow:"hidden" }}>
                {LANGS.map(l => (
                  <div key={l.code} className="li"
                    style={{ padding:"10px 14px", cursor:"pointer", fontSize:"13px", fontFamily:"'DM Sans',sans-serif", color:txt, background:l.code===lang?card:"transparent", display:"flex", alignItems:"center", gap:"8px", fontWeight:l.code===lang?"600":"400" }}
                    onClick={() => { setLang(l.code); setShowLang(false); }}>
                    {l.flag} {l.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setDark(!dark)}
            style={{ background:dark?P:card, border:`1px solid ${bord}`, borderRadius:"20px", padding:"7px 14px", cursor:"pointer", color:dark?"#fff":txt, fontSize:"13px", fontFamily:"'DM Sans',sans-serif", fontWeight:"500", transition:"all .3s" }}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <main style={{ maxWidth:"660px", margin:"0 auto", padding:"44px 22px 90px" }}>

        {/* WELCOME */}
        {screen === "welcome" && (
          <div className="fu" style={{ textAlign:"center", paddingTop:"16px" }}>
            <div style={{ width:"96px", height:"96px", borderRadius:"50%", background:`linear-gradient(135deg,${P},${PL})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", fontSize:"44px", animation:"pulseRing 2.4s ease infinite" }}>🫀</div>
            <p style={{ fontSize:"12px", fontFamily:"'DM Sans',sans-serif", color:P, fontWeight:"700", textTransform:"uppercase", letterSpacing:"2.5px", marginBottom:"14px" }}>Welcome to HealAura</p>
            <h1 style={{ fontSize:"38px", fontWeight:"700", lineHeight:"1.22", marginBottom:"22px" }}>
              Hey there. 👋<br/><span style={{ color:P }}>We're glad you're here.</span>
            </h1>
            <div style={{ background:surf, border:`1px solid ${bord}`, borderRadius:"18px", padding:"26px 28px", marginBottom:"32px", textAlign:"left" }}>
              <p style={{ fontSize:"17px", fontFamily:"'DM Sans',sans-serif", lineHeight:"1.82", color:mut }}>
                Whatever brought you here today — pausing to check on yourself is exactly the right thing to do.
              </p>
              <p style={{ fontSize:"17px", fontFamily:"'DM Sans',sans-serif", lineHeight:"1.82", color:mut, marginTop:"14px" }}>
                HealAura will listen to your symptoms, ask a few simple questions, and give you a calm, clear answer. You're not alone in this. Let's figure it out together. 💜
              </p>
            </div>
            <button className="hl" style={{ ...btnP, maxWidth:"300px", margin:"0 auto", fontSize:"17px", padding:"17px 32px" }} onClick={() => setScreen("input")}>
              I'm Ready — Let's Go →
            </button>
            <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:"8px", marginTop:"36px" }}>
              {[["🧠","Smart Analysis"],["🌍","8 Languages"],["🗣️","Voice Readout"],["🚨","Emergency Alert"],["🫀","Body Map"],["📄","Downloadable"]].map(([ic,lb]) => (
                <div key={lb} style={{ background:surf, border:`1px solid ${bord}`, borderRadius:"20px", padding:"7px 15px", fontSize:"12px", fontFamily:"'DM Sans',sans-serif", color:mut, display:"flex", alignItems:"center", gap:"5px" }}>{ic} {lb}</div>
              ))}
            </div>
            <p style={{ marginTop:"40px", fontSize:"11px", color:mut, fontFamily:"'DM Sans',sans-serif", opacity:.5, lineHeight:"1.65" }}>
              HealAura is for informational guidance only — not a substitute for professional medical advice.
            </p>
          </div>
        )}

        {/* SYMPTOM INPUT */}
        {screen === "input" && (
          <div className="fu">
            <div style={{ fontSize:"11px", fontFamily:"'DM Sans',sans-serif", color:P, fontWeight:"700", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"10px" }}>Step 1 of 5</div>
            <h2 style={{ fontSize:"30px", fontWeight:"700", marginBottom:"10px" }}>What's going on?</h2>
            <p style={{ fontSize:"16px", color:mut, marginBottom:"26px", fontFamily:"'DM Sans',sans-serif", lineHeight:"1.65" }}>Describe how you're feeling in your own words. No medical jargon — just tell us what's happening.</p>
            <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
              placeholder="e.g. I've had a throbbing headache since this morning and feel dizzy when I stand up. I also feel slightly nauseous..."
              style={{ width:"100%", minHeight:"155px", background:surf, border:`2px solid ${bord}`, borderRadius:"14px", padding:"18px", fontSize:"15px", color:txt, fontFamily:"'DM Sans',sans-serif", resize:"vertical", lineHeight:"1.75", transition:"border-color .2s" }} />
            <button className="hl" style={{ ...btnP, opacity:symptoms.trim()?1:.42 }} onClick={handleSymptomNext}>Continue →</button>
            <button className="hf" style={btnS} onClick={reset}>← Back</button>
          </div>
        )}

        {/* EMERGENCY */}
        {screen === "emergency" && (
          <div className="fu">
            <div style={{ background:dark?"#1C0808":"#FEF2F2", border:`2px solid ${DNG}`, borderRadius:"18px", padding:"38px 28px", textAlign:"center" }}>
              <div style={{ fontSize:"56px", marginBottom:"18px", animation:"heartbeat 1s ease infinite" }}>🚨</div>
              <h2 style={{ fontSize:"26px", fontWeight:"700", color:DNG, marginBottom:"12px" }}>This sounds serious</h2>
              <p style={{ fontSize:"16px", color:mut, fontFamily:"'DM Sans',sans-serif", marginBottom:"6px" }}>Your symptoms may require immediate medical attention.</p>
              <p style={{ fontSize:"15px", color:mut, fontFamily:"'DM Sans',sans-serif", marginBottom:"26px" }}>Please don't wait — call emergency services right now:</p>
              <div style={{ fontSize:"36px", fontWeight:"700", color:DNG, letterSpacing:"2px", marginBottom:"12px", fontFamily:"'Lora',serif" }}>{EMERGENCY[lang]?.n || EMERGENCY.en.n}</div>
              <div style={{ fontSize:"16px", fontWeight:"600", color:DNG, marginBottom:"32px", fontFamily:"'DM Sans',sans-serif" }}>{EMERGENCY[lang]?.m || EMERGENCY.en.m}</div>
              <button className="hf" style={{ ...btnS, borderColor:DNG, color:DNG, maxWidth:"220px", margin:"0 auto" }} onClick={reset}>Start Over</button>
            </div>
          </div>
        )}

        {/* FOLLOW-UP */}
        {screen === "followup" && (() => {
          const cur    = followSteps[step];
          const isLast = step === followSteps.length - 1;
          const ok     = cur.type==="slider"?true:cur.type==="options"?!!followUp[cur.f]:!!followUp[cur.f]?.trim();
          return (
            <div className="fu" key={step}>
              <div style={{ display:"flex", gap:"6px", marginBottom:"30px" }}>
                {followSteps.map((_,i) => <div key={i} style={{ flex:1, height:"4px", borderRadius:"2px", background:i<step?P:i===step?PL:bord, transition:"background .3s" }} />)}
              </div>
              <div style={{ fontSize:"11px", fontFamily:"'DM Sans',sans-serif", color:P, fontWeight:"700", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"10px" }}>Step {step+2} of 5</div>
              <h2 style={{ fontSize:"28px", fontWeight:"700", marginBottom:"10px" }}>{cur.q}</h2>
              <p style={{ fontSize:"15px", color:mut, marginBottom:"24px", fontFamily:"'DM Sans',sans-serif" }}>{cur.hint}</p>
              {cur.type==="input" && (
                <input type="text" value={followUp[cur.f]} onChange={e => setFollowUp({...followUp,[cur.f]:e.target.value})} placeholder={cur.ph}
                  style={{ width:"100%", background:surf, border:`2px solid ${bord}`, borderRadius:"12px", padding:"15px 18px", fontSize:"15px", color:txt, fontFamily:"'DM Sans',sans-serif", transition:"border-color .2s" }} />
              )}
              {cur.type==="options" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                  {DURATIONS.map(d => (
                    <button key={d} className={`opt${followUp.duration===d?" sel":""}`} onClick={() => setFollowUp({...followUp,duration:d})}>
                      {followUp.duration===d?"✓ ":""}{d}
                    </button>
                  ))}
                </div>
              )}
              {cur.type==="slider" && (
                <div>
                  <div style={{ textAlign:"center", fontSize:"58px", fontWeight:"700", color:P, marginBottom:"18px", fontFamily:"'Lora',serif" }}>
                    {followUp.severity}<span style={{ fontSize:"22px", color:mut, fontWeight:"400" }}>/10</span>
                  </div>
                  <input type="range" min="1" max="10" value={followUp.severity} onChange={e => setFollowUp({...followUp,severity:Number(e.target.value)})} />
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", color:mut, fontFamily:"'DM Sans',sans-serif", marginTop:"10px" }}>
                    <span>😌 Barely noticeable</span><span>😰 Worst ever</span>
                  </div>
                </div>
              )}
              <button className="hl" style={{ ...btnP, opacity:ok?1:.42 }} disabled={!ok} onClick={() => isLast?setScreen("loading"):setStep(step+1)}>
                {isLast?"Analyse My Symptoms 🔍":"Continue →"}
              </button>
              <button className="hf" style={btnS} onClick={() => step===0?setScreen("input"):setStep(step-1)}>← Back</button>
            </div>
          );
        })()}

        {/* LOADING */}
        {screen === "loading" && (
          <div className="fu" style={{ textAlign:"center", paddingTop:"36px" }}>
            <EKGLine />
            <h2 style={{ fontSize:"24px", fontWeight:"700", marginTop:"28px", marginBottom:"14px" }}>Analysing your symptoms...</h2>
            <div style={{ background:surf, border:`1px solid ${bord}`, borderRadius:"14px", padding:"20px 26px", marginBottom:"20px" }}>
              <p style={{ fontSize:"16px", fontFamily:"'DM Sans',sans-serif", color:P, fontWeight:"500", fontStyle:"italic", lineHeight:"1.65" }}>"{QUOTES[quoteIdx]}"</p>
            </div>
            <div className="fi" key={factIdx} style={{ background:card, border:`1px solid ${bord}`, borderRadius:"12px", padding:"16px 20px" }}>
              <p style={{ fontSize:"14px", fontFamily:"'DM Sans',sans-serif", color:mut, lineHeight:"1.65" }}>{FACTS[factIdx]}</p>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {screen === "results" && (
          <div className="fu">
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
              <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:`linear-gradient(135deg,${P},${PL})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"14px", fontWeight:"700" }}>✓</div>
              <span style={{ fontSize:"11px", fontFamily:"'DM Sans',sans-serif", color:P, fontWeight:"700", textTransform:"uppercase", letterSpacing:"2px" }}>Analysis Complete</span>
            </div>
            <h2 style={{ fontSize:"30px", fontWeight:"700", marginBottom:"8px" }}>Your HealAura Report</h2>
            <p style={{ fontSize:"15px", color:mut, fontFamily:"'DM Sans',sans-serif", marginBottom:"26px" }}>Here's what we found based on everything you shared.</p>
            <div style={{ display:"flex", gap:"20px", alignItems:"flex-start", background:surf, border:`1px solid ${bord}`, borderRadius:"16px", padding:"24px", marginBottom:"20px", flexWrap:"wrap" }}>
              <BodyMap region={bodyRegion} dark={dark} />
              <div style={{ flex:1, minWidth:"160px" }}>
                <p style={{ fontSize:"11px", fontFamily:"'DM Sans',sans-serif", color:P, fontWeight:"700", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:"14px" }}>Symptom Summary</p>
                {[
                  ["🗣️","Symptoms",`"${symptoms.slice(0,55)}${symptoms.length>55?"...":""}"`],
                  ["🕐","Duration", followUp.duration],
                  ["📊","Severity", `${followUp.severity} / 10`],
                  ["🎂","Age",      followUp.age||"Not specified"],
                  followUp.conditions&&["💊","Conditions",followUp.conditions],
                ].filter(Boolean).map(([ic,label,val])=>(
                  <div key={label} style={{ marginBottom:"10px" }}>
                    <div style={{ fontSize:"10px", fontFamily:"'DM Sans',sans-serif", color:mut, textTransform:"uppercase", letterSpacing:"0.6px" }}>{ic} {label}</div>
                    <div style={{ fontSize:"14px", fontFamily:"'DM Sans',sans-serif", color:txt, fontWeight:"500", marginTop:"2px" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:surf, border:`1px solid ${bord}`, borderRadius:"16px", padding:"28px", marginBottom:"16px" }}>
              <ResultText text={results} primary={P} />
            </div>
            <button onClick={handleVoice}
              style={{ background:speaking?`rgba(124,107,176,0.14)`:card, border:`1.5px solid ${speaking?P:bord}`, borderRadius:"12px", padding:"13px 20px", cursor:"pointer", color:speaking?P:txt, fontFamily:"'DM Sans',sans-serif", fontSize:"15px", fontWeight:"500", width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", transition:"all .2s" }}>
              {speaking?"⏹️ Stop Reading Aloud":"🔊 Read Results Aloud"}
            </button>
            <button className="hl" style={btnD} onClick={handleDownload}>📄 Download Report</button>
            <button className="hl" style={{ ...btnP, marginTop:"10px" }} onClick={reset}>Check New Symptoms</button>
            <p style={{ textAlign:"center", fontSize:"11px", color:mut, fontFamily:"'DM Sans',sans-serif", marginTop:"22px", opacity:.48, lineHeight:"1.65" }}>
              HealAura is wellness guidance only — not a medical diagnosis.<br/>Always consult a qualified healthcare professional.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
