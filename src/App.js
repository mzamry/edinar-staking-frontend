import React, { useState, useEffect } from 'react';
import WalletConnect from './components/WalletConnect';
import StakingOperations from './components/StakingOperations';
import ReferralProgram from './components/ReferralProgram';
import TokenInfo from './components/TokenInfo';
import StakeInfo from './components/StakeInfo';
import './styles.css';

function App() {
  const [stats, setStats] = useState({
    tvl: 1.2,
    apy: 12.0, // Updated to 12%
    stakers: 1429
  });

  return (
    <div className="app">
      <header>
        <div className="logo-container">
          <div className="logo">
            <div className="logo-inner">
              <div className="logo-symbol"></div>
              <div className="logo-text">eDINAR</div>
            </div>
          </div>
        </div>
        <h1 className="platform-title">E-DINAR Staking Platform</h1>
        <WalletConnect />
      </header>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Value Locked</h3>
          <p>${stats.tvl.toFixed(1)}M</p>
        </div>
        <div className="stat-card">
          <h3>Staking APY</h3>
          <p>{stats.apy}%</p>
        </div>
        <div className="stat-card">
          <h3>Active Stakers</h3>
          <p>{stats.stakers.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="dashboard">
        <div className="top-section">
          <div className="column">
            <StakingOperations />
          </div>
          <div className="column">
            <ReferralProgram />
            <TokenInfo />
          </div>
        </div>
        
        <div className="stake-info-card">
          <StakeInfo />
        </div>
      </div>
    </div>
  );
}

export default App;