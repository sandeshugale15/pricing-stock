import React from 'react';
import { StockData } from '../types';

interface TickerItemProps {
  stock: StockData;
  isSelected: boolean;
  onClick: () => void;
}

export const TickerItem: React.FC<TickerItemProps> = ({ stock, isSelected, onClick }) => {
  const isPositive = stock.change >= 0;
  
  return (
    <div 
      onClick={onClick}
      className={`
        p-4 border-b border-slate-800 cursor-pointer transition-colors duration-200
        ${isSelected ? 'bg-slate-800/80 border-l-4 border-l-blue-500' : 'hover:bg-slate-800/40 border-l-4 border-l-transparent'}
      `}
    >
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="font-bold text-white text-lg">{stock.symbol}</h3>
          <p className="text-xs text-slate-400">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-white font-medium">${stock.price.toFixed(2)}</p>
          <div className={`flex items-center justify-end text-xs font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
            <span className="ml-1">({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
