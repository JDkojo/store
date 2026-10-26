import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  Category,
  CustomerScreen,
  MobileNetwork,
  Order,
  OrderStatus,
  Product,
  ReadyPack,
  AppViewMode,
} from '../types';
import { INITIAL_ORDERS } from '../data/mockData';
import { sounds } from '../utils/sound';

interface ShopContextType {
  // View mode
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;

  // Customer navigation & filters
  customerScreen: CustomerScreen;
  setCustomerScreen: (screen: CustomerScreen) => void;
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;

  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product | ReadyPack, isPack?: boolean) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalCount: number;

  // Checkout & Payment
  checkoutPhone: string;
  setCheckoutPhone: (phone: string) => void;
  checkoutNetwork: MobileNetwork;
  setCheckoutNetwork: (network: MobileNetwork) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  isSimulatingPayment: boolean;
  paymentCountdown: number;
  currentOrder: Order | null;
  submitCheckout: () => void;
  resendPaymentPrompt: () => void;
  completePaymentNow: () => void;
  startNewCustomerOrder: () => void;

  // Staff Orders
  orders: Order[];
  activeStaffTab: OrderStatus;
  setActiveStaffTab: (tab: OrderStatus) => void;
  selectedStaffOrderId: string | null;
  setSelectedStaffOrderId: (id: string | null) => void;
  selectedStaffOrder: Order | null;
  toggleItemPacked: (orderId: string, itemId: string) => void;
  markOrderAsPacked: (orderId: string) => void;
  markOrderAsCollected: (orderId: string) => void;
  verifyPickupCode: (code: string) => { success: boolean; message: string; order?: Order };

  // Helper
  lastOrderNumber: string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_ORDERS_KEY = 'kofi_ama_orders_v1';
