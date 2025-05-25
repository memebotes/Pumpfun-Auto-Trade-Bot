import React, { createContext, useContext, useState, useEffect } from 'react';
import { BotStatus, BotConfig, Chain, TokenData, Transaction, Notification, WalletInfo } from '../types';
import { mockTokens, mockTransactions, mockNotifications } from '../data/mockData';

interface BotContextType {
  botStatus: BotStatus;
  botConfig: BotConfig;
  tokens: TokenData[];
  transactions: Transaction[];
  notifications: Notification[];
  wallets: WalletInfo[];
  startBot: () => void;
  stopBot: () => void;
  updateConfig: (config: Partial<BotConfig>) => void;
  clearNotifications: () => void;
  markNotificationAsRead: (id: string) => void;
  connectWallet: (chain: Chain) => Promise<boolean>;
  disconnectWallet: (chain: Chain) => void;
}

const defaultBotStatus: BotStatus = {
  isRunning: false,
  currentChain: 'solana',
  mode: 'idle',
  lastScan: null,
  discoveredTokens: 0,
  analyzedTokens: 0,
  purchasedTokens: 0,
  soldTokens: 0,
  totalProfit: 0,
  uptime: 0,
};

const defaultBotConfig: BotConfig = {
  chains: {
    solana: {
      enabled: true,
      rpcUrl: 'https://api.mainnet-beta.solana.com',
    },
  },
  strategy: {
    minLiquidity: 10000,
    maxWhalePercentage: 60,
    targetProfit: 30,
    stopLoss: 15,
    buyAmount: 0.5,
    slippage: 5,
  },
  notifications: {
    telegram: true,
    discord: false,
    email: false,
  },
};

export const BotContext = createContext<BotContextType | undefined>(undefined);

export const BotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [botStatus, setBotStatus] = useState<BotStatus>(defaultBotStatus);
  const [botConfig, setBotConfig] = useState<BotConfig>(defaultBotConfig);
  const [tokens, setTokens] = useState<TokenData[]>(mockTokens);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [uptimeInterval, setUptimeInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (uptimeInterval) {
        clearInterval(uptimeInterval);
      }
    };
  }, [uptimeInterval]);

  const startBot = () => {
    setBotStatus(prev => ({ 
      ...prev, 
      isRunning: true,
      mode: 'discovery',
      lastScan: new Date()
    }));
    
    const interval = setInterval(() => {
      setBotStatus(prev => ({ ...prev, uptime: prev.uptime + 1 }));
      
      // Simulate token discovery
      if (Math.random() > 0.8) {
        const newToken: TokenData = {
          address: `SOL${Math.random().toString(36).substring(7)}`,
          symbol: `TOKEN${Math.floor(Math.random() * 1000)}`,
          name: 'New Token',
          chain: 'solana',
          price: Math.random() * 0.001,
          priceChange24h: (Math.random() * 200) - 100,
          liquidity: Math.random() * 50000 + 10000,
          createdAt: new Date(),
          isAnalyzed: false,
          isHoneypot: false,
          whalePercentage: Math.random() * 100,
          status: 'analyzing'
        };
        
        setTokens(prev => [newToken, ...prev]);
        
        // Add notification
        const notification: Notification = {
          id: Math.random().toString(),
          type: 'info',
          title: 'New Token Found',
          message: `Discovered ${newToken.symbol} with $${newToken.liquidity.toFixed(2)} liquidity`,
          timestamp: new Date(),
          read: false
        };
        
        setNotifications(prev => [notification, ...prev]);
      }
    }, 1000);
    
    setUptimeInterval(interval);
  };

  const stopBot = () => {
    setBotStatus(prev => ({ ...prev, isRunning: false, mode: 'idle' }));
    if (uptimeInterval) {
      clearInterval(uptimeInterval);
      setUptimeInterval(null);
    }
  };

  const updateConfig = (config: Partial<BotConfig>) => {
    setBotConfig(prev => ({ ...prev, ...config }));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const connectWallet = async (chain: Chain): Promise<boolean> => {
    const newWallet: WalletInfo = {
      address: '6x3F...4k2',
      chain,
      balance: 5.2,
      connectedAt: new Date(),
    };
    
    setWallets(prev => [...prev.filter(w => w.chain !== chain), newWallet]);
    return true;
  };

  const disconnectWallet = (chain: Chain) => {
    setWallets(prev => prev.filter(wallet => wallet.chain !== chain));
  };

  return (
    <BotContext.Provider
      value={{
        botStatus,
        botConfig,
        tokens,
        transactions,
        notifications,
        wallets,
        startBot,
        stopBot,
        updateConfig,
        clearNotifications,
        markNotificationAsRead,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </BotContext.Provider>
  );
};

export const useBot = () => {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('useBot must be used within a BotProvider');
  }
  return context;
};