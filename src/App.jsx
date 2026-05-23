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
    const u = new SpeechSynthesisUtterance(clean)
