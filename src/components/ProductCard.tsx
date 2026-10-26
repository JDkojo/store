import React from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, updateQuantity, cartItems } = useShop();

  const cartItem = cartItems.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-2xs overflow-hidden flex flex-col justify-between transition-shadow hover:shadow-xs">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-amber-50/50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
        />

        {/* Category tag */}
        <div className="absolute top-2 left-2 bg-slate-900/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
          {product.category}
        </div>

        {/* In-cart indicator */}
        {quantity > 0 && (
          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-xs">
            {quantity}
          </div>
        )}
      </div>

      {/* Details & Action */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">{product.size}</p>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Price</span>
            <div className="text-sm font-extrabold text-slate-900 tabular-nums">
              GH₵{product.price.toFixed(2)}
            </div>
          </div>

          {/* Stepper or Big Plus Button */}
          {quantity > 0 ? (
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-xl p-0.5">
              <button
                onClick={() => updateQuantity(product.id, -1)}
                aria-label={`Decrease ${product.name}`}
                className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center bg-white text-slate-800 rounded-lg font-bold hover:bg-amber-100 active:scale-95 shadow-2xs"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-slate-900 tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, 1)}
                aria-label={`Increase ${product.name}`}
                className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center bg-amber-500 text-slate-950 rounded-lg font-bold hover:bg-amber-600 active:scale-95 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product, false)}
              aria-label={`Add ${product.name} to bag`}
              className="min-h-[44px] min-w-[44px] px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 active:scale-95 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-2xs transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
