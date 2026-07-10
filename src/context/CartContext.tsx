import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../types';
import { mockProducts } from '../data/mock';

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Completed' | 'Cancelled';
}

export interface AppNotification {
  id: string;
  orderId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'system';
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isCheckingOut: boolean;
  setIsCheckingOut: (isCheckingOut: boolean) => void;

  // Persistent Orders management
  orders: Order[];
  placeOrder: (customerName: string, phone: string, address: string) => string;
  placeDirectOrder: (customerName: string, phone: string, address: string, product: Product, quantity: number) => string;
  updateOrderStatus: (id: string, status: 'Pending' | 'Confirmed' | 'Shipped' | 'Completed' | 'Cancelled') => void;
  deleteOrder: (id: string) => void;

  // Stateful Products management
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Notifications Interface
  notifications: AppNotification[];
  addNotification: (title: string, message: string, orderId?: string, type?: 'order' | 'system') => void;
  dismissNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  triggerSound: () => void;
  desktopPermission: string;
  requestDesktopPermission: () => Promise<string>;
  addSimulatedOrder: (order: Order) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const isClient = typeof window !== 'undefined';

// Web Audio API synthesized sound generator for robust, offline-friendly notification alerts
const playNotificationSound = () => {
  if (!isClient) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Tone 1: Energetic Ding (C5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.35);
    
    // Tone 2: Uplifting Higher Chime (G5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (error) {
    console.warn("Chime Audio Synthesizer blocked or failed:", error);
  }
};

// Sweet, happy upward double-chime for adding items to cart
const playAddToCartSound = () => {
  if (!isClient) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Create a sweet low-pass filter to make the tone warm and buttery
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, ctx.currentTime);
    filter.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    // Function to play a soft, warm bell chime note
    const playNote = (freq: number, startTime: number, duration: number) => {
      // Main sweet tone (sine)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, startTime);
      
      // Beautiful warm harmonic (triangle)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.5, startTime); // Perfect fifth overtone
      
      // Gentle, soft gain envelope to ensure a warm attack with no clicks
      gain1.gain.setValueAtTime(0.001, startTime);
      gain1.gain.linearRampToValueAtTime(0.05, startTime + 0.015); // soft start
      gain1.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      gain2.gain.setValueAtTime(0.001, startTime);
      gain2.gain.linearRampToValueAtTime(0.01, startTime + 0.015); // quiet warm overlay
      gain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc1.connect(gain1);
      gain1.connect(filter);
      
      osc2.connect(gain2);
      gain2.connect(filter);
      
      osc1.start(startTime);
      osc2.start(startTime);
      
      osc1.stop(startTime + duration + 0.05);
      osc2.stop(startTime + duration + 0.05);
    };
    
    // Play a delightful, warm upward chime interval (G5 then C6)
    playNote(783.99, now, 0.28); // G5 (Soft warm tap)
    playNote(1046.50, now + 0.07, 0.38); // C6 (Sweet crisp high note)
  } catch (error) {
    console.warn("Cart audio blocked or failed:", error);
  }
};

const getStoredProducts = (): Product[] => {
  if (!isClient) return mockProducts;
  const stored = localStorage.getItem('mega_products');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  // Safe default initialization of products in localStorage
  localStorage.setItem('mega_products', JSON.stringify(mockProducts));
  return mockProducts;
};

const initialMockOrders: Order[] = [
  {
    id: 'ord-101',
    customerName: 'আরিফুল ইসলাম',
    phone: '01712345678',
    address: 'বাসা: ৪২, রোড: ১০, সেক্টর: ৪, উত্তরা, ঢাকা',
    items: [
      { id: 'p1', name: 'প্রিমিয়াম গরুর মাংস (হাড় ছাড়া)', quantity: 2, price: 799 },
      { id: 'p5', name: 'ফার্মের লাল ডিম', quantity: 12, price: 140 }
    ],
    total: 1738,
    date: '2026-06-09T14:30:00.000Z',
    status: 'Pending'
  },
  {
    id: 'ord-102',
    customerName: 'নাসরিন সুলতানা',
    phone: '01811223344',
    address: 'বাড়ি: ১৮/এ, ধানমন্ডি ২৭, ঢাকা',
    items: [
      { id: 'p3', name: 'দেশি মুরগি (আস্ত)', quantity: 1, price: 600 },
      { id: 'p6', name: 'খাঁটি গরুর দুধ', quantity: 3, price: 120 }
    ],
    total: 960,
    date: '2026-06-08T11:15:00.000Z',
    status: 'Completed'
  },
  {
    id: 'ord-103',
    customerName: 'মো: সাব্বির রহমান',
    phone: '01912344321',
    address: 'ফ্ল্যাট: ৫বি, সানশাইন অ্যাপার্টমেন্ট, জিইসি মোড়, চট্টগ্রাম',
    items: [
      { id: 'p2', name: 'খাসির মাংস (মিক্সড)', quantity: 1, price: 1100 }
    ],
    total: 1100,
    date: '2026-06-07T09:45:00.000Z',
    status: 'Cancelled'
  }
];

