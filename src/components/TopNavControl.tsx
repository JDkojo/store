import React from 'react';
import { Smartphone, Tablet, Columns, QrCode } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { AppViewMode } from '../types';

export const TopNavControl: React.FC = () => {
  const { viewMode, setViewMode } = useShop();

  const modes: { id: AppViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'customer', label: 'Customer Phone', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'staff', label: 'Staff Tablet', icon: <Tablet className="w-4 h-4" /> },
    { id: 'split', label: 'Split Screen (Live Demo)', icon: <Columns className="w-4 h-4" /> },
    { id: 'poster', label: 'Outside QR Sign', icon: <QrCode className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-300 py-1.5 px-3 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        {/* Brand indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-bold text-white tracking-wide">
            Kofi & Ama Provisions
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Fast QR Pickup System
          </span>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {modes.map(({ id, label, icon }) => {
            const isActive = viewMode === id;
            return (
              <button
                key={id}
                onClick={() => setViewMode(id)}
                className={`min-h-[34px] px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{icon}</span>
                <span className="hidden md:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
