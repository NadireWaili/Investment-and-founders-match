// ── Founder Scorer Service (Gemini API + Investor Thesis Matchmaker) ───────────

async function callGemini(prompt, apiKey) {
  let modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash'];

  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (listRes.ok) {
      const listData = await listRes.json();
      const valid = (listData.models || [])
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .map(m => m.name.replace(/^models\//, ''));
      if (valid.length > 0) {
        const flashModels = valid.filter(m => m.includes('flash'));
        modelsToTry = [...flashModels, ...valid.filter(m => !m.includes('flash'))];
      }
    }
  } catch (e) {
    console.warn('[FounderScorer] ListModels error:', e);
  }

  let lastErr = null;
  for (const model of modelsToTry) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status} from ${model}`);
      }

      const data = await res.json();
      const raw =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.steps?.[0]?.modelTurn?.parts?.[0]?.text ||
        '';

      if (!raw) throw new Error(`Empty response from ${model}`);
      return raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    } catch (e) {
      console.warn(`[FounderScorer] ${model} failed:`, e.message);
      lastErr = e;
    }
  }

  throw lastErr || new Error('Failed to communicate with AI API');
}

// ── Default Investor Profile Preset ──────────────────────────────────────────
export const DEFAULT_INVESTOR_PROFILE = {
  name: 'Alex Vance',
  linkedinUrl: 'https://linkedin.com/in/alex-vance-vc',
  fundName: 'Nordic Alpha Ventures',
  role: 'General Partner',
  targetStages: ['Stealth', 'Pre-Seed', 'Seed'],
  targetIndustries: ['AI & DeepTech', 'ClimateTech & Energy', 'Fintech', 'B2B SaaS'],
  targetRegions: ['Nordics', 'DACH', 'UK & Ireland'],
  checkSize: '€250K – €1.5M',
  unfairAdvantage: 'Ex-operator with deep Nordic enterprise networks. Hands-on scaling B2B GTM and AI architecture.',
  thesisDescription: 'Pre-seed to seed stage B2B SaaS, Climate, and AI founders with exceptional pedigree (ex-FAANG, top unicorns, PhDs) in Europe.',
  vision: 'European operators leaving unicorns to rebuild energy systems, AI infrastructure, and financial rails for the next decade.',
  goals: 'Get into 8–12 pre-seed technical teams a year, before a priced round, where we can actually help with GTM and hiring.',
  futureProof: 'Problems that get harder as AI, regulation, and the energy transition compound — not consumer fads.',
  portfolio: [
    { name: 'Voltgrid', sector: 'ClimateTech & Energy' },
    { name: 'LedgerOS', sector: 'Fintech' },
    { name: 'Relay', sector: 'B2B SaaS' },
    { name: 'Axon Health', sector: 'HealthTech & Bio' },
  ],
};

function fundProfile(profile = {}) {
  return { ...DEFAULT_INVESTOR_PROFILE, ...profile };
}

// Match score = vision · goals · future-proof · portfolio (equal weights).
export const MATCH_METRICS = [
  { id: 'vision', label: 'Vision', weight: 0.25 },
  { id: 'goals', label: 'Goals', weight: 0.25 },
  { id: 'futureProof', label: 'Future-proof', weight: 0.25 },
  { id: 'portfolio', label: 'Portfolio', weight: 0.25 },
];

function clamp(n, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function norm(value) {
  return String(value || '').toLowerCase().replace(/[_-]+/g, ' ').trim();
}

function stageKey(value) {
  const s = norm(value);
  if (s.includes('stealth')) return 'stealth';
  if (s.includes('pre')) return 'pre-seed';
  if (s.includes('seed')) return 'seed';
  return s;
}

function tokens(text) {
  return new Set(
    norm(text)
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3 && !['that', 'this', 'with', 'from', 'have', 'they', 'their', 'into'].includes(w))
  );
}

function overlapScore(a, b) {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.size || !B.size) return 0;
  let hits = 0;
  for (const w of A) if (B.has(w)) hits += 1;
  return hits / Math.max(3, Math.min(A.size, B.size, 10));
}

function founderBlurb(founder) {
  return [founder.headline, founder.bio, founder.industry, founder.currentCompany, founder.skills?.join(' ')].filter(Boolean).join(' ');
}

function scoreIndustry(founder, profile) {
  const targets = (profile.targetIndustries || []).map(norm);
  const industry = norm(founder.industry);
  if (!industry) return { score: 40, why: 'Industry not tagged.' };
  if (targets.some((t) => t === industry || t.includes(industry) || industry.includes(t))) {
    return { score: 96, why: `${founder.industry} is on-thesis.` };
  }
  return { score: 28, why: `${founder.industry || 'This sector'} is outside the stated focus.` };
}

function scoreVision(founder, profile) {
  const industry = scoreIndustry(founder, profile);
  const textFit = overlapScore(founderBlurb(founder), `${profile.vision} ${profile.thesisDescription} ${profile.targetIndustries?.join(' ')}`);
  const score = clamp(industry.score * 0.45 + textFit * 100 * 0.55);
  if (industry.score >= 90 && textFit > 0.2) {
    return { score: Math.max(score, 88), why: `On-vision: ${founder.industry} maps to “${String(profile.vision).split(/[.!,]/)[0]}”.` };
  }
  if (industry.score < 40) {
    return { score: Math.min(score, 42), why: `${founder.industry || 'This work'} does not sit in the fund vision.` };
  }
  return { score, why: textFit > 0.15 ? 'Partial vision overlap in the bio and thesis language.' : 'Industry is close; the stated vision is not yet explicit in the profile.' };
}

function scoreGoals(founder, profile) {
  const stage = scoreStage(founder, profile);
  const region = scoreRegion(founder, profile);
  const timing = scoreTiming(founder);
  const score = clamp(stage.score * 0.4 + region.score * 0.3 + timing.score * 0.3);
  const bits = [];
  if (stage.score >= 80) bits.push(`${founder.stage} is in the deployment window`);
  else bits.push(stage.why);
  if (region.score >= 80) bits.push(`${founder.region} is a target geography`);
  if (timing.score >= 80) bits.push('still in the formation window');
  return { score, why: bits.slice(0, 2).join('; ') + '.' };
}

function scoreFutureProof(founder, profile) {
  const themes = profile.futureProof || '';
  const durable = /ai|climate|energy|infra|deeptech|health|bio|grid|model|regulation|fintech|payment/i;
  const industryDurable = durable.test(founder.industry || '') || durable.test(founder.bio || '');
  const themeFit = overlapScore(founderBlurb(founder), themes);
  let score = 38 + themeFit * 50 + (industryDurable ? 22 : 0);
  if ((founder.signals || []).includes('domain-expert')) score += 6;
  score = clamp(score);
  if (themeFit > 0.25 || industryDurable) {
    return { score, why: `${founder.industry} compounds with the fund’s future-proof themes.` };
  }
  return { score, why: 'Unclear whether this problem gets more important over a 5–10 year horizon.' };
}

function scorePortfolioFit(founder, profile) {
  const book = profile.portfolio || [];
  if (!book.length) return { score: 50, why: 'No portfolio loaded — cannot test ecosystem fit.' };

  const industry = norm(founder.industry);
  const blurb = founderBlurb(founder);
  const sectorHits = book.filter((c) => norm(c.sector) && (norm(c.sector) === industry || industry.includes(norm(c.sector)) || norm(c.sector).includes(industry)));
  const nameHits = book.filter((c) => c.name && norm(blurb).includes(norm(c.name)));

  if (nameHits.length) {
    return { score: 92, why: `Ecosystem overlap with ${nameHits.map((c) => c.name).join(', ')}.` };
  }
  if (sectorHits.length === 1) {
    return { score: 86, why: `Adjacent to ${sectorHits[0].name} (${sectorHits[0].sector}) — platform, not a clone.` };
  }
  if (sectorHits.length > 1) {
    return { score: 78, why: `Same sectors as ${sectorHits.map((c) => c.name).join(', ')} — conviction doubling; watch conflict.` };
  }
  return { score: 36, why: `No overlap with ${book.map((c) => c.name).join(', ')}.` };
}

const METRIC_FNS = {
  vision: scoreVision,
  goals: scoreGoals,
  futureProof: scoreFutureProof,
  portfolio: scorePortfolioFit,
};

function scoreRegion(founder, profile) {
  const targets = (profile.targetRegions || []).map(norm);
  const region = norm(founder.region);
  if (targets.includes(region)) {
    return { score: 96, why: `${founder.region} is a core geography.` };
  }
  if (region && targets.some((t) => t.includes(region) || region.includes(t))) {
    return { score: 72, why: `${founder.region} is adjacent to the target map.` };
  }
  return { score: 32, why: `${founder.location || founder.region} is off the geographic thesis.` };
}

function scoreStage(founder, profile) {
  const targets = (profile.targetStages || []).map(stageKey);
  const stage = stageKey(founder.stage);
  if (targets.includes(stage)) {
    return { score: 94, why: `${founder.stage} fits the ${profile.checkSize || 'check'} window.` };
  }
  const order = ['stealth', 'pre-seed', 'seed'];
  const i = order.indexOf(stage);
  const near = i >= 0 && targets.some((t) => Math.abs(order.indexOf(t) - i) === 1);
  if (near) return { score: 62, why: `${founder.stage} is one step off the target stages.` };
  return { score: 30, why: `${founder.stage || 'Unknown stage'} is not in the mandate.` };
}

function scoreTiming(founder) {
  const gap = founder.employmentGapMonths;
  const stealth = stageKey(founder.stage) === 'stealth' || (founder.signals || []).includes('stealth');
  let score = 50;
  let why = 'Timing is middling.';
  if (gap == null) {
    score = stealth ? 70 : 55;
    why = stealth ? 'Stealth — window is open, recency unknown.' : 'No recency signal.';
  } else if (gap <= 3) {
    score = 94;
    why = `Left ${gap} months ago — still in the formation window.`;
  } else if (gap <= 6) {
    score = 82;
    why = `Left ${gap} months ago — still early enough to get in.`;
  } else if (gap <= 12) {
    score = 58;
    why = `Left ${gap} months ago — window is closing.`;
  } else {
    score = 34;
    why = `Left ${gap} months ago — likely already in market or stale.`;
  }
  if (stealth && gap != null && gap <= 6) score = Math.min(100, score + 4);
  return { score, why };
}

export function computeMatchScore(founder, investorProfile = DEFAULT_INVESTOR_PROFILE, overrides = {}) {
  const profile = fundProfile(investorProfile);
  const dimensions = MATCH_METRICS.map((m) => {
    const base = METRIC_FNS[m.id](founder, profile);
    const over = overrides[m.id];
    const score = clamp(over?.score ?? base.score);
    const why = over?.why || base.why;
    return { ...m, score, why, contribution: Math.round(score * m.weight) };
  });

  const fitScore = clamp(dimensions.reduce((sum, d) => sum + d.score * d.weight, 0));
  const urgency = fitScore >= 85 ? 'high' : fitScore >= 70 ? 'medium' : 'low';
  return { fitScore, urgency, dimensions };
}

function heuristicNarrative(founder, investorProfile, match) {
  const top = [...match.dimensions].sort((a, b) => b.score - a.score).slice(0, 3);
  const weak = match.dimensions.filter((d) => d.score < 55);
  return {
    strongSignals: top.map((d) => d.why),
    redFlags: weak.length ? weak.map((d) => d.why) : ['Still needs a live conversation to validate the claim.'],
    summary: `${founder.name} scores ${match.fitScore} against ${investorProfile.fundName || 'the thesis'}: strongest on ${top[0].label.toLowerCase()}.`,
    outreachAngle: `Citing ${founder.previousEmployers?.[0] || founder.currentCompany} and ${investorProfile.fundName}'s ${investorProfile.unfairAdvantage || 'network'} as the reason to talk now.`,
  };
}

