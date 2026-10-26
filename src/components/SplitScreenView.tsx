import React from 'react';
import { CustomerFlow } from './CustomerFlow';
import { StaffDashboard } from './StaffDashboard';
import { Smartphone, Tablet } from 'lucide-react';

export const SplitScreenView: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      <div className="max-w-[1700px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column: Simulated Mobile Device (Screens 1 to 5) */}
          <div className="xl:col-span-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 font-bold mb-2 px-2">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Smartphone className="w-4 h-4" />
                <span>Customer Mobile View (Outside Shop)</span>
              </span>
              <span>412 x 892 px</span>
            </div>

            {/* Android Phone Frame */}
            <div className="w-full max-w-[430px] bg-slate-900 border-4 border-slate-700 rounded-[38px] shadow-2xl overflow-hidden p-2">
              {/* Notch / Speaker Bar */}
              <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-800 mr-2" />
                <div className="w-8 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Viewport Frame */}
              <div className="rounded-[28px] overflow-hidden max-h-[820px] overflow-y-auto no-scrollbar bg-white">
                <CustomerFlow />
              </div>

              {/* Bottom chin navigation bar */}
              <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto my-2" />
            </div>
          </div>

          {/* Right Column: Staff Tablet Layout (Screens 6 & 7) */}
          <div className="xl:col-span-7">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 font-bold mb-2 px-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Tablet className="w-4 h-4" />
                <span>Shop Staff Tablet (Packing Station & Pickup Window)</span>
              </span>
              <span>Live Synced</span>
            </div>

            <div className="bg-slate-900 border-4 border-slate-700 rounded-[32px] p-3 shadow-2xl overflow-hidden">
              <div className="rounded-2xl overflow-hidden max-h-[850px] overflow-y-auto no-scrollbar bg-slate-100">
                <StaffDashboard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
