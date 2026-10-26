import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

interface PickupScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetOrderNumber?: string;
}

export const PickupScannerModal: React.FC<PickupScannerModalProps> = ({
  isOpen,
  onClose,
  targetOrderNumber,
}) => {
  const { verifyPickupCode, orders } = useShop();
  const [inputCode, setInputCode] = useState(targetOrderNumber || '');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string; order?: Order } | null>(null);

  if (!isOpen) return null;

  const handleScan = (codeToScan: string) => {
    const res = verifyPickupCode(codeToScan);
    setFeedback(res);
  };

  const handleQuickSelect = (ord: Order) => {
    setInputCode(ord.orderNumber);
    handleScan(ord.orderNumber);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Pickup Window Scanner
              </h3>
              <p className="text-xs text-slate-500">Scan customer QR or enter code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewfinder Simulation */}
        <div className="my-4 relative bg-slate-950 rounded-2xl h-44 overflow-hidden flex flex-col items-center justify-center border-2 border-slate-800">
          <div className="relative w-32 h-32 border-2 border-amber-400 rounded-xl flex items-center justify-center">
            {/* Animated Laser line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-rose-500 shadow-md shadow-rose-500 animate-bounce" />
            <QrCode className="w-16 h-16 text-slate-700" />
          </div>
          <span className="text-[11px] text-amber-300 font-mono mt-2">
            Target Customer QR Code
          </span>
        </div>

        {/* Input Bar */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Customer Order Number / QR Data:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. A017"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-sm uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={() => handleScan(inputCode)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Verify
            </button>
          </div>
        </div>

        {/* Quick select from packed bags */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-medium block mb-1">
            Or quick-verify packed order at window:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {orders
              .filter((o) => o.status === 'packed' || o.status === 'paid')
              .slice(0, 4)
              .map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => handleQuickSelect(ord)}
                  className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-50 border border-amber-200 text-slate-800 rounded-lg hover:bg-amber-100"
                >
                  {ord.orderNumber} ({ord.customerName})
                </button>
              ))}
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-bold flex items-start gap-2 ${
              feedback.success
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            {feedback.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p>{feedback.message}</p>
              {feedback.success && (
                <button
                  onClick={onClose}
                  className="mt-2 text-[11px] text-emerald-800 underline font-extrabold"
                >
                  Done, close scanner
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
