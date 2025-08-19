import { useStaking } from '../hooks/useStaking';

const TokenInfo = () => {
  const { totalStaked, apy } = useStaking();

  return (
    <div className="card">
      <h2>Token Information</h2>
      <div className="info-card">
        <div className="info-item">
          <span>Token Name:</span>
          <span className="info-value">e-Dinar</span>
        </div>
        <div className="info-item">
          <span>Token Symbol:</span>
          <span className="info-value">EDINAR</span>
        </div>
        <div className="info-item">
          <span>Total Staked:</span>
          <span className="info-value">{totalStaked.toFixed(6)} EDINAR</span>
        </div>
        <div className="info-item">
          <span>Current APY:</span>
          <span className="info-value">{apy.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;