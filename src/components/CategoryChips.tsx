import React from 'react';
import { Category } from '../types';
import { useShop } from '../context/ShopContext';
import { Coffee, PackageCheck, Sparkles, Droplets, Layers } from 'lucide-react';

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  { label: 'All', icon: <Layers className="w-4 h-4" /> },
  { label: 'Beverages', icon: <Coffee className="w-4 h-4" /> },
  { label: 'Provisions', icon: <PackageCheck className="w-4 h-4" /> },
  { label: 'Toiletries', icon: <Sparkles className="w-4 h-4" /> },
  { label: 'Detergents', icon: <Droplets className="w-4 h-4" /> },
];

export const CategoryChips: React.FC = () => {
  const { activeCategory, setActiveCategory } = useShop();

  return (
    <div className="px-4 py-2">
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map(({ label, icon }) => {
          const isActive = activeCategory === label;
          return (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all duration-150 active:scale-[0.97] ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-white text-slate-700 hover:bg-amber-100/60 border border-amber-200/70 shadow-2xs'
              }`}
            >
              <span className={isActive ? 'text-amber-400' : 'text-slate-500'}>
                {icon}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
