import React, { useState } from 'react';
import {
  Clock,
  PackageCheck,
  Search,
  QrCode,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';
import { StaffOrderDetail } from './StaffOrderDetail';
import { PickupScannerModal } from './PickupScannerModal';
import { SHOP_INFO } from '../data/mockData';

export const StaffDashboard: React.FC = () => {
  const {
    orders,
    activeStaffTab,
    setActiveStaffTab,
    selectedStaffOrderId,
    setSelectedStaffOrderId,
    selectedStaffOrder,
    markOrderAsPacked,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Filter orders by active status tab
  const getOrdersCountByStatus = (status: OrderStatus) => {
    return orders.filter((o) => o.status === status).length;
  };

  const filteredOrders = orders.filter((o) => {
    const matchesTab = o.status === activeStaffTab;
    const matchesQuery =
      searchQuery.trim() === '' ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    return matchesTab && matchesQuery;
  });

  const tabs: { id: OrderStatus; label: string; count: number; color: string }[] = [
    { id: 'new', label: 'New', count: getOrdersCountByStatus('new'), color: 'text-blue-700 bg-blue-100' },
    { id: 'paid', label: 'Paid (To Pack)', count: getOrdersCountByStatus('paid'), color: 'text-amber-800 bg-amber-100' },
    { id: 'packed', label: 'Packed (Ready)', count: getOrdersCountByStatus('packed'), color: 'text-purple-800 bg-purple-100' },
    { id: 'collected', label: 'Collected', count: getOrdersCountByStatus('collected'), color: 'text-emerald-800 bg-emerald-100' },
  ];

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Tablet Header Bar */}
        <header className="bg-white rounded-3xl p-4 md:px-6 md:py-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-amber-400 font-black text-xl flex items-center justify-center shadow-xs">
              K&A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black text-slate-900">
                  {SHOP_INFO.name} • Staff Tablet
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {SHOP_INFO.pickupWindow}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Packing station & Pickup window terminal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick QR Scanner for Window Attendant */}
            <button
              onClick={() => setIsScannerOpen(true)}
              className="min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-transform"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Scan Pickup QR</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content: 2-Column Responsive Layout (Tablet optimized) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Tabs & Order Cards (5 to 6 columns on large screen, 12 on mobile) */}
          <div className={`${selectedStaffOrder ? 'hidden lg:block lg:col-span-5' : 'col-span-12 lg:col-span-6'} space-y-4`}>
            {/* Tabs: New / Paid / Packed / Collected */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="grid grid-cols-4 gap-1.5">
                {tabs.map((tab) => {
                  const isActive = activeStaffTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveStaffTab(tab.id);
                        // If selecting a different tab, clear selection if the order is not in this tab
                        if (selectedStaffOrder && selectedStaffOrder.status !== tab.id) {
                          setSelectedStaffOrderId(null);
                        }
                      }}
                      className={`min-h-[50px] p-2 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold whitespace-nowrap">{tab.label}</span>
                      </div>
                      <span
                        className={`text-[11px] font-mono font-extrabold px-2 py-0.2 rounded-full mt-1 ${
                          isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order #, customer name, or phone..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              />
            </div>

            {/* Order Cards List */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-700">No {activeStaffTab} orders</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Orders placed by customers will immediately appear here.
                  </p>
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const isSelected = selectedStaffOrderId === ord.id;
                  const packedCount = ord.items.filter((i) => i.isPacked).length;
                  const totalItems = ord.items.length;

                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedStaffOrderId(ord.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white hover:border-amber-400 ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                          : 'border-slate-200 shadow-2xs'
                      }`}
                    >
                      {/* Card Header: Order Number, Time, Source Tag */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black font-mono text-slate-900">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              ord.source === 'QR'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            {ord.source === 'QR' ? 'QR Code Outside' : 'WhatsApp'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ord.createdAt}</span>
                        </div>
                      </div>

                      {/* Customer and Items Info */}
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">
                          {ord.customerName}
                        </span>
                        <span className="font-semibold text-slate-500">
                          {totalItems} item{totalItems > 1 ? 's' : ''} ({packedCount} packed)
                        </span>
                      </div>

                      {/* Items Preview */}
                      <div className="mt-1.5 text-xs text-slate-600 line-clamp-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        {ord.items.map((it) => `${it.quantity}x ${it.name}`).join(' • ')}
                      </div>

                      {/* Card Footer: Amount, MoMo Status, Action */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900 tabular-nums">
                            GH₵{ord.total.toFixed(2)}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {ord.network} PAID
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                          <span>Checklist</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Order Detail & Packing Checklist (7 columns on large, or full on mobile when selected) */}
          {selectedStaffOrder ? (
            <div className="col-span-12 lg:col-span-7">
              <StaffOrderDetail
                order={selectedStaffOrder}
                onBack={() => setSelectedStaffOrderId(null)}
              />
            </div>
          ) : (
            <div className="hidden lg:flex lg:col-span-6 bg-white rounded-3xl border border-dashed border-slate-300 p-12 flex-col items-center justify-center text-center text-slate-400 min-h-[400px]">
              <PackageCheck className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700">Select an Order</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Tap any order card on the left to start packing items and check customer details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pickup Scanner Modal */}
      <PickupScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
};
