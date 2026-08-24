import React from 'react';
import TalentRadar from './components/TalentRadar/TalentRadar';
import { Wordmark } from './components/brand';
import './index.css';

function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <Wordmark />
        <span className="who">byFounders</span>
      </header>
      <TalentRadar />
    </div>
  );
}

export default App;
