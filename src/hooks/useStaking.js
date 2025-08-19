import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import stakingAbi from '../abis/EdinarStaking.json';
import tokenAbi from '../abis/IERC20.json';

const STAKING_CONTRACT_ADDRESS = process.env.REACT_APP_STAKING_CONTRACT_ADDRESS;
const TOKEN_CONTRACT_ADDRESS = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS;
const ROLLUX_RPC_URL = process.env.REACT_APP_ROLLUX_RPC_URL;

export const useStaking = () => {
  const [stakingContract, setStakingContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);

  const [stakedBalance, setStakedBalance] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [lastClaimTime, setLastClaimTime] = useState(null);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [rewardRate, setRewardRate] = useState(0);
  const [apy, setApy] = useState(0);

  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const staking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingAbi, signer);
        const token = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);

        setStakingContract(staking);
        setTokenContract(token);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!stakingContract || !tokenContract || !account) return;

      try {
        const staked = await stakingContract.stakedBalance(account);
        const total = await stakingContract.totalStaked();
        const balance = await tokenContract.balanceOf(account);
        const lastClaim = await stakingContract.lastClaimTime(account);
        const rewards = await stakingContract.getPendingRewards(account);
        const rate = await stakingContract.rewardRate();

        setStakedBalance(Number(ethers.formatEther(staked)));
        setTotalStaked(Number(ethers.formatEther(total)));
        setTokenBalance(Number(ethers.formatEther(balance)));
        setLastClaimTime(lastClaim.toNumber() * 1000); // ms
        setPendingRewards(Number(ethers.formatEther(rewards)));
        setRewardRate(Number(ethers.formatEther(rate)));

        if (Number(total) > 0) {
          const yearlyRewards = Number(ethers.formatEther(rate)) * 60 * 60 * 24 * 365;
          const apyCalc = (yearlyRewards / Number(ethers.formatEther(total))) * 100;
          setApy(apyCalc);
        } else {
          setApy(0);
        }

      } catch (err) {
        console.error("Error loading staking data:", err);
      }
    };

    loadData();
  }, [stakingContract, tokenContract, account]);

  return {
    stakingContract,
    tokenContract,
    stakedBalance,
    totalStaked,
    tokenBalance,
    lastClaimTime,
    pendingRewards,
    rewardRate,
    apy,
    account
  };
};
