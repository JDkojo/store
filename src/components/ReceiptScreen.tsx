import React from 'react';
import { Check, QrCode, ArrowRight, Clock, MapPin, Sparkles, Smartphone, Share2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { QRCodeDisplay } from './QRCodeDisplay';
import { SHOP_INFO } from '../data/mockData';

export const ReceiptScreen: React.FC = () => {
  const { currentOrder, orders, startNewCustomerOrder, setViewMode } = useShop();

  // Find latest state of current order from orders list (in case staff updated status to packed/collected)
  const order = orders.find((o) => o.id === currentOrder?.id) || currentOrder;

  if (!order) {
    return (
      <div className="min-h-screen bg-amber-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-600">No active receipt found.</p>
          <button
            onClick={startNewCustomerOrder}
            className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  const isPacked = order.status === 'packed' || order.status === 'collected';
  const isCollected = order.status === 'collected';

  return (
    <div className="min-h-screen bg-amber-50/40 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-4">
        {/* Receipt Container */}
        <div className="bg-white rounded-3xl border-2 border-amber-200/90 shadow-md p-5 text-center relative overflow-hidden">
          {/* Decorative receipt serrated top or banner */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500" />

          {/* 1. Big Green PAID Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500 text-white font-black text-sm tracking-widest uppercase shadow-md shadow-emerald-500/25 mt-1">
            <Check className="w-5 h-5 stroke-[3]" />
            <span>PAID</span>
          </div>

          {/* 2. Order Number (Prominent for Attendant) */}
          <div className="mt-4">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Pickup Order Number
            </span>
            <div className="text-4xl font-black text-slate-900 tracking-tight font-mono mt-0.5">
              {order.orderNumber}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Bag Label: <span className="font-bold text-slate-800">{order.customerName}</span>
            </p>
          </div>

          {/* Live Packing Status Tracker */}
          <div className="mt-4 p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-colors duration-200">
            {isCollected ? (
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 w-full p-1.5 rounded-xl">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Bag Collected • Thank you!</span>
              </div>
            ) : isPacked ? (
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-100/80 w-full p-1.5 rounded-xl animate-pulse">
                <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                <span>Bag Packed & Ready at Window 1!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-900 bg-amber-100/70 w-full p-1.5 rounded-xl">
                <Clock className="w-4 h-4 text-amber-700 animate-spin" />
                <span>Packing in progress at Window 1...</span>
              </div>
            )}
          </div>

          {/* 3. Large Pickup QR Code */}
          <div className="my-5 flex flex-col items-center">
            <QRCodeDisplay
              value={`PICKUP:${order.orderNumber}:${order.customerPhone}`}
              size={180}
              label={order.orderNumber}
            />
            {/* 4. Text: "Show this at the pickup window" */}
            <p className="mt-3 text-sm font-extrabold text-slate-900">
              Show this at the pickup window
            </p>
            <p className="text-xs text-slate-500">
              Attendant will scan or check #{order.orderNumber} to hand you your packed bag.
            </p>
          </div>

          {/* 5. Payment & Order Details Breakdown */}
          <div className="border-t border-dashed border-slate-200 pt-4 text-left text-xs space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Date & Time</span>
              <span className="font-semibold text-slate-800">{order.createdAt} • Today</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Network</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {order.network} Mobile Money
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">MoMo Transaction ID</span>
              <span className="font-mono font-bold text-slate-800">
                {order.momoTransactionId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Customer Phone</span>
              <span className="font-mono font-medium text-slate-800">
                {order.customerPhone}
              </span>
            </div>

            {/* Items Summary */}
            <div className="pt-2 border-t border-slate-100">
              <div className="font-bold text-slate-800 mb-1">Packed Items:</div>
              <ul className="space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-slate-700">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.name} ({item.size})
                    </span>
                    <span className="font-medium tabular-nums shrink-0">
                      GH₵{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
              <span>Total Paid</span>
              <span className="text-lg text-emerald-700 font-mono tabular-nums">
                GH₵{order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Quick Staff Simulator Button */}
          <button
            onClick={() => setViewMode('staff')}
            className="w-full min-h-[48px] px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <span>View this in Staff Tablet Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={startNewCustomerOrder}
            className="w-full min-h-[48px] px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <span>Start Another Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
