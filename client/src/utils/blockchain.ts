// src/utils/blockchain.ts
type Wallet = {
    address: string;
    tokens: number;
  };
  
  let voterWallets: Record<string, Wallet> = {};
  
  export const registerVoter = (address: string): Wallet => {
    if (!voterWallets[address]) {
      voterWallets[address] = { address, tokens: 0 };
    }
    return voterWallets[address];
  };
  
  export const castVote = (address: string): Wallet => {
    const wallet = registerVoter(address);
    wallet.tokens += 10; // Reward for voting
    return wallet;
  };
  
  export const redeemTokens = (address: string, tokens: number): Wallet => {
    const wallet = voterWallets[address];
    if (wallet.tokens >= tokens) {
      wallet.tokens -= tokens;
    } else {
      throw new Error("Insufficient tokens");
    }
    return wallet;
  };

  export const getBlockchainData = (): Wallet[] => {
    return Object.values(voterWallets);
  };
  