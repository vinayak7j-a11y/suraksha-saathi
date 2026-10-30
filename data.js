const MACHINES = {
  "press-3": {
    displayName: "Press Machine 3",
    procedureId: "press-3-basic-safety",
    instruction: "नमस्ते। यह प्रेस मशीन तीन है। मशीन चालू करने से पहले इमरजेंसी स्टॉप चेक करें। गार्ड ठीक से बंद करें। दोनों हाथ गार्ड के बाहर रखें। अगर कुछ फँस जाए, तो खुद हाथ अंदर मत डालिए।",
    quiz: {
      question: "अगर प्रेस मशीन में सामान फँस जाए तो आपको क्या करना चाहिए? अपने शब्दों में बताइए।",
      groups: [
        ["emergency", "इमरजेंसी", "stop", "स्टॉप", "रोक", "बंद"],
        ["supervisor", "सुपरवाइजर", "सुपरवाइज़र", "सुपरवाइज", "बुला"]
      ]
    },
    faqs: [
      { keywords: ["फँस", "फंस", "जाम", "jam", "कपड़ा"], answer: "अगर कुछ फँस जाए तो तुरंत इमरजेंसी स्टॉप दबाएँ। मशीन पूरी तरह रुकने के बाद ही सुपरवाइजर को बुलाएँ। खुद हाथ अंदर मत डालें।" },
      { keywords: ["चालू", "स्टार्ट", "start"], answer: "मशीन चालू करने से पहले गार्ड नीचे करें, दोनों हाथ सुरक्षित जगह पर रखें, और ढीले कपड़े या दुपट्टा हटा लें।" },
      { keywords: ["कट", "चोट", "खून"], answer: "चोट लगे तो मशीन तुरंत रोकें और सुपरवाइजर को बुलाएँ। खुद इलाज की कोशिश मत कीजिए।" }
    ]
  },
  "assembly-2": {
    displayName: "Assembly Line 2",
    procedureId: "assembly-2-basic-safety",
    instruction: "नमस्ते। यह असेंबली लाइन दो है। काम शुरू करने से पहले दस्ताने और चश्मा पहनें। चलती बेल्ट को हाथ से न छुएँ। कुछ अटक जाए तो लाइन का बटन बंद करें और लीडर को बुलाएँ।",
    quiz: {
      question: "चलती असेंबली लाइन में कुछ अटक जाए तो क्या करना चाहिए? अपने शब्दों में बताइए।",
      groups: [
        ["बटन", "बंद", "stop", "स्टॉप", "रोक", "off"],
        ["लीडर", "leader", "supervisor", "सुपरवाइजर", "सुपरवाइज़र", "बुला"]
      ]
    },
    faqs: [
      { keywords: ["अटक", "रुक", "जाम", "jam", "बेल्ट"], answer: "बेल्ट में कुछ अटक जाए तो पहले लाइन का बटन बंद करें, फिर लीडर को बुलाएँ। चलती बेल्ट में हाथ मत डालें।" },
      { keywords: ["दस्ताने", "चश्मा", "gloves"], answer: "दस्ताने और चश्मा काम शुरू करने से पहले पहनना ज़रूरी है। न मिलें तो लीडर से माँगें।" }
    ]
  }
};

function getAnswer(mid, q) {
  const t = q.toLowerCase();
  const hit = MACHINES[mid].faqs.find(f => f.keywords.some(k => t.includes(k.toLowerCase())));
  return hit ? hit.answer : "इस सवाल का सीधा जवाब अभी नहीं है। नियम यह है कि किसी भी खतरे में मशीन रोकें, सुपरवाइजर को बुलाएँ, और खुद जोखिम मत लीजिए।";
}

function evaluate(mid, ans) {
  const t = ans.toLowerCase();
  const ok = MACHINES[mid].quiz.groups.every(g => g.some(k => t.includes(k.toLowerCase())));
  const unsafe = /(हाथ|hand)/.test(t) && /(डाल|अंदर|घुस|निकाल|inside)/.test(t) && !/(नहीं|नही|मत|nahi|mat|not)/.test(t);
  return ok && !unsafe;
}

const LogService = {
  key: "suraksha_logs",
  getAll() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; } },
  add(e) { const l = this.getAll(); l.push(e); localStorage.setItem(this.key, JSON.stringify(l)); },
  clear() { localStorage.removeItem(this.key); }
};

MACHINES["press-3"].en = {
  instruction: "Hello. This is Press Machine 3. Before starting the machine, check the emergency stop. Close the guard properly. Keep both hands outside the guard. If something gets stuck, never put your hand inside.",
  quiz: "If material gets stuck in the press machine, what should you do? Explain in your own words.",
  faqs: [
    { keywords: ["stuck", "jam", "cloth", "caught"], answer: "If something gets stuck, press the emergency stop right away. Call the supervisor only after the machine has fully stopped. Never put your hand inside." },
    { keywords: ["start", "begin", "turn on"], answer: "Before starting, lower the guard, keep both hands in the safe zone, and remove loose clothes or scarves." },
    { keywords: ["cut", "injury", "hurt", "blood"], answer: "If someone is hurt, stop the machine immediately and call the supervisor. Do not try to treat it yourself." }
  ],
  fallback: "I don't have a direct answer to that. The rule is: in any danger, stop the machine, call the supervisor, and do not take risks yourself."
};
MACHINES["assembly-2"].en = {
  instruction: "Hello. This is Assembly Line 2. Before starting work, wear gloves and safety glasses. Never touch a moving belt with your hands. If something gets stuck, switch off the line and call the leader.",
  quiz: "If something gets stuck in the moving assembly line, what should you do? Explain in your own words.",
  faqs: [
    { keywords: ["stuck", "jam", "belt", "stopped"], answer: "If something gets stuck, first switch off the line, then call the leader. Never put your hands in a moving belt." },
    { keywords: ["glove", "glasses", "gear"], answer: "Gloves and safety glasses are required before starting work. If you don't have them, ask the leader." }
  ],
  fallback: "I don't have a direct answer to that. The rule is: in any danger, stop the line, call the leader, and do not take risks yourself."
};

function getAnswerL(mid, q, lang) {
  if (lang !== "en") return getAnswer(mid, q);
  const e = MACHINES[mid].en, t = q.toLowerCase();
  const hit = e.faqs.find(f => f.keywords.some(k => t.includes(k)));
  return hit ? hit.answer : e.fallback;
}

function evaluate(mid, ans) {
  const t = ans.toLowerCase();
  const ok = MACHINES[mid].quiz.groups.every(g => g.some(k => t.includes(k.toLowerCase())));
  const unsafe = /(हाथ|hand)/.test(t) && /(डाल|अंदर|घुस|निकाल|inside)/.test(t) && !/(नहीं|नही|मत|nahi|mat|not|n't|never|dont)/.test(t);
  return ok && !unsafe;
}
