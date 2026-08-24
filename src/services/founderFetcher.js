// ── LinkedIn Founder Fetcher (Proxycurl + Multi-Region/Industry Seed Data) ─────

const nowMs = Date.now();
const daysAgo = (d) => nowMs - d * 24 * 60 * 60 * 1000;

export const REGIONS = [
  { id: 'all', label: 'All regions' },
  { id: 'Nordics', label: 'Nordics' },
  { id: 'DACH', label: 'DACH' },
  { id: 'UK & Ireland', label: 'UK & Ireland' },
  { id: 'Southern Europe', label: 'Southern Europe' },
  { id: 'North America', label: 'North America' },
];

export const INDUSTRIES = [
  { id: 'all', label: 'All industries' },
  { id: 'AI & DeepTech', label: 'AI & DeepTech' },
  { id: 'ClimateTech & Energy', label: 'ClimateTech' },
  { id: 'Fintech', label: 'Fintech' },
  { id: 'B2B SaaS', label: 'B2B SaaS' },
  { id: 'HealthTech & Bio', label: 'HealthTech' },
  { id: 'Logistics & Supply Chain', label: 'Logistics' },
  { id: 'DevTools & Infra', label: 'DevTools' },
];

// ── Rich Seed Founders with Industry, Region, and Pedigree Metadata ──────────
export const SEED_FOUNDERS = [
  {
    id: 'f-001',
    name: 'Alex Müller',
    headline: 'Building in stealth | ex-N26 Head of Engineering',
    linkedinUrl: 'https://linkedin.com/in/alex-muller-fintech',
    location: 'Berlin, Germany',
    city: 'Berlin',
    country: 'Germany',
    region: 'DACH',
    industry: 'Fintech',
    currentCompany: 'Stealth Payments OS',
    companyFoundedYear: 2026,
    previousEmployers: ['N26', 'Zalando', 'TU Berlin'],
    employmentGapMonths: 3,
    connectionDegree: 2,
    skills: ['Embedded Finance', 'API Design', 'Distributed Systems', 'Python', 'Go'],
    signals: ['ex-unicorn', 'stealth', 'left-recently', '2nd-degree'],
    stage: 'stealth',
    pedigree: 'ex-unicorn',
    lastActivityDays: 5,
    timestampMs: daysAgo(14),
    bio: 'Led engineering at N26 for 4 years — scaled core banking infrastructure to 8M users across Europe. Left quietly 3 months ago. Recently hired 2 senior engineers from Stripe and Monzo. Profile activity spiked 3x in the last 30 days.',
    connectionCount: 3420,
  },
  {
    id: 'f-002',
    name: 'Dr. Sara Kim',
    headline: 'Co-founder @ Axon Health | ex-DeepMind Research Scientist',
    linkedinUrl: 'https://linkedin.com/in/sara-kim-ai',
    location: 'Copenhagen, Denmark',
    city: 'Copenhagen',
    country: 'Denmark',
    region: 'Nordics',
    industry: 'HealthTech & Bio',
    currentCompany: 'Axon Health',
    companyFoundedYear: 2025,
    previousEmployers: ['DeepMind', 'DTU', 'Novo Nordisk'],
    employmentGapMonths: 6,
    connectionDegree: 2,
    skills: ['Medical AI', 'Computer Vision', 'PyTorch', 'MLOps', 'Python'],
    signals: ['ex-FAANG', 'pre-seed', 'top-academia', 'domain-expert'],
    stage: 'pre-seed',
    pedigree: 'ex-FAANG',
    lastActivityDays: 2,
    timestampMs: daysAgo(7),
    bio: 'Published 9 papers at NeurIPS/ICML on medical imaging AI. Left DeepMind to build early cancer detection tools using multimodal foundation models. Raised €600K pre-seed from EIFO. Team of 3 PhDs. Axon Health incorporated Feb 2025.',
    connectionCount: 1850,
  },
  {
    id: 'f-003',
    name: 'Jonas Brandt',
    headline: 'Founder @ EnerLink (stealth) | ex-Ørsted Senior Product Manager',
    linkedinUrl: 'https://linkedin.com/in/jonas-brandt-energy',
    location: 'Copenhagen, Denmark',
    city: 'Copenhagen',
    country: 'Denmark',
    region: 'Nordics',
    industry: 'ClimateTech & Energy',
    currentCompany: 'EnerLink',
    companyFoundedYear: 2026,
    previousEmployers: ['Ørsted', 'Siemens Energy', 'DTU'],
    employmentGapMonths: 4,
    connectionDegree: 3,
    skills: ['Energy Markets', 'Grid APIs', 'Product Strategy', 'Python', 'B2B SaaS'],
    signals: ['stealth', 'left-recently', 'domain-expert', 'ex-corporate'],
    stage: 'stealth',
    pedigree: 'ex-corporate',
    lastActivityDays: 8,
    timestampMs: daysAgo(21),
    bio: 'Led Ørsted\'s offshore wind data platform for 5 years — managed data pipeline for €2B in assets. Left 4 months ago. Building an AI-driven energy flexibility marketplace for industrial consumers. LinkedIn indicates "EnerLink" active since Jan 2026.',
    connectionCount: 2100,
  },
  {
    id: 'f-004',
    name: 'Lena Schwarz',
    headline: 'Co-founder & CTO @ Crono | ex-Klarna Principal Architect',
    linkedinUrl: 'https://linkedin.com/in/lena-schwarz-eng',
    location: 'Stockholm, Sweden',
    city: 'Stockholm',
    country: 'Sweden',
    region: 'Nordics',
    industry: 'Fintech',
    currentCompany: 'Crono',
    companyFoundedYear: 2025,
    previousEmployers: ['Klarna', 'Zalando', 'KTH Royal Institute'],
    employmentGapMonths: 8,
    connectionDegree: 2,
    skills: ['BNPL Infrastructure', 'Payments', 'Rust', 'Go', 'FinOps'],
    signals: ['ex-unicorn', 'seed', '2nd-degree', 'serial-founder'],
    stage: 'seed',
    pedigree: 'ex-unicorn',
    lastActivityDays: 1,
    timestampMs: daysAgo(3),
    bio: 'Principal Architect at Klarna, built real-time fraud mitigation processing €15B GMV. Previously co-founded and exited a DevOps SaaS (2021). Crono is building multi-currency subscription billing for European enterprises. Seed round closing Q3 2026.',
    connectionCount: 4870,
  },
  {
    id: 'f-005',
    name: 'Mikkel Hansen',
    headline: 'Founder @ Phlox | ex-Maersk Digital Lead Architect',
    linkedinUrl: 'https://linkedin.com/in/mikkel-hansen-logistics',
    location: 'Aarhus, Denmark',
    city: 'Aarhus',
    country: 'Denmark',
    region: 'Nordics',
    industry: 'Logistics & Supply Chain',
    currentCompany: 'Phlox',
    companyFoundedYear: 2026,
    previousEmployers: ['Maersk Digital', 'IBM', 'Aalborg University'],
    employmentGapMonths: 2,
    connectionDegree: 2,
    skills: ['Supply Chain AI', 'LLM Agents', 'FastAPI', 'TypeScript', 'B2B SaaS'],
    signals: ['left-recently', 'stealth', '2nd-degree', 'domain-expert'],
    stage: 'stealth',
    pedigree: 'ex-unicorn',
    lastActivityDays: 3,
    timestampMs: daysAgo(10),
    bio: 'Lead architect at Maersk Digital, responsible for AI-driven port routing for 350+ vessels. Left just 2 months ago. Phlox is developing autonomous dispatch agents for freight forwarders. First enterprise pilot signed with DFDS.',
    connectionCount: 2450,
  },
  {
    id: 'f-006',
    name: 'Dr. Amira Osei',
    headline: 'Co-founder @ Dialect AI | ex-Google Brain · YC S25',
    linkedinUrl: 'https://linkedin.com/in/amira-osei-nlp',
    location: 'Berlin, Germany',
    city: 'Berlin',
    country: 'Germany',
    region: 'DACH',
    industry: 'AI & DeepTech',
    currentCompany: 'Dialect AI',
    companyFoundedYear: 2025,
    previousEmployers: ['Google Brain', 'Max Planck Institute', 'ETH Zurich'],
    employmentGapMonths: 10,
    connectionDegree: 2,
    skills: ['NLP', 'Multilingual LLMs', 'Python', 'RLHF', 'B2B SaaS'],
    signals: ['ex-FAANG', 'yc-backed', 'top-academia', 'seed', '2nd-degree'],
    stage: 'seed',
    pedigree: 'ex-FAANG',
    lastActivityDays: 1,
    timestampMs: daysAgo(2),
    bio: 'Research Scientist at Google Brain with 3,000+ citations on multilingual tokenization and alignment. Completed YC S25. Dialect AI builds privacy-compliant multilingual document intelligence for European regulated industries. €1.8M seed round.',
    connectionCount: 6200,
  },
  {
    id: 'f-007',
    name: 'Tobias Ravn',
    headline: 'Founder @ Fjord Climate | ex-McKinsey Sustainability · DTU PhD',
    linkedinUrl: 'https://linkedin.com/in/tobias-ravn-climate',
    location: 'Copenhagen, Denmark',
    city: 'Copenhagen',
    country: 'Denmark',
    region: 'Nordics',
    industry: 'ClimateTech & Energy',
    currentCompany: 'Fjord Climate',
    companyFoundedYear: 2026,
    previousEmployers: ['McKinsey & Company', 'DTU', 'Vestas'],
    employmentGapMonths: 5,
    connectionDegree: 3,
    skills: ['Carbon Verification', 'Geospatial AI', 'Python', 'Remote Sensing'],
    signals: ['left-recently', 'pre-seed', 'domain-expert', 'ex-consulting'],
    stage: 'pre-seed',
    pedigree: 'ex-consulting',
    lastActivityDays: 6,
    timestampMs: daysAgo(18),
    bio: 'PhD in Climate Systems (DTU) followed by 3 years at McKinsey advising Nordic energy giants on ESG compliance and scope-3 auditing. Fjord Climate offers automated satellite verification for carbon offsets. InnoBooster grant approved.',
    connectionCount: 1620,
  },
  {
    id: 'f-008',
    name: 'Clara Weber',
    headline: 'Co-founder @ Kinto | ex-Spotify Principal Data Scientist',
    linkedinUrl: 'https://linkedin.com/in/clara-weber-data',
    location: 'Munich, Germany',
    city: 'Munich',
    country: 'Germany',
    region: 'DACH',
    industry: 'B2B SaaS',
    currentCompany: 'Kinto',
    companyFoundedYear: 2025,
    previousEmployers: ['Spotify', 'Babbel', 'HU Berlin'],
    employmentGapMonths: 7,
    connectionDegree: 2,
    skills: ['Recommendation Engines', 'LLM Personalization', 'Python', 'FastAPI'],
    signals: ['ex-unicorn', 'pre-seed', '2nd-degree', 'domain-expert'],
    stage: 'pre-seed',
    pedigree: 'ex-unicorn',
    lastActivityDays: 4,
    timestampMs: daysAgo(12),
    bio: 'Principal Data Scientist at Spotify where she built adaptive podcast recommendation engines. Left to create Kinto, an AI-native skills intelligence OS for enterprise L&D departments. Pre-seed round currently active.',
    connectionCount: 3100,
  },
  {
    id: 'f-009',
    name: 'Callum Stewart',
    headline: 'Founder @ KernelSync (stealth) | ex-DeepMind & ARM Systems Lead',
    linkedinUrl: 'https://linkedin.com/in/callum-stewart-chips',
    location: 'Cambridge, United Kingdom',
    city: 'Cambridge',
    country: 'United Kingdom',
    region: 'UK & Ireland',
    industry: 'DevTools & Infra',
    currentCompany: 'KernelSync',
    companyFoundedYear: 2026,
    previousEmployers: ['DeepMind', 'ARM', 'Cambridge University'],
    employmentGapMonths: 2,
    connectionDegree: 2,
    skills: ['Compilers', 'C++', 'CUDA', 'Hardware Acceleration', 'LLM Inference'],
    signals: ['ex-FAANG', 'stealth', 'left-recently', 'top-academia'],
    stage: 'stealth',
    pedigree: 'ex-FAANG',
    lastActivityDays: 2,
    timestampMs: daysAgo(8),
    bio: '10 years leading silicon-level kernel optimization at ARM and DeepMind hardware systems. Building a dynamic compiler that reduces LLM inference costs on edge GPUs by 4x. In stealth with 3 ex-ARM engineers.',
    connectionCount: 2900,
  },
  {
    id: 'f-010',
    name: 'Camille Dubois',
    headline: 'Co-founder @ Synapse Security | ex-Mistral AI & Criteo Lead',
    linkedinUrl: 'https://linkedin.com/in/camille-dubois-sec',
    location: 'Paris, France',
    city: 'Paris',
    country: 'France',
    region: 'Southern Europe',
    industry: 'AI & DeepTech',
    currentCompany: 'Synapse Security',
    companyFoundedYear: 2025,
    previousEmployers: ['Mistral AI', 'Criteo', 'École Polytechnique'],
    employmentGapMonths: 5,
    connectionDegree: 2,
    skills: ['AI Red Teaming', 'LLM Guardrails', 'Python', 'Rust', 'Cybersecurity'],
    signals: ['ex-unicorn', 'pre-seed', 'top-academia', 'left-recently'],
    stage: 'pre-seed',
    pedigree: 'ex-unicorn',
    lastActivityDays: 1,
    timestampMs: daysAgo(5),
    bio: 'Early research engineer at Mistral AI, focused on alignment and jailbreak mitigation. Synapse provides enterprise automated red-teaming and compliance guardrails for agentic LLM deployments. Raising €1.2M pre-seed.',
    connectionCount: 4150,
  },
  {
    id: 'f-011',
    name: 'David Vance',
    headline: 'Founder @ NexusFlow | ex-Stripe Head of DevTools',
    linkedinUrl: 'https://linkedin.com/in/david-vance-infra',
    location: 'San Francisco, CA, USA',
    city: 'San Francisco',
    country: 'United States',
    region: 'North America',
    industry: 'DevTools & Infra',
    currentCompany: 'NexusFlow',
    companyFoundedYear: 2026,
    previousEmployers: ['Stripe', 'Twilio', 'Stanford University'],
    employmentGapMonths: 3,
    connectionDegree: 2,
    skills: ['Developer APIs', 'Distributed Observability', 'TypeScript', 'Rust'],
    signals: ['ex-FAANG', 'stealth', 'left-recently', 'serial-founder'],
    stage: 'stealth',
    pedigree: 'ex-FAANG',
    lastActivityDays: 1,
    timestampMs: daysAgo(4),
    bio: 'Led developer tools at Stripe for 5 years, scaling internal CI/CD and public SDK generation. NexusFlow is building AI-powered API migration and integration automation for enterprise platforms.',
    connectionCount: 7800,
  }
];

