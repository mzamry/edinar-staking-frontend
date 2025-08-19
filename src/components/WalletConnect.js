import { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';

const WalletConnect = () => {
  const { connect, disconnect, account, isConnected, chainId, switchToRollux } = useWeb3();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  useEffect(() => {
    setIsWrongNetwork(chainId !== 570 && chainId !== null);
  }, [chainId]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect('injected');
    } catch (error) {
      console.error('Connection failed:', error);
    }
    setIsConnecting(false);
  };

  const handleSwitchNetwork = async () => {
    await switchToRollux();
  };

  return (
    <div className="wallet-connect">
      {isConnected ? (
        <div className="connected">
          <span>Connected: {account.slice(0,6)}...{account.slice(-4)}</span>
          {isWrongNetwork ? (
            <button onClick={handleSwitchNetwork} className="switch-network">
              Switch to Rollux
            </button>
          ) : (
            <button onClick={disconnect}>Disconnect</button>
          )}
        </div>
      ) : (
        <button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
};

export default WalletConnect;