import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { TopNavControl } from './components/TopNavControl';
import { CustomerFlow } from './components/CustomerFlow';
import { StaffDashboard } from './components/StaffDashboard';
import { SplitScreenView } from './components/SplitScreenView';
import { OutsideShopPoster } from './components/OutsideShopPoster';

const MainAppContent: React.FC = () => {
  const { viewMode } = useShop();

  return (
    <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top persistent mode navigation */}
      <TopNavControl />

      {/* Active Screen View */}
      <div className="flex-1">
        {viewMode === 'customer' && <CustomerFlow />}
        {viewMode === 'staff' && <StaffDashboard />}
        {viewMode === 'split' && <SplitScreenView />}
        {viewMode === 'poster' && <OutsideShopPoster />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainAppContent />
    </ShopProvider>
  );
}
