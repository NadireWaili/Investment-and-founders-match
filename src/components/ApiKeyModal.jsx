import React, { useState } from 'react';
import { X } from 'lucide-react';

const ApiKeyModal = ({ onSave, onClose }) => {
  const [key, setKey] = useState('');

  const handleSave = () => {
    const trimmed = key.trim();
    if (!trimmed) return;
    localStorage.setItem('geminiApiKey', trimmed);
    onSave(trimmed);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={16} /></button>
        <div className="modal-t">Gemini API key</div>
        <p className="modal-d">
          Scoring runs in the browser against Google’s API. Get a free key at{' '}
          <a className="link" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
            aistudio.google.com
          </a>.
        </p>
        <div className="modal-body">
          <input
            className="field"
            type="password"
            placeholder="Paste key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>
        <div className="modal-foot">
          <button className="link" onClick={onClose}>Cancel</button>
          <button className="btn sm" onClick={handleSave} disabled={!key.trim()}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
