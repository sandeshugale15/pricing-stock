import { StockData } from '../types';

const INITIAL_STOCKS: Omit<StockData, 'history'>[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 0, changePercent: 0, volume: 54300000, marketCap: '2.7T' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: 0, changePercent: 0, volume: 28100000, marketCap: '1.7T' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 332.06, change: 0, changePercent: 0, volume: 22400000, marketCap: '2.5T' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.54, change: 0, changePercent: 0, volume: 105000000, marketCap: '780B' },
  { symbol: 'AMZN', name: 'Amazon.com', price: 145.12, change: 0, changePercent: 0, volume: 38900000, marketCap: '1.5T' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 460.18, change: 0, changePercent: 0, volume: 42100000, marketCap: '1.1T' },
];

// Helper to generate a random walk price update
const getNextPrice = (currentPrice: number): number => {
  const volatility = 0.002; // 0.2% max change per tick
  const change = currentPrice * (Math.random() * volatility * 2 - volatility);
  return Number((currentPrice + change).toFixed(2));
};

export const initializeStocks = (): StockData[] => {
  return INITIAL_STOCKS.map(stock => ({
    ...stock,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Number((stock.price * (1 + (Math.random() * 0.02 - 0.01))).toFixed(2)) // slight randomized history
    }))
  }));
};

export const updateStockPrices = (stocks: StockData[]): StockData[] => {
  return stocks.map(stock => {
    const newPrice = getNextPrice(stock.price);
    const priceChange = Number((newPrice - stock.history[stock.history.length - 1].price).toFixed(2)); // Compare to "open" of the day or just prev tick for simulation
    // Ideally compare to today's open, but for simulation we just track relative to start
    const openPrice = stock.history[0].price;
    const diff = newPrice - openPrice;
    const percent = (diff / openPrice) * 100;

    const newHistory = [...stock.history.slice(1), {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      price: newPrice
    }];

    return {
      ...stock,
      price: newPrice,
      change: Number(diff.toFixed(2)),
      changePercent: Number(percent.toFixed(2)),
      history: newHistory,
    };
  });
};
