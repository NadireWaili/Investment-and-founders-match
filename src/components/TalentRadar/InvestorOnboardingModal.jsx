import React, { useState } from 'react';
import { X } from 'lucide-react';
import { REGIONS, INDUSTRIES } from '../../services/founderFetcher';

const PRESETS = [
  {
    label: 'Nordic climate & DeepTech',
    name: 'Nadira Vance',
    linkedinUrl: 'https://linkedin.com/in/nadira-investor',
    fundName: 'Nordic Alpha Seed',
    role: 'General Partner',
    targetStages: ['Stealth', 'Pre-Seed', 'Seed'],
    targetIndustries: ['ClimateTech & Energy', 'AI & DeepTech', 'B2B SaaS'],
    targetRegions: ['Nordics', 'DACH'],
    checkSize: '€500K – €1.5M',
    unfairAdvantage: 'Deep Nordic clean-energy operator ties and rapid enterprise pilot introductions.',
    thesisDescription: 'Backing world-class technical founders in the Nordics building decarbonization, energy grids, and foundational AI.',
    vision: 'Decarbonize European industry with operators who already ran the grid, the plant, or the model.',
    goals: 'Lead or co-lead 8–10 climate and deeptech pre-seeds a year in Nordics + DACH.',
    futureProof: 'Energy systems, industrial AI, and climate infrastructure that get more valuable as regulation tightens.',
    portfolio: [
      { name: 'Voltgrid', sector: 'ClimateTech & Energy' },
      { name: 'Axon Health', sector: 'HealthTech & Bio' },
    ],
  },
  {
    label: 'European AI & infra',
    name: 'Marcus Lindqvist',
    linkedinUrl: 'https://linkedin.com/in/marcus-ai-vc',
    fundName: 'Silicon Baltic Ventures',
    role: 'Managing Partner',
    targetStages: ['Stealth', 'Pre-Seed'],
    targetIndustries: ['AI & DeepTech', 'DevTools & Infra', 'B2B SaaS'],
    targetRegions: ['Nordics', 'DACH', 'UK & Ireland'],
    checkSize: '€250K – €750K',
    unfairAdvantage: 'Silicon Valley network, ex-Google Brain syndicate members, GPU cluster credits.',
    thesisDescription: 'Pre-incorporation AI researchers & engineers from DeepMind, Mistral, Google Brain, and top European labs.',
    vision: 'Foundational AI and infra built in Europe, by people who trained the models.',
    goals: 'Be first check into stealth research teams before they incorporate.',
    futureProof: 'Models, evals, and infrastructure that still matter when the current hype cycle ends.',
    portfolio: [
      { name: 'Relay', sector: 'B2B SaaS' },
      { name: 'Forge', sector: 'DevTools & Infra' },
    ],
  },
  {
    label: 'Fintech & SaaS',
    name: 'Elena Rossi',
    linkedinUrl: 'https://linkedin.com/in/elena-rossi-fintech',
    fundName: 'NextWave Capital',
    role: 'Founding Partner',
    targetStages: ['Pre-Seed', 'Seed'],
    targetIndustries: ['Fintech', 'B2B SaaS', 'Logistics & Supply Chain'],
    targetRegions: ['DACH', 'UK & Ireland', 'Southern Europe'],
    checkSize: '€500K – €2M',
    unfairAdvantage: 'Ex-Klarna & N26 executives backing next-gen financial infrastructure.',
    thesisDescription: 'Embedded finance, automated regulatory compliance, and cross-border European payments.',
    vision: 'The operating system for European money movement — rails, not consumer apps.',
    goals: 'Seed fintech infrastructure where we can open bank and enterprise doors.',
    futureProof: 'Payments, KYC, and embedded finance that survive PSD3 and AI-native fraud.',
    portfolio: [
      { name: 'LedgerOS', sector: 'Fintech' },
      { name: 'Relay', sector: 'B2B SaaS' },
    ],
  },
];

const InvestorOnboardingModal = ({ currentProfile, onSave, onClose }) => {
  const [profile, setProfile] = useState(currentProfile || PRESETS[0]);

  const toggleArrayItem = (field, value) => {
    const list = profile[field] || [];
    setProfile({
      ...profile,
      [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
    });
  };

  return (
    <div className="overlay">
      <div className="modal wide">
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={16} /></button>
        <div className="modal-t">Thesis</div>
        <p className="modal-d">Vision, goals, future-proof themes, and portfolio — used to rank founders.</p>

        <div className="modal-body">
          <div className="filter-row">
            {PRESETS.map((p) => (
              <button
                key={p.fundName}
                className={`chip${profile.fundName === p.fundName ? ' on' : ''}`}
                onClick={() => setProfile(p)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="stack">
            <span className="label">LinkedIn</span>
            <input
              className="field"
              value={profile.linkedinUrl || ''}
              onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <div className="stack">
              <span className="label">Name</span>
              <input className="field" value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="stack">
              <span className="label">Fund</span>
              <input className="field" value={profile.fundName || ''} onChange={(e) => setProfile({ ...profile, fundName: e.target.value })} />
            </div>
          </div>

          <div className="stack">
            <span className="label">Industries</span>
            <div className="filter-row">
              {INDUSTRIES.filter((i) => i.id !== 'all').map((ind) => (
                <button
                  key={ind.id}
                  type="button"
                  className={`chip${profile.targetIndustries?.includes(ind.id) ? ' on' : ''}`}
                  onClick={() => toggleArrayItem('targetIndustries', ind.id)}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          </div>

          <div className="stack">
            <span className="label">Regions</span>
            <div className="filter-row">
              {REGIONS.filter((r) => r.id !== 'all').map((reg) => (
                <button
                  key={reg.id}
                  type="button"
                  className={`chip${profile.targetRegions?.includes(reg.id) ? ' on' : ''}`}
                  onClick={() => toggleArrayItem('targetRegions', reg.id)}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="stack">
            <span className="label">Vision</span>
            <textarea
              className="field"
              rows={2}
              value={profile.vision || ''}
              onChange={(e) => setProfile({ ...profile, vision: e.target.value })}
            />
          </div>

          <div className="stack">
            <span className="label">Goals</span>
            <textarea
              className="field"
              rows={2}
              value={profile.goals || ''}
              onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
            />
          </div>

          <div className="stack">
            <span className="label">Future-proof</span>
            <textarea
              className="field"
              rows={2}
              value={profile.futureProof || ''}
              onChange={(e) => setProfile({ ...profile, futureProof: e.target.value })}
            />
          </div>

          <div className="stack">
            <span className="label">Portfolio (name — sector, one per line)</span>
            <textarea
              className="field"
              rows={4}
              value={(profile.portfolio || []).map((c) => (c.sector ? `${c.name} — ${c.sector}` : c.name)).join('\n')}
              onChange={(e) => setProfile({
                ...profile,
                portfolio: e.target.value.split('\n').map((line) => {
                  const [name, sector] = line.split(/[—–-]/).map((s) => s.trim());
                  return name ? { name, sector: sector || '' } : null;
                }).filter(Boolean),
              })}
            />
          </div>

          <div className="stack">
            <span className="label">Value-add</span>
            <textarea
              className="field"
              rows={2}
              value={profile.unfairAdvantage || ''}
              onChange={(e) => setProfile({ ...profile, unfairAdvantage: e.target.value })}
            />
          </div>
        </div>

        <div className="modal-foot">
          <span className="fine">Saved in this browser.</span>
          <button className="btn sm" onClick={() => onSave(profile)}>Save & rank</button>
        </div>
      </div>
    </div>
  );
};

export default InvestorOnboardingModal;
