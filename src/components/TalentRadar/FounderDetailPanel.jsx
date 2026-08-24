import React, { useState } from 'react';
import { sendFounderToSlack } from '../../services/slackService';

const FounderDetailPanel = ({ founder, scoreData, rank, onScore, isScoring, investorProfile }) => {
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [slackSent, setSlackSent] = useState(false);
  const [sendingSlack, setSendingSlack] = useState(false);

  if (!founder) {
    return (
      <div className="memo">
        <div className="memo-scroll">
          <div className="d-name">Select a founder</div>
          <p className="d-note">
            Open anyone on the left to see the memo against {investorProfile?.fundName || 'your thesis'}.
          </p>
        </div>
      </div>
    );
  }

  const fitScore = scoreData?.fitScore;

  const handleCopyPitch = () => {
    if (!scoreData?.outreachAngle) return;
    navigator.clipboard.writeText(scoreData.outreachAngle);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleSendSlack = async () => {
    setSendingSlack(true);
    try {
      await sendFounderToSlack({ founder, scoreData, investorProfile, rank });
      setSlackSent(true);
      setTimeout(() => setSlackSent(false), 3000);
    } catch (err) {
      console.warn('Slack error:', err);
    }
    setSendingSlack(false);
  };

  return (
    <div className="memo">
      <div className="memo-scroll">
        <div className="d-name">{founder.name}</div>
        <div className="d-meta">
          {founder.industry} · {founder.stage} · {founder.location}
          {rank && fitScore ? ` · #${rank}` : ''}
        </div>

        <div className="d-block">
          <div className="label">Background</div>
          <div className="d-quote">“{founder.headline}”</div>
          <p className="d-note">{founder.bio}</p>
        </div>

        {founder.previousEmployers?.length > 0 && (
          <div className="d-block">
            <div className="label">Pedigree</div>
            <div className="rows">
              {founder.previousEmployers.map((emp) => (
                <div className="row" key={emp}>
                  <span className="l">{emp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!scoreData ? (
          <div className="d-block">
            <div className="label">Match against {investorProfile?.fundName || 'your fund'}</div>
            <p className="d-lede">
              Score pedigree, stage, and sector against the thesis, then draft outreach.
            </p>
          </div>
        ) : (
          <>
            <div className="d-block">
              <div className="label">Match score</div>
              <div className="score-num num" style={{ marginTop: 8, color: fitScore >= 75 ? 'var(--pos)' : 'var(--ink)' }}>
                {fitScore}<span>/100</span>
              </div>
              <p className="d-lede">{scoreData.summary}</p>
              {scoreData.dimensions?.length > 0 && (
                <div className="rows">
                  {scoreData.dimensions.map((d) => (
                    <div className={`row${d.score < 55 ? ' off' : ''}`} key={d.id}>
                      <span className="l">
                        {d.label}
                        <span className="item-sector"> · {Math.round(d.weight * 100)}% · {d.why}</span>
                      </span>
                      <span className="v" style={{ color: d.score >= 80 ? 'var(--pos)' : undefined }}>
                        {d.score}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {scoreData.strongSignals?.length > 0 && (
              <div className="d-block">
                <div className="label">What holds</div>
                <div className="rows">
                  {scoreData.strongSignals.map((s) => (
                    <div className="row" key={s}>
                      <span className="l">{s}</span>
                      <span className="v" style={{ color: 'var(--pos)' }}>Holds</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scoreData.redFlags?.length > 0 && (
              <div className="d-block">
                <div className="label">First things to check</div>
                <div className="rows">
                  {scoreData.redFlags.map((f) => (
                    <div className="row off" key={f}>
                      <span className="l">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scoreData.outreachAngle && (
              <div className="d-block">
                <div className="label">Outreach</div>
                <div className="d-quote">“{scoreData.outreachAngle}”</div>
                <div style={{ marginTop: 12 }}>
                  <button className="link" onClick={handleCopyPitch}>
                    {copiedPitch ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="actions">
        {founder.linkedinUrl && (
          <a className="link" href={founder.linkedinUrl} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        <button className="link" onClick={handleSendSlack} disabled={sendingSlack}>
          {slackSent ? 'Sent' : 'Slack'}
        </button>
        <span className="spacer" />
        <button className="btn sm" onClick={() => onScore(founder)} disabled={isScoring}>
          {isScoring ? 'Scoring…' : scoreData ? 'Re-evaluate' : 'Score'}
        </button>
      </div>
    </div>
  );
};

export default FounderDetailPanel;
