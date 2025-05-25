export type Chain = 'solana';

export type TokenData = {
  address: string;
  symbol: string;
  name: string;
  chain: Chain;
  price: number;
  priceChange24h: number;
  liquidity: number;
  createdAt: Date;
  isAnalyzed: boolean;
  isHoneypot: boolean;
  whalePercentage: number;
  status: 'pending' | 'analyzing' | 'approved' | 'rejected' | 'purchased' | 'sold';
}

export type Transaction = {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  chain: Chain;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  txHash: string;
  profit?: number;
  profitPercentage?: number;
}

export type BotStatus = {
  isRunning: boolean;
  currentChain: Chain;
  mode: 'discovery' | 'snipe' | 'sell' | 'idle';
  lastScan: Date | null;
  discoveredTokens: number;
  analyzedTokens: number;
  purchasedTokens: number;
  soldTokens: number;
  totalProfit: number;
  uptime: number;
}

export type BotConfig = {
  chains: {
    solana: {
      enabled: boolean;
      rpcUrl: string;
    };
  };
  strategy: {
    minLiquidity: number;
    maxWhalePercentage: number;
    targetProfit: number;
    stopLoss: number;
    buyAmount: number;
    slippage: number;
  };
  notifications: {
    telegram: boolean;
    discord: boolean;
    email: boolean;
  };
}

export type Notification = {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export type WalletInfo = {
  address: string;
  chain: Chain;
  balance: number;
  connectedAt: Date;
}