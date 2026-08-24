import React, { useState } from 'react';
import { Tile } from '../brand';
import { sendFounderToSlack } from '../../services/slackService';

const FounderCard = ({ founder, scoreData, rank, onScore, isScoring, onSelect, isSelected, investorProfile }) => {
  const [slackSent, setSlackSent] = useState(false);
  const [sendingSlack, setSendingSlack] = useState(false);
  const fitScore = scoreData?.fitScore;
  const initials = founder.name.split(' ').map((p) => p[0]).join('').slice(0, 2);

  const handleSlackShare = async (e) => {
    e.stopPropagation();
    setSendingSlack(true);
    try {
      await sendFounderToSlack({ founder, scoreData, investorProfile, rank });
      setSlackSent(true);
      setTimeout(() => setSlackSent(false), 3000);
    } catch (err) {
      console.warn('Slack share error:', err);
    }
    setSendingSlack(false);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(founder)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(founder); }}
      className={`item${isSelected ? ' selected' : ''}`}
    >
      <div className="item-top">
        <Tile initials={initials} size={24} />
        <span className="item-name">{founder.name}</span>
        <span className="item-sector">{founder.industry} · {founder.stage}</span>
        {fitScore ? (
          <span className="item-state pos num">
            {rank ? `#${rank}` : ''} {fitScore}%
          </span>
        ) : (
          <span className="item-state">Unscored</span>
        )}
      </div>

      <div className="then">“{founder.headline}”</div>

      <div className="now">
        <span className="fact"><b>{founder.currentCompany}</b></span>
        <span className="fact">{founder.location}</span>
        {founder.employmentGapMonths != null && (
          <span className="fact">Left {founder.employmentGapMonths} mo ago</span>
        )}
        {founder.previousEmployers?.[0] && (
          <span className="fact">ex-{founder.previousEmployers[0]}</span>
        )}
      </div>

      <div className="item-links">
        {founder.linkedinUrl && (
          <a
            className="link"
            href={founder.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            LinkedIn
          </a>
        )}
        <button className="link" onClick={handleSlackShare} disabled={sendingSlack}>
          {slackSent ? 'Sent to Slack' : 'Slack'}
        </button>
        <button
          className="link"
          onClick={(e) => { e.stopPropagation(); onScore(founder); }}
          disabled={isScoring}
        >
          {isScoring ? 'Scoring…' : fitScore ? 'Re-score' : 'Score'}
        </button>
      </div>
    </div>
  );
};

export default FounderCard;