// ── Proxycurl Live Search (When Key Is Present) ───────────────────────────────
async function fetchProxycurlFounders(proxycurlKey, { regionFilter, industryFilter }) {
  const results = [];
  const searches = [
    { keywords: 'Founder OR Co-Founder OR CEO', country: 'DK', city: 'Copenhagen', region: 'Nordics' },
    { keywords: 'Founder OR Co-Founder OR CEO', country: 'DE', city: 'Berlin', region: 'DACH' },
    { keywords: 'Founder OR Co-Founder OR CEO', country: 'GB', city: 'London', region: 'UK & Ireland' },
    { keywords: 'Founder OR Co-Founder OR CEO', country: 'FR', city: 'Paris', region: 'Southern Europe' },
  ];

  const targetSearches = searches.filter(s => regionFilter === 'all' || s.region === regionFilter);

  for (const s of targetSearches.slice(0, 2)) {
    try {
      const params = new URLSearchParams({
        headline_keyword_regex: s.keywords,
        country: s.country,
        page_size: 6,
      });

      const res = await fetch(
        `https://nubela.co/proxycurl/api/v2/search/person?${params}`,
        { headers: { Authorization: `Bearer ${proxycurlKey}` } }
      );

      if (!res.ok) continue;

      const data = await res.json();
      const profiles = data.results || [];

      profiles.forEach((p, idx) => {
        results.push({
          id: `proxycurl-${s.country}-${idx}-${Date.now()}`,
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'LinkedIn Founder',
          headline: p.headline || 'Founder & CEO',
          linkedinUrl: p.linkedin_profile_url || '',
          location: `${s.city}, ${s.country}`,
          city: s.city,
          country: s.country,
          region: s.region,
          industry: industryFilter !== 'all' ? industryFilter : 'AI & DeepTech',
          currentCompany: p.current_company?.name || 'Stealth Venture',
          companyFoundedYear: new Date().getFullYear(),
          previousEmployers: (p.experiences || []).slice(1, 4).map(e => e.company).filter(Boolean),
          employmentGapMonths: 3,
          connectionDegree: 2,
          skills: (p.skills || []).slice(0, 5).map(sk => sk.name || sk),
          signals: ['live-data', 'stealth'],
          stage: 'stealth',
          pedigree: 'ex-unicorn',
          lastActivityDays: 2,
          timestampMs: nowMs,
          bio: p.summary || p.headline || 'Active founder spotted via live LinkedIn sync.',
          connectionCount: p.follower_count || 1500,
          isLive: true,
        });
      });
    } catch (e) {
      console.warn('[FounderFetcher] Proxycurl error:', e.message);
    }
  }

  return results;
}