const getStoredOrders = (): Order[] => {
  if (!isClient) return initialMockOrders;
  const stored = localStorage.getItem('mega_orders');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  // Initialize in localStorage if empty
  localStorage.setItem('mega_orders', JSON.stringify(initialMockOrders));
  return initialMockOrders;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [orders, setOrders] = useState<Order[]>(getStoredOrders);
  
  // Custom Cart Toast state for beautiful feedback when adding items
  const [cartToast, setCartToast] = useState<{
    id: string;
    productName: string;
    productImage: string;
    productPrice: number;
    quantity: number;
  } | null>(null);

  // Auto-dismiss the toast after 3 seconds
  useEffect(() => {
    if (!cartToast) return;
    const timer = setTimeout(() => {
      setCartToast(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [cartToast]);

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (!isClient) return [];
    try {
      const stored = localStorage.getItem('mega_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sound and Desktop Push Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (!isClient) return true;
    return localStorage.getItem('mega_sound_enabled') !== 'false';
  });

  const [desktopPermission, setDesktopPermission] = useState<string>(() => {
    if (isClient && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  // Persist notifications
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('mega_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Sync products to local storage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('mega_products', JSON.stringify(products));
    }
  }, [products]);

  // Sync orders to local storage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('mega_orders', JSON.stringify(orders));
    }
  }, [orders]);

  // Persist sound config
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('mega_sound_enabled', String(soundEnabled));
    }
  }, [soundEnabled]);

  // Request HTML5 Browser Notification Permissions
  const requestDesktopPermission = async () => {
    if (!isClient || !('Notification' in window)) return 'unsupported';
    try {
      const permission = await Notification.requestPermission();
      setDesktopPermission(permission);
      return permission;
    } catch {
      return 'default';
    }
  };

  // Sound triggering helper (for manual settings tests)
  const triggerSound = () => {
    playNotificationSound();
  };

  // Trigger high-fidelity notification sequence
  const triggerOrderNotification = (order: Order) => {
    // 1. Play sound chime if enabled
    if (soundEnabled) {
      playNotificationSound();
    }

    // 2. Add React/Local Notification center card
    const newNotif: AppNotification = {
      id: `ntf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: order.id,
      title: 'নতুন অর্ডার রিসিভ হয়েছে! 🛒',
      message: `গ্রাহক "${order.customerName}" ওনার মোবাইল নম্বর "${order.phone}" এ সর্বমোট ৳${order.total} মূল্যের নতুন অর্ডার দিয়েছেন।`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'order'
    };

    setNotifications(prev => [newNotif, ...prev]);

    // 3. Dispatch standard browser push if granted
    if (isClient && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const itemsList = order.items.map(item => `${item.name} (${item.quantity}টি)`).join(', ');
        new Notification('এম.কে.গ্রুপ - নতুন অর্ডার!', {
          body: `গ্রাহক: ${order.customerName}\nমোবাইল: ${order.phone}\nআইটেমসমূহ: ${itemsList}\nমোট বিল: ৳${order.total}`,
          icon: 'https://i.ibb.co/s9n1g23j/1000095789-removebg-preview.png',
          tag: `order-${order.id}`,
          requireInteraction: true
        });
      } catch (err) {
        console.error('Failed to trigger native desktop notification: ', err);
      }
    }
  };

  // Cross-tab real-time listener using 'storage' event.
  // This enables instant notification trigger if the admin is on another tab/window!
  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mega_orders' && e.newValue) {
        try {
          const parsedOrders = JSON.parse(e.newValue) as Order[];
          // Find orders in the sync data that aren't in current state
          if (parsedOrders.length > orders.length) {
            const freshOrders = parsedOrders.filter(po => !orders.some(o => o.id === po.id));
            if (freshOrders.length > 0) {
              setOrders(parsedOrders);
              // Notify user of latest orders in real-time
              freshOrders.forEach(order => {
                triggerOrderNotification(order);
              });
            }
          } else {
            setOrders(parsedOrders);
          }
        } catch (err) {
          console.error('Storage parsing error for orders sync: ', err);
        }
      }
      if (e.key === 'mega_products' && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [orders, soundEnabled]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    // Play beautiful sound
    if (soundEnabled) {
      playAddToCartSound();
    }

    // Trigger toast notification
    const price = product.discountedPrice || product.originalPrice;
    setCartToast({
      id: `toast-${Date.now()}`,
      productName: product.name,
      productImage: product.image,
      productPrice: price,
      quantity
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.discountedPrice || item.originalPrice;
    return total + (price * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Order submission
  const placeOrder = (customerName: string, phone: string, address: string) => {
    const trackingId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: trackingId,
      customerName,
      phone,
      address,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.discountedPrice || item.originalPrice
      })),
      total: cartTotal,
      date: new Date().toISOString(),
      status: 'Pending'
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      // Sync straight away to trigger notifications
      if (isClient) {
        localStorage.setItem('mega_orders', JSON.stringify(updated));
      }
      return updated;
    });

    // Fire sound & alert popup immediately
    triggerOrderNotification(newOrder);
    
    return trackingId;
  };

  const placeDirectOrder = (customerName: string, phone: string, address: string, product: Product, quantity: number) => {
    const trackingId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: trackingId,
      customerName,
      phone,
      address,
      items: [{
        id: product.id,
        name: product.name,
        quantity,
        price: product.discountedPrice || product.originalPrice
      }],
      total: (product.discountedPrice || product.originalPrice) * quantity,
      date: new Date().toISOString(),
      status: 'Pending'
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      if (isClient) {
        localStorage.setItem('mega_orders', JSON.stringify(updated));
      }
      return updated;
    });

    triggerOrderNotification(newOrder);
    
    return trackingId;
  };

  const updateOrderStatus = (id: string, status: 'Pending' | 'Confirmed' | 'Shipped' | 'Completed' | 'Cancelled') => {
    setOrders(prev => {
      const updated = prev.map(order => 
        order.id === id ? { ...order, status } : order
      );
      if (isClient) {
        localStorage.setItem('mega_orders', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => {
      const updated = prev.filter(order => order.id !== id);
      if (isClient) {
        localStorage.setItem('mega_orders', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Product management actions
  const addProduct = (newProdData: Omit<Product, 'id' | 'rating' | 'reviews'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `p-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: 5.0,
      reviews: 0
    };
    setProducts(prev => {
      const updated = [newProduct, ...prev];
      if (isClient) {
        localStorage.setItem('mega_products', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateProduct = (updatedProd: Product) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === updatedProd.id ? updatedProd : p);
      if (isClient) {
        localStorage.setItem('mega_products', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (isClient) {
        localStorage.setItem('mega_products', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Add a simulated mock order for admin notification tests
  const addSimulatedOrder = (simulatedOrder: Order) => {
    setOrders(prev => {
      const updated = [simulatedOrder, ...prev];
      if (isClient) {
        localStorage.setItem('mega_orders', JSON.stringify(updated));
      }
      return updated;
    });
    triggerOrderNotification(simulatedOrder);
  };

  // Notification management functions
  const addNotification = (title: string, message: string, orderId?: string, type: 'order' | 'system' = 'system') => {
    const newNotif: AppNotification = {
      id: `ntf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      isCheckingOut,
      setIsCheckingOut,
      orders,
      placeOrder,
      placeDirectOrder,
      updateOrderStatus,
      deleteOrder,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      notifications,
      addNotification,
      dismissNotification,
      markNotificationAsRead,
      clearAllNotifications,
      soundEnabled,
      setSoundEnabled,
      triggerSound,
      desktopPermission,
      requestDesktopPermission,
      addSimulatedOrder
    }}>
      {children}

      {/* Added to Cart Floating Toast Notification */}
      {cartToast && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 sm:left-6 -translate-x-1/2 sm:translate-x-0 z-[9999] w-[90%] max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto select-none">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 shrink-0 flex items-center justify-center border border-white/10">
            <img loading="lazy" src={cartToast.productImage} alt={cartToast.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-emerald-400">কার্টে যোগ করা হয়েছে! 🛒</h4>
            <div className="text-sm font-extrabold truncate text-white mt-0.5">{cartToast.productName}</div>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">
              পরিমাণ: {cartToast.quantity}টি &bull; মূল্য: ৳{(cartToast.productPrice * cartToast.quantity).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <button 
              onClick={() => {
                setIsCartOpen(true);
                setCartToast(null);
              }}
              className="bg-[#00693E] hover:bg-[#005030] text-white px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide transition-all active:scale-95 cursor-pointer text-center"
            >
              কার্ট দেখুন
            </button>
            <button 
              onClick={() => setCartToast(null)}
              className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors py-0.5 cursor-pointer text-center"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
