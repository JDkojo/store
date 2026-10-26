import React from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartScreen: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartTotalCount,
    setCustomerScreen,
    clearCart,
  } = useShop();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50/30 flex flex-col justify-between">
        <header className="sticky top-0 z-30 bg-white border-b border-amber-100 p-4 flex items-center justify-between">
          <button
            onClick={() => setCustomerScreen('home')}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-slate-700 hover:text-slate-900"
            aria-label="Back to shop"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-slate-900">Your Shopping Bag</h1>
          <div className="w-8" />
        </header>

        <div className="p-8 text-center my-auto">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Your bag is empty</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
            Add Milo, milk, sugar or a ready pack to pick up at the window.
          </p>
          <button
            onClick={() => setCustomerScreen('home')}
            className="mt-6 min-h-[48px] px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl"
          >
            Start Ordering
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/30 pb-28">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-amber-100 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCustomerScreen('home')}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-slate-700 hover:text-slate-900"
            aria-label="Back to shop"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">Your Order Bag</h1>
            <p className="text-xs text-slate-500">{cartTotalCount} items selected</p>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
        >
          Clear
        </button>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Fast Pickup Window Notice */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
            ✓
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-950">
              Direct Pickup • Window 1
            </h3>
            <p className="text-xs text-emerald-800">
              Staff packs your order in a bag once payment is received.
            </p>
          </div>
        </div>

        {/* Item List */}
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {cartItems.map((item) => (
            <div key={item.id} className="p-3.5 flex items-center gap-3">
              {/* Product Thumbnail */}
              <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {item.name}
                  </h4>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500">{item.size}</p>

                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 tabular-nums">
                    GH₵{(item.price * item.quantity).toFixed(2)}
                    {item.quantity > 1 && (
                      <span className="text-[11px] font-normal text-slate-400 ml-1">
                        (GH₵{item.price.toFixed(2)} ea)
                      </span>
                    )}
                  </div>

                  {/* Quantity Stepper (Hitboxes >= 44px) */}
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-xl p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label="Decrease quantity"
                      className="w-8 h-8 min-w-[34px] min-h-[34px] flex items-center justify-center bg-white text-slate-800 rounded-lg hover:bg-amber-100 active:scale-95 shadow-2xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label="Increase quantity"
                      className="w-8 h-8 min-w-[34px] min-h-[34px] flex items-center justify-center bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-600 active:scale-95 shadow-2xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Free Packing Bag Note */}
        <div className="p-3 bg-white rounded-2xl border border-amber-200/80 text-xs text-slate-600 flex items-center justify-between">
          <span>Sturdy Packing Bag</span>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            FREE
          </span>
        </div>

        {/* Cost Summary */}
        <div className="bg-white rounded-2xl border border-amber-200/80 p-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium tabular-nums">
              GH₵{cartSubtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Window Pickup Fee</span>
            <span className="font-medium text-emerald-600">GH₵0.00</span>
          </div>
          <div className="border-t border-slate-100 pt-2 flex justify-between items-center">
            <span className="font-bold text-slate-900">Total to Pay</span>
            <span className="text-lg font-black text-slate-900 tabular-nums">
              GH₵{cartSubtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Checkout Action */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/95 border-t border-amber-100 backdrop-blur-md">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setCustomerScreen('checkout')}
            className="w-full min-h-[52px] px-6 py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 active:scale-[0.99] text-slate-950 rounded-2xl font-black text-base flex items-center justify-between shadow-md shadow-amber-500/20 transition-all"
          >
            <span>Proceed to Checkout</span>
            <div className="flex items-center gap-1.5 tabular-nums">
              <span>GH₵{cartSubtotal.toFixed(2)}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