// ── Score an Individual Founder Against Investor Profile ──────────────────────
export async function scoreFounder(founder, investorProfile = DEFAULT_INVESTOR_PROFILE, apiKey) {
  const profile = fundProfile(investorProfile);
  const heuristic = computeMatchScore(founder, profile);

  if (!apiKey) {
    return { ...heuristicNarrative(founder, profile, heuristic), ...heuristic };
  }

  const book = (profile.portfolio || []).map((c) => `${c.name} (${c.sector})`).join(', ');
  const prompt = `
You score one founder against a fund. Do NOT invent a total score.
For each metric, return an integer 0-100 and one short why (max 22 words).
Unknown → 40-55. Do not reward generic momentum that does not address the metric.

METRICS (each 25% of the final score):
- vision: Does this company belong in the fund's stated vision?
- goals: Can we actually do this deal given stage, geography, check size, and timing?
- futureProof: Will this problem matter more in 5-10 years (AI, climate, infra, regulation) or is it a fad?
- portfolio: Adjacent to the existing book (intros, shared ICP) without being a clone of one company.

FUND:
${profile.fundName} · ${profile.name}
Vision: ${profile.vision}
Goals: ${profile.goals}
Future-proof: ${profile.futureProof}
Portfolio: ${book || 'none listed'}
Stages: ${profile.targetStages?.join(', ')} · ${profile.checkSize}
Industries: ${profile.targetIndustries?.join(', ')}
Regions: ${profile.targetRegions?.join(', ')}

FOUNDER:
${founder.name} · ${founder.headline}
${founder.location} · ${founder.region} · ${founder.industry}
${founder.currentCompany} · ${founder.stage}
Employers: ${founder.previousEmployers?.join(', ') || 'n/a'}
Bio: ${founder.bio}

Return raw JSON only:
{
  "dimensions": {
    "vision": { "score": 0, "why": "" },
    "goals": { "score": 0, "why": "" },
    "futureProof": { "score": 0, "why": "" },
    "portfolio": { "score": 0, "why": "" }
  },
  "strongSignals": ["", ""],
  "redFlags": ["", ""],
  "summary": "",
  "outreachAngle": ""
}
`;

  const rawJson = await callGemini(prompt, apiKey);
  const ai = JSON.parse(rawJson);
  const match = computeMatchScore(founder, profile, ai.dimensions || {});
  const story = heuristicNarrative(founder, profile, match);

  return {
    ...story,
    ...match,
    strongSignals: ai.strongSignals?.length ? ai.strongSignals : story.strongSignals,
    redFlags: ai.redFlags?.length ? ai.redFlags : story.redFlags,
    summary: ai.summary || story.summary,
    outreachAngle: ai.outreachAngle || story.outreachAngle,
  };
}

// ── Batch Score All Founders with Intelligent Offline Fallback ─────────────────
export async function scoreAllFounders(founders, investorProfile, apiKey, onProgress) {
  const results = {};
  for (let i = 0; i < founders.length; i++) {
    const f = founders[i];
    try {
      results[f.id] = await scoreFounder(f, investorProfile, apiKey);
    } catch (err) {
      console.warn(`[FounderScorer] Error scoring ${f.name}:`, err);
      const match = computeMatchScore(f, investorProfile);
      results[f.id] = { ...heuristicNarrative(f, investorProfile, match), ...match };
    }
    if (onProgress) onProgress(i + 1, founders.length);
  }
  return results;
}
