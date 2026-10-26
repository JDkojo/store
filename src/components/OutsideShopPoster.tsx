import React from 'react';
import { Smartphone, ArrowRight, ShieldCheck, Zap, Sparkles, MapPin, Store } from 'lucide-react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { SHOP_INFO } from '../data/mockData';
import { useShop } from '../context/ShopContext';

export const OutsideShopPoster: React.FC = () => {
  const { setViewMode, setCustomerScreen } = useShop();

  const handleScanPoster = () => {
    setCustomerScreen('home');
    setViewMode('customer');
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 flex flex-col items-center justify-center">
      {/* Physical Laminated Shop Sign Mockup */}
      <div className="max-w-md w-full bg-amber-400 text-slate-950 rounded-3xl p-6 shadow-2xl border-4 border-slate-950 relative overflow-hidden text-center">
        {/* Metal eyelets for hanging */}
        <div className="absolute top-3 left-4 w-4 h-4 rounded-full bg-slate-950/20 border-2 border-slate-950/40" />
        <div className="absolute top-3 right-4 w-4 h-4 rounded-full bg-slate-950/20 border-2 border-slate-950/40" />

        {/* Header */}
        <div className="border-b-2 border-slate-950/20 pb-3 mb-4">
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-900 bg-amber-300 inline-block px-3 py-1 rounded-full border border-slate-950/20 mb-1">
            Don&apos;t Wait in the Heat • No Queue
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase leading-none">
            {SHOP_INFO.name}
          </h1>
          <p className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Pickup Window 1 • Accra</span>
          </p>
        </div>

        {/* 3 Step Visual Guide */}
        <div className="bg-white rounded-2xl p-4 border-2 border-slate-950 shadow-sm mb-4 text-left space-y-2.5">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <span className="text-xs font-bold text-slate-900">
              Point your phone camera at this QR code
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <span className="text-xs font-bold text-slate-900">
              Pick Milo, sugar, milk, soap & pay with MoMo
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <span className="text-xs font-bold text-slate-900">
              Collect your packed bag at Window 1 in 3 mins
            </span>
          </div>
        </div>

        {/* The Giant QR Code on the Shop Wall */}
        <div className="bg-white rounded-2xl p-4 border-2 border-slate-950 shadow-md inline-block">
          <QRCodeDisplay
            value="https://ais-dev-nbznorggkv3mhrqlznukgg-910522031404.europe-west2.run.app"
            size={180}
            label="SCAN TO ORDER"
          />
        </div>

        {/* Supported Networks Banner */}
        <div className="mt-4 pt-3 border-t-2 border-slate-950/20 flex items-center justify-center gap-2">
          <span className="text-[11px] font-black uppercase text-slate-950">
            Instant MoMo:
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-300 font-extrabold text-[10px] text-slate-950 border border-slate-950/20">
            MTN MoMo
          </span>
          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px]">
            Telecel
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-700 text-white font-extrabold text-[10px]">
            AT Money
          </span>
        </div>
      </div>

      {/* Simulator Action Trigger: "Customer scans QR code" */}
      <div className="mt-6 text-center space-y-2 max-w-md w-full">
        <button
          onClick={handleScanPoster}
          className="w-full min-h-[52px] px-6 py-3 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 transition-transform"
        >
          <Smartphone className="w-5 h-5" />
          <span>Simulate Scanning QR Code (Open Customer Phone App)</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>

        <button
          onClick={() => setViewMode('staff')}
          className="text-xs text-slate-400 hover:text-white underline py-1"
        >
          Switch to Staff Packing Tablet
        </button>
      </div>
    </div>
  );
};
