import { useState } from 'react';
import { useStaking } from '../hooks/useStaking';

const StakingOperations = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [referrer, setReferrer] = useState('');
  const { stake, withdraw, claimRewards, isLoading, stakedBalance, pendingRewards } = useStaking();

  const handleStake = () => {
    if (!stakeAmount) return;
    stake(stakeAmount, referrer);
    setStakeAmount('');
  };

  const handleUnstake = () => {
    if (!unstakeAmount) return;
    withdraw(unstakeAmount);
    setUnstakeAmount('');
  };

  return (
    <div className="card">
      <h2>Staking Operations</h2>
      
      <div className="operation">
        <h3>Stake Tokens</h3>
        <input
          type="number"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          placeholder="Amount to stake"
          step="any"
        />
        <input
          type="text"
          value={referrer}
          onChange={(e) => setReferrer(e.target.value)}
          placeholder="Referrer (optional)"
        />
        <button onClick={handleStake} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Stake EDINAR'}
        </button>
      </div>
      
      <div className="operation">
        <h3>Unstake Tokens</h3>
        <input
          type="number"
          value={unstakeAmount}
          onChange={(e) => setUnstakeAmount(e.target.value)}
          placeholder="Amount to unstake"
          step="any"
        />
        <button onClick={handleUnstake} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Unstake'}
        </button>
      </div>
      
      <div className="operation">
        <h3>Claim Rewards</h3>
        <p>Pending Rewards: {pendingRewards.toFixed(6)} EDINAR</p>
        <button onClick={claimRewards} disabled={isLoading || pendingRewards === 0}>
          {isLoading ? 'Processing...' : 'Claim Rewards'}
        </button>
      </div>
    </div>
  );
};

export default StakingOperations;