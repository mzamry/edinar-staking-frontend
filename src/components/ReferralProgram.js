import { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useStaking } from '../hooks/useStaking';

const ReferralProgram = () => {
  const { account } = useWeb3();
  const { referralCount, referralRewards } = useStaking();
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (account) {
      setReferralLink(`${window.location.origin}?ref=${account}`);
    }
  }, [account]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  return (
    <div className="card">
      <h2>Referral Program</h2>
      <div className="referral-info">
        <p>Earn 1% of your referrals' rewards!</p>
        <div className="referral-link">
          <input type="text" value={referralLink} readOnly />
          <button onClick={copyToClipboard}>Copy</button>
        </div>
        <div className="referral-stats">
          <div className="info-item">
            <span>Total Referrals:</span>
            <span className="info-value">{referralCount}</span>
          </div>
          <div className="info-item">
            <span>Referral Rewards:</span>
            <span className="info-value">{referralRewards.toFixed(6)} EDINAR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;