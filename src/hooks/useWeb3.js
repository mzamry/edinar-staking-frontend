import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      const readOnlyProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ROLLUX_RPC_URL || "https://rpc.rollux.com");
      setProvider(readOnlyProvider);
      
      const network = await readOnlyProvider.getNetwork();
      setChainId(network.chainId);

      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        try {
          const accounts = await provider.send('eth_accounts', []);
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setSigner(provider.getSigner());
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking accounts:', error);
        }
      }
    };

    initWeb3();

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setSigner(null);
        setIsConnected(false);
      } else {
        setAccount(accounts[0]);
        setSigner(provider.getSigner());
        setIsConnected(true);
      }
    };

    const handleChainChanged = (chainId) => {
      setChainId(parseInt(chainId, 16));
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const connect = async (type) => {
    if (type === 'injected' && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        const network = await provider.getNetwork();
        
        setProvider(provider);
        setSigner(signer);
        setAccount(account);
        setChainId(network.chainId);
        setIsConnected(true);
      } catch (error) {
        console.error('Connection error:', error);
        throw error;
      }
    } else {
      throw new Error('Wallet not found');
    }
  };

  const disconnect = () => {
    setAccount(null);
    setSigner(null);
    setIsConnected(false);
  };

  const switchToRollux = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x23A' }], // 570 in hex
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x23A',
                  chainName: 'Rollux Mainnet',
                  nativeCurrency: {
                    name: 'SYS',
                    symbol: 'SYS',
                    decimals: 18
                  },
                  rpcUrls: ['https://rpc.rollux.com'],
                  blockExplorerUrls: ['https://explorer.rollux.com'],
                },
              ],
            });
          } catch (addError) {
            console.error('Error adding Rollux network:', addError);
          }
        }
        console.error('Error switching to Rollux:', switchError);
      }
    }
  };

  return {
    account,
    provider,
    signer,
    isConnected,
    chainId,
    connect,
    disconnect,
    switchToRollux
  };
};