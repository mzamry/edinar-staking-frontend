import { useStaking } from '../hooks/useStaking';
import { useEffect, useState } from 'react';

const StakeInfo = () => {
  const { 
    stakedBalance, 
    totalStaked, 
    tokenBalance, 
    lastClaimTime, 
    pendingRewards, 
    apy,
    stakingContract 
  } = useStaking();

  const [rewardRate, setRewardRate] = useState(0);

  // Load reward rate from contract
  useEffect(() => {
    const fetchRewardRate = async () => {
      if (stakingContract) {
        try {
          const rate = await stakingContract.rewardRate();
          setRewardRate(Number(rate) / 1e18); // Adjust decimals if needed
        } catch (err) {
          console.error("Error fetching reward rate:", err);
        }
      }
    };
    fetchRewardRate();
  }, [stakingContract]);

  // Format last claim time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="card stake-info-card">
      <h2>Your Stake Information</h2>
      <div className="info-card">
        <div className="info-item">
          <span>Staked Amount:</span>
          <span className="info-value">{stakedBalance.toFixed(6)} EDINAR</span>
        </div>
        <div className="info-item">
          <span>Wallet Balance:</span>
          <span className="info-value">{tokenBalance.toFixed(6)} EDINAR</span>
        </div>
        <div className="info-item">
          <span>Pending Rewards:</span>
          <span className="info-value">{pendingRewards.toFixed(6)} EDINAR</span>
        </div>
        <div className="info-item">
          <span>Reward Rate:</span>
          <span className="info-value">{rewardRate.toFixed(6)} EDINAR/sec</span>
        </div>
        <div className="info-item">
          <span>APY:</span>
          <span className="info-value">{apy.toFixed(2)}%</span>
        </div>
        <div className="info-item">
          <span>Last Claim Time:</span>
          <span className="info-value">{formatTime(lastClaimTime)}</span>
        </div>
        <div className="info-item">
          <span>Total Value Locked:</span>
          <span className="info-value">{totalStaked.toFixed(6)} EDINAR</span>
        </div>
      </div>
    </div>
  );
};

export default StakeInfo;
