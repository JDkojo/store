import React from 'react';
import { useShop } from '../context/ShopContext';
import { CustomerHome } from './CustomerHome';
import { CartScreen } from './CartScreen';
import { CheckoutScreen } from './CheckoutScreen';
import { PaymentWaitingScreen } from './PaymentWaitingScreen';
import { ReceiptScreen } from './ReceiptScreen';

export const CustomerFlow: React.FC = () => {
  const { customerScreen } = useShop();

  switch (customerScreen) {
    case 'home':
      return <CustomerHome />;
    case 'cart':
      return <CartScreen />;
    case 'checkout':
      return <CheckoutScreen />;
    case 'payment_waiting':
      return <PaymentWaitingScreen />;
    case 'receipt':
      return <ReceiptScreen />;
    default:
      return <CustomerHome />;
  }
};