const STORAGE_CART_KEY = 'kofi_ama_cart_v1';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<AppViewMode>('customer');
  const [customerScreen, setCustomerScreen] = useState<CustomerScreen>('home');
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Checkout inputs
  const [checkoutPhone, setCheckoutPhone] = useState('0244129881');
  const [checkoutNetwork, setCheckoutNetwork] = useState<MobileNetwork>('MTN');
  const [customerName, setCustomerName] = useState('Kofi Mensah');

  // Payment waiting state
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [paymentCountdown, setPaymentCountdown] = useState(90);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Staff selected order
  const [activeStaffTab, setActiveStaffTab] = useState<OrderStatus>('paid');
  const [selectedStaffOrderId, setSelectedStaffOrderId] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Payment Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (customerScreen === 'payment_waiting' && paymentCountdown > 0) {
      timer = setTimeout(() => {
        setPaymentCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [customerScreen, paymentCountdown]);

  // Cart Calculations
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (item: Product | ReadyPack, isPack: boolean = false) => {
    sounds.playTap();
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          size: 'size' in item ? item.size : 'Pack Bundle',
          price: item.price,
          quantity: 1,
          image: item.image,
          isPack,
        },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    sounds.playTap();
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: string) => {
    sounds.playTap();
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Next order number generation
  const getNextOrderNumber = () => {
    const numbers = orders
      .map((o) => {
        const match = o.orderNumber.match(/A(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 16;
    const next = maxNum + 1;
    return `A0${next}`;
  };

  const submitCheckout = () => {
    if (cartItems.length === 0) return;
    sounds.playTap();

    const orderNum = getNextOrderNumber();
    const orderItems = cartItems.map((ci) => ({
      id: `${ci.id}_${Date.now()}`,
      name: ci.name,
      size: ci.size,
      price: ci.price,
      quantity: ci.quantity,
      isPacked: false,
    }));

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      customerPhone: checkoutPhone.trim() || '0244129881',
      customerName: customerName.trim() || 'Customer',
      network: checkoutNetwork,
      items: orderItems,
      subtotal: cartSubtotal,
      total: cartSubtotal,
      status: 'paid', // Prompt says: After entering MoMo PIN, moves to paid receipt
      paymentStatus: 'paid',
      source: 'QR',
      momoTransactionId: `${checkoutNetwork.substring(0, 2).toUpperCase()}${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: timeStr,
    };

    setCurrentOrder(newOrder);
    setPaymentCountdown(90);
    setIsSimulatingPayment(true);
    setCustomerScreen('payment_waiting');
  };

  const resendPaymentPrompt = () => {
    sounds.playTap();
    setPaymentCountdown(90);
  };

  const completePaymentNow = () => {
    if (!currentOrder) return;
    sounds.playSuccess();
    // Add order to orders list for staff dashboard
    setOrders((prev) => [currentOrder, ...prev]);
    // Clear cart
    clearCart();
    setIsSimulatingPayment(false);
    setCustomerScreen('receipt');
  };

  const startNewCustomerOrder = () => {
    sounds.playTap();
    clearCart();
    setCurrentOrder(null);
    setCustomerScreen('home');
  };

  // Staff Actions
  const toggleItemPacked = (orderId: string, itemId: string) => {
    sounds.playTap();
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedItems = ord.items.map((it) =>
            it.id === itemId ? { ...it, isPacked: !it.isPacked } : it
          );
          return { ...ord, items: updatedItems };
        }
        return ord;
      })
    );

    // Also update currentOrder if it matches
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          items: prev.items.map((it) =>
            it.id === itemId ? { ...it, isPacked: !it.isPacked } : it
          ),
        };
      });
    }
  };

  const markOrderAsPacked = (orderId: string) => {
    sounds.playSuccess();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          // Mark all items as packed too
          return {
            ...ord,
            status: 'packed',
            packedAt: timeStr,
            items: ord.items.map((it) => ({ ...it, isPacked: true })),
          };
        }
        return ord;
      })
    );

    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder((prev) =>
        prev
          ? {
              ...prev,
              status: 'packed',
              packedAt: timeStr,
              items: prev.items.map((it) => ({ ...it, isPacked: true })),
            }
          : null
      );
    }
  };

  const markOrderAsCollected = (orderId: string) => {
    sounds.playSuccess();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'collected',
            collectedAt: timeStr,
          };
        }
        return ord;
      })
    );

    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder((prev) =>
        prev
          ? {
              ...prev,
              status: 'collected',
              collectedAt: timeStr,
            }
          : null
      );
    }
  };

  const verifyPickupCode = (rawCode: string) => {
    const trimmed = rawCode.trim().toUpperCase();
    // Look for orderNumber like A017 or format like PICKUP:A017
    const found = orders.find((o) => {
      const ordNum = o.orderNumber.toUpperCase();
      return (
        trimmed === ordNum ||
        trimmed.includes(ordNum) ||
        o.id === rawCode ||
        o.customerPhone.includes(trimmed)
      );
    });

    if (found) {
      sounds.playScan();
      markOrderAsCollected(found.id);
      return {
        success: true,
        message: `Order ${found.orderNumber} verified! Packed bag handed over.`,
        order: found,
      };
    }

    return {
      success: false,
      message: `No active order found for code "${rawCode}". Check order number.`,
    };
  };

  const selectedStaffOrder =
    orders.find((o) => o.id === selectedStaffOrderId) || null;

  return (
    <ShopContext.Provider
      value={{
        viewMode,
        setViewMode,
        customerScreen,
        setCustomerScreen,
        activeCategory,
        setActiveCategory,
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotalCount,
        checkoutPhone,
        setCheckoutPhone,
        checkoutNetwork,
        setCheckoutNetwork,
        customerName,
        setCustomerName,
        isSimulatingPayment,
        paymentCountdown,
        currentOrder,
        submitCheckout,
        resendPaymentPrompt,
        completePaymentNow,
        startNewCustomerOrder,
        orders,
        activeStaffTab,
        setActiveStaffTab,
        selectedStaffOrderId,
        setSelectedStaffOrderId,
        selectedStaffOrder,
        toggleItemPacked,
        markOrderAsPacked,
        markOrderAsCollected,
        verifyPickupCode,
        lastOrderNumber: currentOrder?.orderNumber || 'A017',
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