// ── Main Query & Filtering Engine ─────────────────────────────────────────────
export async function fetchFounders({
  regionFilter = 'all',
  industryFilter = 'all',
  locationFilter = 'all',
  pedigreeFilter = 'all',
  stageFilter = 'all',
  recencyFilter = 'all',
  searchQuery = '',
  proxycurlKey = null,
}) {
  let founders = [...SEED_FOUNDERS];

  if (proxycurlKey) {
    try {
      const liveFounders = await fetchProxycurlFounders(proxycurlKey, { regionFilter, industryFilter });
      if (liveFounders.length > 0) {
        founders = [...liveFounders, ...founders];
      }
    } catch (e) {
      console.warn('[FounderFetcher] Live fetch error:', e);
    }
  }

  // Filter by Region
  if (regionFilter !== 'all') {
    founders = founders.filter(f => f.region === regionFilter);
  }

  // Filter by Industry
  if (industryFilter !== 'all') {
    founders = founders.filter(f => f.industry === industryFilter);
  }

  // Filter by City / Specific Location
  if (locationFilter !== 'all') {
    founders = founders.filter(f => f.city?.toLowerCase() === locationFilter.toLowerCase());
  }

  // Filter by Pedigree
  if (pedigreeFilter !== 'all') {
    founders = founders.filter(f => f.pedigree === pedigreeFilter || f.signals?.includes(pedigreeFilter));
  }

  // Filter by Stage
  if (stageFilter !== 'all') {
    founders = founders.filter(f => f.stage === stageFilter);
  }

  // Filter by Recency
  if (recencyFilter !== 'all') {
    founders = founders.filter(f => {
      if (f.employmentGapMonths == null) return true;
      if (recencyFilter === '3mo') return f.employmentGapMonths <= 3;
      if (recencyFilter === '6mo') return f.employmentGapMonths <= 6;
      if (recencyFilter === '12mo') return f.employmentGapMonths <= 12;
      return true;
    });
  }

  // Search Query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    founders = founders.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.headline.toLowerCase().includes(q) ||
      f.bio.toLowerCase().includes(q) ||
      f.currentCompany?.toLowerCase().includes(q) ||
      f.industry?.toLowerCase().includes(q) ||
      f.region?.toLowerCase().includes(q) ||
      f.location?.toLowerCase().includes(q) ||
      f.previousEmployers?.some(e => e.toLowerCase().includes(q)) ||
      f.skills?.some(s => s.toLowerCase().includes(q)) ||
      f.signals?.some(s => s.toLowerCase().includes(q))
    );
  }

  return founders;
}
