import React from 'react';
import { CustomerHeader } from './CustomerHeader';
import { ReadyPacksCarousel } from './ReadyPacksCarousel';
import { CategoryChips } from './CategoryChips';
import { ProductCard } from './ProductCard';
import { PRODUCTS } from '../data/mockData';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const CustomerHome: React.FC = () => {
  const { activeCategory, cartTotalCount, cartSubtotal, setCustomerScreen } = useShop();

  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeCategory === 'All') return true;
    return product.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-amber-50/30 pb-28">
      <CustomerHeader />

      <main className="max-w-md mx-auto">
        {/* Friendly Guidance Banner */}
        <div className="mx-4 mt-3 p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl text-slate-950 shadow-sm flex items-center justify-between gap-3">
          <div>
            <div className="font-extrabold text-sm leading-tight text-slate-950 flex items-center gap-1.5">
              <span>Order outside • Pick up inside</span>
            </div>
            <p className="text-xs text-amber-950 font-medium mt-0.5">
              Pay with MoMo. No standing in line.
            </p>
          </div>
          <div className="bg-amber-400/80 px-2.5 py-1.5 rounded-xl text-center shrink-0 border border-amber-300">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-950">Wait Time</span>
            <span className="text-xs font-black text-slate-950">3 mins</span>
          </div>
        </div>

        {/* 1. Ready Packs Carousel */}
        <ReadyPacksCarousel />

        {/* 2. Category Chips */}
        <div className="mt-1">
          <div className="px-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">All Provisions</h2>
            <span className="text-xs text-slate-500">{filteredProducts.length} items</span>
          </div>
          <CategoryChips />
        </div>

        {/* 3. Product Grid */}
        <div className="px-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mx-4 mt-6 p-3 bg-white rounded-2xl border border-amber-200/80 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fast MoMo confirmation (MTN, Telecel, AT Money)</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Your bag is packed immediately at Window 1</span>
          </div>
        </div>
      </main>

      {/* Floating Cart Button (Thumb Zone) */}
      {cartTotalCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-xs">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setCustomerScreen('cart')}
              className="w-full min-h-[54px] px-5 py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-2xl font-bold flex items-center justify-between shadow-lg shadow-slate-900/15 transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="relative bg-amber-500 text-slate-950 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                    {cartTotalCount}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-xs text-slate-300 block">Bag Total</span>
                  <span className="text-sm font-extrabold text-white tabular-nums">
                    GH₵{cartSubtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                <span>View Cart</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
