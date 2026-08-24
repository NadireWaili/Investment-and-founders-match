import React, { useState } from 'react';
import { Key, X, ExternalLink } from 'lucide-react';

const ProxycurlKeyModal = ({ onSave, onClose }) => {
  const [key, setKey] = useState('');

  const handleSave = () => {
    const trimmed = key.trim();
    if (!trimmed) return;
    localStorage.setItem('proxycurlApiKey', trimmed);
    onSave(trimmed);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '28px',
        width: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '14px', right: '14px',
          background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
        }}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            background: '#0a66c210', borderRadius: '8px', padding: '8px',
            display: 'flex', alignItems: 'center',
          }}>
            <Key size={18} color="#0a66c2" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
            Connect LinkedIn via Proxycurl
          </h2>
        </div>

        <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.55 }}>
          Proxycurl is a LinkedIn-compliant API that gives you real profile data. 
          Without a key, the radar runs on realistic seed data — still great for demos.
        </p>

        <div style={{
          background: '#f8fafc', borderRadius: '8px', padding: '12px 14px',
          marginBottom: '16px', fontSize: '0.8rem', color: '#475569',
        }}>
          <strong>Free tier:</strong> 10 credits (10 profiles). Paid plans from $49/mo.<br />
          Each person search costs 1–3 credits.
        </div>

        <a
          href="https://nubela.co/proxycurl"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '0.8rem', color: '#0a66c2', textDecoration: 'none',
            marginBottom: '16px',
          }}
        >
          Get a key at nubela.co/proxycurl <ExternalLink size={12} />
        </a>

        <input
          type="password"
          placeholder="Paste your Proxycurl API key here..."
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          style={{
            width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0',
            borderRadius: '6px', fontSize: '0.875rem', outline: 'none',
            boxSizing: 'border-box', marginBottom: '16px',
            fontFamily: 'monospace',
          }}
          autoFocus
        />

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0',
            background: '#fff', cursor: 'pointer', fontSize: '0.85rem', color: '#64748b',
          }}>
            Skip — Use Demo Data
          </button>
          <button onClick={handleSave} disabled={!key.trim()} style={{
            padding: '8px 16px', borderRadius: '6px', border: 'none',
            background: key.trim() ? '#0a66c2' : '#cbd5e1',
            color: '#fff', cursor: key.trim() ? 'pointer' : 'not-allowed',
            fontSize: '0.85rem', fontWeight: 600,
          }}>
            Connect LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProxycurlKeyModal;
