import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckSquare,
  Square,
  QrCode,
  PackageCheck,
  Phone,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { PickupScannerModal } from './PickupScannerModal';

interface StaffOrderDetailProps {
  order: Order;
  onBack: () => void;
}

export const StaffOrderDetail: React.FC<StaffOrderDetailProps> = ({ order, onBack }) => {
  const { toggleItemPacked, markOrderAsPacked, markOrderAsCollected } = useShop();
  const [showFullPhone, setShowFullPhone] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const packedCount = order.items.filter((i) => i.isPacked).length;
  const totalItems = order.items.length;
  const allPacked = totalItems > 0 && packedCount === totalItems;

  const maskPhone = (phone: string) => {
    if (phone.length < 7) return phone;
    const prefix = phone.slice(0, 3);
    const suffix = phone.slice(-3);
    return `${prefix} ••• •${suffix}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-full">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
              title="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black font-mono text-slate-900">
                  {order.orderNumber}
                </h2>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    order.status === 'collected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.status === 'packed'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {order.source === 'QR' ? 'QR Code Outside' : 'WhatsApp'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Received at {order.createdAt} • Paid via {order.network} MoMo (
                <span className="font-mono">{order.momoTransactionId}</span>)
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Order Total</span>
            <span className="text-xl font-black text-slate-900 tabular-nums">
              GH₵{order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Customer Information (Partly Hidden Phone as specified) */}
        <div className="my-4 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Bag Recipient Name:</div>
              <div className="text-base font-extrabold text-slate-900">
                {order.customerName}
              </div>
            </div>
          </div>

          {/* Partly hidden phone with unmask toggle */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-amber-200">
            <Phone className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-slate-500 font-medium">Phone:</span>
            <span className="text-xs font-mono font-bold text-slate-900">
              {showFullPhone ? order.customerPhone : maskPhone(order.customerPhone)}
            </span>
            <button
              onClick={() => setShowFullPhone(!showFullPhone)}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 ml-1"
              title={showFullPhone ? 'Hide phone' : 'Reveal phone'}
            >
              {showFullPhone ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Packing Checklist Progress */}
        <div className="my-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Packing Checklist
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                (Tick each item into physical bag)
              </span>
            </div>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              {packedCount} / {totalItems} Packed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(packedCount / totalItems) * 100}%` }}
            />
          </div>

          {/* Tickable Item Rows */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {order.items.map((item) => {
              const checked = item.isPacked ?? false;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItemPacked(order.id, item.id)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    checked ? 'bg-emerald-50/40 text-slate-500' : 'hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Tick ${item.name}`}
                      className="text-slate-800 p-0.5 focus:outline-none"
                    >
                      {checked ? (
                        <CheckSquare className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                    <div>
                      <div
                        className={`text-sm font-bold ${
                          checked ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {item.quantity}x {item.name}
                      </div>
                      <div className="text-xs text-slate-400">{item.size}</div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-600 tabular-nums">
                    GH₵{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Staff Action Buttons (Mark as packed, Scan pickup QR) */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Scan Pickup QR Button */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors"
          >
            <QrCode className="w-4 h-4 text-slate-700" />
            <span>Scan Pickup QR</span>
          </button>

          {order.status === 'packed' && (
            <button
              onClick={() => markOrderAsCollected(order.id)}
              className="min-h-[48px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors"
            >
              <span>Hand Over Bag (Collected)</span>
            </button>
          )}
        </div>

        {/* Mark as packed Button */}
        {order.status !== 'collected' && (
          <button
            onClick={() => markOrderAsPacked(order.id)}
            disabled={order.status === 'packed'}
            className={`min-h-[48px] px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all shadow-sm ${
              order.status === 'packed'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 active:scale-95'
            }`}
          >
            <PackageCheck className="w-5 h-5 stroke-[2.5]" />
            <span>{order.status === 'packed' ? 'Already Packed' : 'Mark as Packed'}</span>
          </button>
        )}
      </div>

      {/* Pickup Scanner Modal */}
      <PickupScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        targetOrderNumber={order.orderNumber}
      />
    </div>
  );
};
