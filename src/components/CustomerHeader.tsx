import React from 'react';
import { ShoppingBag, Sparkles, MapPin, QrCode } from 'lucide-react';
import { SHOP_INFO } from '../data/mockData';
import { useShop } from '../context/ShopContext';

export const CustomerHeader: React.FC = () => {
  const { setViewMode, cartTotalCount } = useShop();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Shop Brand & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm border border-amber-400 shrink-0">
            K&A
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {SHOP_INFO.name}
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wide uppercase">
                OPEN
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Pickup Window 1 • Skip Queue</span>
            </p>
          </div>
        </div>

        {/* Poster / Outside QR button */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('poster')}
            title="View Outside Shop QR Poster"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-amber-100/70 hover:bg-amber-100 active:bg-amber-200 rounded-lg min-h-[44px] transition-colors"
          >
            <QrCode className="w-4 h-4 text-slate-800" />
            <span className="hidden sm:inline">QR Sign</span>
          </button>
        </div>
      </div>
    </header>
  );
};
