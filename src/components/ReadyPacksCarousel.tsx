import React from 'react';
import { Plus, Check, Sparkles } from 'lucide-react';
import { READY_PACKS } from '../data/mockData';
import { useShop } from '../context/ShopContext';
import { ReadyPack } from '../types';

export const ReadyPacksCarousel: React.FC = () => {
  const { addToCart, cartItems } = useShop();

  const isPackInCart = (packId: string) => {
    return cartItems.some((item) => item.id === packId);
  };

  return (
    <section className="py-2">
      <div className="flex items-center justify-between px-4 mb-2.5">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
            <span>Ready Packs</span>
            <span className="text-xs font-normal text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Pre-bagged
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Packed in advance • Instant pickup at window
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Carousel */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 pt-0.5 no-scrollbar scroll-smooth snap-x snap-mandatory">
        {READY_PACKS.map((pack) => {
          const inCart = isPackInCart(pack.id);
          const cartItem = cartItems.find((i) => i.id === pack.id);

          return (
            <div
              key={pack.id}
              className="min-w-[270px] max-w-[280px] shrink-0 snap-start bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              {/* Image & Price Tag */}
              <div className="relative h-32 bg-amber-50 overflow-hidden">
                <img
                  src={pack.image}
                  alt={pack.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-xs">
                  GH₵{pack.price.toFixed(2)}
                </div>
                {pack.originalPrice > pack.price && (
                  <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                    Save GH₵{(pack.originalPrice - pack.price).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {pack.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {pack.tagline}
                  </p>

                  {/* Pack Items Mini Checklist */}
                  <ul className="mt-2 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2">
                    {pack.items.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="truncate">
                          {item.quantity > 1 ? `${item.quantity}x ` : ''}
                          {item.productName}
                        </span>
                      </li>
                    ))}
                    {pack.items.length > 3 && (
                      <li className="text-[11px] text-amber-700 font-medium pl-3">
                        + {pack.items.length - 3} more item
                      </li>
                    )}
                  </ul>
                </div>

                {/* Add Pack Button */}
                <button
                  onClick={() => addToCart(pack, true)}
                  className={`mt-3.5 w-full min-h-[48px] px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    inCart
                      ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                      : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm'
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                      <span>In Bag ({cartItem?.quantity}) • Add Another</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Add {pack.name} • GH₵{pack.price.toFixed(0)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
