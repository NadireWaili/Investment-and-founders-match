// ── Unipile Real LinkedIn API Service ─────────────────────────────────────────

const UNIPILE_STORAGE_KEY = 'talentRadar_unipileConfig';

const UNIPILE_DSN =
  import.meta.env.VITE_UNIPILE_BASE_URL || 'https://api38.unipile.com:16809';

export const DEFAULT_UNIPILE_CONFIG = {
  baseUrl: UNIPILE_DSN,
  apiKey: import.meta.env.VITE_UNIPILE_API_KEY || '',
  connectedAccountId: null,
  connectedAccountName: null,
};

function unipileRequestBase() {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return '/unipile';
  }
  return UNIPILE_DSN;
}

export function getUnipileConfig() {
  try {
    const stored = localStorage.getItem(UNIPILE_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return {
      ...DEFAULT_UNIPILE_CONFIG,
      ...parsed,
      // Env / default DSN + key always win over a stale localStorage value.
      baseUrl: UNIPILE_DSN,
      apiKey: DEFAULT_UNIPILE_CONFIG.apiKey || parsed.apiKey || '',
    };
  } catch {
    return DEFAULT_UNIPILE_CONFIG;
  }
}

export function saveUnipileConfig(config) {
  localStorage.setItem(UNIPILE_STORAGE_KEY, JSON.stringify(config));
}

async function unipileFetch(path, options = {}) {
  const config = getUnipileConfig();
  if (!config.apiKey) {
    throw new Error('Unipile API key is missing. Add VITE_UNIPILE_API_KEY to .env.local.');
  }

  const res = await fetch(`${unipileRequestBase()}${path}`, {
    ...options,
    headers: {
      'X-API-KEY': config.apiKey,
      accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || `Unipile HTTP ${res.status}`);
  }

  return res.json();
}

// ── Check Connected Accounts ──────────────────────────────────────────────────
export async function getUnipileAccounts() {
  const data = await unipileFetch('/api/v1/accounts');
  const items = data.items || [];
  const config = getUnipileConfig();
  const activeLinkedin =
    items.find((a) => a.provider === 'LINKEDIN' && a.status === 'OK') || items[0];

  if (activeLinkedin) {
    saveUnipileConfig({
      ...config,
      connectedAccountId: activeLinkedin.id,
      connectedAccountName:
        activeLinkedin.name || activeLinkedin.username || 'Connected LinkedIn User',
    });
  }

  return items;
}

function mapSearchItem(item, idx, { location, region, industry }) {
  return {
    id: `unipile-${item.id || idx}-${Date.now()}`,
    name:
      item.name ||
      `${item.first_name || ''} ${item.last_name || ''}`.trim() ||
      'LinkedIn Founder',
    headline: item.headline || 'Founder',
    linkedinUrl: item.profile_url || `https://linkedin.com/in/${item.public_identifier || ''}`,
    location: item.location || location || 'Europe',
    city: item.location?.split(',')[0]?.trim() || 'Copenhagen',
    country: item.location?.split(',').slice(-1)[0]?.trim() || 'Denmark',
    region: region || 'Nordics',
    industry: industry || 'AI & DeepTech',
    currentCompany: item.current_positions?.[0]?.company || item.current_company || 'Stealth Venture',
    companyFoundedYear: new Date().getFullYear(),
    previousEmployers: item.past_companies || [],
    employmentGapMonths: 3,
    connectionDegree: item.network_distance || 2,
    skills: item.skills || ['Leadership', 'Product Strategy'],
    signals: ['live-unipile'],
    stage: 'stealth',
    pedigree: 'live-linkedin',
    lastActivityDays: 1,
    timestampMs: Date.now(),
    bio: item.summary || item.headline || 'Live profile synchronized from LinkedIn via Unipile API.',
    connectionCount: item.connections_count || 0,
    isLiveUnipile: true,
  };
}

// ── Search Live LinkedIn Founders via Unipile ────────────────────────────────
export async function searchLiveLinkedInFounders({
  keywords = 'Founder',
  location = '',
  region = 'Nordics',
  industry = 'AI & DeepTech',
} = {}) {
  const config = getUnipileConfig();
  const accounts = await getUnipileAccounts();
  const accountId = config.connectedAccountId || accounts[0]?.id;

  if (!accountId) {
    throw new Error('No LinkedIn account connected in Unipile yet. Please connect your LinkedIn account first.');
  }

  const data = await unipileFetch(`/api/v1/linkedin/search?account_id=${encodeURIComponent(accountId)}`, {
    method: 'POST',
    body: JSON.stringify({
      api: 'classic',
      category: 'people',
      keywords: keywords || 'Founder OR Co-Founder',
    }),
  });

  return (data.items || []).map((item, idx) =>
    mapSearchItem(item, idx, { location, region, industry })
  );
}

// ── Fetch Individual LinkedIn Profile by Identifier / URL ─────────────────────
export async function fetchLinkedInProfile(profileIdentifierOrUrl) {
  const config = getUnipileConfig();
  const accounts = await getUnipileAccounts();
  const accountId = config.connectedAccountId || accounts[0]?.id;

  if (!accountId) {
    throw new Error('No LinkedIn account connected in Unipile.');
  }

  let identifier = profileIdentifierOrUrl.trim();
  const urlMatch = identifier.match(/linkedin\.com\/in\/([^/?#]+)/);
  if (urlMatch) {
    identifier = decodeURIComponent(urlMatch[1]);
  }

  const p = await unipileFetch(
    `/api/v1/users/${encodeURIComponent(identifier)}?account_id=${encodeURIComponent(accountId)}`
  );

  return {
    id: `unipile-profile-${p.provider_id || p.id || Date.now()}`,
    name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.name || identifier,
    headline: p.headline || 'Founder',
    linkedinUrl: p.profile_url || `https://linkedin.com/in/${identifier}`,
    location: p.location || p.living_in || 'Europe',
    city: (p.location || '').split(',')[0]?.trim() || 'Copenhagen',
    country: (p.location || '').split(',').slice(-1)[0]?.trim() || 'Denmark',
    region: 'Nordics',
    industry: 'AI & DeepTech',
    currentCompany: p.work_experience?.[0]?.company || p.company || 'Stealth Venture',
    companyFoundedYear: new Date().getFullYear(),
    previousEmployers: (p.work_experience || []).slice(1, 4).map((e) => e.company).filter(Boolean),
    employmentGapMonths: 2,
    connectionDegree: p.network_distance || 2,
    skills: (p.skills || []).slice(0, 6).map((s) => s.name || s),
    signals: ['live-unipile', 'imported'],
    stage: 'stealth',
    pedigree: 'live-linkedin',
    lastActivityDays: 1,
    timestampMs: Date.now(),
    bio: p.summary || p.headline || 'Profile fetched directly from LinkedIn via Unipile.',
    connectionCount: p.connections_count || 0,
    isLiveUnipile: true,
  };
}
