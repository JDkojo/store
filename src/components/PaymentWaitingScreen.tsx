import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SHOP_INFO } from '../data/mockData';

export const PaymentWaitingScreen: React.FC = () => {
  const {
    currentOrder,
    paymentCountdown,
    resendPaymentPrompt,
    completePaymentNow,
    checkoutNetwork,
    checkoutPhone,
    setCustomerScreen,
  } = useShop();

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const handleKeypadPress = (val: string) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + val;
      setEnteredPin(next);
      if (next.length === 4) {
        // Auto approve after 4 digits
        setTimeout(() => {
          completePaymentNow();
        }, 500);
      }
    }
  };

  const handleClearPin = () => {
    setEnteredPin('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-4">
      {/* Top Bar */}
      <header className="flex items-center justify-between py-2 max-w-md mx-auto w-full">
        <button
          onClick={() => setCustomerScreen('checkout')}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white"
          aria-label="Back to checkout"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Payment Authorization
        </span>
        <div className="w-8" />
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto w-full text-center my-auto py-2">
        {/* Animated Phone Graphic with USSD Prompt */}
        <div className="relative mx-auto w-64 bg-slate-950 border-4 border-slate-700 rounded-3xl p-3 shadow-2xl shadow-amber-500/10">
          {/* Phone Speaker & Camera Notch */}
          <div className="w-16 h-2 bg-slate-800 rounded-full mx-auto mb-3" />

          {/* USSD Modal on Phone Screen */}
          <div className="bg-slate-100 rounded-2xl p-3.5 text-slate-900 text-left shadow-md">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
              <span className="text-[11px] font-black tracking-wide text-amber-700 uppercase">
                {checkoutNetwork} MoMo USSD
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Prompt</span>
            </div>

            <p className="text-xs font-semibold leading-relaxed text-slate-800">
              Pay <strong className="text-slate-950">GH₵{currentOrder?.total.toFixed(2)}</strong> to{' '}
              <strong>{SHOP_INFO.name}</strong>?
            </p>

            <div className="mt-2 text-[11px] text-slate-600">
              Reference: <span className="font-mono font-bold">{currentOrder?.orderNumber}</span>
            </div>

            {/* PIN Input Dots */}
            <div className="mt-3 bg-white border border-slate-300 rounded-lg p-2 text-center">
              <div className="text-[10px] text-slate-500 mb-1">Enter MoMo PIN:</div>
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border border-slate-400 ${
                      enteredPin.length > idx ? 'bg-slate-900' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Phone Mini Keypad for Simulation */}
            <div className="mt-3 grid grid-cols-3 gap-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    if (k === 'C') handleClearPin();
                    else if (k === 'OK') completePaymentNow();
                    else handleKeypadPress(k);
                  }}
                  className="h-7 text-xs font-bold bg-slate-200 hover:bg-slate-300 active:bg-slate-400 rounded text-slate-800 flex items-center justify-center transition-colors"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Home Indicator */}
          <div className="w-20 h-1 bg-slate-800 rounded-full mx-auto mt-3" />
        </div>

        {/* Clear Instructions */}
        <div className="mt-5 space-y-2">
          <h2 className="text-xl font-black text-white">
            Check your phone and enter your MoMo PIN
          </h2>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            A prompt was sent to <strong className="text-amber-400 font-mono">{checkoutPhone}</strong>.
            Approve with your PIN to complete the order.
          </p>
        </div>

        {/* 90-Second Countdown */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="text-3xl font-black font-mono text-amber-400 tabular-nums">
            {formatSeconds(paymentCountdown)}
          </div>
          <span className="text-xs text-slate-400 mt-1">Waiting for authorization</span>

          {/* Progress bar */}
          <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-1000"
              style={{ width: `${(paymentCountdown / 90) * 100}%` }}
            />
          </div>
        </div>

        {/* Resend Prompt Button */}
        <div className="mt-4">
          <button
            onClick={resendPaymentPrompt}
            className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold inline-flex items-center gap-1.5 py-2 px-3"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Didn&apos;t get the prompt? Resend prompt</span>
          </button>
        </div>

        {/* Quick Testing Shortcut */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={completePaymentNow}
            className="min-h-[48px] px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-sm rounded-xl inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Simulate PIN Entered (Instant Approval)</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full text-center text-xs text-slate-500 py-2">
        Kofi & Ama Provisions • Secure Ghana MoMo Service
      </footer>
    </div>
  );
};
