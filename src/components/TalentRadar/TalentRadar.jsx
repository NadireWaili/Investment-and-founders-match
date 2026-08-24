import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import FounderCard from './FounderCard';
import FounderDetailPanel from './FounderDetailPanel';
import InvestorOnboardingModal from './InvestorOnboardingModal';
import SlackModal from './SlackModal';
import ApiKeyModal from '../ApiKeyModal';
import { fetchFounders, REGIONS, INDUSTRIES } from '../../services/founderFetcher';
import { scoreFounder, scoreAllFounders, DEFAULT_INVESTOR_PROFILE } from '../../services/founderScorer';
import { getSlackConfig } from '../../services/slackService';

const INVESTOR_STORAGE_KEY = 'talentRadar_investorProfile';

const TalentRadar = () => {
  const [founders, setFounders] = useState([]);
  const [loadingFounders, setLoadingFounders] = useState(true);
  const [selectedFounder, setSelectedFounder] = useState(null);

  // Investor Profile
  const [investorProfile, setInvestorProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(INVESTOR_STORAGE_KEY);
      return stored ? { ...DEFAULT_INVESTOR_PROFILE, ...JSON.parse(stored) } : DEFAULT_INVESTOR_PROFILE;
    } catch {
      return DEFAULT_INVESTOR_PROFILE;
    }
  });

  // Filters
  const [regionFilter, setRegionFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [pedigreeFilter, setPedigreeFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [recencyFilter, setRecencyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rank');

  // AI Scoring State
  const [scoreResults, setScoreResults] = useState(() => {
    try { return JSON.parse(localStorage.getItem('founderScores')) || {}; }
    catch { return {}; }
  });
  const [scoringFounderId, setScoringFounderId] = useState(null);
  const [batchScoring, setBatchScoring] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  // Modals
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [showGeminiModal, setShowGeminiModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [slackConfig, setSlackConfig] = useState(() => getSlackConfig());

  useEffect(() => {
    localStorage.setItem('founderScores', JSON.stringify(scoreResults));
  }, [scoreResults]);

  useEffect(() => {
    localStorage.setItem(INVESTOR_STORAGE_KEY, JSON.stringify(investorProfile));
  }, [investorProfile]);

  useEffect(() => {
    loadFounders();
  }, [regionFilter, industryFilter, pedigreeFilter, stageFilter, recencyFilter, searchQuery]);

  const loadFounders = async () => {
    setLoadingFounders(true);
    const list = await fetchFounders({
      regionFilter,
      industryFilter,
      pedigreeFilter,
      stageFilter,
      recencyFilter,
      searchQuery,
    });
    setFounders(list);
    if (!selectedFounder && list.length > 0) {
      setSelectedFounder(list[0]);
    }
    setLoadingFounders(false);
  };

  const handleScoreSingle = async (founder) => {
    const geminiKey = localStorage.getItem('geminiApiKey');
    setScoringFounderId(founder.id);
    setErrorMessage('');
    try {
      const result = await scoreFounder(founder, investorProfile, geminiKey);
      setScoreResults(prev => ({ ...prev, [founder.id]: result }));
      setSelectedFounder(founder);
    } catch (e) {
      setErrorMessage(`Scoring failed: ${e.message}`);
    }
    setScoringFounderId(null);
  };

  // 1-Click Batch Matchmaking & Auto-Ranking
  const handleBatchScore = async () => {
    const geminiKey = localStorage.getItem('geminiApiKey');
    setBatchScoring(true);
    setErrorMessage('');
    try {
      const results = await scoreAllFounders(
        founders,
        investorProfile,
        geminiKey,
        (current, total) => setBatchProgress({ current, total })
      );
      setScoreResults(prev => ({ ...prev, ...results }));
      setSortBy('rank');
      setSuccessMessage('Ranked all founders against the thesis.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (e) {
      setErrorMessage(`Batch ranking failed: ${e.message}`);
    }
    setBatchScoring(false);
  };

  // Sort and calculate ranks
  const sortedFounders = [...founders].sort((a, b) => {
    const scoreA = scoreResults[a.id]?.fitScore || 0;
    const scoreB = scoreResults[b.id]?.fitScore || 0;

    if (sortBy === 'rank') {
      if (scoreA !== scoreB) return scoreB - scoreA;
      return (b.timestampMs || 0) - (a.timestampMs || 0);
    }
    if (sortBy === 'recent') {
      return (b.timestampMs || 0) - (a.timestampMs || 0);
    }
    if (sortBy === 'signals') {
      return (b.signals?.length || 0) - (a.signals?.length || 0);
    }
    return 0;
  });

  const founderRanks = {};
  let currentRank = 1;
  sortedFounders.forEach(f => {
    if (scoreResults[f.id]?.fitScore) {
      founderRanks[f.id] = currentRank++;
    }
  });

  const rankedCount = Object.keys(scoreResults).length;

  return (
    <div className="page">
      {showInvestorModal && (
        <InvestorOnboardingModal
          currentProfile={investorProfile}
          onSave={(updated) => {
            setInvestorProfile(updated);
            setShowInvestorModal(false);
            handleBatchScore();
          }}
          onClose={() => setShowInvestorModal(false)}
        />
      )}

      {showSlackModal && (
        <SlackModal
          sampleFounder={selectedFounder || founders[0]}
          sampleScore={selectedFounder ? scoreResults[selectedFounder.id] : null}
          investorProfile={investorProfile}
          onClose={() => {
            setShowSlackModal(false);
            setSlackConfig(getSlackConfig());
          }}
        />
      )}

      {showGeminiModal && (
        <ApiKeyModal
          onSave={() => setShowGeminiModal(false)}
          onClose={() => setShowGeminiModal(false)}
        />
      )}

      <h1>
        Founders whose timing and pedigree{' '}
        <em>match the thesis.</em>
      </h1>
      <p className="lede">
        Rank stealth and seed founders against {investorProfile.fundName} on vision, goals, future-proof, and portfolio.
      </p>

      <div className="toolbar">
        <div className="toolbar-meta">
          <div className="fund">{investorProfile.fundName}</div>
          <div className="facts">
            {investorProfile.name} · {investorProfile.role} · {investorProfile.targetIndustries?.slice(0, 3).join(', ')} · {investorProfile.checkSize}
          </div>
        </div>
        <div className="toolbar-actions">
          <button className="link" onClick={() => setShowInvestorModal(true)}>Thesis</button>
          <button className="link" onClick={() => setShowSlackModal(true)}>
            {slackConfig.webhookUrl ? `Slack ${slackConfig.channelName}` : 'Slack'}
          </button>
          <button className="link" onClick={loadFounders}>Refresh</button>
          <button className="btn sm" onClick={handleBatchScore} disabled={batchScoring}>
            {batchScoring ? `Ranking ${batchProgress.current}/${batchProgress.total}` : 'Rank all'}
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="notice">
          <span>{successMessage}</span>
          <button type="button" onClick={() => setSuccessMessage('')}>Dismiss</button>
        </div>
      )}
      {errorMessage && (
        <div className="notice err">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}

      <div className="filters">
        <div className="filter-row">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              className={`chip${regionFilter === r.id ? ' on' : ''}`}
              onClick={() => setRegionFilter(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="filter-row">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              className={`chip${industryFilter === ind.id ? ' on' : ''}`}
              onClick={() => setIndustryFilter(ind.id)}
            >
              {ind.label}
            </button>
          ))}
          <select className="select" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
            <option value="all">All stages</option>
            <option value="stealth">Stealth</option>
            <option value="pre-seed">Pre-seed</option>
            <option value="seed">Seed</option>
          </select>
          <select className="select" value={pedigreeFilter} onChange={(e) => setPedigreeFilter(e.target.value)}>
            <option value="all">All pedigree</option>
            <option value="ex-FAANG">ex-FAANG</option>
            <option value="ex-unicorn">ex-Unicorn</option>
            <option value="top-academia">Academia</option>
            <option value="ex-consulting">Consulting</option>
          </select>
          <div className="search">
            <Search size={13} />
            <input
              className="field"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="split">
        <div className="col-list">
          {loadingFounders ? (
            <div className="empty">Matching founders…</div>
          ) : sortedFounders.length === 0 ? (
            <div className="empty">Nothing in this cut. Broaden filters to see more founders.</div>
          ) : (
            <>
              <div className="list-meta">
                <span><b>{sortedFounders.length}</b> founders</span>
                <span>{rankedCount} scored</span>
              </div>
              <div className="list">
                {sortedFounders.map((founder) => (
                  <FounderCard
                    key={founder.id}
                    founder={founder}
                    scoreData={scoreResults[founder.id]}
                    rank={founderRanks[founder.id]}
                    onScore={handleScoreSingle}
                    isScoring={scoringFounderId === founder.id}
                    onSelect={setSelectedFounder}
                    isSelected={selectedFounder?.id === founder.id}
                    investorProfile={investorProfile}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="col-memo">
          <FounderDetailPanel
            founder={selectedFounder}
            scoreData={selectedFounder ? scoreResults[selectedFounder.id] : null}
            rank={selectedFounder ? founderRanks[selectedFounder.id] : null}
            onScore={handleScoreSingle}
            isScoring={selectedFounder ? scoringFounderId === selectedFounder.id : false}
            investorProfile={investorProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default TalentRadar;
