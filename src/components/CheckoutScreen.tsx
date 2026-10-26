import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Phone, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { MobileNetwork } from '../types';

export const CheckoutScreen: React.FC = () => {
  const {
    cartSubtotal,
    cartTotalCount,
    checkoutPhone,
    setCheckoutPhone,
    checkoutNetwork,
    setCheckoutNetwork,
    customerName,
    setCustomerName,
    submitCheckout,
    setCustomerScreen,
    cartItems,
  } = useShop();

  const [phoneError, setPhoneError] = useState('');

  const networks: { id: MobileNetwork; name: string; brandText: string; bgClass: string; textClass: string; borderClass: string; badge: string }[] = [
    {
      id: 'MTN',
      name: 'MTN MoMo',
      brandText: 'MTN Mobile Money',
      bgClass: 'bg-[#FFCC00]',
      textClass: 'text-slate-950 font-black',
      borderClass: 'border-[#E6B800]',
      badge: '*170#',
    },
    {
      id: 'Telecel',
      name: 'Telecel Cash',
      brandText: 'Telecel (Vodafone)',
      bgClass: 'bg-[#E60000]',
      textClass: 'text-white font-black',
      borderClass: 'border-[#B30000]',
      badge: '*110#',
    },
    {
      id: 'AirtelTigo',
      name: 'AT Money',
      brandText: 'AirtelTigo Money',
      bgClass: 'bg-[#004F9F]',
      textClass: 'text-white font-black',
      borderClass: 'border-[#003B77]',
      badge: '*110#',
    },
  ];

  const handlePay = () => {
    // Validate phone number length (Ghanaian standard 10 digits e.g. 0244123456 or with country code)
    const cleaned = checkoutPhone.replace(/\D/g, '');
    if (cleaned.length < 9) {
      setPhoneError('Please enter a valid 10-digit mobile money number');
      return;
    }
    setPhoneError('');
    submitCheckout();
  };

  return (
    <div className="min-h-screen bg-amber-50/30 pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-amber-100 px-4 py-3 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => setCustomerScreen('cart')}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-slate-700 hover:text-slate-900"
          aria-label="Back to cart"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-slate-900">Mobile Money Checkout</h1>
        <div className="w-8" />
      </header>

      <main className="max-w-md mx-auto p-4 space-y-5">
        {/* Step 1: Mobile Network Selection */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-900 block">
              1. Select Your Network
            </label>
            <span className="text-xs text-slate-500">Tap to choose</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {networks.map((net) => {
              const isSelected = checkoutNetwork === net.id;
              return (
                <button
                  key={net.id}
                  type="button"
                  onClick={() => setCheckoutNetwork(net.id)}
                  className={`w-full min-h-[58px] p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-[0.99] shadow-2xs ${net.bgClass} ${net.textClass} ${net.borderClass} ${
                    isSelected ? 'ring-4 ring-slate-900/25 scale-[1.01]' : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center shrink-0">
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-current stroke-[3]" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border-2 border-current" />
                      )}
                    </div>
                    <div>
                      <div className="text-base font-extrabold leading-tight">
                        {net.name}
                      </div>
                      <div className="text-xs opacity-85">{net.brandText}</div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold bg-black/10 px-2 py-1 rounded-md">
                    {net.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Customer Phone Number */}
        <section className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-2xs space-y-3">
          <label className="text-sm font-bold text-slate-900 block">
            2. MoMo Phone Number
          </label>
          <p className="text-xs text-slate-500 -mt-1">
            Prompt will be sent to this number to enter your PIN
          </p>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4 text-amber-600" />
            </div>
            <input
              type="tel"
              value={checkoutPhone}
              onChange={(e) => {
                setCheckoutPhone(e.target.value);
                setPhoneError('');
              }}
              placeholder="e.g. 024 412 3456"
              className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-slate-300 rounded-xl text-base font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          {phoneError && (
            <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{phoneError}</span>
            </p>
          )}

          {/* Quick Ghanaian Prefix helpers */}
          <div className="flex gap-1.5 pt-1">
            {['024', '054', '050', '026'].map((prefix) => (
              <button
                key={prefix}
                type="button"
                onClick={() => {
                  if (!checkoutPhone.startsWith(prefix)) {
                    setCheckoutPhone(prefix + checkoutPhone.replace(/^0\d{2}/, ''));
                  }
                }}
                className="text-[11px] font-mono font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
              >
                {prefix}
              </button>
            ))}
          </div>
        </section>

        {/* Step 3: Customer Name for Window Callout */}
        <section className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-2xs space-y-2">
          <label className="text-sm font-bold text-slate-900 block">
            3. Name for Pickup Bag
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4 text-amber-600" />
            </div>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Your name or nickname"
              className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Attendant will write this on your bag at Window 1.
          </p>
        </section>

        {/* Order Summary Card */}
        <section className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
            <span>Order Summary</span>
            <span>{cartTotalCount} items</span>
          </div>

          <div className="max-h-32 overflow-y-auto divide-y divide-slate-50 text-xs text-slate-700">
            {cartItems.map((item) => (
              <div key={item.id} className="py-1.5 flex justify-between">
                <span className="truncate pr-2">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-bold tabular-nums shrink-0">
                  GH₵{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Amount Due</span>
            <span className="text-base font-black tabular-nums text-emerald-700">
              GH₵{cartSubtotal.toFixed(2)}
            </span>
          </div>
        </section>

        {/* Security badge */}
        <div className="p-3 bg-amber-100/60 rounded-xl text-xs text-slate-700 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Official Ghana Interbank Payment & MoMo Gateway</span>
        </div>
      </main>

      {/* Primary Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/95 border-t border-amber-100 backdrop-blur-md">
        <div className="max-w-md mx-auto">
          <button
            onClick={handlePay}
            className="w-full min-h-[54px] px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.99] text-white rounded-2xl font-black text-base flex items-center justify-between shadow-lg shadow-emerald-600/20 transition-all"
          >
            <span>Confirm & Pay with {checkoutNetwork}</span>
            <span className="tabular-nums text-lg font-black">
              GH₵{cartSubtotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
