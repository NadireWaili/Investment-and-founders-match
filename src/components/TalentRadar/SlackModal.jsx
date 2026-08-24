import React, { useState } from 'react';
import { X } from 'lucide-react';
import { getSlackConfig, saveSlackConfig, sendFounderToSlack } from '../../services/slackService';

const SlackModal = ({ onClose, sampleFounder, sampleScore, investorProfile }) => {
  const [config, setConfig] = useState(() => getSlackConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSave = () => {
    saveSlackConfig(config);
    if (onClose) onClose();
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const mockFounder = sampleFounder || {
        name: 'Alex Müller',
        headline: 'Building in stealth | ex-N26 Head of Engineering',
        location: 'Berlin, Germany',
        region: 'DACH',
        industry: 'Fintech',
        currentCompany: 'Stealth Payments OS',
        stage: 'stealth',
        previousEmployers: ['N26', 'Zalando'],
        linkedinUrl: 'https://linkedin.com/in/alex-muller-fintech',
        bio: 'Led engineering at N26 for 4 years.',
      };
      const mockScore = sampleScore || {
        fitScore: 94,
        summary: 'Technical founder with fintech domain expertise.',
        strongSignals: ['Ex-N26', 'Stealth timing'],
        outreachAngle: 'Congratulate them on the stealth venture.',
      };
      saveSlackConfig(config);
      const res = await sendFounderToSlack({
        founder: mockFounder,
        scoreData: mockScore,
        investorProfile,
        rank: 1,
      });
      setTestResult({
        success: true,
        message: res.mode === 'live'
          ? `Sent to ${res.channel}`
          : `Simulated payload for ${res.channel}`,
      });
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    }
    setTesting(false);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={16} /></button>
        <div className="modal-t">Slack</div>
        <p className="modal-d">Send high-fit founder memos to the deal-flow channel.</p>

        <div className="modal-body">
          <div className="stack">
            <span className="label">Incoming webhook</span>
            <input
              className="field"
              type="password"
              placeholder="https://hooks.slack.com/services/…"
              value={config.webhookUrl}
              onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
            />
            <a className="link" href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noreferrer">
              Create a webhook
            </a>
          </div>
          <div className="stack">
            <span className="label">Channel</span>
            <input
              className="field"
              value={config.channelName}
              onChange={(e) => setConfig({ ...config, channelName: e.target.value })}
            />
          </div>
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13.5, color: 'var(--ink-3)' }}>
            <input
              type="checkbox"
              checked={config.autoNotifyHighMatch}
              onChange={(e) => setConfig({ ...config, autoNotifyHighMatch: e.target.checked })}
            />
            Auto-alert on scores 85%+
          </label>
          {testResult && (
            <div className={`notice${testResult.success ? '' : ' err'}`}>{testResult.message}</div>
          )}
        </div>

        <div className="modal-foot">
          <button className="link" onClick={handleTest} disabled={testing}>
            {testing ? 'Sending…' : 'Test'}
          </button>
          <button className="btn sm" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default SlackModal;
