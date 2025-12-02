export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: { time: string; price: number }[];
  volume: number;
  marketCap: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: { uri: string; title: string }[];
}

export enum MarketStatus {
  OPEN = 'Market Open',
  CLOSED = 'Market Closed',
}
