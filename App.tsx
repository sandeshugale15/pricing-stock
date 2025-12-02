import React, { useState, useEffect } from 'react';
import { StockData } from './types';
import { initializeStocks, updateStockPrices } from './services/marketSimulator';
import { TickerItem } from './components/TickerItem';
import { StockChart } from './components/StockChart';
import { AnalystChat } from './components/AnalystChat';

const App: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [selectedStockId, setSelectedStockId] = useState<string>('AAPL');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Initialize Data
  useEffect(() => {
    setStocks(initializeStocks());
  }, []);

  // Update Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate Real-time Prices
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(currentStocks => updateStockPrices(currentStocks));
    }, 1500); // Update every 1.5 seconds
    return () => clearInterval(interval);
  }, []);

  const selectedStock = stocks.find(s => s.symbol === selectedStockId) || stocks[0];

  if (!selectedStock) return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">Loading Market Data...</div>;

  const isPositive = selectedStock.change >= 0;
  const chartColor = isPositive ? '#4ade80' : '#f87171'; // Green-400 or Red-400

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      
      {/* Left Sidebar: Stock Ticker */}
      <aside className="w-80 flex flex-col border-r border-slate-800 bg-slate-900 z-10 hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
            <h1 className="text-xl font-bold tracking-tight">Nebula Finance</h1>
          </div>
          <div className="mt-4 flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>MARKET OPEN</span>
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {stocks.map(stock => (
            <TickerItem 
              key={stock.symbol}
              stock={stock}
              isSelected={stock.symbol === selectedStockId}
              onClick={() => setSelectedStockId(stock.symbol)}
            />
          ))}
        </div>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Simulated Data for Demo
        </div>
      </aside>

      {/* Center: Main Dashboard */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="font-bold">Nebula Finance</div>
          <select 
            className="bg-slate-800 border border-slate-700 rounded p-1 text-sm"
            value={selectedStockId}
            onChange={(e) => setSelectedStockId(e.target.value)}
          >
            {stocks.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol}</option>)}
          </select>
        </div>

        {/* Stock Detail Header */}
        <header className="p-8 pb-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{selectedStock.name}</h2>
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-mono font-medium tracking-tighter">${selectedStock.price.toFixed(2)}</span>
                <div className={`flex items-center px-2 py-1 rounded ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  <span className="font-bold text-sm">{isPositive ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block text-right space-y-1">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Market Cap</div>
              <div className="font-mono">{selectedStock.marketCap}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-2">Volume</div>
              <div className="font-mono">{(selectedStock.volume / 1000000).toFixed(1)}M</div>
            </div>
          </div>
        </header>

        {/* Chart Section */}
        <div className="px-8 py-4 flex-1 min-h-[300px]">
           <div className="h-full w-full bg-slate-900/50 rounded-2xl border border-slate-800 p-4 relative overflow-hidden backdrop-blur-sm">
             <div className="absolute top-4 right-4 z-10 flex space-x-2">
               {['1H', '1D', '1W', '1M', '1Y'].map(period => (
                 <button 
                   key={period}
                   className={`px-3 py-1 text-xs rounded-full transition-all ${period === '1H' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                 >
                   {period}
                 </button>
               ))}
             </div>
             <StockChart data={selectedStock.history} color={chartColor} />
           </div>
        </div>

        {/* Grid Stats */}
        <div className="px-8 pb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Open', val: (selectedStock.history[0]?.price || 0).toFixed(2) },
            { label: 'High', val: (selectedStock.price * 1.01).toFixed(2) },
            { label: 'Low', val: (selectedStock.price * 0.98).toFixed(2) },
            { label: 'Prev Close', val: (selectedStock.history[0]?.price * 0.995).toFixed(2) },
          ].map((stat, i) => (
             <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
               <div className="text-xs text-slate-500 uppercase">{stat.label}</div>
               <div className="font-mono text-lg mt-1">{stat.val}</div>
             </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar: AI Analyst */}
      <aside className="w-96 border-l border-slate-800 bg-slate-900 z-10 hidden lg:block">
        <AnalystChat selectedStock={selectedStock} />
      </aside>

      {/* Mobile Chat Overlay Button (Not implemented fully for brevity, assuming Desktop focus for complex dashboard) */}
    </div>
  );
};

export default App;
