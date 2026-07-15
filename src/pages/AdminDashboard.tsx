import React, { useState, useEffect, useRef } from "react";
import { PackagePlus, ExternalLink, RefreshCw, Boxes, ArrowRightLeft, SlidersHorizontal, Building, MapPin, Minus } from "lucide-react";
import StaffPortal from '../components/admin/StaffPortal';
import { FileText, 
  Package, 
  ShoppingBag, ShoppingCart, 
  Users, UserCheck, Camera, 
  BarChart3, 
  Settings, 
  LogOut, 
  Search, 
  Plus, 
  ShieldCheck, 
  User, 
  Lock, 
  ArrowLeft, 
  EyeOff, 
  Eye, 
  LogIn, 
  Award, 
  Headset, 
  Check, 
  Download, 
  Menu, 
  X, 
  Edit, 
  Trash2, Briefcase, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Bell,
  Volume2,
  VolumeX,
  Share2,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Calendar,
  DollarSign,
  Megaphone,
  Percent,
  Sparkles,
  Target,
  BookOpen,
  PhoneCall,
  CheckSquare,
  Truck, Upload,
  Printer,
  ScanBarcode,
  ScanLine
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product, Investor } from '../types';
import { db, courierHistoryCollection } from '../lib/firebase';
import { onSnapshot, setDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';


const safeJSONParse = (data, fallback) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return fallback;
  }
};

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mk_admin_authenticated') === 'true';
    }
    return false;
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  // Tab routing
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'receiving' | 'courier' | 'inventory' | 'orders' | 'customers' | 'settings' | 'finances' | 'marketing' | 'dues' | 'agreement' | 'investors' | 'staff' | 'scan_status' | 'scan_article' | 'scan_order'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Language translation state
  const [lang, setLang] = useState<'bn' | 'en'>('bn');

  const t = {
    bn: {
      appName: 'এম.কে.গ্রুপ',
      adminPanel: 'অ্যাডমিন প্যানেল',
      dashboard: 'ড্যাশবোর্ড',
      productManagement: 'পণ্য ম্যানেজমেন্ট',
      productReceiving: 'পণ্য রিসিভিং',
      courier: 'কুরিয়ার ড্যাশবোর্ড',
      inventory: 'ইনভেন্টরি কন্ট্রোল',
      orders: 'অর্ডার সমূহ',
      customerList: 'কাস্টমার লিস্ট',
      settings: 'সেটিংস',
      finances: 'আয় ও ব্যয় ট্র্যাকার',
      dues: 'বকেয়া খাতা',
      marketing: 'মার্কেটিং ও ডিসকাউন্ট',
      scanStatus: 'স্ক্যান করে স্ট্যাটাস',
      scanArticle: 'স্ক্যান করে আর্টিকেল',
      scanOrder: 'স্ক্যান করে অর্ডার',
      logout: 'প্রস্থান করুন',
      languageLabel: 'ভাষা পরিবর্তন',
      ordersTrack: 'অর্ডার সমূহ',
      orderCount: 'টি',
      subTitleOrders: 'স্টোরের সকল সক্রিয় গ্রাহকের ক্যাশ অন ডেলিভারি অর্ডার ট্র্যাক',
    },
    en: {
      appName: 'Nirapod Khaddo',
      adminPanel: 'Admin Panel',
      dashboard: 'Dashboard',
      productManagement: 'Products',
      productReceiving: 'Product Receiving',
      courier: 'Courier Dashboard',
      inventory: 'Inventory Control',
      orders: 'Orders List',
      customerList: 'Customers',
      settings: 'Settings',
      finances: 'Income & Expense',
      dues: 'Due Ledger',
      marketing: 'Marketing & Discount',
      scanStatus: 'Scan & Update Status',
      scanArticle: 'Scan & Add Article',
      scanOrder: 'Scan & Create Order',
      logout: 'Logout',
      languageLabel: 'Language',
      ordersTrack: 'All Orders',
      orderCount: 'total',
      subTitleOrders: 'Track cash on delivery orders from active store customers',
    }
  }[lang];

  // Search filter inputs
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilterDate, setOrderFilterDate] = useState('');

  // Context resources
  const { 
    products, 
    orders, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    deleteOrder,
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
  } = useCart();

  // Manual Order states
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [manualOrderCustomerName, setManualOrderCustomerName] = useState('');
  const [manualOrderPhone, setManualOrderPhone] = useState('');
  const [manualOrderAddress, setManualOrderAddress] = useState('');
  const [manualOrderIsDue, setManualOrderIsDue] = useState(false);
  const [manualOrderItems, setManualOrderItems] = useState<{ id: string; name: string; quantity: number; price: number }[]>([]);

  // Scan Tool States
  const [scanStatusInput, setScanStatusInput] = useState('');
  const [scanStatusTarget, setScanStatusTarget] = useState('Delivered');
  const [scanArticleInput, setScanArticleInput] = useState('');
  const [scanArticleProduct, setScanArticleProduct] = useState<Product | null>(null);
  const [scanArticleBoxes, setScanArticleBoxes] = useState('0');
  const [scanArticlePairs, setScanArticlePairs] = useState('0');
  const [scanOrderInput, setScanOrderInput] = useState('');
  const [manualSelectedProductId, setManualSelectedProductId] = useState('');
  const [manualSelectedQuantity, setManualSelectedQuantity] = useState<number | ''>('');
  const [manualSelectedPrice, setManualSelectedPrice] = useState<number | ''>('');
  const [manualArticleSearch, setManualArticleSearch] = useState('');
  const [manualDeliveryCharge, setManualDeliveryCharge] = useState<number | ''>('');
  const [manualConditionCharge, setManualConditionCharge] = useState<number | ''>('');

  // Auto calculate condition charge
  useEffect(() => {
    if (!manualOrderIsDue) { // if COD
      const subtotal = manualOrderItems.reduce((sum, item) => sum + (((item as any).price || 0) * item.quantity), 0);
      const totalForCondition = subtotal + (Number(manualDeliveryCharge) || 0);
      const newCharge = totalForCondition > 0 ? Math.round(totalForCondition * 0.01) : 0;
      setManualConditionCharge(newCharge);
    } else {
      setManualConditionCharge(0);
    }
  }, [manualOrderItems, manualOrderIsDue, manualDeliveryCharge]);
  const [createdOrderForActions, setCreatedOrderForActions] = useState<any>(null);

  // Income & Expense (Transactions) states
  const [transactions, setTransactions] = useState<{
    id: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    date: string;
    note: string;
  }[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mega_transactions');
      return (stored && safeJSONParse(stored, null)) || [];
    }
    return [];
  });

  // Persist transactions to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mega_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  // Transaction form states
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [txCategory, setTxCategory] = useState('পণ্য বিক্রি');
  const [txAmount, setTxAmount] = useState('');
  const [txNote, setTxNote] = useState('');
  const [txFilter, setTxFilter] = useState<'all' | 'income' | 'expense' | 'automated'>('all');
  const [txSearch, setTxSearch] = useState('');


  // Dues states
  const [dues, setDues] = useState<{
    id: string;
    customerName: string;
    phone: string;
    amount: number;
    paidAmount: number;
    date: string;
    status: 'Unpaid' | 'Partial' | 'Paid';
  }[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mega_dues');
      return (stored && safeJSONParse(stored, null)) || [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mega_dues', JSON.stringify(dues));
    }
  }, [dues]);

  const [isDueModalOpen, setIsDueModalOpen] = useState(false);
  const [isDuePayModalOpen, setIsDuePayModalOpen] = useState(false);
  const [currentDue, setCurrentDue] = useState<any>(null);
  
  const [newDue, setNewDue] = useState({ customerName: '', phone: '', amount: '' });
  const [payDueAmount, setPayDueAmount] = useState('');

  const handleAddDue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDue.customerName || !newDue.amount) return;
    const added = {
      id: `d-${Date.now()}`,
      customerName: newDue.customerName,
      phone: newDue.phone,
      amount: Number(newDue.amount),
      paidAmount: 0,
      date: new Date().toISOString(),
      status: 'Unpaid' as const
    };
    setDues([added, ...dues]);
    setIsDueModalOpen(false);
    setNewDue({ customerName: '', phone: '', amount: '' });
  };

  const handlePayDue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDue || !payDueAmount) return;
    const paying = Number(payDueAmount);
    
    // Update due record
    setDues(dues.map(d => {
      if (d.id === currentDue.id) {
        const newPaid = d.paidAmount + paying;
        return {
          ...d,
          paidAmount: newPaid,
          status: newPaid >= d.amount ? 'Paid' : 'Partial'
        };
      }
      return d;
    }));
    
    // Add to income
    const newTx = {
      id: `tx-due-${Date.now()}`,
      type: 'income' as const,
      category: 'বকেয়া আদায়',
      amount: paying,
      date: new Date().toISOString(),
      note: `${currentDue.customerName} এর বকেয়া পরিশোধ`
    };
    setTransactions([newTx, ...transactions]);
    
    setIsDuePayModalOpen(false);
    setPayDueAmount('');
    setCurrentDue(null);
    addNotification('বকেয়া আদায় 💰', 'বকেয়া জমা হয়েছে এবং আয় হিসেবে যুক্ত হয়েছে!');
  };

  // Marketing Campaigns states
  const [campaigns, setCampaigns] = useState<{
    id: string;
    name: string;
    platform: string;
    budget: number;
    targetAudience: string;
    conversions: number;
    status: 'Active' | 'Paused' | 'Scheduled' | 'Completed';
    date: string;
    roi: number;
  }[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mega_campaigns');
      return (stored && safeJSONParse(stored, null)) || [];
    }
    return [];
  });

  // Coupons states
  const [coupons, setCoupons] = useState<{
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minSpend: number;
    expiryDate: string;
    usageCount: number;
  }[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mega_coupons');
      return (stored && safeJSONParse(stored, null)) || [];
    }
    return [];
  });

  // Save campaigns & coupons to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mega_campaigns', JSON.stringify(campaigns));
    }
  }, [campaigns]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mega_coupons', JSON.stringify(coupons));
    }
  }, [coupons]);

  // Request browser desktop push notification permission automatically on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      requestDesktopPermission().catch(console.error);
    }
  }, []);

  // Campaign Form state
  const [newCampName, setNewCampName] = useState('');
  const [newCampPlatform, setNewCampPlatform] = useState('Facebook Ads');
  const [newCampBudget, setNewCampBudget] = useState('');
  const [newCampTarget, setNewCampTarget] = useState('');
  const [newCampStatus, setNewCampStatus] = useState<'Active' | 'Paused' | 'Scheduled'>('Active');

  // Coupon Form state
  const [newCopCode, setNewCopCode] = useState('');
  const [newCopType, setNewCopType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCopValue, setNewCopValue] = useState('');
  const [newCopMinSpend, setNewCopMinSpend] = useState('');
  const [newCopExpiry, setNewCopExpiry] = useState('');

  // Modals management states
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCustomReceiveModalOpen, setIsCustomReceiveModalOpen] = useState(false);

  // Courier Tab States
  const [courierSearch, setCourierSearch] = useState('');
  const [courierHistory, setCourierHistory] = useState<any[]>([]);
  
  // Real-time Firestore sync and LocalStorage migration for courier history
  useEffect(() => {
    // 1. Migrate localStorage data to Firestore if present
    const stored = localStorage.getItem('mega_courier_history');
    if (stored) {
      const localHistory = safeJSONParse(stored, []);
      if (Array.isArray(localHistory) && localHistory.length > 0) {
        localHistory.forEach(async (item) => {
          if (item && item.consignment_id) {
            try {
              await setDoc(doc(courierHistoryCollection, item.consignment_id.toString()), item);
            } catch (err) {
              console.error('Error migrating local courier history to Firestore:', err);
            }
          }
        });
        localStorage.removeItem('mega_courier_history');
      }
    }

    // 2. Setup real-time listener
    const unsub = onSnapshot(courierHistoryCollection, (snapshot) => {
      const history: any[] = [];
      snapshot.forEach((doc) => {
        history.push(doc.data());
      });
      // Sort by created_at descending
      history.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      setCourierHistory(history);
    });

    return () => unsub();
  }, []);

  const [isSyncing, setIsSyncing] = useState(false);
  const handleSyncCourier = async () => {
    setIsSyncing(true);
    try {
      const updatedHistory = [...courierHistory];
      let updatedCount = 0;
      const newTransactions = [];
      for (let i = 0; i < updatedHistory.length; i++) {
         const booking = updatedHistory[i];
         if (booking.status !== 'delivered' && booking.status !== 'cancelled') {
            try {
                const api_url = `https://portal.packzy.com/api/v1/status_by_cid/${booking.consignment_id}`;
                const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(api_url)}`, {
                   headers: {
                      "Api-Key": "2p80tiyscewtjoczqbqy9fcugkhpocvz",
                      "Secret-Key": "y0i0bp251lyktq4vx8fwcr2l"
                   }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 200 && data.delivery_status) {
                        const newStatus = data.delivery_status.toLowerCase();
                        if (newStatus !== booking.status) {
                            updatedHistory[i].status = newStatus;
                            updatedCount++;
                            if (newStatus === 'delivered') {
                                const codAmount = Number(data.cod_amount !== undefined ? data.cod_amount : (booking.amount || booking.cod_amount)) || 0;
                                const deliveryCharge = Number(data.delivery_charge !== undefined ? data.delivery_charge : (data.delivery_fee !== undefined ? data.delivery_fee : 0));
                                const codCharge = Number(data.cod_charge !== undefined ? data.cod_charge : (data.cod_fee !== undefined ? data.cod_fee : 0));
                                const netAmount = Math.max(0, codAmount - deliveryCharge - codCharge);

                                updatedHistory[i].delivery_charge = deliveryCharge;
                                updatedHistory[i].cod_charge = codCharge;

                                newTransactions.push({
                                  id: Math.random().toString(36).substr(2, 9),
                                  type: 'income' as const,
                                  category: 'কুরিয়ার ডেলিভারি',
                                  amount: netAmount,
                                  date: new Date().toISOString(),
                                  note: `কুরিয়ার পার্সেল (${booking.tracking_code}) ডেলিভারি সম্পন্ন (ডেলিভারি চার্জ ৳${deliveryCharge} এবং কন্ডিশন চার্জ ৳${codCharge} বাদ দিয়ে)`
                                });
                            } else {
                                const deliveryCharge = Number(data.delivery_charge !== undefined ? data.delivery_charge : (data.delivery_fee !== undefined ? data.delivery_fee : 0));
                                const codCharge = Number(data.cod_charge !== undefined ? data.cod_charge : (data.cod_fee !== undefined ? data.cod_fee : 0));
                                updatedHistory[i].delivery_charge = deliveryCharge;
                                updatedHistory[i].cod_charge = codCharge;
                            }
                        }
                    }
                }
            } catch (err) {
                console.log("Error syncing:", err);
            }
         }
      }
      if (updatedCount > 0) {
         // Save updated status bookings to Firestore
         for (const booking of updatedHistory) {
           if (booking && booking.consignment_id) {
             await setDoc(doc(courierHistoryCollection, booking.consignment_id.toString()), booking);
           }
         }
         if (newTransactions.length > 0) {
             setTransactions(prev => [...newTransactions, ...prev]);
             addNotification('আয় আপডেট 💰', 'ডেলিভারি সম্পন্ন হওয়া অর্ডারগুলোর টাকা আয় অপশনে যুক্ত হয়েছে!');
         }
         addNotification('সিঙ্ক সম্পন্ন 🔄', `${updatedCount} টি পার্সেলের স্ট্যাটাস রিয়্যাল-টাইম আপডেট করা হয়েছে!`);
      } else {
         addNotification('আপ-টু-ডেট 🔄', 'সব পার্সেলের স্ট্যাটাস ইতিমধ্যেই সর্বশেষ অবস্থায় রয়েছে।');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto sync courier on tab open
  useEffect(() => {
    if (activeTab === 'courier') {
       handleSyncCourier();
    }
  }, [activeTab]);
  const [isCourierBookingOpen, setIsCourierBookingOpen] = useState(false);
  const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
  const [autoBookingResult, setAutoBookingResult] = useState<any | null>(null);
  const [courierBookingData, setCourierBookingData] = useState({
    invoice: '',
    recipient_name: '',
    recipient_phone: '',
    recipient_address: '',
    cod_amount: '',
    note: ''
  });

  const [customReceiveData, setCustomReceiveData] = useState({ name: '', quantity: '', buyingPrice: '', supplier: '' });
  const [isBoxReceiveModalOpen, setIsBoxReceiveModalOpen] = useState(false);
  const [boxReceiveData, setBoxReceiveData] = useState({ article: '', boxCount: '1' });
  const [receiveQtys, setReceiveQtys] = useState<Record<string, string>>({});
  const [lastReceivedMsg, setLastReceivedMsg] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const articleInputRef = useRef<HTMLInputElement>(null);

  const [isStockAdjustmentModalOpen, setIsStockAdjustmentModalOpen] = useState(false);
  const [selectedStockProduct, setSelectedStockProduct] = useState<any | null>(null);
  const [addBoxes, setAddBoxes] = useState('1');
  const [addPairs, setAddPairs] = useState('0');
  const [adjustmentPrice, setAdjustmentPrice] = useState('');
  const [adjustmentDiscountPrice, setAdjustmentDiscountPrice] = useState('');

  // Quick Add Product states for Inventory page
  const [quickArticle, setQuickArticle] = useState('');
  const [quickName, setQuickName] = useState('');
  const [quickPrice, setQuickPrice] = useState('');
  const [quickStockBoxes, setQuickStockBoxes] = useState('24');
  const [quickImage, setQuickImage] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState<{ phone: string, name: string } | null>(null);
  
  // Product form state
  const [productFormData, setProductFormData] = useState({
    name: '',
    originalPrice: '',
    discountedPrice: '',
    category: '',
    weight: '১ কেজি',
    image: '',
    isNew: false,
    isFlashSale: false,
    description: '',
    stock: '',
    article: '',
    isHidden: false,
    piecesPerBox: '24'
  });

  // Order viewing modal state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);



  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim().toLowerCase();
    const p = password.trim();
    if (u === 'mk admin' && p === 'Mkgroupbd.ltd@@') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mk_admin_authenticated', 'true');
      }
      setError('');
    } else {
      setError('ভুল ইউজারনেম বা পাসওয়ার্ড! আবার চেষ্টা করুন।');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mk_admin_authenticated');
    }
    onLogout();
  };


  // Agreement Form State
  const [isAgreementSaved, setIsAgreementSaved] = useState(false);



    // Handle saving agreement as investor
  const [agreementData, setAgreementData] = useState({
    party1: { name: '', fname: '', mname: '', address: '', nid: '', mobile: '' },
    party2: { name: '', fname: '', mname: '', address: '', nid: '', mobile: '' },
    nominee: { name: '', fname: '', mname: '', address: '', nid: '', mobile: '' },
    details: { totalAmount: '', totalAmountWords: '', installmentAmount: '', installmentAmountWords: '', installmentCount: '', dueAmount: '', dueAmountWords: '', paymentDate: '', party1Bank: '', party1Account: '', party2Bank: '', party2Account: '', chequeNumber: '' },
    warish1: { relation: '', name: '', address: '', nid: '', mobile: '' },
    warish2: { relation: '', name: '', address: '', nid: '', mobile: '' },
    witness1: { name: '', address: '', nid: '', mobile: '' },
    witness2: { name: '', address: '', nid: '', mobile: '' },
    witness3: { name: '', address: '', nid: '', mobile: '' }
  });

  // Reset print state if form is modified
  useEffect(() => {
    setIsAgreementSaved(false);
  }, [agreementData]);

  const handleSaveInvestor = () => {
    if (!agreementData.party1.name || !agreementData.party1.mobile || !agreementData.details.totalAmount) {
      alert("১ম পক্ষ ক্রেতার নাম, মোবাইল এবং চুক্তির মোট টাকার পরিমান অবশ্যই পূরণ করতে হবে।");
      return;
    }
    
    // Calculate values
    const totalAmount = parseFloat(agreementData.details.totalAmount) || 0;
    const dueAmount = parseFloat(agreementData.details.dueAmount) || 0;
    const paidAmount = totalAmount - dueAmount;
    
    const newInvestor: Investor = {
      id: Math.random().toString(36).substr(2, 9),
      accountNumber: Math.floor(1000000 + Math.random() * 9000000).toString(),
      name: agreementData.party1.name,
      fname: agreementData.party1.fname,
      mobile: agreementData.party1.mobile,
      nid: agreementData.party1.nid,
      address: agreementData.party1.address,
      totalAmount: totalAmount,
      dueAmount: dueAmount,
      paidAmount: paidAmount,
      date: new Date().toISOString()
    };
    
    // Save to localStorage
    const stored = localStorage.getItem('mega_investors');
    const existing = (stored && safeJSONParse(stored, null)) || [];
    const updatedList = [newInvestor, ...existing];
    localStorage.setItem('mega_investors', JSON.stringify(updatedList));
    setInvestorsList(updatedList);
    
    setIsAgreementSaved(true);
    alert(`বিনিয়োগকারী সফলভাবে সংরক্ষিত হয়েছে! একাউন্ট নম্বর: ${newInvestor.accountNumber}\nএখন আপনি চুক্তিনামা প্রিন্ট করতে পারবেন।`);
  };


  useEffect(() => {
    if (selectedStockProduct) {
      setAdjustmentPrice(selectedStockProduct.originalPrice?.toString() || '');
      setAdjustmentDiscountPrice(selectedStockProduct.discountedPrice?.toString() || '');
    } else {
      setAdjustmentPrice('');
      setAdjustmentDiscountPrice('');
    }
  }, [selectedStockProduct]);


  // Investors Management
  const [investorsList, setInvestorsList] = useState<Investor[]>([]);
  const [showAddInvestorForm, setShowAddInvestorForm] = useState(false);
  const [newInvestorData, setNewInvestorData] = useState({
    name: '', fname: '', mobile: '', nid: '', address: '', totalAmount: '', dueAmount: ''
  });

  useEffect(() => {
    if (activeTab === 'investors') {
      const stored = localStorage.getItem('mega_investors');
      if (stored) {
        setInvestorsList(safeJSONParse(stored, null));
      }
    }
  }, [activeTab]);

  const handleManualAddInvestor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvestorData.name || !newInvestorData.mobile || !newInvestorData.totalAmount) {
      alert('নাম, মোবাইল এবং মোট বিনিয়োগের পরিমান আবশ্যক।');
      return;
    }

    const totalAmount = parseFloat(newInvestorData.totalAmount) || 0;
    const dueAmount = parseFloat(newInvestorData.dueAmount) || 0;
    const paidAmount = totalAmount - dueAmount;

    const newInvestor: Investor = {
      id: Math.random().toString(36).substr(2, 9),
      accountNumber: Math.floor(1000000 + Math.random() * 9000000).toString(),
      name: newInvestorData.name,
      fname: newInvestorData.fname,
      mobile: newInvestorData.mobile,
      nid: newInvestorData.nid,
      address: newInvestorData.address,
      totalAmount: totalAmount,
      dueAmount: dueAmount,
      paidAmount: paidAmount,
      date: new Date().toISOString()
    };

    const updatedList = [newInvestor, ...investorsList];
    setInvestorsList(updatedList);
    localStorage.setItem('mega_investors', JSON.stringify(updatedList));
    
    setNewInvestorData({ name: '', fname: '', mobile: '', nid: '', address: '', totalAmount: '', dueAmount: '' });
    setShowAddInvestorForm(false);
    alert(`বিনিয়োগকারী সফলভাবে সংরক্ষিত হয়েছে! একাউন্ট নম্বর: ${newInvestor.accountNumber}`);
  };

  const handleDeleteInvestor = (id: string) => {
    {
      const updatedList = investorsList.filter(inv => inv.id !== id);
      setInvestorsList(updatedList);
      localStorage.setItem('mega_investors', JSON.stringify(updatedList));
    }
  };



  // Courier booking mockup states
  const [bookingOrder, setBookingOrder] = useState<any | null>(null);
  const [courierService, setCourierService] = useState<'pathao' | 'redx' | 'steadfast'>('steadfast');
  const [weightKg, setWeightKg] = useState('1.0');
  const [deliveryType, setDeliveryType] = useState<'home' | 'point'>('home');
  const [bookingCategory, setBookingCategory] = useState('ব্যাগ ও জুতো');
  const [bookingResult, setBookingResult] = useState<any | null>(null);

  // CSV Orders Report exporter and downloader
  const handleDownloadCSV = () => {
    // CSV headers matching the table columns
    const headers = ['Order ID', 'Customer Name', 'Phone Number', 'Delivery Address', 'Items (Quantity)', 'Total Amount (BDT)', 'Order Status', 'Date Created'];
    
    // Convert orders to rows
    const csvRows = [
      headers.join(','), // CSV header line
      ...orders.map(order => {
        const itemsStr = (order.items || []).map(item => `${item.name} (${item.quantity}x)`).join('; ');
        const dateStr = new Date(order.date).toLocaleDateString('bn-BD', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
        const statusText = order.status === 'Completed' ? 'ডেলিভারি সম্পন্ন' : order.status === 'Cancelled' ? 'বাতিল' : order.status === 'Shipped' ? 'ডেলিভারি পার্টনারের কাছে হস্তান্তরিত' : order.status === 'Confirmed' ? 'পণ্য প্রস্তুত করা হচ্ছে' : 'পেন্ডিং';
        
        // Escape quotes to prevent CSV format corruption
        const esc = (text: string) => `"${(text || '').replace(/"/g, '""')}"`;
        
        return [
          esc(order.id),
          esc(order.customerName),
          esc(order.phone),
          esc(order.address),
          esc(itemsStr),
          esc(String(order.total)),
          esc(statusText),
          esc(dateStr)
        ].join(',');
      })
    ];
    
    // Add UTF-8 BOM for Excel Bangla encoding compatibility
    const csvContent = "\ufeff" + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nirapod_Khaddo_Orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF/Print Orders Report compiler and downloader using a standalone downloadable HTML page
  const handleDownloadPDF = () => {
    const ordersToDownload = orders.filter(o => {
      const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || o.phone.includes(orderSearch) || o.id.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesDate = orderFilterDate ? o.date.startsWith(orderFilterDate) : true;
      return matchesSearch && matchesDate;
    });
    const dateBD = new Date().toLocaleDateString('bn-BD', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const rowsHtml = ordersToDownload.map((order, idx) => {
      const itemsStr = (order.items || []).map(item => `${item.name} (${item.quantity}x)`).join(', ');
      const dateStr = new Date(order.date).toLocaleDateString('bn-BD', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      const statusText = order.status === 'Completed' ? 'ডেলিভারি সম্পন্ন' : order.status === 'Cancelled' ? 'বাতিল' : order.status === 'Shipped' ? 'ডেলিভারি পার্টনারের কাছে হস্তান্তরিত' : order.status === 'Confirmed' ? 'পণ্য প্রস্তুত করা হচ্ছে' : 'পেন্ডিং';
      const statusColor = order.status === 'Completed' ? '#2e7d32' : order.status === 'Cancelled' ? '#d32f2f' : '#f57c00';

      return `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px 8px; font-family: monospace; font-size: 11px;">#${order.id}</td>
          <td style="padding: 12px 8px; font-size: 12px;">
            <strong style="color: #111;">${order.customerName}</strong><br/>
            <span style="color: #666; font-size: 11px; font-family: monospace;">${order.phone}</span>
          </td>
          <td style="padding: 12px 8px; font-size: 11px; max-width: 180px; word-wrap: break-word; color: #444;">${order.address}</td>
          <td style="padding: 12px 8px; font-size: 11px; max-width: 220px; word-wrap: break-word; color: #444;">${itemsStr}</td>
          <td style="padding: 12px 8px; font-weight: bold; font-size: 12px;">৳${order.total}</td>
          <td style="padding: 12px 8px; text-align: center;">
            <span style="color: ${statusColor}; font-weight: bold; font-size: 10px; border: 1px solid ${statusColor}; padding: 2px 6px; border-radius: 4px; background: ${statusColor}10;">
              ${statusText}
            </span>
          </td>
          <td style="padding: 12px 8px; font-size: 11px; color: #666;">${dateStr}</td>
        </tr>
      `;
    }).join('');

    const totalOrders = ordersToDownload.length;
    const completedOrders = ordersToDownload.filter(o => o.status === 'Completed').length;
    const pendingOrders = ordersToDownload.filter(o => o.status === 'Pending').length;
    const totalEarnings = ordersToDownload.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.total, 0);

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Nirapod_Khaddo_Shomvar_Orders_Report</title>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap');
            body {
              font-family: 'Hind Siliguri', 'Inter', sans-serif;
              color: #333;
              margin: 40px;
              background-color: #ffffff;
            }
            .header {
              text-align: center;
              border-bottom: 3px double #2e7d32;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2e7d32;
              margin: 0;
              font-size: 26px;
              font-weight: 700;
            }
            .header p {
              margin: 5px 0 0;
              color: #666;
              font-weight: 600;
              font-size: 13px;
            }
            .meta-box {
              display: flex;
              justify-content: space-between;
              background: #fbfbfb;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 15px;
              margin-bottom: 25px;
            }
            .meta-item {
              text-align: center;
              flex: 1;
            }
            .meta-item:not(:last-child) {
              border-right: 1px solid #e2e8f0;
            }
            .meta-label {
              font-size: 11px;
              color: #718096;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .meta-value {
              font-size: 16px;
              font-weight: bold;
              color: #2e7d32;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th {
              background-color: #2e7d32;
              color: white;
              padding: 10px 8px;
              text-align: left;
              font-size: 12px;
              font-weight: bold;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 10px;
              color: #a0aec0;
              border-top: 1px solid #edf2f7;
              padding-top: 15px;
            }
            .no-print-btn {
              display: inline-block;
              background-color: #2e7d32;
              color: white;
              border: none;
              padding: 10px 20px;
              font-size: 14px;
              font-weight: bold;
              border-radius: 8px;
              cursor: pointer;
              margin-bottom: 20px;
              font-family: 'Hind Siliguri', sans-serif;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              transition: all 0.2s;
            }
            .no-print-btn:hover {
              background-color: #1b5e20;
              transform: translateY(-1px);
            }
            @media print {
              body { margin: 15px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: right;">
            <button class="no-print-btn" onclick="window.print()">রিপোর্ট প্রিন্ট করুন / PDF সেভ করুন (Print / Save PDF)</button>
          </div>
          <div class="header">
            <h1>এম.কে.গ্রুপ</h1>
            <p>অর্ডার রিপোর্ট ও কাস্টমার ট্র্যাকিং তালিকা</p>
            <div style="font-size: 11px; color: #718096; margin-top: 8px;">রিপোর্ট তৈরির সময়: ${dateBD}</div>
          </div>
          
          <div class="meta-box">
            <div class="meta-item">
              <div class="meta-label">মোট অর্ডার</div>
              <div class="meta-value" style="color: #2d3748;">${totalOrders} টি</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">পেন্ডিং অর্ডার</div>
              <div class="meta-value" style="color: #dd6b20;">${pendingOrders} টি</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">ডেলিভারড অর্ডার</div>
              <div class="meta-value">${completedOrders} টি</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">মোট সংগ্রহ (৳)</div>
              <div class="meta-value" style="color: #0d9488;">৳${totalEarnings}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 10%;">অর্ডার আইডি</th>
                <th style="width: 20%;">গ্রাহকের বিবরণ</th>
                <th style="width: 25%;">ডেলিভারি ঠিকানা</th>
                <th style="width: 25%;">ক্রয়কৃত আইটেম</th>
                <th style="width: 10%;">মূল্য</th>
                <th style="text-align: center; width: 10%;">স্ট্যাটাস</th>
                <th style="width: 15%;">অর্ডারের তারিখ</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
                </table>

          <div class="footer">
            <p>এই রিপোর্টটি সিস্টেম থেকে স্বয়ংক্রিয়ভাবে জেনারেট করা হয়েছে। এম.কে.গ্রুপ অনলাইন ম্যানেজমেন্ট সিস্টেম।</p>
          </div>

          <script>
            // Auto trigger print dialog when loaded
            window.addEventListener('DOMContentLoaded', () => {
              setTimeout(() => {
                window.print();
              }, 500);
            });
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nirapod_Khaddo_Orders_Report_${new Date().toISOString().split('T')[0]}.html`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy product landing page link for Facebook Ads campaigns
  const copyLandingPageLink = (productId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/#product=${productId}`;
    
    let success = false;
    try {
      // Create a temporary textarea element for execution of copy command
      const textarea = document.createElement('textarea');
      textarea.value = link;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0px';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, 99999); // for mobile devices
      
      success = document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch (err) {
      console.error('Textarea copy failed:', err);
    }

    if (!success && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        success = true;
      }).catch(err => {
        console.error('Navigator copy failed too:', err);
      });
    }

    alert('সফলভাবে ল্যান্ডিং পেজ লিঙ্ক কপি হয়েছে!\n\nএই লিঙ্কটি কপি করে আপনি সরাসরি ফেসবুকে বা অন্য যেকোনো বিজ্ঞাপনে ব্যবহার করতে পারবেন।\n\nলিঙ্ক: ' + link);
  };

  // Image Upload helper with size limit of 2MB & canvas compression for Firestore
  const handleImageUpload = (file: File, onSuccess: (base64Url: string) => void) => {
    if (!file) return;
    
    // Check size <= 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("ফাইল সাইজ অবশ্যই ২MB এর কম হতে হবে! (File must be under 2MB)");
      return;
    }
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert("শুধুমাত্র ছবি আপলোড করা যাবে! (Only images are supported)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // We compress the image using a canvas to fit within Firestore document limit (1MB)
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Downscale if too large
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress as jpeg with 0.7 quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          onSuccess(compressedBase64);
        } else {
          // Fallback to original data URL if canvas fails
          onSuccess(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Quick Add Product for Inventory Control Tab
  const handleQuickAddProduct = () => {
    if (!quickArticle.trim()) {
      alert('দয়া করে আর্টিকেল নম্বর দিন।');
      return;
    }
    if (!quickPrice.trim() || isNaN(parseFloat(quickPrice)) || parseFloat(quickPrice) <= 0) {
      alert('সবচেয়ে সঠিক মূল্য দিন।');
      return;
    }
    
    const existingProduct = products.find(p => p.article === quickArticle.trim());
    if (existingProduct) {
      // Just update the stock and image if specified
      const boxesNum = parseInt(quickStockBoxes) || 0;
      updateProduct({
        ...existingProduct,
        stock: (existingProduct.stock || 0) + boxesNum,
        image: quickImage.trim() || existingProduct.image
      });
      addNotification('স্টক আপডেট', `আর্টিকেল ${quickArticle.trim()} অনুযায়ী ${boxesNum} পিস স্টকে যুক্ত করা হয়েছে।`);
      setQuickArticle('');
      setQuickName('');
      setQuickPrice('');
      setQuickStockBoxes('0');
      setQuickImage('');
      alert('বর্তমান পণ্যের স্টক সফলভাবে আপডেট করা হয়েছে!');
      return;
    }

    const boxesNum = parseInt(quickStockBoxes) || 0;
    const initialStock = boxesNum;

    const payload = {
      name: quickName.trim() || quickArticle.trim(),
      originalPrice: parseFloat(quickPrice) * 24,
      category: 'জুতো', // Default category for shoe warehouse inventory
      weight: '১ জোড়া',
      image: quickImage.trim(),
      isNew: true,
      description: `আর্টিকেল ${quickArticle.trim()} - প্রিমিয়াম কোয়ালিটি পণ্য`,
      article: quickArticle.trim(),
      stock: initialStock,
      piecesPerBox: 24,
      isHidden: false
    };

    addProduct(payload);
    addNotification('পণ্য যুক্ত', `আর্টিকেল ${quickArticle.trim()} অনুযায়ী নতুন পণ্য "${quickName.trim()}" এবং মূল্য ৳${quickPrice} ইনভেন্টরিতে যুক্ত করা হয়েছে।`);
    
    // Reset fields
    setQuickArticle('');
    setQuickName('');
    setQuickPrice('');
    setQuickStockBoxes('0');
    setQuickImage('');
    alert('নতুন পণ্য ও মূল্য সফলভাবে ইনভেন্টরিতে যুক্ত করা হয়েছে!');
  };

  // Product submission form
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.originalPrice) return; // name is optional now
    
    // Check if product with this article already exists
    if (!editingProduct && productFormData.article) {
      const existingProduct = products.find(p => p.article === productFormData.article);
      if (existingProduct) {
        const addedStock = productFormData.stock ? parseInt(productFormData.stock) : 0;
        if (addedStock > 0) {
          updateProduct({
            ...existingProduct,
            stock: (existingProduct.stock || 0) + addedStock
          });
          addNotification('স্টক আপডেট', `আর্টিকেল ${productFormData.article} এর স্টকে ${addedStock} পিস যোগ করা হয়েছে।`);
        } else {
          addNotification('সতর্কতা', `আর্টিকেল ${productFormData.article} আগে থেকেই আছে, কিন্তু কোন স্টক দেওয়া হয়নি।`);
        }
        setIsProductModalOpen(false);
        setProductFormData({
          name: '', originalPrice: '', discountedPrice: '', category: '', weight: '১ কেজি', image: '', isNew: false, isFlashSale: false, description: '', stock: '', article: '', isHidden: false, piecesPerBox: '24'
        });
        return;
      }
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80'
    ];

    const finalImage = productFormData.image.trim();

    const payload = {
      name: productFormData.name.trim() || productFormData.article.trim() || 'পণ্য',
      originalPrice: parseFloat(productFormData.originalPrice),
      discountedPrice: productFormData.discountedPrice ? parseFloat(productFormData.discountedPrice) : undefined,
      category: productFormData.category,
      weight: productFormData.weight,
      image: finalImage,
      isNew: productFormData.isNew,
      isFlashSale: productFormData.isFlashSale,
      description: productFormData.description,
      article: productFormData.article,
      stock: productFormData.stock ? parseInt(productFormData.stock) : undefined,
      isHidden: productFormData.isHidden,
      piecesPerBox: productFormData.piecesPerBox ? parseInt(productFormData.piecesPerBox) : 24
    };

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...payload
      });
    } else {
      addProduct(payload);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductFormData({
      name: '',
      originalPrice: '',
      discountedPrice: '',
      category: '',
      weight: '১ কেজি',
      image: '',
      isNew: false,
      isFlashSale: false,
      description: '',
      stock: '',
      article: '',
      isHidden: false,
      piecesPerBox: '24'
    });
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      originalPrice: product.originalPrice.toString(),
      discountedPrice: product.discountedPrice ? product.discountedPrice.toString() : '',
      category: product.category,
      weight: product.weight,
      image: product.image,
      isNew: !!product.isNew,
      isFlashSale: !!product.isFlashSale,
      description: product.description || '',
      article: product.article || '',
      stock: product.stock !== undefined ? product.stock.toString() : '',
      isHidden: !!product.isHidden,
      piecesPerBox: (product as any).piecesPerBox !== undefined ? (product as any).piecesPerBox.toString() : '24'
    });
    setIsProductModalOpen(true);
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      originalPrice: '',
      discountedPrice: '',
      category: '',
      weight: '১ কেজি',
      image: '',
      isNew: true,
      isFlashSale: false,
      description: '',
      stock: '',
      article: '',
      isHidden: false,
      piecesPerBox: '24'
    });
    setIsProductModalOpen(true);
  };

  // Dynamic statistics calculations
  const totalSales = orders
    .filter(order => order.status === 'Completed')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrdersCount = orders.filter(order => order.status === 'Pending').length;
  const completedOrdersCount = orders.filter(order => order.status === 'Completed').length;
  const cancelledOrdersCount = orders.filter(order => order.status === 'Cancelled').length;

  // Compile unique customers from orders with aggregation
  const uniqueCustomersMap = new Map<string, { name: string; phone: string; address: string; totalSpent: number; ordersCount: number }>();
  orders.forEach(order => {
    const existing = uniqueCustomersMap.get(order.phone);
    if (existing) {
      existing.totalSpent += order.status === 'Completed' ? order.total : 0;
      existing.ordersCount += 1;
    } else {
      uniqueCustomersMap.set(order.phone, {
        name: order.customerName,
        phone: order.phone,
        address: order.address,
        totalSpent: order.status === 'Completed' ? order.total : 0,
        ordersCount: 1
      });
    }
  });
  const customersList = Array.from(uniqueCustomersMap.values());
  const totalCustomersCount = customersList.length;

  // Filter lists based on searches
  const filteredProductsList = products.filter(p => 
    (p.name || '').toLowerCase().includes((productSearch || '').toLowerCase()) || 
    (p.category || '').toLowerCase().includes((productSearch || '').toLowerCase()) ||
    (p.article || '').toLowerCase().includes((productSearch || '').toLowerCase())
  );

  const filteredOrdersList = orders.filter(o => {
    const searchLow = (orderSearch || '').toLowerCase();
    const matchesSearch = (o.customerName || '').toLowerCase().includes(searchLow) || 
                          (o.phone || '').includes(searchLow) || 
                          (o.id || '').toLowerCase().includes(searchLow);
    
    if (orderFilterDate) {
        const oDate = new Date(o.date).toISOString().split('T')[0];
        return matchesSearch && oDate === orderFilterDate;
    }
    return matchesSearch;
  });

  // Authentication Page view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022c22] via-[#047857] to-[#0d9488] flex flex-col items-center justify-center p-4 overflow-x-hidden relative font-sans">
        {/* Glow Spheres for Visual Depth */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Main Card Container */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-[0_25px_60px_-15px_rgba(2,44,34,0.5)] relative z-10 flex flex-col">
          
          {/* Logo & Header Section */}
          <div className="flex flex-col items-center text-center mb-6">
            <img loading="lazy" 
              src="https://i.ibb.co/s9n1g23j/1000095789-removebg-preview.png" 
              alt="এম.কে.গ্রুপ লোগো" 
              className="w-16 h-16 rounded-full object-cover border border-[#00693E]/20 shadow-lg mb-4 transform hover:scale-105 transition-transform duration-300" 
              referrerPolicy="no-referrer"
            />
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">এম.কে.গ্রুপ</h2>
            <div className="h-1 w-12 bg-gradient-to-r from-[#047857] to-[#0d9488] rounded-full mt-3" />
          </div>
          
          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-black text-center border border-rose-100 shadow-inner animate-shake">
                ⚠️ {error}
              </div>
            )}
            
            {/* Username Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wide">ইউজারনেম</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center overflow-hidden focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:bg-white transition-all duration-200">
                <div className="w-12 h-11 bg-slate-100/80 flex items-center justify-center text-slate-400 shrink-0 border-r border-slate-200">
                  <User size={18} strokeWidth={2} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ইউজারনেম লিখুন"
                  className="w-full h-full py-2.5 px-3 text-xs sm:text-sm font-black text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wide">পাসওয়ার্ড</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center overflow-hidden focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:bg-white transition-all duration-200">
                <div className="w-12 h-11 bg-slate-100/80 flex items-center justify-center text-slate-400 shrink-0 border-r border-slate-200">
                  <Lock size={18} strokeWidth={2} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন"
                  className="w-full h-full py-2.5 px-3 text-xs sm:text-sm font-black text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3.5 text-slate-400 hover:text-slate-600 focus:outline-none shrink-0 transition-colors"
                >
                  {showPassword ? <Eye size={16} strokeWidth={2} /> : <EyeOff size={16} strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* Remember Me row */}
            <div className="flex items-center justify-between pt-1 text-[11.5px] font-extrabold">
              <label className="flex items-center gap-2 cursor-pointer group select-none">
                <div className={`w-[18px] h-[18px] rounded-md flex items-center justify-center border transition-all duration-200 ${rememberMe ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'bg-slate-50 border-slate-200 group-hover:border-emerald-500'}`}>
                  {rememberMe && <Check size={11} className="stroke-[3]" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="text-slate-600 group-hover:text-slate-800 transition-colors">আমাকে মনে রাখুন</span>
              </label>
              
              <button type="button" className="text-emerald-700 hover:text-emerald-800 hover:underline transition-colors focus:outline-none">
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer duration-200"
            >
              <LogIn size={16} strokeWidth={2.5} />
              লগিন
            </button>
          </form>

          {/* Back to store link */}
          <button 
            onClick={handleAdminLogout}
            className="mt-6 text-xs font-black text-slate-400 hover:text-emerald-700 transition-all duration-200 flex items-center justify-center gap-1.5 mx-auto group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            স্টোরে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-slate-800">

      {/* Primary Sidebar for Large Screens */}
      <div className="w-64 bg-slate-900 text-white hidden md:flex flex-col flex-shrink-0">
        <div className="p-5 flex items-center justify-between border-b border-slate-800 bg-slate-950">
          <div className="flex flex-col">
            <span className="text-[15px] font-black text-[#2e7d32] tracking-tight leading-snug">{t.appName}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.adminPanel}</span>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-black border border-emerald-500/20">LIVE</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'dashboard' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BarChart3 size={18} /> {t.dashboard}
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'products' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Package size={18} /> {t.productManagement}
          </button>
          <button 
            onClick={() => setActiveTab('inventory')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'inventory' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Boxes size={18} /> {t.inventory}
          </button>
          <button 
            onClick={() => setActiveTab('receiving')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'receiving' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Download size={18} /> {t.productReceiving}
          </button>
          <button 
            onClick={() => setActiveTab('courier')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'courier' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Truck size={18} /> {t.courier}
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'orders' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <ShoppingBag size={18} /> {t.orders} {pendingOrdersCount > 0 && <span className="ml-auto bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{pendingOrdersCount}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('customers')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'customers' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={18} /> {t.customerList}
          </button>
          <button 
            onClick={() => setActiveTab('finances')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'finances' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Wallet size={18} /> {t.finances}
          </button>
          <button 
            onClick={() => setActiveTab('dues')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'dues' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BookOpen size={18} /> {t.dues}
          </button>
          
          <button 
            onClick={() => setActiveTab('agreement')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'agreement' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText size={18} /> চুক্তিনামা প্রিন্ট
          </button>
          <button 
            onClick={() => setActiveTab('investors')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'investors' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Briefcase size={18} /> বিনিয়োগকারীগণ
          </button>
          <button 
            onClick={() => setActiveTab('staff')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'staff' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <UserCheck size={18} /> স্টাফ পোর্টাল
          </button>

          <div className="pt-4 pb-1">
            <span className="px-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">স্ক্যান ও টুলস</span>
          </div>

          <button 
            onClick={() => setActiveTab('scan_status')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'scan_status' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <ScanBarcode size={18} /> {t.scanStatus}
          </button>
          
          <button 
            onClick={() => setActiveTab('scan_article')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'scan_article' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <ScanLine size={18} /> {t.scanArticle}
          </button>
          
          <button 
            onClick={() => setActiveTab('scan_order')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'scan_order' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <ScanBarcode size={18} /> {t.scanOrder}
          </button>

          <div className="pt-4 pb-1">
            <span className="px-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">অন্যান্য</span>
          </div>

          <button 
            onClick={() => setActiveTab('marketing')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'marketing' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Megaphone size={18} /> {t.marketing}
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === 'settings' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings size={18} /> {t.settings}
          </button>
        </nav>

        {/* Language Selection option */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 select-none">
          <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
            {t.languageLabel}
          </label>
          <div className="flex gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button 
              type="button"
              onClick={() => setLang('bn')}
              className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                lang === 'bn' 
                  ? 'bg-[#2e7d32] text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button 
              type="button"
              onClick={() => setLang('en')}
              className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                lang === 'en' 
                  ? 'bg-[#2e7d32] text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <button 
            onClick={handleAdminLogout} 
            className="flex items-center gap-3 w-full hover:bg-rose-500/10 hover:text-rose-400 px-4 py-3 rounded-xl text-sm font-bold transition-all text-rose-300"
          >
            <LogOut size={18} /> {t.logout}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Slide-out Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex flex-col w-64 max-w-xs bg-slate-900 text-white h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="p-5 flex items-center justify-between border-b border-slate-800 bg-slate-950">
              <span className="text-[15px] font-black text-[#2e7d32]">{t.appName}</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              <button 
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'dashboard' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <BarChart3 size={16} /> {t.dashboard}
              </button>
              <button 
                onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'products' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Package size={16} /> {t.productManagement}
              </button>
              <button 
                onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'inventory' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Boxes size={16} /> {t.inventory}
              </button>
              <button 
                onClick={() => { setActiveTab('receiving'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'receiving' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Download size={16} /> {t.productReceiving}
              </button>
              <button 
                onClick={() => { setActiveTab('courier'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'courier' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Truck size={16} /> {t.courier}
              </button>
              <button 
                onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'orders' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <ShoppingBag size={16} /> {t.orders} {pendingOrdersCount > 0 && <span className="ml-auto bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black">{pendingOrdersCount}</span>}
              </button>
              <button 
                onClick={() => { setActiveTab('customers'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'customers' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Users size={16} /> {t.customerList}
              </button>
              <button 
                onClick={() => { setActiveTab('finances'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'finances' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Wallet size={16} /> {t.finances}
              </button>
              <button 
                onClick={() => { setActiveTab('dues'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'dues' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <BookOpen size={16} /> {t.dues}
              </button>
              
              <button 
                onClick={() => { setActiveTab('agreement'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'agreement' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <FileText size={16} /> চুক্তিনামা প্রিন্ট
              </button>
              <button 
                onClick={() => { setActiveTab('investors'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'investors' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Briefcase size={16} /> বিনিয়োগকারীগণ
              </button>
              <button 
                onClick={() => { setActiveTab('staff'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'staff' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <UserCheck size={16} /> স্টাফ পোর্টাল
              </button>

              <div className="pt-4 pb-1">
                <span className="px-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">স্ক্যান ও টুলস</span>
              </div>

              <button 
                onClick={() => { setActiveTab('scan_status'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'scan_status' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <ScanBarcode size={16} /> {t.scanStatus}
              </button>
              
              <button 
                onClick={() => { setActiveTab('scan_article'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'scan_article' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <ScanLine size={16} /> {t.scanArticle}
              </button>

              <button 
                onClick={() => { setActiveTab('scan_order'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'scan_order' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <ScanBarcode size={16} /> {t.scanOrder}
              </button>

              <div className="pt-4 pb-1">
                <span className="px-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">অন্যান্য</span>
              </div>

              <button 
                onClick={() => { setActiveTab('marketing'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'marketing' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Megaphone size={16} /> {t.marketing}
              </button>
              <button 
                onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === 'settings' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Settings size={16} /> {t.settings}
              </button>
            </nav>

            {/* Mobile Language Selection option */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 select-none">
              <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                {t.languageLabel}
              </label>
              <div className="flex gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button 
                  type="button"
                  onClick={() => setLang('bn')}
                  className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                    lang === 'bn' 
                      ? 'bg-[#2e7d32] text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  বাংলা
                </button>
                <button 
                  type="button"
                  onClick={() => setLang('en')}
                  className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                    lang === 'en' 
                      ? 'bg-[#2e7d32] text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800">
              <button onClick={() => { handleAdminLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold transition-all text-left text-rose-400 hover:text-rose-50 hover:bg-rose-500/20" title="লগআউট">
                <LogOut size={16} /> লগআউট
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Box Receive Modal */}
      {isBoxReceiveModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBoxReceiveModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-indigo-50/50 rounded-t-2xl">
              <div>
                <h3 className="font-black text-slate-800 flex items-center gap-2"><PackagePlus size={18} className="text-indigo-600" /> র‍্যাপিড বক্স রিসিভ</h3>
                <p className="text-[10px] text-slate-500 mt-1">প্রতি বক্সে ২৪ পিস করে হিসাব হবে। আর্টিকেল লিখে এন্টার চাপুন।</p>
              </div>
              <button onClick={() => setIsBoxReceiveModalOpen(false)} className="text-slate-400 hover:text-rose-500 bg-white hover:bg-rose-50 p-1.5 rounded-lg transition-colors shadow-sm border border-slate-100">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {lastReceivedMsg && (
                <div className={`p-3 rounded-xl text-xs font-bold ${lastReceivedMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                  {lastReceivedMsg.text}
                </div>
              )}
              
              <form onSubmit={(e) => {
                e.preventDefault();
                
                if (!boxReceiveData.article) {
                  setLastReceivedMsg({ text: 'দয়া করে আর্টিকেল নম্বর দিন।', type: 'error' });
                  return;
                }
                
                const boxes = parseInt(boxReceiveData.boxCount || '1');
                if (isNaN(boxes) || boxes <= 0) {
                  setLastReceivedMsg({ text: 'সঠিক বক্স সংখ্যা দিন।', type: 'error' });
                  return;
                }
                
                const totalItems = boxes * 24;
                const existingProduct = products.find(p => p.article === boxReceiveData.article);
                
                if (existingProduct) {
                  const currentStock = existingProduct.stock || 0;
                  updateProduct({ ...existingProduct, stock: currentStock + totalItems });
                  
                  setLastReceivedMsg({ text: `সফল: ${existingProduct.name} এ ${boxes} বক্স (${totalItems} পিস) যোগ হয়েছে! নতুন স্টক: ${currentStock + totalItems} পিস`, type: 'success' });
                  setBoxReceiveData({ article: '', boxCount: '1' });
                  
                  // Keep focus
                  setTimeout(() => {
                    articleInputRef.current?.focus();
                  }, 50);
                } else {
                  // Auto create new product
                  const newProduct = {
                    name: 'পণ্য (' + boxReceiveData.article + ')',
                    originalPrice: 0,
                    category: 'নতুন',
                    weight: '১ পিস',
                    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
                    stock: totalItems,
                    article: boxReceiveData.article,
                    isHidden: true
                  };
                  addProduct(newProduct);
                  
                  setLastReceivedMsg({ text: `সফল: নতুন পণ্য তৈরি হয়েছে এবং ${boxes} বক্স (${totalItems} পিস) যোগ হয়েছে!`, type: 'success' });
                  setBoxReceiveData({ article: '', boxCount: '1' });
                  
                  setTimeout(() => {
                    articleInputRef.current?.focus();
                  }, 50);
                }
              }}>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">আর্টিকেল নম্বর <span className="text-rose-500">*</span></label>
                    <input 
                      ref={articleInputRef}
                      type="text" 
                      value={boxReceiveData.article}
                      onChange={(e) => setBoxReceiveData(p => ({ ...p, article: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-600 outline-none text-sm text-slate-800 font-black uppercase transition-colors" 
                      placeholder="যেমন: ART-101"
                      autoFocus
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">বক্স <span className="text-rose-500">*</span></label>
                    <input 
                      type="number" 
                      value={boxReceiveData.boxCount}
                      onChange={(e) => setBoxReceiveData(p => ({ ...p, boxCount: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none text-sm text-slate-800 font-black text-center transition-colors" 
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                  >
                    <Check size={18} /> রিসিভ করুন (Enter)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* Stock Adjustment Modal */}
      {isStockAdjustmentModalOpen && selectedStockProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsStockAdjustmentModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50 rounded-t-2xl">
              <div>
                <h3 className="font-black text-slate-800 flex items-center gap-2"><SlidersHorizontal size={18} className="text-emerald-600" /> স্টক সমন্বয় / যোগ</h3>
                <p className="text-[10px] text-slate-500 mt-1">পণ্যের বর্তমান স্টকের সাথে নতুন বক্স বা জোড়া যোগ/বিয়োগ করুন।</p>
              </div>
              <button onClick={() => setIsStockAdjustmentModalOpen(false)} className="text-slate-400 hover:text-rose-500 bg-white hover:bg-rose-50 p-1.5 rounded-lg transition-colors shadow-sm border border-slate-100">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Product Selector */}
              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">পণ্য নির্বাচন করুন (Select Product)</label>
                <select
                  value={selectedStockProduct.id}
                  onChange={(e) => {
                    const found = products.find(p => p.id === e.target.value);
                    if (found) setSelectedStockProduct(found);
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:outline-[#2e7d32] bg-white cursor-pointer"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.article ? `[${p.article}] ` : ''}{p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Info */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">সিলেক্টেড পণ্য</div>
                <div className="font-extrabold text-slate-900 text-sm mt-0.5">{selectedStockProduct.article || 'N/A'}</div>
                <div className="text-xs text-slate-500 font-bold">{selectedStockProduct.name}</div>
                
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-500">বর্তমান স্টক:</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg text-[11px] font-black">
                    {(() => {
                      const curr = selectedStockProduct.stock || 0;
                      const b = Math.floor(curr / 24);
                      const p = curr % 24;
                      let t = '';
                      if (b > 0) t += `${b} বক্স `;
                      if (p > 0) t += `${p} জোড়া`;
                      if (curr === 0) t = '০ জোড়া (স্টক নেই)';
                      return `${t} (${curr} পিস)`;
                    })()}
                  </span>
                </div>
              </div>

              {/* Adjustment Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">বক্স সংখ্যা (১ বক্স = ২৪ পিস)</label>
                  <input 
                    type="number" 
                    value={addBoxes}
                    onChange={(e) => setAddBoxes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-600 outline-none text-sm text-slate-800 font-black text-center transition-colors" 
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">জোড়া/পিস সংখ্যা</label>
                  <input 
                    type="number" 
                    value={addPairs}
                    onChange={(e) => setAddPairs(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-600 outline-none text-sm text-slate-800 font-black text-center transition-colors" 
                    min="0"
                  />
                </div>
              </div>

              {/* Price adjustments within stock adjustment */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-3">
                <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase">পণ্যের মূল্য সংশোধন করুন</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">আসল মূল্য (৳)</label>
                    <input 
                      type="number" 
                      value={adjustmentPrice}
                      onChange={(e) => setAdjustmentPrice(e.target.value)}
                      placeholder="যেমন: ৮৫০"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none text-xs text-slate-800 font-bold focus:border-emerald-600 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">অফার মূল্য (৳)</label>
                    <input 
                      type="number" 
                      value={adjustmentDiscountPrice}
                      onChange={(e) => setAdjustmentDiscountPrice(e.target.value)}
                      placeholder="যেমন: ৭৯৯"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none text-xs text-slate-800 font-bold focus:border-emerald-600 transition-colors" 
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Calculation */}
              {(() => {
                const boxesNum = parseInt(addBoxes) || 0;
                const pairsNum = parseInt(addPairs) || 0;
                const adjustmentAmount = boxesNum * 24 + pairsNum;
                const currentStock = selectedStockProduct.stock || 0;
                
                const finalAddStock = currentStock + adjustmentAmount;
                const finalSubStock = Math.max(0, currentStock - adjustmentAmount);

                const getStockDesc = (stockVal: number) => {
                  const b = Math.floor(stockVal / 24);
                  const p = stockVal % 24;
                  let t = '';
                  if (b > 0) t += `${b} বক্স `;
                  if (p > 0) t += `${p} জোড়া`;
                  if (stockVal === 0) t = 'স্টক নেই';
                  return `${t} (${stockVal} pces)`;
                };

                return (
                  <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl space-y-1.5 text-xs font-bold text-slate-700">
                    <div className="flex justify-between">
                      <span>সমন্বয় পরিমাণ:</span>
                      <span className="text-[#2e7d32]">{boxesNum} BOX + {pairsNum} PCS = {adjustmentAmount} PCS</span>
                    </div>
                    <div className="pt-1.5 border-t border-dashed border-slate-200 flex justify-between">
                      <span>যোগ করলে হবে (+):</span>
                      <span className="text-emerald-700 font-black">{getStockDesc(finalAddStock)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>বিয়োগ করলে হবে (-):</span>
                      <span className="text-rose-700 font-black">{getStockDesc(finalSubStock)}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    const boxesNum = parseInt(addBoxes) || 0;
                    const pairsNum = parseInt(addPairs) || 0;
                    const amount = boxesNum * 24 + pairsNum;
                    const currentStock = selectedStockProduct.stock || 0;
                    const newStock = currentStock + amount;

                    const parsedPrice = parseFloat(adjustmentPrice);
                    const parsedDiscount = parseFloat(adjustmentDiscountPrice);

                    const updatedPayload = {
                      ...selectedStockProduct,
                      stock: newStock,
                      ...(isNaN(parsedPrice) ? {} : { originalPrice: parsedPrice }),
                      discountedPrice: isNaN(parsedDiscount) || parsedDiscount <= 0 ? undefined : parsedDiscount
                    };

                    updateProduct(updatedPayload);
                    addNotification('স্টক ও মূল্য বৃদ্ধি', `"${selectedStockProduct.name}" এর স্টকে ${boxesNum} বক্স ও ${pairsNum} জোড়া যোগ এবং মূল্য আপডেট করা হয়েছে।`);
                    setIsStockAdjustmentModalOpen(false);
                  }}
                  className="py-3 px-4 rounded-xl bg-[#2e7d32] hover:bg-emerald-700 text-white font-black text-xs transition-colors flex justify-center items-center gap-1.5 shadow-md shadow-emerald-600/10 active:scale-[0.98] cursor-pointer"
                >
                  <Plus size={14} /> স্টক ও মূল্য যোগ (+)
                </button>
                <button 
                  onClick={() => {
                    const boxesNum = parseInt(addBoxes) || 0;
                    const pairsNum = parseInt(addPairs) || 0;
                    const amount = boxesNum * 24 + pairsNum;
                    const currentStock = selectedStockProduct.stock || 0;
                    const newStock = Math.max(0, currentStock - amount);

                    const parsedPrice = parseFloat(adjustmentPrice);
                    const parsedDiscount = parseFloat(adjustmentDiscountPrice);

                    const updatedPayload = {
                      ...selectedStockProduct,
                      stock: newStock,
                      ...(isNaN(parsedPrice) ? {} : { originalPrice: parsedPrice }),
                      discountedPrice: isNaN(parsedDiscount) || parsedDiscount <= 0 ? undefined : parsedDiscount
                    };

                    updateProduct(updatedPayload);
                    addNotification('স্টক ও মূল্য হ্রাস', `"${selectedStockProduct.name}" এর স্টক থেকে ${boxesNum} বক্স ও ${pairsNum} জোড়া বিয়োগ এবং মূল্য আপডেট করা হয়েছে।`);
                    setIsStockAdjustmentModalOpen(false);
                  }}
                  className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-colors flex justify-center items-center gap-1.5 shadow-md shadow-rose-600/10 active:scale-[0.98] cursor-pointer"
                >
                  <Minus size={14} /> স্টক ও মূল্য বিয়োগ (-)
                </button>
              </div>

              <button 
                onClick={() => {
                  const boxesNum = parseInt(addBoxes) || 0;
                  const pairsNum = parseInt(addPairs) || 0;
                  const newStock = boxesNum * 24 + pairsNum;

                  const parsedPrice = parseFloat(adjustmentPrice);
                  const parsedDiscount = parseFloat(adjustmentDiscountPrice);

                  const updatedPayload = {
                    ...selectedStockProduct,
                    stock: newStock,
                    ...(isNaN(parsedPrice) ? {} : { originalPrice: parsedPrice }),
                    discountedPrice: isNaN(parsedDiscount) || parsedDiscount <= 0 ? undefined : parsedDiscount
                  };

                  updateProduct(updatedPayload);
                  addNotification('স্টক ও মূল্য সেট', `"${selectedStockProduct.name}" এর স্টক সরাসরি ${boxesNum} বক্স ও ${pairsNum} জোড়া এবং মূল্য আপডেট সেট করা হয়েছে।`);
                  setIsStockAdjustmentModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex justify-center items-center gap-1.5 cursor-pointer"
              >
                <Check size={14} /> সরাসরি স্টক ও মূল্য সেট করুন (=)
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Header - Highly Optimized and Responsive */}
        <header className="bg-white shadow-sm border-b relative shrink-0">
          <div className="px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-2">
            
            {/* Left Header info */}
            <div className="flex items-center gap-3 min-w-0">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-[#2e7d32] md:hidden shrink-0 border border-slate-200"
                title="Sidebar Open"
              >
                <Menu size={20} />
              </button>
              
              <div className="min-w-0">
                <h1 className="text-base md:text-xl font-extrabold text-slate-800 truncate leading-tight">
                  {activeTab === 'dashboard' && 'ড্যাশবোর্ড ওভারভিউ'}
                  {activeTab === 'products' && 'পণ্য ম্যানেজমেন্ট'}
                  {activeTab === 'inventory' && 'ইনভেন্টরি কন্ট্রোল'}
                  {activeTab === 'receiving' && 'পণ্য রিসিভিং (স্টক)'}
                  {activeTab === 'courier' && 'কুরিয়ার ড্যাশবোর্ড'}
                  {activeTab === 'orders' && 'অর্ডার সমূহ'}
                  {activeTab === 'customers' && 'কাস্টমার ডিরেক্টরি'}
                                    {activeTab === 'finances' && 'আয় ও ব্যয় ট্র্যাকার'}
                  {activeTab === 'dues' && 'বকেয়া হিসাব ও কালেকশন'}
                  {activeTab === 'marketing' && 'মার্কেটিং ও ডিসকাউন্ট ইন্টেলিজেন্স'}
                  {activeTab === 'settings' && 'সিস্টেম সেটিংস'}
                  {activeTab === 'staff' && 'স্টাফ পোর্টাল'}
                </h1>
                <p className="text-[10px] md:text-xs text-slate-400 hidden sm:block font-bold mt-0.5">
                  এম.কে.গ্রুপ • রিয়েল-টাইম অ্যাডমিন অ্যাকশন
                </p>
              </div>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0 font-bold">
              {activeTab === 'products' && (
                <div className="relative hidden max-w-xs sm:block">
                  <input 
                    type="text" 
                    placeholder="পণ্য খুঁজুন..." 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-44 lg:w-56 pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32]" 
                  />
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
              )}
              {activeTab === 'receiving' && (
                <div className="relative hidden max-w-xs sm:block">
                  <input 
                    type="text" 
                    placeholder="পণ্য খুঁজুন..." 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-44 lg:w-56 pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32]" 
                  />
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
              )}
              {activeTab === 'orders' && (
                <div className="relative hidden max-w-xs sm:block">
                  <input 
                    type="text" 
                    placeholder="অর্ডার খুঁজুন..." 
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-44 lg:w-56 pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32]" 
                  />
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
              )}

              {/* User Avatar Badge */}
              <div className="flex items-center gap-2">
                {/* Notification Dropdown Bell */}
                <div className="relative shrink-0 mr-1">
                  <button 
                    onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                    className="relative p-2 text-slate-500 hover:text-[#2e7d32] hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer border border-slate-200"
                    title="নোটিফিকেশন সেন্টার"
                  >
                    <Bell size={18} />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-[9px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce leading-none">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>

                  {/* Absolute Notification Dropdown list panel */}
                  {isNotificationDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-[999] animate-in fade-in slide-in-from-top-4 duration-200 text-xs text-slate-700 font-medium">
                      {/* Top Action line */}
                      <div className="p-3 bg-slate-50 border-b flex items-center justify-between select-none">
                        <span className="font-extrabold text-slate-800">রিসেন্ট নোটিফিকেশন ({notifications.filter(n => !n.read).length}টি অপরঠিত)</span>
                        <button 
                          onClick={clearAllNotifications}
                          className="text-[#2e7d32] hover:text-emerald-700 font-extrabold text-[10px]"
                        >
                          সব ক্লিয়ার করুন
                        </button>
                      </div>

                      {/* Notifs lists scrollable window */}
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 font-extrabold select-none">
                            কোন নোটিফিকেশন পাওয়া যায়নি।
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={`p-3 transition-colors ${n.read ? 'bg-white' : 'bg-emerald-50/40'}`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className={`font-extrabold ${n.read ? 'text-slate-600' : 'text-[#2e7d32]'}`}>{n.title}</span>
                                <span className="text-[9px] text-slate-400 shrink-0 font-medium font-sans">
                                  {new Date(n.timestamp).toLocaleTimeString('bn-BD', { hour: 'numeric', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed mt-1 font-semibold">{n.message}</p>
                              <div className="flex gap-2.5 mt-2.5 justify-end">
                                {!n.read && (
                                  <button 
                                    onClick={() => markNotificationAsRead(n.id)}
                                    className="text-[10px] text-[#2e7d32] hover:underline font-extrabold cursor-pointer"
                                  >
                                    পড়লাম
                                  </button>
                                )}
                                <button 
                                  onClick={() => {
                                    markNotificationAsRead(n.id);
                                    setIsNotificationDropdownOpen(false);
                                    setActiveTab('orders');
                                    if (n.orderId) {
                                      setOrderSearch(n.orderId);
                                    }
                                  }}
                                  className="text-[10px] text-indigo-500 hover:underline font-extrabold cursor-pointer"
                                >
                                  অর্ডারটি দেখুন
                                </button>
                                <button 
                                  onClick={() => dismissNotification(n.id)}
                                  className="text-[10px] text-rose-500 opacity-60 hover:opacity-100 hover:underline font-bold cursor-pointer"
                                >
                                  ডিলিট
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#2e7d32]/20 shadow-sm shrink-0 bg-white">
                  <img loading="lazy" 
                    src="https://i.ibb.co/s9n1g23j/1000095789-removebg-preview.png" 
                    alt="এম.কে.গ্রুপ" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button 
                  onClick={handleAdminLogout} 
                  className="text-xs text-rose-500 hover:text-rose-700 bg-rose-50 border border-rose-100 hover:bg-rose-100 px-2 py-1.5 rounded-lg font-bold transition-all hidden sm:block"
                >
                  স্টোরে ফিরুন
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-4 md:p-6 pb-24">
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
                     {/* Dynamic Responsive Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {[
                  { label: 'মোট বিক্রি', value: `৳${totalSales.toLocaleString('bn-BD')}`, countDesc: 'টাকা', color: 'bg-indigo-500', icBg: 'bg-indigo-50 text-indigo-500' },
                  { label: 'নতুন অর্ডার', value: pendingOrdersCount.toString(), countDesc: 'টি পেন্ডিং', color: 'bg-emerald-500', icBg: 'bg-emerald-50 text-emerald-500' },
                  { label: 'মোট পণ্য', value: products.length.toString(), countDesc: 'টি লাইভ', color: 'bg-purple-500', icBg: 'bg-purple-50 text-purple-500' },
                  { label: 'মোট কাস্টমার', value: totalCustomersCount.toString(), countDesc: 'জন নিবন্ধিত', color: 'bg-amber-500', icBg: 'bg-amber-50 text-amber-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider truncate mr-1">{stat.label}</span>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${stat.icBg}`}>
                        <BarChart3 size={15} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight leading-none truncate">{stat.value}</h3>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                        {stat.countDesc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Mobile search */}
              <div className="block sm:hidden bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="পণ্য ক্যাটাগরি বা নাম খুঁজুন..." 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-150 rounded-xl text-xs focus:outline-none focus:border-[#2e7d32]" 
                  />
                  <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                </div>
              </div>

              {/* Main Split Sections: Recent orders & stats review */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Block: Recent Orders Table / Cards */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] lg:col-span-8 flex flex-col min-w-0 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap shrink-0 bg-gradient-to-r from-white to-slate-50/50 select-none">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-emerald-50 text-[#2e7d32] rounded-2xl border border-emerald-100/50">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm md:text-base font-black text-slate-800 tracking-tight">সাম্প্রতিক সক্রিয় অর্ডার</h3>
                        <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-0.5">গ্রাহকদের সর্বশেষ অর্ডার সমূহ</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('orders')} 
                      className="text-xs font-extrabold text-[#2e7d32] bg-emerald-50 hover:bg-[#2e7d32] hover:text-white px-3.5 py-2 rounded-xl transition-all duration-250 cursor-pointer flex items-center gap-1 shadow-sm border border-emerald-100/30"
                    >
                      সব অর্ডার দেখুন
                    </button>
                  </div>

                  {/* Desktop View: Wide Beautiful Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold min-w-[500px]">
                      <thead>
                        <tr className="bg-slate-50/60 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 text-left select-none">
                          <th className="p-4 font-extrabold pl-6">অর্ডার আইডি</th>
                          <th className="p-4 font-extrabold">গ্রাহক</th>
                          <th className="p-4 font-extrabold">পণ্যের বিবরণ</th>
                          <th className="p-4 font-extrabold">মোট বিল</th>
                          <th className="p-4 font-extrabold text-center pr-6">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150/60 text-slate-700">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-12 text-center text-slate-400 font-bold bg-white select-none">কোন অর্ডার রেকর্ড নেই।</td>
                          </tr>
                        ) : (
                          orders.slice(0, 4).map((order) => {
                            const isCompleted = order.status === 'Completed';
                            const isCancelled = order.status === 'Cancelled';
                            const initials = order.customerName ? order.customerName.substring(0, 2) : 'গ্র';
                            return (
                              <tr 
                                key={order.id} 
                                onClick={() => setSelectedOrder(order)}
                                className="hover:bg-emerald-50/20 transition-all duration-150 cursor-pointer group"
                              >
                                <td className="p-4 pl-6 text-slate-500 font-mono font-bold group-hover:text-[#2e7d32] transition-colors">
                                  #{order.id}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 select-none ${
                                      isCompleted ? 'bg-emerald-50 text-emerald-700' :
                                      isCancelled ? 'bg-rose-50 text-rose-700' :
                                      'bg-amber-50 text-amber-700'
                                    }`}>
                                      {initials}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-extrabold text-slate-900 leading-snug group-hover:text-[#2e7d32] transition-colors truncate max-w-[150px]">{order.customerName}</div>
                                      <div className="text-[10px] text-slate-400 tracking-wide font-normal mt-0.5 font-sans select-all">{order.phone}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <p className="truncate max-w-[220px] text-slate-500 font-semibold text-xs">
                                    {(order.items || []).map(it => `${it.name} (${it.quantity}x)`).join(', ')}
                                  </p>
                                </td>
                                <td className="p-4 font-black text-slate-900 group-hover:text-[#1b4332] text-sm">৳{order.total}</td>
                                <td className="p-4 text-center pr-6">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                                    isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' :
                                    isCancelled ? 'bg-rose-50 text-rose-700 border border-rose-100/50' :
                                    'bg-amber-50 text-amber-700 border border-amber-100/50'
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                      isCompleted ? 'bg-emerald-500' :
                                      isCancelled ? 'bg-rose-500' :
                                      'bg-amber-500'
                                    }`}></span>
                                    {isCompleted ? 'সম্পন্ন' : isCancelled ? 'বাতিল' : 'পেন্ডিং'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                </table>
                  </div>

                  {/* Mobile responsive view: beautiful stacked bento-list - NO horizontal scroll */}
                  <div className="block md:hidden p-4 space-y-3 bg-slate-50/40">
                    {orders.length === 0 ? (
                      <div className="p-10 text-center text-slate-400 font-bold bg-white rounded-2xl border border-slate-100/80">কোন অর্ডার রেকর্ড নেই।</div>
                    ) : (
                      orders.slice(0, 4).map((order) => {
                        const isCompleted = order.status === 'Completed';
                        const isCancelled = order.status === 'Cancelled';
                        const initials = order.customerName ? order.customerName.substring(0, 2) : 'গ্র';
                        
                        return (
                          <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="p-4 bg-white rounded-2xl border border-slate-100/80 shadow-[0_4px_15px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-all duration-250 cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden group border-l-4"
                            style={{
                              borderLeftColor: isCompleted ? '#10b981' : isCancelled ? '#ef4444' : '#f59e0b'
                            }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Custom Initial Avatar Circle */}
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 select-none ${
                                isCompleted ? 'bg-emerald-50 text-emerald-700' :
                                isCancelled ? 'bg-rose-50 text-rose-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>
                                {initials}
                              </div>
                              
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-slate-800 font-black text-xs tracking-tight leading-none group-hover:text-[#2e7d32] transition-colors">{order.customerName}</span>
                                  <span className="text-[9px] text-slate-400 font-mono font-bold bg-slate-50 px-1.5 py-0.5 rounded-md">#{order.id}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold mt-1.5 truncate max-w-[170px]">
                                  {(order.items || []).map(it => `${it.name} (${it.quantity}x)`).join(', ')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end justify-between gap-1.5 shrink-0">
                              <span className="text-slate-800 font-black text-xs tracking-tight">৳{order.total}</span>
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                                isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/40' :
                                isCancelled ? 'bg-rose-50 text-rose-700 border border-rose-100/40' :
                                'bg-amber-50 text-amber-700 border border-amber-100/40'
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${
                                  isCompleted ? 'bg-emerald-500' :
                                  isCancelled ? 'bg-rose-500' :
                                  'bg-amber-500'
                                }`}></span>
                                {isCompleted ? 'সম্পন্ন' : isCancelled ? 'বাতিল' : 'পেন্ডিং'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>


                {/* Right Block: Fast Actions & Shortcut Panel */}
                <div className="space-y-6 lg:col-span-4 flex flex-col">
                  
                  {/* System Fast Actions */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <h3 className="font-black text-sm text-slate-800 mb-4">অ্যাডমিন শর্টকাট অ্যাকশন</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={openAddProductModal}
                        className="flex flex-col items-center justify-center gap-1.5 bg-[#e8f5e9] border border-[#c8e6c9] hover:bg-[#c8e6c9] text-[#2e7d32] p-4 rounded-xl transition-all font-bold cursor-pointer hover:-translate-y-0.5"
                      >
                        <Plus size={20} />
                        <span className="text-[11px]">নতুন পণ্য যোগ</span>
                      </button>
                      
                      <button 
                        onClick={handleDownloadPDF}
                        className="flex flex-col items-center justify-center gap-1.5 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-600 p-4 rounded-xl transition-all font-bold cursor-pointer hover:-translate-y-0.5"
                      >
                        <Download size={20} />
                        <span className="text-[11px]">ডাউনলোড (PDF/প্রিন্ট)</span>
                      </button>

                      <button 
                        onClick={() => {
                          const printDate = orderFilterDate || new Date().toISOString().split('T')[0];
                          window.open(`/print-sticker?date=${printDate}`, '_blank');
                        }}
                        className="col-span-2 flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-[#1b4332] py-3 px-4 rounded-xl transition-all font-black cursor-pointer hover:-translate-y-0.5"
                      >
                        <Printer size={16} />
                        <span className="text-[11px]">কুরিয়ার স্টিকার প্রিন্ট (${orderFilterDate || 'আজ'})</span>
                      </button>

                      <button 
                        onClick={() => {
                          setManualOrderCustomerName('');
                          setManualOrderPhone('');
                          setManualOrderAddress('');
                          setManualOrderItems([]);
                          setManualSelectedProductId('');
                            setManualSelectedPrice('');
                      setManualArticleSearch('');
                          setManualSelectedQuantity('');
                      setManualSelectedPrice('');
                          setIsManualOrderModalOpen(true);
                        }}
                        className="col-span-2 flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 py-3 px-4 rounded-xl transition-all font-black cursor-pointer hover:-translate-y-0.5"
                      >
                        <PlusCircle size={16} />
                        <span className="text-[11px]">ম্যানুয়াল অর্ডার তৈরি করুন</span>
                      </button>
                    </div>

                    <div className="mt-4 bg-slate-50 rounded-xl p-3 text-[11px] font-bold text-slate-500 flex items-start gap-2 leading-relaxed">
                      <span className="text-secondary text-sm mt-px">✦</span>
                      মোবাইল ভিউতে অর্ডারলিস্ট ডাউনলোড সম্পূর্ণ রেসপন্সিভ এবং এক্সেল-ট্যাবলেটের সাথে সামঞ্জস্যপূর্ণ।
                    </div>
                  </div>

                  {/* Operational Status overview indicator */}
                  <div className="bg-gradient-to-br from-[#022c22] via-[#047857] to-[#0d9488] text-white rounded-3xl p-6 shadow-[0_15px_35px_-5px_rgba(4,120,87,0.35)] border-t border-white/20 border-l border-white/10 relative overflow-hidden flex-1 flex flex-col justify-between group transition-all duration-500 hover:shadow-[0_25px_50px_rgba(4,120,87,0.45)] hover:-translate-y-0.5">
                    {/* Glowing background circles for visual depth */}
                    <div className="absolute -top-12 -right-12 w-44 h-44 bg-teal-400/30 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-300/40 transition-all duration-500 animate-pulse" />
                    <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/25 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

                    <div>
                      <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-inner px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-95"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300 shadow-[0_0_10px_#10b981]"></span>
                          </span>
                          <span className="text-emerald-100 font-sans tracking-wide">অপারেশন স্ট্যাটাস</span>
                        </div>
                        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-emerald-200 shadow-sm transition-transform duration-300 group-hover:scale-110">
                          <ShieldCheck size={18} className="text-emerald-300" />
                        </div>
                      </div>
                      
                      <h4 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-1.5 font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                        এম.কে.গ্রুপ অনলাইন
                      </h4>
                      <p className="text-[11.5px] text-emerald-100/90 font-medium leading-relaxed mt-2.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                        সমস্ত সিস্টেম সচল এবং রিয়েল-টাইমে অর্ডার গ্রহণ করছে। কাস্টমার অ্যাপে ক্যাশ অন ডেলিভারি মোড সচল করা আছে।
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-white/15 text-center shrink-0">
                      {/* Pending Card */}
                      <div className="bg-white/10 backdrop-blur-md border border-white/15 hover:border-amber-400/50 hover:bg-white/15 transition-all duration-300 rounded-2xl p-3 flex flex-col justify-between items-center group/card relative shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:scale-[1.03]">
                        <div className="absolute top-1.5 right-1.5 text-amber-300 group-hover/card:scale-110 transition-transform drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]">
                          <Clock size={12} />
                        </div>
                        <p className="text-[10px] text-emerald-100/85 font-black tracking-wide">পেন্ডিং</p>
                        <p className="text-xl md:text-2xl font-mono font-black text-amber-300 mt-1 drop-shadow-[0_2px_10px_rgba(251,191,36,0.4)]">{pendingOrdersCount}</p>
                      </div>

                      {/* Delivered Card */}
                      <div className="bg-white/10 backdrop-blur-md border border-white/15 hover:border-emerald-300/50 hover:bg-white/15 transition-all duration-300 rounded-2xl p-3 flex flex-col justify-between items-center group/card relative shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:scale-[1.03]">
                        <div className="absolute top-1.5 right-1.5 text-emerald-300 group-hover/card:scale-110 transition-transform drop-shadow-[0_0_4px_rgba(52,211,153,0.3)]">
                          <CheckCircle size={12} />
                        </div>
                        <p className="text-[10px] text-emerald-100/85 font-black tracking-wide">ডেলিভারড</p>
                        <p className="text-xl md:text-2xl font-mono font-black text-emerald-300 mt-1 drop-shadow-[0_2px_10px_rgba(52,211,153,0.4)]">{completedOrdersCount}</p>
                      </div>

                      {/* Cancelled Card */}
                      <div className="bg-white/10 backdrop-blur-md border border-white/15 hover:border-rose-400/50 hover:bg-white/15 transition-all duration-300 rounded-2xl p-3 flex flex-col justify-between items-center group/card relative shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:scale-[1.03]">
                        <div className="absolute top-1.5 right-1.5 text-rose-300 group-hover/card:scale-110 transition-transform drop-shadow-[0_0_4px_rgba(244,63,94,0.3)]">
                          <AlertTriangle size={12} />
                        </div>
                        <p className="text-[10px] text-emerald-100/85 font-black tracking-wide">বাতিল</p>
                        <p className="text-xl md:text-2xl font-mono font-black text-rose-300 mt-1 drop-shadow-[0_2px_10px_rgba(244,63,94,0.4)]">{cancelledOrdersCount}</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}


          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col min-w-0">
              
              {/* Header inside Tab */}
              <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap select-none">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">পণ্য তালিকা ({filteredProductsList.length} টি)</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">স্টোরের সকল সক্রিয় পণ্য যোগ, এডিট বা ডিলিট করুন</p>
                </div>
                
                <div className="flex gap-2 items-center flex-wrap">
                  <button 
                    onClick={openAddProductModal}
                    className="flex items-center gap-1.5 bg-[#2e7d32] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> নতুন পণ্য যোগ
                  </button>
                </div>
              </div>

              {/* Dynamic scrollable table - Desktop view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm font-bold min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[11px] select-none text-left">
                      <th className="p-4 font-bold">পণ্য ছবি</th>
                      <th className="p-4 font-bold">নাম</th>
                      <th className="p-4 font-bold">ক্যাটাগরি</th>
                      <th className="p-4 font-bold">ওজন</th>
                      <th className="p-4 font-bold">মূল্য</th>
                      <th className="p-4 font-bold text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredProductsList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-slate-400 font-bold">কোন পণ্য পাওয়া যায়নি।</td>
                      </tr>
                    ) : (
                      filteredProductsList.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 select-none">
                            <img loading="lazy" src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm" />
                          </td>
                          <td className="p-4">
                            <div className="font-extrabold text-slate-900 leading-snug">{product.name}</div>
                            <div className="flex gap-1.5 mt-1 font-bold flex-wrap">
                              {product.isNew && (
                                <span className="bg-[#e8f5e9] text-[#2e7d32] px-1.5 py-0.5 rounded text-[9px] font-extrabold">নতুন</span>
                              )}
                              {product.isFlashSale && (
                                <span className="bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded text-[9px] font-extrabold">ফ্ল্যাশ সেল</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-slate-500 font-bold">{product.category}</td>
                          <td className="p-4 text-slate-500 font-mono font-bold">{product.weight}</td>
                          <td className="p-4 select-none">
                            {product.discountedPrice ? (
                              <div className="flex flex-col">
                                <span className="text-slate-950 font-black">৳{product.discountedPrice}</span>
                                <span className="text-slate-400 line-through text-[11px] font-bold">৳{product.originalPrice}</span>
                              </div>
                            ) : (
                              <span className="text-slate-950 font-black">৳{product.originalPrice}</span>
                            )}
                          </td>
                          <td className="p-4 text-center select-none">
                            <div className="flex items-center justify-center gap-1.5 font-bold">
                              <button 
                                onClick={() => copyLandingPageLink(product.id)}
                                className="bg-[#1b4332]/10 text-[#1b4332] hover:bg-[#1b4332] hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="ফেসবুক এড ল্যান্ডিং পেজ লিঙ্ক কপি করুন"
                              >
                                <Share2 size={13} />
                              </button>
                              <button 
                                onClick={() => openEditProductModal(product)}
                                className="bg-blue-50 text-blue-600 hover:bg-[#115e5a]/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="সম্পাদনা"
                              >
                                <Edit size={13} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); if(window.confirm('আপনি কি নিশ্চিত?')) deleteProduct(product.id); }}
                                className="text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-100 p-1.5 rounded-lg transition-all cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile responsive view: beautiful stacked list - NO horizontal scroll */}
              <div className="block md:hidden divide-y divide-slate-100">
                {filteredProductsList.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 font-bold">কোন পণ্য পাওয়া যায়নি।</div>
                ) : (
                  filteredProductsList.map((product) => (
                    <div key={product.id} className="p-4 flex flex-col gap-3 hover:bg-slate-50/50 transition-colors">
                      {/* Product identity details */}
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-150 shrink-0 bg-slate-50 shadow-sm">
                          <img loading="lazy" src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{product.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="bg-emerald-50 text-[#2e7d32] px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-100/45">
                              {product.category}
                            </span>
                            <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-100">
                              {product.weight}
                            </span>
                            {product.isNew && (
                              <span className="bg-[#e8f5e9] text-[#2e7d32] px-1.5 py-0.5 rounded text-[9px] font-extrabold">নতুন</span>
                            )}
                            {product.isFlashSale && (
                              <span className="bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded text-[9px] font-extrabold">ফ্ল্যাশ সেল</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pricing and Action buttons wrapper */}
                      <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-dashed border-slate-150">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">বর্তমান মূল্য</span>
                          {product.discountedPrice ? (
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-sm font-black text-slate-950">৳{product.discountedPrice}</span>
                              <span className="text-slate-400 line-through text-[10px] font-bold">৳{product.originalPrice}</span>
                            </div>
                          ) : (
                            <span className="text-sm font-black text-slate-950 mt-0.5">৳{product.originalPrice}</span>
                          )}
                        </div>

                        {/* Fast mobile controls */}
                        <div className="flex items-center gap-1.5 font-bold">
                          <button 
                            onClick={() => copyLandingPageLink(product.id)}
                            className="bg-[#2e7d32]/10 text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1 text-[11px] font-extrabold cursor-pointer"
                            title="ফেসবুক এড ল্যান্ডিং পেজ লিঙ্ক কপি করুন"
                          >
                            <Share2 size={12} /> শেয়ার লিংক
                          </button>
                          
                          <button 
                            onClick={() => openEditProductModal(product)}
                            className="bg-blue-50 text-blue-600 hover:bg-[#2e7d32]/10 p-2 rounded-xl transition-colors cursor-pointer"
                            title="সম্পাদনা"
                          >
                            <Edit size={13} />
                          </button>
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); if(window.confirm('আপনি কি নিশ্চিত?')) deleteProduct(product.id); }}
                            className="text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-100 p-2 rounded-xl transition-all cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: COURIER DASHBOARD */}
          {activeTab === 'courier' && (
            <div className="bg-white md:rounded-2xl border-0 md:border border-slate-100 md:shadow-sm flex flex-col min-w-0 flex-1">
              <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">Steadfast কুরিয়ার প্যানেল</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">অটো বুকিং এবং ডেলিভারি ট্র্যাকিং</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative w-full sm:w-auto">
                    <input 
                      type="text" 
                      placeholder="ট্র্যাকিং কোড বা নাম খুঁজুন..." 
                      value={courierSearch}
                      onChange={(e) => setCourierSearch(e.target.value)}
                      className="w-full sm:w-56 pl-9 pr-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32]" 
                    />
                    <Search size={14} className="absolute left-3 top-3 sm:top-2.5 text-slate-400" />
                  </div>
                  
                  <button
                    onClick={handleSyncCourier}
                    disabled={isSyncing}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer w-full sm:w-auto disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} /> আপডেট
                  </button>
                  <button
                    onClick={() => setIsCourierBookingOpen(true)}
                    className="bg-[#2e7d32] text-white px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer w-full sm:w-auto"
                  >
                    <Plus size={14} /> নতুন বুকিং
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-slate-50/50 p-2 md:p-4">
                {/* Real-time Courier Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4 select-none">
                  <div className="bg-white border border-slate-100 rounded-2xl p-3 md:p-4 shadow-sm flex flex-col justify-between">
                    <span className="text-[9px] md:text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">মোট বুকিং (Total Booked)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-base md:text-xl font-black text-slate-900">{courierHistory.length}</span>
                      <span className="text-[10px] md:text-xs text-slate-400 font-bold">টি পার্সেল</span>
                    </div>
                  </div>
                  <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-3 md:p-4 shadow-sm flex flex-col justify-between">
                    <span className="text-[9px] md:text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider">ডেলিভারি সম্পন্ন (Delivered)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-base md:text-xl font-black text-emerald-800">{courierHistory.filter(c => c && c.status === 'delivered').length}</span>
                      <span className="text-[10px] md:text-xs text-emerald-600 font-bold">টি পার্সেল</span>
                    </div>
                  </div>
                  <div className="bg-amber-50/30 border border-amber-100 rounded-2xl p-3 md:p-4 shadow-sm flex flex-col justify-between">
                    <span className="text-[9px] md:text-[10px] text-amber-700 font-extrabold uppercase tracking-wider">চলমান/পেন্ডিং (Pending)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-base md:text-xl font-black text-amber-900">{courierHistory.filter(c => c && c.status !== 'delivered').length}</span>
                      <span className="text-[10px] md:text-xs text-amber-700 font-bold">টি পার্সেল</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {courierHistory.filter(c => c && (String(c.tracking_code || "").toLowerCase().includes(String(courierSearch || "").toLowerCase()) || String(c.customer_name || "").toLowerCase().includes(String(courierSearch || "").toLowerCase()))).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Truck size={32} className="text-slate-300 mb-3" />
                      <p className="text-sm font-bold text-slate-400">কোনো পার্সেল পাওয়া যায়নি</p>
                    </div>
                  ) : (
                    courierHistory.filter(c => c && (String(c.tracking_code || "").toLowerCase().includes(String(courierSearch || "").toLowerCase()) || String(c.customer_name || "").toLowerCase().includes(String(courierSearch || "").toLowerCase()))).map((delivery, i) => (
                      <div key={i} className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3.5 group relative overflow-hidden hover:-translate-y-0.5">
                        <div className="flex justify-between items-start gap-2.5">
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-black text-slate-800 truncate">{delivery.customer_name}</span>
                              {delivery.delivery_type === 'point' ? (
                                <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase">Point</span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase">Home</span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono font-bold mt-0.5">{delivery.customer_phone}</span>
                            
                            {/* Address details on the card */}
                            {(delivery.recipient_address || (delivery as any).customer_address || (delivery as any).address) && (
                              <div className="flex items-start gap-1 text-[11px] text-slate-600 mt-2 bg-white/80 p-2 rounded-xl border border-slate-100 shadow-xs max-w-md">
                                <MapPin size={12} className="text-slate-400 mt-0.5 shrink-0" />
                                <span className="leading-relaxed line-clamp-2">{delivery.recipient_address || (delivery as any).customer_address || (delivery as any).address}</span>
                              </div>
                            )}

                            <span className="text-[10px] font-bold text-slate-400 mt-1.5 block">{new Date(delivery.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          
                          <div className="text-right flex flex-col items-end shrink-0">
                            <span className="text-sm md:text-base font-black text-[#2e7d32]">৳{delivery.amount}</span>
                            {delivery.status === 'delivered' && (delivery.delivery_charge !== undefined || delivery.cod_charge !== undefined) && (
                              <div className="text-[10px] text-slate-500 font-bold mt-1 text-right max-w-[180px] leading-tight">
                                {delivery.delivery_charge !== undefined ? `ডেলিভারি: -৳${delivery.delivery_charge}` : ''}
                                {delivery.cod_charge !== undefined ? ` | কন্ডিশন: -৳${delivery.cod_charge}` : ''}
                                <div className="text-emerald-700 font-black mt-0.5">
                                  আয়: ৳{Math.max(0, Number(delivery.amount || 0) - Number(delivery.delivery_charge || 0) - Number(delivery.cod_charge || 0))}
                                </div>
                              </div>
                            )}
                            <div className="mt-1">
                              {delivery.status === 'delivered' ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100/50">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Delivered
                                </span>
                              ) : delivery.status === 'in_transit' ? (
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border border-amber-100/50">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> In Transit
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border border-slate-200">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                          <div 
                            className="bg-blue-50/50 hover:bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-mono font-black border border-blue-100 cursor-pointer flex items-center justify-between sm:justify-start gap-1.5 transition-colors group/track w-full sm:w-auto"
                            onClick={() => {
                              setCourierSearch(delivery.tracking_code);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            title="ক্লিক করে সার্চ বক্সে কপি করুন"
                          >
                            <span className="flex items-center gap-1.5">
                              <Search size={12} className="text-blue-400 group-hover/track:text-blue-600" /> {delivery.tracking_code}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button 
                              onClick={() => {
                                window.open(`/print-sticker?id=${delivery.consignment_id}&name=${encodeURIComponent(delivery.customer_name)}&phone=${encodeURIComponent(delivery.customer_phone)}&address=${encodeURIComponent(delivery.recipient_address || (delivery as any).customer_address || (delivery as any).address || '')}&amount=${delivery.amount}`, '_blank');
                              }}
                              className="px-2.5 py-1.5 text-xs font-black text-emerald-700 bg-emerald-50 hover:text-white hover:bg-[#2e7d32] border border-emerald-100 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                              title="স্টিকার প্রিন্ট করুন"
                            >
                              <Printer size={13} /> প্রিন্ট
                            </button>

                            <a 
                              href={delivery.tracking_link || 'https://steadfast.com.bd/tracking'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 text-xs font-black text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                              title="ট্র্যাক করুন"
                            >
                              <ExternalLink size={13} /> ট্র্যাক
                            </a>

                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm('আপনি কি নিশ্চিত যে এই কুরিয়ার বুকিংটি ডিলিট করতে চান?')) {
                                  try {
                                    await deleteDoc(doc(courierHistoryCollection, delivery.consignment_id.toString()));
                                    addNotification('বুকিং ডিলিট', `কুরিয়ার বুকিং ${delivery.tracking_code} সফলভাবে মুছে ফেলা হয়েছে।`);
                                  } catch (err: any) {
                                    alert('মুছে ফেলতে সমস্যা হয়েছে: ' + err.message);
                                  }
                                }
                              }}
                              className="px-2.5 py-1.5 text-xs font-black text-rose-500 bg-rose-50/50 hover:text-white hover:bg-rose-600 border border-rose-100 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                              title="বুকিং ডিলিট করুন"
                            >
                              <Trash2 size={13} /> ডিলিট
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: INVENTORY CONTROL */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col min-w-0">
              <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">ওয়্যারহাউস ম্যানেজমেন্ট</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">নতুন পণ্য যুক্ত করুন এবং মূল্য ও স্টক সমন্বয় করুন।</p>
                </div>
                <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap w-full sm:w-auto">
                  <button onClick={() => {
                    setProductFormData({
                      name: '',
                      originalPrice: '',
                      discountedPrice: '',
                      category: 'জুতো',
                      weight: '১ জোড়া',
                      image: '',
                      isNew: true,
                      isFlashSale: false,
                      description: '',
                      article: '',
                      stock: '0',
                      isHidden: false,
                      piecesPerBox: '24'
                    });
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#115e5a] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#0d4c49] transition-colors cursor-pointer">
                    <Plus size={14} /> নতুন পণ্য যোগ করুন
                  </button>
                  <button onClick={() => {
                    setSelectedStockProduct(products[0] || null);
                    setAddBoxes('1');
                    setAddPairs('0');
                    setIsStockAdjustmentModalOpen(true);
                  }} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#2e7d32] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors cursor-pointer">
                    <SlidersHorizontal size={14} /> স্টক সমন্বয়
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {/* কুইক পণ্য ও মূল্য সংযোজন (Quick Product & Price Entry) */}
                <div className="border border-slate-100 rounded-2xl p-4 md:p-5 bg-slate-50/50 mb-6 font-bold text-xs select-none shadow-inner">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Plus size={16} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">আর্টিকেল অনুযায়ী নতুন পণ্য ও মূল্য যুক্ত করুন</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">নতুন পণ্য বা আর্টিকেল সরাসরি ইনভেন্টরিতে এন্ট্রি করুন এবং মূল্য নির্ধারণ করুন।</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider">আর্টিকেল নম্বর <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="যেমন: ART-102"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#2e7d32] text-xs font-bold text-slate-800 font-sans"
                        value={quickArticle}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuickArticle(val);
                          const existing = products.find(p => p.article === val.trim());
                          if (existing) {
                            const perPairPrice = Math.round(existing.originalPrice / ((existing as any).piecesPerBox || 24));
                            setQuickPrice(perPairPrice.toString());
                            setQuickName(existing.name);
                            if (existing.image) {
                              setQuickImage(existing.image);
                            }
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider">পণ্যের নাম (ঐচ্ছিক)</label>
                      <input
                        type="text"
                        placeholder="যেমন: জেন্টস স্লিপার"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#2e7d32] text-xs font-bold text-slate-800"
                        value={quickName}
                        onChange={(e) => setQuickName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider">মূল্য (৳) <span className="text-rose-500">*</span></label>
                      <input
                        type="number"
                        placeholder="যেমন: ৮৫০"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#2e7d32] text-xs font-bold text-slate-800"
                        value={quickPrice}
                        onChange={(e) => setQuickPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider">প্রাথমিক স্টক (জোড়া)</label>
                      <input
                        type="number"
                        placeholder="যেমন: ২৪"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#2e7d32] text-xs font-bold text-slate-800"
                        value={quickStockBoxes}
                        onChange={(e) => setQuickStockBoxes(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleQuickAddProduct}
                        className="w-full bg-[#2e7d32] hover:bg-emerald-700 text-white py-2 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-[#2e7d32]/10 h-[38px]"
                      >
                        <Plus size={14} /> ইনভেন্টরিতে যুক্ত করুন
                      </button>
                    </div>
                  </div>

                  {/* Photo addition option */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider">পণ্যের ছবি (URL বা আপলোড)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="যেমন: https://images.unsplash.com/..."
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#2e7d32] text-xs font-normal font-sans text-slate-800"
                          value={quickImage}
                          onChange={(e) => setQuickImage(e.target.value)}
                        />
                        <label className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-[10px] font-bold shrink-0 select-none">
                          <Upload size={12} />
                          আপলোড
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, (url) => {
                                  setQuickImage(url);
                                });
                              }
                            }}
                          />
                        </label>
                      </div>
                      {quickImage && quickImage.startsWith('data:image/') && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md overflow-hidden border border-slate-150 bg-slate-50 relative shrink-0">
                            <img src={quickImage} alt="Uploaded" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[9px] text-emerald-600 font-bold font-sans">✓ আপলোড সফল (Max 2MB)</span>
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider">অথবা দ্রুত ছবি সিলেক্ট করুন</label>
                      <div className="flex gap-2 flex-wrap items-center">
                        {[
                          { name: 'কালো স্যান্ডাল', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
                          { name: 'স্লিপার', url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400' },
                          { name: 'লোফার', url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400' },
                          { name: 'মহিলা জুতো', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
                        ].map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setQuickImage(preset.url)}
                            className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              quickImage === preset.url
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-200 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <div className="w-5 h-5 rounded overflow-hidden border border-slate-100 shrink-0 bg-slate-100">
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            {preset.name}
                          </button>
                        ))}
                        {quickImage && (
                          <button
                            type="button"
                            onClick={() => setQuickImage('')}
                            className="text-rose-500 hover:text-rose-700 text-[10px] font-bold px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                          >
                            ছবি মুছুন
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 shadow-sm relative overflow-hidden mt-6">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-[#2e7d32] flex items-center justify-center text-white shadow-md shadow-emerald-200">
                        <Building size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 tracking-tight">ওয়ারহাউস স্টক ব্যালেন্স</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">লাইভ ইনভেন্টরি মনিটরিং</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Table view (Hidden on mobile) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[11px] select-none text-left">
                          <th className="p-4 font-bold text-center w-16">সিরিয়াল</th>
                          <th className="p-4 font-bold">পণ্য</th>
                          <th className="p-4 font-bold">বক্স/জোড়া</th>
                          <th className="p-4 font-bold">মূল্য</th>
                          <th className="p-4 font-bold text-right w-36">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {products.map((product, index) => {
                          const totalStock = product.stock || 0;
                          const boxes = Math.floor(totalStock / 24);
                          const pairs = totalStock % 24;
                          let stockText = '';
                          if (boxes > 0) stockText += `${boxes} বক্স `;
                          if (pairs > 0) stockText += `${pairs} জোড়া`;
                          if (totalStock === 0) stockText = 'স্টক নেই';

                          return (
                            <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 text-center text-slate-500 font-mono">{index + 1}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-150 shrink-0 bg-slate-50 shadow-sm relative group cursor-pointer" onClick={() => {
                                      const newUrl = window.prompt('পণ্যের নতুন ছবির URL দিন:', product.image);
                                      if (newUrl) updateProduct({ ...product, image: newUrl });
                                  }} title="ছবি পরিবর্তন করতে ক্লিক করুন">
                                    {product.image ? (
                                      <img loading="lazy" src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                        <Package size={18} />
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                                      <Camera size={14} className="text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-extrabold text-slate-900">{product.article || `PRD-${product.id}`}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">{product.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl text-xs font-black whitespace-nowrap">
                                  {stockText}
                                </span>
                              </td>
                              <td className="p-4 font-black text-slate-900">৳{product.discountedPrice || product.originalPrice}</td>
                              <td className="p-4">
                                <div className="flex items-center justify-end gap-1.5 font-bold">
                                  <button
                                    onClick={() => {
                                      const newUrl = window.prompt('পণ্যের নতুন ছবির URL দিন:', product.image);
                                      if (newUrl) updateProduct({ ...product, image: newUrl });
                                    }}
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2 rounded-lg transition-colors cursor-pointer"
                                    title="ছবি যোগ/পরিবর্তন"
                                  >
                                    <Camera size={14} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedStockProduct(product);
                                      setAddBoxes('1');
                                      setAddPairs('0');
                                      setIsStockAdjustmentModalOpen(true);
                                    }}
                                    className="bg-emerald-50 hover:bg-[#2e7d32] text-emerald-700 hover:text-white p-2 rounded-lg transition-colors cursor-pointer shadow-sm hover:shadow"
                                    title="স্টক সমন্বয়"
                                  >
                                    <SlidersHorizontal size={14} />
                                  </button>
                                  <button 
                                    onClick={() => openEditProductModal(product)}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors cursor-pointer"
                                    title="সম্পাদনা"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if(window.confirm('আপনি কি এই পণ্যটি মুছে ফেলতে চান?')) {
                                        deleteProduct(product.id);
                                      }
                                    }}
                                    className="bg-rose-50 text-rose-600 p-2 rounded-lg hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                                    title="মুছে ফেলুন"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Grid view (No horizontal scrolling!) */}
                  <div className="block md:hidden space-y-3">
                    {products.map((product, index) => {
                      const totalStock = product.stock || 0;
                      const boxes = Math.floor(totalStock / 24);
                      const pairs = totalStock % 24;
                      let stockText = '';
                      if (boxes > 0) stockText += `${boxes} বক্স `;
                      if (pairs > 0) stockText += `${pairs} জোড়া`;
                      if (totalStock === 0) stockText = 'স্টক নেই';

                      return (
                        <div key={product.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/30 hover:bg-slate-50/60 transition-all flex flex-col gap-3">
                          <div className="flex justify-between items-start gap-3">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-150 shrink-0 bg-slate-50 shadow-sm relative group" onClick={() => {
                                const newUrl = window.prompt('পণ্যের নতুন ছবির URL দিন:', product.image);
                                if (newUrl) updateProduct({ ...product, image: newUrl });
                            }}>
                              {product.image ? (
                                <img loading="lazy" src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                  <Package size={24} />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                                <Camera size={16} className="text-white" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">#{(index + 1).toString().padStart(2, '0')}</span>
                                <span className="font-extrabold text-slate-900 text-xs tracking-wider">{product.article || `PRD-${product.id}`}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium truncate">{product.name}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">মূল্য</span>
                              <span className="font-black text-slate-900 text-xs">৳{product.discountedPrice || product.originalPrice}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2.5 border-t border-slate-100/80">
                            <div>
                              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider mb-1">স্টক ব্যালেন্স</span>
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-xl text-xs font-black">
                                {stockText}
                              </span>
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedStockProduct(product);
                                  setAddBoxes('1');
                                  setAddPairs('0');
                                  setIsStockAdjustmentModalOpen(true);
                                }}
                                className="bg-emerald-50 hover:bg-[#2e7d32] text-emerald-700 hover:text-white px-2.5 py-2 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-sm"
                                title="স্টক সমন্বয়"
                              >
                                <SlidersHorizontal size={14} />
                              </button>
                              <button 
                                onClick={() => openEditProductModal(product)}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-2 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-sm"
                                title="সম্পাদনা"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={() => {
                                  if(window.confirm('আপনি কি এই পণ্যটি মুছে ফেলতে চান?')) {
                                    deleteProduct(product.id);
                                  }
                                }}
                                className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-2.5 py-2 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-sm"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRODUCT RECEIVING */}
          {activeTab === 'receiving' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col min-w-0">
              <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap select-none">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">পণ্য রিসিভিং (স্টক ম্যানেজমেন্ট)</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">নতুন স্টক রিসিভ করুন এবং ইনভেন্টরি আপডেট করুন</p>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                  <button
                    onClick={() => setIsBoxReceiveModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={14} /> বক্স রিসিভ
                  </button>
                  <button
                    onClick={() => setIsCustomReceiveModalOpen(true)}
                    className="bg-[#2e7d32] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={14} /> কাস্টম রিসিভ
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-5">
                {filteredProductsList.length === 0 ? (
                  <div className="text-center py-10">
                    <Package size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-bold text-slate-400">কোনো পণ্য পাওয়া যায়নি</p>
                  </div>
                ) : (
                  <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[11px] select-none text-left">
                          <th className="p-4 font-bold text-center">সিরিয়াল</th>
                          <th className="p-4 font-bold">আর্টিকেল</th>
                          <th className="p-4 font-bold">বর্তমান স্টক</th>
                          <th className="p-4 font-bold">নতুন রিসিভ (জোড়া)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredProductsList.map((product, index) => {
                          const totalStock = product.stock || 0;
                          const boxes = Math.floor(totalStock / 24);
                          const pairs = totalStock % 24;
                          let stockText = '';
                          if (boxes > 0) stockText += `${boxes} বক্স `;
                          if (pairs > 0) stockText += `${pairs} জোড়া`;
                          if (totalStock === 0) stockText = 'স্টক নেই';

                          return (
                            <tr key={'rec-'+product.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 text-center text-slate-500 font-mono">{index + 1}</td>
                              <td className="p-4">
                                <div className="font-extrabold text-slate-900">{product.article || `PRD-${product.id}`}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{product.name}</div>
                              </td>
                              <td className="p-4">
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                                  {stockText}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="number" 
                                    placeholder="পরিমাণ (জোড়া)" 
                                    className="w-24 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#2e7d32]"
                                    value={receiveQtys[product.id] || ''}
                                    onChange={(e) => setReceiveQtys(prev => ({ ...prev, [product.id]: e.target.value }))}
                                    min="1"
                                  />
                                  <button 
                                    onClick={() => {
                                      const qty = parseInt(receiveQtys[product.id] || '0');
                                      if (!isNaN(qty) && qty > 0) {
                                        updateProduct({ ...product, stock: (product.stock || 0) + qty });
                                        setReceiveQtys(prev => ({ ...prev, [product.id]: '' }));
                                        alert('স্টক আপডেট সফল হয়েছে! নতুন স্টক: ' + ((product.stock || 0) + qty) + ' জোড়া');
                                      } else {
                                        alert('সঠিক পরিমাণ দিন।');
                                      }
                                    }}
                                    className="bg-[#2e7d32] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                                  >
                                    রিসিভ
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if(window.confirm('আপনি কি এই পণ্যটি স্টক থেকে মুছে ফেলতে চান?')) {
                                        deleteProduct(product.id);
                                      }
                                    }}
                                    className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-600 hover:text-white transition-colors"
                                    title="স্টক থেকে ডিলিট করুন"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Mobile responsive view: stacked cards */}
                  <div className="block md:hidden divide-y divide-slate-100">
                    {filteredProductsList.map((product, index) => {
                      const totalStock = product.stock || 0;
                      const boxes = Math.floor(totalStock / 24);
                      const pairs = totalStock % 24;
                      let stockText = '';
                      if (boxes > 0) stockText += `${boxes} বক্স `;
                      if (pairs > 0) stockText += `${pairs} জোড়া`;
                      if (totalStock === 0) stockText = 'স্টক নেই';

                      return (
                        <div key={'rec-mob-'+product.id} className="p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-extrabold text-slate-900">{product.article || `PRD-${product.id}`}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{product.name}</div>
                            </div>
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                              {stockText}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="number"
                              placeholder="পরিমাণ (জোড়া)"
                              className="flex-1 min-w-0 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#2e7d32]"
                              value={receiveQtys[product.id] || ''}
                              onChange={(e) => setReceiveQtys(prev => ({ ...prev, [product.id]: e.target.value }))}
                              min="1"
                            />
                            <button 
                              onClick={() => {
                                const qty = parseInt(receiveQtys[product.id] || '0');
                                if (!isNaN(qty) && qty > 0) {
                                  updateProduct({ ...product, stock: (product.stock || 0) + qty });
                                  setReceiveQtys(prev => ({ ...prev, [product.id]: '' }));
                                  alert('স্টক আপডেট সফল হয়েছে! নতুন স্টক: ' + ((product.stock || 0) + qty) + ' জোড়া');
                                } else {
                                  alert('সঠিক পরিমাণ দিন।');
                                }
                              }}
                              className="bg-[#2e7d32] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors whitespace-nowrap"
                            >
                              রিসিভ
                            </button>
                            <button 
                              onClick={() => {
                                if(window.confirm('আপনি কি এই পণ্যটি স্টক থেকে মুছে ফেলতে চান?')) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="bg-rose-50 text-rose-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-rose-600 hover:text-white transition-colors flex items-center justify-center"
                              title="স্টক থেকে ডিলিট করুন"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS TRACKING */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col min-w-0">
              
              {/* Header inside Tab */}
              <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">
                    {lang === 'bn' ? 'অর্ডার সমূহ' : 'Orders List'} ({filteredOrdersList.length} {lang === 'bn' ? 'টি' : 'orders'})
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">
                    {lang === 'bn' ? 'স্টোরের সকল সক্রিয় ক্যাশ অন ডেলিভারি অর্ডার ট্র্যাক এবং বুকিং' : 'Track and book active cash on delivery store orders'}
                  </p>
                </div>
                
                <div className="flex flex-col lg:flex-row flex-wrap items-stretch lg:items-center gap-2.5 w-full lg:w-auto">
                  <input 
                    type="date"
                    value={orderFilterDate}
                    onChange={(e) => setOrderFilterDate(e.target.value)}
                    className="w-full lg:w-auto px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-[#115e5a] cursor-pointer"
                  />
                  {/* Search bar inside block */}
                  <div className="relative w-full lg:w-auto">
                    <input 
                      type="text" 
                      placeholder={lang === 'bn' ? "নাম বা মোবাইল নম্বর খুঁজুন..." : "Search name or phone..."} 
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full lg:w-56 pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-[#115e5a] font-bold" 
                    />
                    <Search size={14} className="absolute left-2.5 top-3 text-slate-400" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <button 
                      onClick={() => {
                        setManualOrderCustomerName('');
                        setManualOrderPhone('');
                        setManualOrderAddress('');
                        setManualOrderItems([]);
                        setManualSelectedProductId('');
                            setManualSelectedPrice('');
                        setManualArticleSearch('');
                        setManualSelectedQuantity(1);
                        setIsManualOrderModalOpen(true);
                      }}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-amber-500 text-white px-3 py-2 rounded-xl text-xs font-black hover:bg-amber-600 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
                    >
                      <PlusCircle size={14} /> {lang === 'bn' ? 'ম্যানুয়াল অর্ডার তৈরি' : 'Create Manual Order'}
                    </button>

                    <button 
                      onClick={handleDownloadPDF}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-black hover:bg-blue-700 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
                    >
                      <Download size={14} /> {lang === 'bn' ? 'ডাউনলোড (PDF/প্রিন্ট)' : 'Download (PDF)'}
                    </button>

                    <button 
                      onClick={() => {
                        const printDate = orderFilterDate || new Date().toISOString().split('T')[0];
                        window.open(`/print-sticker?date=${printDate}`, '_blank');
                      }}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-[#1b4332] text-white px-3 py-2 rounded-xl text-xs font-black hover:bg-[#112d22] shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
                    >
                      <Printer size={14} /> {lang === 'bn' ? `কুরিয়ার স্টিকার প্রিন্ট (${orderFilterDate || 'আজ'})` : `Print Stickers (${orderFilterDate || 'Today'})`}
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop view: wide table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm font-bold min-w-[850px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider select-none text-left">
                      <th className="p-4 font-extrabold">অর্ডার আইডি</th>
                      <th className="p-4 font-extrabold">গ্রাহকের বিবরণ</th>
                      <th className="p-4 font-extrabold">ডেলিভারি ঠিকানা</th>
                      <th className="p-4 font-extrabold">ক্রয়কৃত আইটেম</th>
                      <th className="p-4 font-extrabold">মূল্য</th>
                      <th className="p-4 font-extrabold text-center font-sans uppercase">স্ট্যাটাস</th>
                      <th className="p-4 font-extrabold text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredOrdersList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-400 font-bold">কোন সক্রিয় অর্ডার খুঁজে পাওয়া যায়নি।</td>
                      </tr>
                    ) : (
                      filteredOrdersList.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 text-slate-500 font-mono text-xs">#{order.id}</td>
                          <td className="p-4">
                            <div className="font-extrabold text-slate-900 leading-none text-xs">{order.customerName}</div>
                            <div className="text-[10px] text-slate-400 font-normal tracking-wide mt-1.5">{order.phone}</div>
                          </td>
                          <td className="p-4">
                            <p className="truncate max-w-[150px] text-slate-500 font-normal text-xs" title={order.address}>{order.address}</p>
                          </td>
                          <td className="p-4">
                            <p className="line-clamp-2 max-w-[200px] text-slate-600 font-medium text-xs">
                              {(order.items || []).map(it => `${it.name} (${it.quantity}x)`).join(', ')}
                            </p>
                          </td>
                          <td className="p-4 font-black text-slate-900 text-xs">৳{order.total}</td>
                          <td className="p-4 text-center select-none">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                              order.status === 'Confirmed' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                              order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                              'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {order.status === 'Completed' ? 'ডেলিভারি সম্পন্ন' : order.status === 'Cancelled' ? 'বাতিল' : order.status === 'Shipped' ? 'ডেলিভারি পার্টনারের কাছে হস্তান্তরিত' : order.status === 'Confirmed' ? 'পণ্য প্রস্তুত করা হচ্ছে' : 'পেন্ডিং'}
                            </span>
                          </td>
                          <td className="p-4 text-center select-none">
                            <div className="flex items-center justify-center gap-1.5 font-bold">
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-[10px] font-extrabold transition-colors border border-blue-100"
                              >
                                বিবরণ
                              </button>
                              
                              {order.status !== 'Completed' && (
                                courierHistory.some(c => c.invoice === order.id) ? (
                                  <button 
                                    onClick={() => {
                                      const bookingItem = courierHistory.find(c => c.invoice === order.id);
                                      const consignmentId = bookingItem?.consignment_id || bookingItem?.tracking_code || '';
                                      window.open(`/print-invoice?consignmentId=${consignmentId}&orderId=${encodeURIComponent(order.id)}&name=${encodeURIComponent(order.customerName)}&phone=${encodeURIComponent(order.phone)}&amount=${order.total}`, "_blank");
                                    }}
                                    className="text-white hover:bg-emerald-700 bg-emerald-600 px-2.5 py-1 rounded text-[10px] font-black flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                                    title="প্রিন্ট ইনভয়েস"
                                  >
                                    <Download size={10} /> প্রিন্ট
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => setBookingOrder(order)}
                                    className="text-white hover:bg-emerald-800 bg-[#1b4332] px-2 py-1 rounded text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                                    title="কুরিয়ার বুকিং করুন"
                                  >
                                    <Truck size={10} /> বুকিং
                                  </button>
                                )
                              )}

                              <select 
                                value={order.status}
                                onChange={(e) => {
                                const newStatus = e.target.value;
                                updateOrderStatus(order.id, newStatus as any);
                                if (newStatus === 'Completed') {
                                    const txExists = transactions.some(t => t.note && t.note.includes(`ID: ${order.id}`));
                                    if (!txExists && order.total > 0) {
                                        const newTx = {
                                            id: `t-del-man-${Date.now()}`,
                                            type: 'income' as 'income' | 'expense',
                                            category: 'পণ্য বিক্রি',
                                            amount: order.total,
                                            date: new Date().toISOString(),
                                            note: `অর্ডার ডেলিভারি সম্পন্ন (ID: ${order.id}) - ${order.customerName}`
                                        };
                                        setTransactions(prev => [newTx, ...prev]);
                                        addNotification('আয় আপডেট 💰', 'ডেলিভারি সম্পন্ন হওয়া অর্ডারের টাকা আয় অপশনে যুক্ত হয়েছে!');
                                    }
                                }
                            }}
                                className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-1.5 py-1 text-[10px] cursor-pointer font-bold focus:outline-none"
                              >
                                <option value="Pending">পেন্ডিং (অর্ডার সফল হয়েছে)</option>
                                <option value="Confirmed">পণ্য প্রস্তুত করা হচ্ছে</option>
                                <option value="Shipped">ডেলিভারি পার্টনারের কাছে হস্তান্তরিত</option>
                                <option value="Completed">ডেলিভারি সম্পন্ন</option>
                                <option value="Cancelled">বাতিল</option>
                              </select>
                              
                              <button 
                                onClick={(e) => { e.stopPropagation(); if(window.confirm('আপনি কি নিশ্চিত?')) deleteOrder(order.id); }}
                                className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-1 rounded cursor-pointer"
                                title="অর্ডার ডিলিট"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile responsive view: beautiful stacked card list - NO horizontal scroll, pristine margins */}
              <div className="block md:hidden divide-y divide-slate-100">
                {filteredOrdersList.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 font-bold">কোন সক্রিয় অর্ডার খুঁজে পাওয়া যায়নি।</div>
                ) : (
                  filteredOrdersList.map((order) => (
                    <div key={order.id} className="p-4 flex flex-col gap-3 hover:bg-slate-50/50 transition-colors">
                      {/* Card Header: Order ID & Status with compact typography */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono tracking-wider font-extrabold">#{order.id}</span>
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                              order.status === 'Confirmed' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                          order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {order.status === 'Completed' ? 'ডেলিভারি সম্পন্ন' : order.status === 'Cancelled' ? 'বাতিল' : order.status === 'Shipped' ? 'ডেলিভারি পার্টনারের কাছে হস্তান্তরিত' : order.status === 'Confirmed' ? 'পণ্য প্রস্তুত করা হচ্ছে' : 'পেন্ডিং'}
                        </span>
                      </div>

                      {/* Customer contact details */}
                      <div>
                        <div className="font-extrabold text-[#115e5a] text-sm leading-snug">{order.customerName}</div>
                        <div className="text-[10px] text-slate-400 font-extrabold mt-0.5">{order.phone}</div>
                      </div>

                      {/* Delivery Address */}
                      <div className="text-[11px] text-slate-600 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100 font-semibold leading-relaxed">
                        <span className="text-[9px] text-slate-400 block font-bold mb-0.5 uppercase tracking-wider">ডেলিভারি ঠিকানা:</span>
                        {order.address}
                      </div>

                      {/* Ordered Items summary block */}
                      <div className="bg-emerald-50/20 rounded-xl p-3 border border-emerald-100/30">
                        <span className="text-[9px] text-emerald-800 uppercase tracking-widest block font-extrabold mb-1">অর্ডারকৃত পণ্যসমূহ</span>
                        <p className="text-xs text-slate-700 font-bold leading-relaxed">
                          {(order.items || []).map(it => `${it.name} (${it.quantity}x)`).join(', ')}
                        </p>
                      </div>

                      {/* Total bill and Actions wrapper - Clean Alignment */}
                      <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-dashed border-slate-200">
                        <div className="flex flex-col shrink-0 pr-2">
                          <span className="text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">মোট বিল</span>
                          <span className="text-xs font-black text-slate-900 whitespace-nowrap">৳{order.total}</span>
                        </div>

                        {/* Interactive mobile actions */}
                        <div className="flex items-center gap-1.5 font-bold overflow-x-auto no-scrollbar justify-end w-full pb-1">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded text-[10px] font-extrabold transition-colors border border-blue-100 shrink-0"
                          >
                            বিবরণ
                          </button>
                          {order.status !== 'Completed' && (
                            courierHistory.some(c => c.invoice === order.id) ? (
                              <button 
                                onClick={() => {
                                  const bookingItem = courierHistory.find(c => c.invoice === order.id);
                                  const consignmentId = bookingItem?.consignment_id || bookingItem?.tracking_code || '';
                                  window.open(`/print-invoice?consignmentId=${consignmentId}&orderId=${encodeURIComponent(order.id)}&name=${encodeURIComponent(order.customerName)}&phone=${encodeURIComponent(order.phone)}&amount=${order.total}`, '_blank');
                                }}
                                className="text-white hover:bg-emerald-700 bg-emerald-600 px-2 py-1 rounded text-[10px] font-black flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                                title="প্রিন্ট ইনভয়েস"
                              >
                                <Download size={10} /> প্রিন্ট
                              </button>
                            ) : (
                              <button 
                                onClick={() => setBookingOrder(order)}
                                className="bg-[#1b4332] text-white hover:bg-emerald-800 px-2 py-1 rounded text-[10px] font-extrabold flex items-center gap-1 transition-colors shadow-sm cursor-pointer shrink-0"
                              >
                                <Truck size={10} /> বুকিং
                              </button>
                            )
                          )}
                          <select 
                            value={order.status}
                            onChange={(e) => {
                                const newStatus = e.target.value;
                                updateOrderStatus(order.id, newStatus as any);
                                
                            }}
                            className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-1.5 py-1 text-[10px] cursor-pointer font-bold focus:outline-none max-w-[100px] sm:max-w-[150px] truncate shrink" 
                          >
                            <option value="Pending">পেন্ডিং (অর্ডার সফল হয়েছে)</option>
                            <option value="Confirmed">পণ্য প্রস্তুত করা হচ্ছে</option>
                            <option value="Shipped">ডেলিভারি পার্টনারের কাছে হস্তান্তরিত</option>
                            <option value="Completed">ডেলিভারি সম্পন্ন</option>
                            <option value="Cancelled">বাতিল</option>
                          </select>

                          <button 
                            onClick={(e) => { e.stopPropagation(); if(window.confirm('আপনি কি নিশ্চিত?')) deleteOrder(order.id); }}
                            className="text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-100 p-1.5 rounded transition-all cursor-pointer shrink-0"
                            title="অর্ডার ডিলিট"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}


          {/* TAB 4: CUSTOMERS DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              {/* Dynamic Responsive Stats Grid for Customer Database */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'মোট নিবন্ধিত গ্রাহক', value: `${totalCustomersCount} জন`, countDesc: 'অনন্য কাস্টমার ফোন নম্বর', icBg: 'bg-emerald-50 text-emerald-500' },
                  { label: 'মোট সম্পন্ন বিক্রয়', value: `৳${customersList.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString('bn-BD')}`, countDesc: 'সফলভাবে ডেলিভারি করা অর্ডার', icBg: 'bg-indigo-50 text-indigo-500' },
                  { label: 'গ্রাহক প্রতি গড় ক্রয় মূল্য', value: `৳${totalCustomersCount > 0 ? Math.round(customersList.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomersCount).toLocaleString('bn-BD') : '০'}`, countDesc: 'অনন্য গ্রাহক প্রতি গড় শপিং', icBg: 'bg-purple-50 text-purple-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider truncate mr-1">{stat.label}</span>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${stat.icBg}`}>
                        <Users size={15} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight leading-none truncate">{stat.value}</h3>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32] inline-block animate-pulse"></span>
                        {stat.countDesc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col min-w-0">
                <div className="p-4 md:p-5 border-b border-gray-100 bg-white select-none">
                  <h3 className="font-extrabold text-base text-slate-800">গ্রাহক প্রোফাইল ডাটাবেজ সেন্টার ({totalCustomersCount} জন)</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">এম.কে.গ্রুপ স্টোরে কেনাকাটা করা গ্রাহকের ঠিকানা ও মোট বেচা-বিক্রির রেকর্ড</p>
                </div>

                {/* Desktop view: wide table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs md:text-sm font-bold min-w-[650px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[11px] text-left select-none">
                        <th className="p-4 font-bold">গ্রাহক নাম</th>
                        <th className="p-4 font-bold">মোবাইল</th>
                        <th className="p-4 font-bold">ঠিকানা</th>
                        <th className="p-4 font-bold text-center">অর্ডার সংখ্যা</th>
                        <th className="p-4 font-bold">মোট ক্রয় মূল্য (৳)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {customersList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-slate-400 font-bold">কোন কাস্টমার প্রোফাইল পাওয়া যায়নি।</td>
                        </tr>
                      ) : (
                        customersList.map((customer, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedCustomerHistory({ phone: customer.phone, name: customer.name })}>
                            <td className="p-4 font-extrabold text-slate-900">{customer.name}</td>
                            <td className="p-4">{customer.phone}</td>
                            <td className="p-4 text-slate-500 font-normal">{customer.address}</td>
                            <td className="p-4 text-center">{customer.ordersCount} টি</td>
                            <td className="p-4 text-slate-900 font-black">৳ {customer.totalSpent > 0 ? customer.totalSpent.toLocaleString('bn-BD') : '০'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                </table>
                </div>

                {/* Mobile responsive view: stacked cards for customers list */}
                <div className="block md:hidden divide-y divide-slate-100">
                  {customersList.length === 0 ? (
                    <div className="p-12 text-center text-zinc-400 font-bold">কোন কাস্টমার প্রোফাইল পাওয়া যায়নি।</div>
                  ) : (
                    customersList.map((customer, idx) => (
                      <div key={idx} onClick={() => setSelectedCustomerHistory({ phone: customer.phone, name: customer.name })} className="p-4 flex flex-col gap-1.5 hover:bg-slate-50/50 transition-colors text-xs font-semibold cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[#115e5a] text-sm leading-tight">{customer.name}</span>
                          <span className="bg-[#e8f5e9] text-[#2e7d32] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0">
                            {customer.ordersCount} টি অর্ডার
                          </span>
                        </div>
                        
                        <div className="text-slate-500 font-bold tracking-wide">{customer.phone}</div>
                        
                        <div className="text-slate-600 font-medium mt-1">
                          <span className="text-[10px] text-slate-400 font-bold block mb-0.5 uppercase tracking-wider">ডেলিভারি ঠিকানা:</span>
                          {customer.address}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">মোট কেনাকাটার পরিমাণ</span>
                          <span className="text-sm font-black text-[#1b4332]">৳{customer.totalSpent.toLocaleString('bn-BD')}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}


          {/* TAB 6: FINANCES / INCOME & EXPENSE TRACKER */}
          {activeTab === 'finances' && (() => {
            const automatedIncome = orders
              .filter(o => o.status === 'Completed')
              .reduce((sum, o) => sum + o.total, 0);

            const manualIncome = transactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0);

            const totalIncome = automatedIncome + manualIncome;

            const totalExpense = transactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);

            const netProfit = totalIncome - totalExpense;

            // Categories list depending on transaction type
            const categoriesForType = txType === 'income' 
              ? ['পণ্য বিক্রি', 'বিনিয়োগ', 'অন্যান্য আয়']
              : ['কাঁচামাল কেনা', 'শিপিং চার্জ', 'দোকান ভাড়া', 'বিজ্ঞাপন', 'বেতন ও ভাতা', 'অন্যান্য ব্যয়'];

            // Prepare dynamic mapping ledger
            const orderIncomes = orders
              .filter(o => o.status === 'Completed')
              .map(o => ({
                id: `order-${o.id}`,
                type: 'income' as const,
                category: 'পণ্য বিক্রি (অর্ডার)',
                amount: o.total,
                date: o.date,
                note: `অর্ডার #${o.id} - ${o.customerName}`,
                isAutomated: true
              }));

            const manualTx = transactions.map(t => ({
              ...t,
              isAutomated: false
            }));

            // Combine and filter ledger
            const rawLedger = [...orderIncomes, ...manualTx];
            const filteredLedger = rawLedger
              .filter(item => {
                // Search filter matching note or category
                const matchesSearch = item.note.toLowerCase().includes(txSearch.toLowerCase()) || 
                                      item.category.toLowerCase().includes(txSearch.toLowerCase());
                
                // Tab category filters
                if (txFilter === 'income') return matchesSearch && item.type === 'income';
                if (txFilter === 'expense') return matchesSearch && item.type === 'expense';
                if (txFilter === 'automated') return matchesSearch && item.isAutomated;
                return matchesSearch;
              })
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // Handle transaction addition
            const handleAddTransaction = (e: React.FormEvent) => {
              e.preventDefault();
              if (!txAmount || isNaN(Number(txAmount)) || Number(txAmount) <= 0) {
                alert('অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন।');
                return;
              }

              const newTx = {
                id: `tx-${Date.now()}`,
                type: txType,
                category: txCategory,
                amount: Number(txAmount),
                date: new Date().toISOString(),
                note: txNote || `${txCategory} বাবদ লেনদেন`
              };

              setTransactions(prev => [newTx, ...prev]);
              addNotification(
                txType === 'income' ? 'নতুন আয় যুক্ত হয়েছে 💰' : 'নতুন ব্যয় যুক্ত হয়েছে 💸',
                `${txCategory} বাবদ ৳${txAmount} টাকার লেনদেন সফলভাবে রেকর্ড করা হয়েছে।`
              );
              
              // Play a sound
              if (soundEnabled) {
                triggerSound();
              }

              // Reset form
              setTxAmount('');
              setTxNote('');
            };

            const handleDeleteTx = (id: string) => {
              setTransactions(prev => prev.filter(t => t.id !== id));
              addNotification('লেনদেন মুছে ফেলা হয়েছে 🗑️', 'রেকর্ডকৃত লেনদেনটি সফলভাবে খাতা থেকে ডিলিট করা হয়েছে।');
            };

            return (
              <div className="space-y-6">
                
                {/* 1. Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Total Income Card */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">মোট সর্বমোট আয় (ইনকাম)</p>
                      <h3 className="text-xl md:text-2xl font-black text-emerald-600 mt-1">৳{totalIncome.toLocaleString('bn-BD')}</h3>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">
                        অর্ডার আয়: ৳{automatedIncome.toLocaleString('bn-BD')} + ম্যানুয়াল: ৳{manualIncome.toLocaleString('bn-BD')}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>

                  {/* Total Expense Card */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">মোট সর্বমোট ব্যয় (খরচ)</p>
                      <h3 className="text-xl md:text-2xl font-black text-rose-600 mt-1">৳{totalExpense.toLocaleString('bn-BD')}</h3>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">
                        মোট {transactions.filter(t => t.type === 'expense').length}টি ব্যয় খাতের হিসাব
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <ArrowDownRight size={24} />
                    </div>
                  </div>

                  {/* Net Profit Card */}
                  <div className={`rounded-2xl p-5 border shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between ${netProfit >= 0 ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 border-emerald-100 text-slate-800' : 'bg-rose-50 border-rose-100'}`}>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">নিট লাভ / মুনাফা (Profit)</p>
                      <h3 className={`text-xl md:text-2xl font-black mt-1 ${netProfit >= 0 ? 'text-teal-800' : 'text-rose-700'}`}>
                        ৳{netProfit.toLocaleString('bn-BD')}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1 font-bold">
                        আয় এবং ব্যয়ের চূড়ান্ত ব্যালেন্স খাতা
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${netProfit >= 0 ? 'bg-emerald-500/10 text-[#2e7d32]' : 'bg-rose-500/10 text-rose-600'}`}>
                      <TrendingUp size={24} />
                    </div>
                  </div>
                </div>

                {/* 2. Content Body Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Transaction Ledger History */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] lg:col-span-8 flex flex-col min-w-0 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-white to-slate-50/50">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100/50">
                          <Wallet size={16} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-800">লেনদেন খতিয়ান ও বিবরণী</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">রিয়েল-টাইমে ক্যাশ অন ডেলিভারি সেলস ম্যাপিং</p>
                        </div>
                      </div>

                      {/* Ledger Search Input */}
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="লেনদেন বা খাত খুঁজুন..." 
                          value={txSearch}
                          onChange={(e) => setTxSearch(e.target.value)}
                          className="w-full sm:w-48 pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#2e7d32]" 
                        />
                        <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Filter Toggles */}
                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 flex-wrap">
                      <button 
                        onClick={() => setTxFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${txFilter === 'all' ? 'bg-[#2e7d32] text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200/60'}`}
                      >
                        সকল বিবরণী ({rawLedger.length}টি)
                      </button>
                      <button 
                        onClick={() => setTxFilter('income')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${txFilter === 'income' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200/60'}`}
                      >
                        শুধুমাত্র আয় ({rawLedger.filter(l => l.type === 'income').length}টি)
                      </button>
                      <button 
                        onClick={() => setTxFilter('automated')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${txFilter === 'automated' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200/60'}`}
                      >
                        অর্ডার থেকে আয় ({orderIncomes.length}টি)
                      </button>
                      <button 
                        onClick={() => setTxFilter('expense')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${txFilter === 'expense' ? 'bg-rose-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200/60'}`}
                      >
                        শুধুমাত্র ব্যয় ({rawLedger.filter(l => l.type === 'expense').length}টি)
                      </button>
                    </div>

                    {/* Ledger List */}
                    <div className="divide-y divide-slate-100 overflow-y-auto max-h-[480px]">
                      {filteredLedger.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-extrabold flex flex-col items-center justify-center gap-2">
                          <Wallet size={32} className="opacity-30" />
                          <span>কোন লেনদেন রেকর্ড পাওয়া যায়নি।</span>
                        </div>
                      ) : (
                        filteredLedger.map((item) => {
                          const isInc = item.type === 'income';
                          const isAut = (item as any).isAutomated;
                          
                          return (
                            <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors select-none">
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Type icon */}
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${isInc ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                  {isInc ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-black text-slate-800 truncate">{item.note}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-black border uppercase tracking-wider ${
                                      isAut ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                                      isInc ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                      'bg-rose-50 border-rose-100 text-rose-700'
                                    }`}>
                                      {item.category}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-1 font-bold">
                                    <Calendar size={10} />
                                    <span>{new Date(item.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    {isAut && <span className="text-indigo-500 ml-1 bg-indigo-50 px-1 py-0.5 rounded">অটোমেটেড</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span className={`text-xs font-black font-sans ${isInc ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {isInc ? '+' : '-'}৳{item.amount.toLocaleString('bn-BD')}
                                </span>

                                {!isAut ? (
                                  <button 
                                    onClick={() => handleDeleteTx(item.id)}
                                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="লেনদেন ডিলিট করুন"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                ) : (
                                  <div className="p-1.5 text-slate-200" title="অটোমেটেড অর্ডার লেনদেন ডিলিট করা সম্ভব নয়">
                                    <Lock size={12} className="opacity-40 font-bold" />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Column: Add Transaction Form */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                          <PlusCircle size={15} />
                        </div>
                        <h4 className="text-xs font-black text-slate-800">নতুন লেনদেন রেকর্ড করুন</h4>
                      </div>

                      <form onSubmit={handleAddTransaction} className="space-y-4">
                        {/* Transaction Type toggler */}
                        <div>
                          <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1.5">লেনদেনের ধরন</label>
                          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-150">
                            <button 
                              type="button"
                              onClick={() => {
                                setTxType('income');
                                setTxCategory('পণ্য বিক্রি');
                              }}
                              className={`py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${txType === 'income' ? 'bg-[#2e7d32] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                              আয় (Income)
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                setTxType('expense');
                                setTxCategory('কাঁচামাল কেনা');
                              }}
                              className={`py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${txType === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                              ব্যয় (Expense)
                            </button>
                          </div>
                        </div>

                        {/* Category Select */}
                        <div>
                          <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1.5">খাত / ক্যাটাগরি</label>
                          <select 
                            value={txCategory}
                            onChange={(e) => setTxCategory(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32] bg-white"
                          >
                            {categoriesForType.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        {/* Amount Field */}
                        <div>
                          <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1.5">টাকার পরিমাণ (৳)</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              required
                              placeholder="১০০০" 
                              value={txAmount}
                              onChange={(e) => setTxAmount(e.target.value)}
                              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]"
                            />
                            <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">৳</span>
                          </div>
                        </div>

                        {/* Note Field */}
                        <div>
                          <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1.5">লেনদেনের নোট / বিবরণ</label>
                          <input 
                            type="text" 
                            placeholder="যেমন: ডেলিভারি খরচ পরিশোধ, দোকানের ভাড়া" 
                            value={txNote}
                            onChange={(e) => setTxNote(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32]"
                          />
                        </div>

                        {/* Submit Button */}
                        <button 
                          type="submit"
                          className={`w-full py-2.5 rounded-xl text-white text-xs font-black transition-all cursor-pointer shadow-md ${txType === 'income' ? 'bg-[#2e7d32] hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                        >
                          খাতায় হিসাব যুক্ত করুন
                        </button>
                      </form>
                    </div>

                    {/* Quick Financial Insight Info Card */}
                    <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-sm leading-relaxed">
                      <h4 className="text-xs font-black text-emerald-400 flex items-center gap-1.5 mb-2">
                        <span>💡 হিসাব রক্ষণ টিপস</span>
                      </h4>
                      <p className="text-[10px] text-slate-300 font-bold">
                        অর্ডার সমূহের মধ্যে যেগুলোর স্ট্যাটাস <span className="text-emerald-300 font-black">"সম্পন্ন"</span> করা হয়, সেগুলো স্বয়ংক্রিয়ভাবে আয় হিসেবে লেনদেন তালিকায় যুক্ত হয়। অন্যান্য খরচ যেমন পণ্য উৎপাদন, শিপিং খরচ, ও আনুষঙ্গিক ব্যয়সমূহ ডান পাশের ফরম ব্যবহার করে যুক্ত করলে সঠিক নিট মুনাফার হিসাব বজায় থাকবে।
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            );
          })()}


          {/* TAB: MARKETING & DISCOUNT INTELLIGENCE */}
          {activeTab === 'marketing' && (() => {
            // Calculations
            const totalCampBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
            const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
            const activeCampaignsCount = campaigns.filter(c => c.status === 'Active').length;
            
            const totalRevenue = orders
              .filter(o => o.status === 'Completed')
              .reduce((sum, o) => sum + o.total, 0);
            
            // Recommend budget: 7% of total completed revenue, minimum 2000
            const recommendedBudget = Math.max(2000, Math.round(totalRevenue * 0.07));

            // Customer Loyalty Intelligence: Analyze real orders list
            const customerStats: { [phone: string]: { name: string; address: string; count: number; spend: number } } = {};
            orders.forEach(o => {
              if (!o.phone) return;
              if (!customerStats[o.phone]) {
                customerStats[o.phone] = { name: o.customerName, address: o.address, count: 0, spend: 0 };
              }
              customerStats[o.phone].count += 1;
              customerStats[o.phone].spend += o.total;
            });

            const customerList = Object.entries(customerStats).map(([phone, stats]) => ({
              phone,
              ...stats
            }));

            // Categories
            const vipCustomers = customerList.filter(c => c.count >= 2 || c.spend >= 2500);
            const oneTimeCustomers = customerList.filter(c => c.count === 1 && c.spend < 2500);

            return (
              <div className="space-y-6">
                
                {/* 1. Marketing Performance Overview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 p-5 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] md:text-xs text-emerald-700/80 font-black uppercase tracking-wider">চলতি বাজেট ব্যয়</span>
                        <h3 className="text-xl md:text-2xl font-black text-[#1b4332] mt-1">৳{totalCampBudget.toLocaleString('bn-BD')}</h3>
                      </div>
                      <div className="p-2.5 bg-emerald-500 text-white rounded-xl">
                        <Megaphone size={16} />
                      </div>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold mt-2.5 flex items-center gap-1">
                      <span>• মোট {campaigns.length}টি ক্যাম্পেইন অন্তর্ভুক্ত</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 p-5 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] md:text-xs text-blue-700/80 font-black uppercase tracking-wider">মোট কনভার্সন (অর্ডার)</span>
                        <h3 className="text-xl md:text-2xl font-black text-blue-900 mt-1">{totalConversions.toLocaleString('bn-BD')} টি</h3>
                      </div>
                      <div className="p-2.5 bg-blue-500 text-white rounded-xl">
                        <Target size={16} />
                      </div>
                    </div>
                    <div className="text-[10px] text-blue-700 font-bold mt-2.5 flex items-center gap-1">
                      <span>• গড় রূপান্তর হার: ১২.৫% (ফেসবুক)</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100 p-5 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] md:text-xs text-amber-700/80 font-black uppercase tracking-wider">সক্রিয় ক্যাম্পেইন</span>
                        <h3 className="text-xl md:text-2xl font-black text-amber-900 mt-1">{activeCampaignsCount.toLocaleString('bn-BD')} টি</h3>
                      </div>
                      <div className="p-2.5 bg-amber-500 text-white rounded-xl">
                        <Sparkles size={16} />
                      </div>
                    </div>
                    <div className="text-[10px] text-amber-700 font-bold mt-2.5 flex items-center gap-1">
                      <span>• রানিং প্রমোশন ও বুস্টিং চলছে</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100 p-5 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] md:text-xs text-purple-700/80 font-black uppercase tracking-wider">প্রস্তাবিত মার্কেটিং বাজেট</span>
                        <h3 className="text-xl md:text-2xl font-black text-purple-900 mt-1">৳{recommendedBudget.toLocaleString('bn-BD')}</h3>
                      </div>
                      <div className="p-2.5 bg-purple-500 text-white rounded-xl">
                        <TrendingUp size={16} />
                      </div>
                    </div>
                    <div className="text-[10px] text-purple-700 font-bold mt-2.5 flex items-center gap-1">
                      <span>• মোট সম্পন্ন আয়ের ৭% হিসাব ভিত্তিক</span>
                    </div>
                  </div>
                </div>

                {/* 2. Bento Grid: Timings & Guidance and Customer Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* Left Column: Timing guidance and budget advice - 5 cols */}
                  <div className="lg:col-span-5 space-y-5">
                    
                    {/* A. কখন কতটুকু মার্কেটিং করা দরকার? (Timing Guidance Card) */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                      <h3 className="font-extrabold text-sm md:text-base text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100 select-none">
                        <Calendar size={18} className="text-emerald-600 animate-pulse" />
                        <span>কখন কতটুকু মার্কেটিং করা প্রয়োজন?</span>
                      </h3>
                      
                      <div className="space-y-3.5">
                        <div className="flex gap-3">
                          <div className="shrink-0 w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-xs font-black text-emerald-700">১</div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800">মাসের বেতন সেশন (১ থেকে ১০ তারিখ)</h4>
                            <p className="text-[10.5px] text-slate-500 font-bold mt-0.5 leading-relaxed">
                              এই সময়ে ক্রেতাদের ক্রয়ক্ষমতা সর্বোচ্চ থাকে। আপনার সম্পূর্ণ মাসিক বাজেটের <span className="text-[#2e7d32] font-black">৫০% থেকে ৬০%</span> এই ১০ দিনে খরচ করা উচিত। বিশেষ করে ঘি, সুন্দরবনের মধু এবং সরিষার তেলের মতো প্রিমিয়াম খাদ্য আইটেমগুলোর বুস্ট সচল করুন।
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="shrink-0 w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-xs font-black text-emerald-700">২</div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800">দৈনিক পিক-আওয়ার (সন্ধ্যা ৬:০০ - রাত ১০:০০)</h4>
                            <p className="text-[10.5px] text-slate-500 font-bold mt-0.5 leading-relaxed">
                              অর্গানিক খাবার ও গ্রোসারির ফেসবুকে সবচেয়ে বেশি অর্ডার আসে বিকেলে ও রাতে। আপনার বিজ্ঞাপন ক্যাম্পেইনগুলো রাতে একটিভ রাখুন এবং মেসেঞ্জার চ্যাটে ইনস্ট্যান্ট রিপ্লাই সচল রাখুন।
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="shrink-0 w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-xs font-black text-emerald-700">৩</div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800">উৎসবে স্পেশাল বাজেট (রমজান ও ঈদ সেশন)</h4>
                            <p className="text-[10.5px] text-slate-500 font-bold mt-0.5 leading-relaxed">
                              রমজান বা যেকোনো উৎসবে বিশেষ বাজেট বরাদ্দ করুন। উৎসবের দিনগুলোতে খাঁটি উপাদানের চাহিদা অনেক বেড়ে যায়।
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Customer Recommendations / Segments */}
                  <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-sm md:text-base text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100 select-none">
                      <Users size={18} className="text-emerald-600 animate-pulse" />
                      <span>গ্রাহক সেগমেন্ট ভিত্তিক কুপন অফার</span>
                    </h3>
                    
                    <div className="space-y-4">
                        
                        {/* Segment 1: VIP Loyal Spenders */}
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <span className="text-[11px] font-black text-[#1b4332] bg-[#e8f5e9] px-2.5 py-1 rounded-lg flex items-center gap-1 self-start shadow-sm border border-emerald-100">
                              👑 ভিআইপি কাস্টমার (Loyal Customers)
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold sm:text-right">প্রস্তাবিত ডিসকাউন্ট: ১০% বা ফ্ল্যাট ৳১৫০ ছাড়</span>
                          </div>
                          
                          {vipCustomers.length === 0 ? (
                            <p className="text-[10px] text-slate-400 font-bold bg-slate-50 p-3 rounded-xl border border-dashed">এখনো পর্যন্ত কোন কাস্টমার ভিআইপি ক্যাটাগরিতে পৌঁছায়নি (২+ অর্ডার বা ৳২৫০০+ ক্রয়)।</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                              {vipCustomers.map(cust => (
                                <div key={cust.phone} className="p-3 bg-gradient-to-r from-emerald-500/[0.04] to-emerald-500/[0.01] border border-emerald-500/10 hover:border-emerald-500/25 rounded-xl flex items-center justify-between gap-3 hover:bg-emerald-500/[0.06] transition-all duration-300 shadow-sm">
                                  <div className="min-w-0 flex-1">
                                    <span className="text-xs font-black text-slate-800 block truncate leading-tight">{cust.name}</span>
                                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{cust.phone}</span>
                                    <div className="text-[9px] text-emerald-800 font-bold mt-1.5 flex items-center gap-1">
                                      <span>অর্ডার: <strong className="font-extrabold font-mono text-[10.5px] text-[#2e7d32]">{cust.count}</strong>টি</span>
                                      <span className="text-slate-300">•</span>
                                      <span>ক্রয়: <strong className="font-extrabold font-mono text-[10.5px] text-[#2e7d32]">৳{cust.spend}</strong></span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const cleanName = cust.name.replace(/[^a-zA-Z]/g, '').slice(0, 5) || 'VIP';
                                      const code = `VIP${cleanName.toUpperCase()}`;
                                      const exist = coupons.some(c => c.code === code);
                                      if (exist) {
                                        alert('এই ডিসকাউন্ট কুপন ইতিমধ্যে তৈরি করা আছে!');
                                        return;
                                      }
                                      setCoupons(prev => [{
                                        code,
                                        type: 'fixed',
                                        value: 150,
                                        minSpend: 1500,
                                        expiryDate: '2026-12-31',
                                        usageCount: 0
                                      }, ...prev]);
                                      addNotification(
                                        'ভিআইপি স্পেশাল কুপন 🎫',
                                        `${cust.name} এর জন্য বিশেষ ডিসকাউন্ট কোড "${code}" সচল করা হয়েছে।`
                                      );
                                      alert(`কুপন কোড ${code} তৈরি করা হয়েছে এবং SMS/মেসেঞ্জারে কাস্টমারকে পাঠানোর জন্য রেডি!`);
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] px-3 py-1.5 rounded-lg font-black shrink-0 transition-all duration-200 active:scale-95 shadow-sm shadow-emerald-600/10"
                                  >
                                    কুপন দিন
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Segment 2: One-time welcome discount */}
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <span className="text-[11px] font-black text-blue-950 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center gap-1 self-start shadow-sm border border-blue-100">
                              👋 ১ বার কেনা ক্রেতা (Winback Segment)
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold sm:text-right">প্রস্তাবিত ডিসকাউন্ট: ফ্রি ডেলিভারি কুপন</span>
                          </div>
                          
                          {oneTimeCustomers.length === 0 ? (
                            <p className="text-[10px] text-slate-400 font-bold bg-slate-50 p-3 rounded-xl border border-dashed">১ বার কিনেছেন এমন কোন কাস্টমার লিস্টে নেই।</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                              {oneTimeCustomers.map(cust => (
                                <div key={cust.phone} className="p-3 bg-gradient-to-r from-blue-500/[0.04] to-blue-500/[0.01] border border-blue-500/10 hover:border-blue-500/25 rounded-xl flex items-center justify-between gap-3 hover:bg-blue-500/[0.06] transition-all duration-300 shadow-sm">
                                  <div className="min-w-0 flex-1">
                                    <span className="text-xs font-black text-slate-800 block truncate leading-tight">{cust.name}</span>
                                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{cust.phone}</span>
                                    <div className="text-[9px] text-blue-800 font-bold mt-1.5 flex items-center gap-1">
                                      <span>অर्डर: <strong className="font-extrabold font-mono text-[10.5px] text-blue-700">{cust.count}</strong>টি</span>
                                      <span className="text-slate-300">•</span>
                                      <span>ক্রয়: <strong className="font-extrabold font-mono text-[10.5px] text-blue-700">৳{cust.spend}</strong></span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const code = `WELCOME60`;
                                      const exist = coupons.some(c => c.code === code);
                                      if (exist) {
                                        alert('এই ডিসকাউন্ট কুপন ইতিমধ্যে তৈরি করা আছে!');
                                        return;
                                      }
                                      setCoupons(prev => [{
                                        code,
                                        type: 'fixed',
                                        value: 60, // delivery fee amount
                                        minSpend: 800,
                                        expiryDate: '2026-12-31',
                                        usageCount: 0
                                      }, ...prev]);
                                      addNotification(
                                        'উইনব্যাক ফ্রি ডেলিভারি কুপন 🚚',
                                        `পুরাতন খদ্দেরদের পুনরায় টানতে "${code}" কোড তৈরি করা হয়েছে।`
                                      );
                                      alert(`কুপন কোড ${code} তৈরি করা হয়েছে! এটি ১ বার কেনা গ্রাহকদের রিপিট ক্রয়ে উৎসাহিত করবে।`);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] px-3 py-1.5 rounded-lg font-black shrink-0 transition-all duration-200 active:scale-95 shadow-sm shadow-blue-600/10"
                                  >
                                    ফ্রি শিপিং
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* D. একটিভ মার্কেটিং ক্যাম্পেইন তালিকা ও ফর্ম */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <h3 className="font-extrabold text-sm md:text-base text-slate-800 flex items-center gap-2">
                          <Megaphone size={18} className="text-[#2e7d32]" />
                          <span>মার্কেটিং ক্যাম্পেইন বাজেট ও আরওআই ট্র্যাকার</span>
                        </h3>
                        <span className="text-xs font-black text-slate-500">বাজেট বণ্টন তালিকা</span>
                      </div>

                      {/* Add Campaign Form */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newCampName || !newCampBudget) return;

                          const budg = Number(newCampBudget) || 1000;
                          const newCampObj = {
                            id: `c-${Math.floor(100 + Math.random() * 900)}`,
                            name: newCampName,
                            platform: newCampPlatform,
                            budget: budg,
                            targetAudience: newCampTarget || 'নির্ধারিত কাস্টমার অডিয়েন্স',
                            conversions: 0,
                            status: newCampStatus,
                            date: new Date().toISOString(),
                            roi: 0
                          };

                          setCampaigns(prev => [newCampObj, ...prev]);
                          setNewCampName('');
                          setNewCampBudget('');
                          setNewCampTarget('');

                          addNotification(
                            'নতুন প্রমোショナル ক্যাম্পেইন 📣',
                            `ক্যাম্পেইন "${newCampObj.name}" বাজেট ৳${budg} সফলভাবে রানিং করা হয়েছে।`
                          );
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200/60"
                      >
                        <div className="col-span-1 sm:col-span-2 md:col-span-3">
                          <h4 className="text-[11px] uppercase tracking-wider text-slate-500 font-black mb-1">ক্যাম্পেইন যুক্ত করুন</h4>
                        </div>
                        <div>
                          <label className="block text-[9px] text-slate-500 font-bold mb-1">ক্যাম্পেইনের নাম *</label>
                          <input 
                            type="text"
                            required
                            placeholder="যেমন: ঘি বুস্টিং অফার"
                            value={newCampName}
                            onChange={(e) => setNewCampName(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white outline-none focus:border-[#2e7d32]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-slate-500 font-bold mb-1">প্ল্যাটফর্ম</label>
                          <select
                            value={newCampPlatform}
                            onChange={(e) => setNewCampPlatform(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white outline-none focus:border-[#2e7d32]"
                          >
                            <option value="Facebook Ads">Facebook Ads</option>
                            <option value="Instagram Ads">Instagram Ads</option>
                            <option value="SMS Marketing">SMS Marketing</option>
                            <option value="Google Search Ads">Google Search Ads</option>
                            <option value="YouTube Promotion">YouTube Promotion</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] text-slate-500 font-bold mb-1">বাজেট (৳) *</label>
                          <input 
                            type="number"
                            required
                            placeholder="যেমন: ১৫০০"
                            value={newCampBudget}
                            onChange={(e) => setNewCampBudget(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-black bg-white outline-none focus:border-[#2e7d32]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[9px] text-slate-500 font-bold mb-1">টার্গেট কাস্টমার বিবরণ</label>
                          <input 
                            type="text"
                            placeholder="যেমন: ঢাকা সিটির খাঁটি খাবারের আগ্রহী পরিবার"
                            value={newCampTarget}
                            onChange={(e) => setNewCampTarget(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white outline-none focus:border-[#2e7d32]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-slate-500 font-bold mb-1">স্ট্যাটাস</label>
                          <select
                            value={newCampStatus}
                            onChange={(e) => setNewCampStatus(e.target.value as any)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white outline-none focus:border-[#2e7d32]"
                          >
                            <option value="Active">Active</option>
                            <option value="Paused">Paused</option>
                            <option value="Scheduled">Scheduled</option>
                          </select>
                        </div>
                        <div className="col-span-1 sm:col-span-2 md:col-span-3 pt-2">
                          <button
                            type="submit"
                            className="w-full bg-[#2e7d32] hover:bg-emerald-700 text-white text-xs font-black py-2 rounded-xl shadow-sm transition-all"
                          >
                            📣 নতুন ক্যাম্পেইন সেভ করুন
                          </button>
                        </div>
                      </form>

                      {/* Campaigns Tracker Responsive Layout */}
                      {/* Mobile View: Vertical Cards (No Horizontal Scrolling) */}
                      <div className="block md:hidden space-y-4">
                        {campaigns.length === 0 ? (
                          <div className="p-8 text-center bg-slate-50 border border-dashed rounded-xl text-slate-400 font-bold text-xs">
                            কোন ক্যাম্পেইন পাওয়া যায়নি।
                          </div>
                        ) : (
                          campaigns.map((camp) => (
                            <div key={camp.id} className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 space-y-3 shadow-sm hover:border-emerald-500/30 transition-all">
                              <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-200/50">
                                <div>
                                  <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-tight">{camp.name}</h4>
                                  <span className="inline-block mt-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">{camp.platform}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    {
                                      setCampaigns(prev => prev.filter(c => c.id !== camp.id));
                                    }
                                  }}
                                  className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-[11px]">
                                <div className="space-y-0.5">
                                  <span className="text-slate-400 font-bold block text-[10px]">বাজেট</span>
                                  <span className="font-extrabold text-[#1b4332] text-xs">৳{camp.budget}</span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-slate-400 font-bold block text-[10px]">টার্গেট অডিয়েন্স</span>
                                  <span className="font-extrabold text-slate-600 block truncate" title={camp.targetAudience}>{camp.targetAudience}</span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-slate-400 font-bold block text-[10px]">অর্ডার কনভার্সন</span>
                                  <div className="flex items-center gap-1">
                                    <span className="font-black text-slate-800">{camp.conversions} টি</span>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const count = prompt('নতুন কনভার্সন অর্ডার সংখ্যা লিখুন:', String(camp.conversions));
                                        if (count === null) return;
                                        const num = Number(count);
                                        if (isNaN(num)) return;
                                        
                                        // Update ROI too: each conversion is worth on average 1500 Taka
                                        const aovValue = num * 1500;
                                        const calculatedRoi = camp.budget > 0 ? Number((aovValue / camp.budget).toFixed(1)) : 0;

                                        setCampaigns(prev => prev.map(c => c.id === camp.id ? { ...c, conversions: num, roi: calculatedRoi } : c));
                                      }}
                                      className="text-[10px] text-blue-600 hover:underline font-extrabold"
                                    >
                                      (সংশোধন)
                                    </button>
                                  </div>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-slate-400 font-bold block text-[10px]">আরওআই (ROI)</span>
                                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black ${camp.roi > 2 ? 'bg-emerald-100 text-[#2e7d32]' : camp.roi > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200/80 text-slate-500'}`}>
                                    {camp.roi > 0 ? `${camp.roi}x ROI` : 'N/A'}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-2.5 border-t border-slate-200/50 flex items-center justify-between gap-3">
                                <span className="text-[10px] text-slate-400 font-black uppercase">স্ট্যাটাস</span>
                                <select
                                  value={camp.status}
                                  onChange={(e) => {
                                    const newStat = e.target.value as any;
                                    setCampaigns(prev => prev.map(c => c.id === camp.id ? { ...c, status: newStat } : c));
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-black outline-none border border-slate-200 bg-white shadow-sm focus:border-emerald-500"
                                >
                                  <option value="Active">Active</option>
                                  <option value="Paused">Paused</option>
                                  <option value="Scheduled">Scheduled</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Desktop View: Beautiful Structured Table (Visible on MD and larger screens) */}
                      <div className="hidden md:block overflow-x-auto border border-slate-100 rounded-xl">
                        <table className="w-full text-left border-collapse text-xs font-bold min-w-[550px] bg-slate-50/50">
                          <thead>
                            <tr className="bg-slate-100 text-slate-600 text-[10px]">
                              <th className="p-3">ক্যাম্পেইন নাম ও প্ল্যাটফর্ম</th>
                              <th className="p-3">বাজেট</th>
                              <th className="p-3">টার্গেট অডিয়েন্স</th>
                              <th className="p-3">অর্ডার কনভার্সন</th>
                              <th className="p-3">আরওআই (ROI)</th>
                              <th className="p-3 text-center">স্ট্যাটাস</th>
                              <th className="p-3">অ্যাকশন</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {campaigns.map((camp) => (
                              <tr key={camp.id} className="hover:bg-white transition-colors">
                                <td className="p-3">
                                  <span className="text-slate-800 block font-black">{camp.name}</span>
                                  <span className="text-[10px] text-slate-400">{camp.platform}</span>
                                </td>
                                <td className="p-3 font-black text-[#1b4332]">৳{camp.budget}</td>
                                <td className="p-3 text-[10px] text-slate-500 max-w-[120px] truncate" title={camp.targetAudience}>{camp.targetAudience}</td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-slate-800 font-black">{camp.conversions} টি</span>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const count = prompt('নতুন কনভার্সন অর্ডার সংখ্যা লিখুন:', String(camp.conversions));
                                        if (count === null) return;
                                        const num = Number(count);
                                        if (isNaN(num)) return;
                                        
                                        // Update ROI too: each conversion is worth on average 1500 Taka
                                        const aovValue = num * 1500;
                                        const calculatedRoi = camp.budget > 0 ? Number((aovValue / camp.budget).toFixed(1)) : 0;

                                        setCampaigns(prev => prev.map(c => c.id === camp.id ? { ...c, conversions: num, roi: calculatedRoi } : c));
                                      }}
                                      className="text-xs text-blue-600 hover:underline shrink-0"
                                    >
                                      সংশোধন
                                    </button>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${camp.roi > 2 ? 'bg-emerald-100 text-[#2e7d32]' : camp.roi > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>
                                    {camp.roi > 0 ? `${camp.roi}x ROI` : 'N/A'}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <select
                                    value={camp.status}
                                    onChange={(e) => {
                                      const newStat = e.target.value as any;
                                      setCampaigns(prev => prev.map(c => c.id === camp.id ? { ...c, status: newStat } : c));
                                    }}
                                    className="px-2 py-1 rounded text-[10px] font-black outline-none border border-slate-200 bg-white"
                                  >
                                    <option value="Active">Active</option>
                                    <option value="Paused">Paused</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </td>
                                <td className="p-3">
                                  <button
                                    onClick={() => {
                                      {
                                        setCampaigns(prev => prev.filter(c => c.id !== camp.id));
                                      }
                                    }}
                                    className="text-slate-300 hover:text-rose-600 transition-colors"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                </table>
                      </div>
                    </div>
</div>
</div>
            );
          })()}


                    {/* TAB: DUE LEDGER */}
          {activeTab === 'dues' && (
            <div className="space-y-6 select-none">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-0.5">মোট পাওনা বকেয়া</p>
                    <h3 className="text-xl font-black text-slate-800">৳{dues.filter(d => d.status !== 'Paid').reduce((sum, d) => sum + (d.amount - d.paidAmount), 0)}</h3>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckSquare size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-0.5">মোট আদায় হয়েছে</p>
                    <h3 className="text-xl font-black text-slate-800">৳{dues.reduce((sum, d) => sum + d.paidAmount, 0)}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDueModalOpen(true)}
                  className="bg-[#1b4332] text-white rounded-2xl p-5 shadow-lg shadow-[#1b4332]/20 hover:bg-[#153426] transition-all flex flex-col items-center justify-center gap-2"
                >
                  <PlusCircle size={24} />
                  <span className="font-extrabold text-sm">নতুন বকেয়া যোগ করুন</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-extrabold text-slate-800">বকেয়া তালিকা</h3>
                </div>
                
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">
                    <thead>
                      <tr className="bg-slate-50/60 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                        <th className="p-4">গ্রাহক</th>
                        <th className="p-4">পরিমাণ</th>
                        <th className="p-4">জমা</th>
                        <th className="p-4">পাওনা</th>
                        <th className="p-4 text-center">স্ট্যাটাস</th>
                        <th className="p-4 text-center">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {dues.filter(d => d.status !== 'Paid').length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">কোন বকেয়া রেকর্ড নেই।</td>
                        </tr>
                      ) : (
                        dues.filter(d => d.status !== 'Paid').map(d => {
                          const isPaid = d.status === 'Paid';
                          return (
                            <tr key={d.id} className="hover:bg-slate-50/50">
                              <td className="p-4">
                                <div className="font-extrabold text-slate-800">{d.customerName}</div>
                                <div className="text-[10px] text-slate-400">{d.phone}</div>
                              </td>
                              <td className="p-4 text-rose-600">৳{d.amount}</td>
                              <td className="p-4 text-emerald-600">৳{d.paidAmount}</td>
                              <td className="p-4 font-black">৳{d.amount - d.paidAmount}</td>
                              <td className="p-4 text-center">
                                <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                  isPaid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                  d.status === 'Partial' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                  'bg-rose-50 text-rose-600 border border-rose-100'
                                }`}>
                                  {isPaid ? 'পরিশোধিত' : d.status === 'Partial' ? 'আংশিক জমা' : 'বকেয়া'}
                                </span>
                              </td>
                              <td className="p-4 text-center flex justify-center gap-2">
                                {!isPaid && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentDue(d); setIsDuePayModalOpen(true); }}
                                      className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded text-[10px] font-extrabold transition-colors border border-emerald-100 cursor-pointer"
                                    >
                                      টাকা জমা
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addNotification('এসএমএস রিমাইন্ডার', `${d.customerName} এর নাম্বারে বকেয়া পরিশোধের রিমাইন্ডার পাঠানো হয়েছে।`); }}
                                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded text-[10px] font-extrabold transition-colors border border-blue-100 flex items-center gap-1 cursor-pointer"
                                      title="সফটওয়্যার থেকে ম্যাসেজ"
                                    >
                                      <PhoneCall size={10} /> রিমাইন্ডার
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="block md:hidden divide-y divide-slate-100">
                  {dues.filter(d => d.status !== 'Paid').length === 0 ? (
                    <div className="p-8 text-center text-slate-400 font-bold text-xs">কোন বকেয়া রেকর্ড নেই।</div>
                  ) : (
                    dues.filter(d => d.status !== 'Paid').map(d => {
                      const isPaid = d.status === 'Paid';
                      return (
                        <div key={d.id} className="p-4 flex flex-col gap-3 hover:bg-slate-50/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-extrabold text-[#115e5a] text-sm leading-snug">{d.customerName}</div>
                              <div className="text-[10px] text-slate-400 font-extrabold mt-0.5">{d.phone}</div>
                            </div>
                            <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              isPaid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              d.status === 'Partial' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                              {isPaid ? 'পরিশোধিত' : d.status === 'Partial' ? 'আংশিক জমা' : 'বকেয়া'}
                            </span>
                          </div>

                          <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <div className="flex flex-col text-center">
                              <span className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">পরিমাণ</span>
                              <span className="text-xs font-bold text-slate-700">৳{d.amount}</span>
                            </div>
                            <div className="flex flex-col text-center border-l border-r border-slate-200 px-3">
                              <span className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">জমা</span>
                              <span className="text-xs font-bold text-emerald-600">৳{d.paidAmount}</span>
                            </div>
                            <div className="flex flex-col text-center">
                              <span className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">পাওনা</span>
                              <span className="text-xs font-black text-rose-600">৳{d.amount - d.paidAmount}</span>
                            </div>
                          </div>

                          {!isPaid && (
                            <div className="flex items-center gap-2 justify-end mt-1">
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentDue(d); setIsDuePayModalOpen(true); }}
                                className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-2 rounded-xl text-[10px] font-extrabold transition-colors border border-emerald-100 flex-1 flex items-center justify-center gap-1 cursor-pointer"
                              >
                                টাকা জমা
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addNotification('এসএমএস রিমাইন্ডার', `${d.customerName} এর নাম্বারে বকেয়া পরিশোধের রিমাইন্ডার পাঠানো হয়েছে।`); }}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-xl text-[10px] font-extrabold transition-colors border border-blue-100 flex-1 flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <PhoneCall size={12} /> রিমাইন্ডার
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          
          {/* TAB: INVESTORS */}
          {activeTab === 'investors' && (
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800">বিনিয়োগকারী ব্যবস্থাপনা</h2>
                  <p className="text-xs text-slate-500 mt-1">আপনার সকল বিনিয়োগকারীদের তালিকা এবং নতুন যুক্ত করুন</p>
                </div>
                <button 
                  onClick={() => setShowAddInvestorForm(!showAddInvestorForm)}
                  className="bg-[#2e7d32] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-[#2e7d32]/20"
                >
                  {showAddInvestorForm ? <X size={16} /> : <Users size={16} />} 
                  {showAddInvestorForm ? 'বাতিল করুন' : 'ম্যানুয়ালি যুক্ত করুন'}
                </button>
              </div>

              {showAddInvestorForm ? (
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300 mb-8">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Briefcase size={18} className="text-emerald-600" />
                    নতুন বিনিয়োগকারী ফর্ম
                  </h3>
                  <form onSubmit={handleManualAddInvestor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম <span className="text-rose-500">*</span></label>
                      <input type="text" value={newInvestorData.name} onChange={e => setNewInvestorData(p => ({...p, name: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">পিতার নাম</label>
                      <input type="text" value={newInvestorData.fname} onChange={e => setNewInvestorData(p => ({...p, fname: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল <span className="text-rose-500">*</span></label>
                      <input type="text" value={newInvestorData.mobile} onChange={e => setNewInvestorData(p => ({...p, mobile: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                      <input type="text" value={newInvestorData.nid} onChange={e => setNewInvestorData(p => ({...p, nid: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                      <input type="text" value={newInvestorData.address} onChange={e => setNewInvestorData(p => ({...p, address: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোট বিনিয়োগের পরিমান (৳) <span className="text-rose-500">*</span></label>
                      <input type="number" value={newInvestorData.totalAmount} onChange={e => setNewInvestorData(p => ({...p, totalAmount: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">বকেয়া পরিমান (যদি থাকে)</label>
                      <input type="number" value={newInvestorData.dueAmount} onChange={e => setNewInvestorData(p => ({...p, dueAmount: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" />
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-4">
                      <button type="submit" className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-md">
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {/* List of investors */}
              {investorsList.length === 0 && !showAddInvestorForm ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Briefcase size={28} className="text-slate-400" />
                  </div>
                  <h3 className="font-bold text-slate-800">কোন বিনিয়োগকারী নেই</h3>
                  <p className="text-xs text-slate-500 mt-1">নতুন বিনিয়োগকারী যুক্ত করতে উপরের বাটনে ক্লিক করুন</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {investorsList.map((inv) => (
                    <div key={inv.id} className="border border-slate-100 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDeleteInvestor(inv.id)} className="text-rose-400 hover:text-rose-600 p-1.5 bg-rose-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-3">
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-black text-lg border border-emerald-100">
                          {inv.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 leading-tight">{inv.name}</h4>
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider mt-1 inline-block">A/C: {inv.accountNumber}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-[11px] text-slate-500 font-bold">মোবাইল:</span>
                          <span className="text-[11px] text-slate-800 font-bold">{inv.mobile}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[11px] text-slate-500 font-bold">তারিখ:</span>
                          <span className="text-[11px] text-slate-800 font-bold">{new Date(inv.date).toLocaleDateString('bn-BD')}</span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-[11px] text-slate-500 font-bold">মোট বিনিয়োগ:</span>
                          <span className="text-[11px] text-slate-800 font-black">৳ {inv.totalAmount.toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[11px] text-slate-500 font-bold">পরিশোধিত:</span>
                          <span className="text-[11px] text-emerald-600 font-black">৳ {inv.paidAmount.toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[11px] text-slate-500 font-bold">বকেয়া:</span>
                          <span className="text-[11px] text-rose-600 font-black">৳ {inv.dueAmount.toLocaleString('bn-BD')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: AGREEMENT */}
          {activeTab === 'agreement' && (
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800">ক্রয় বিক্রয় চুক্তিনামা ফর্ম</h2>
                  <p className="text-xs text-slate-500 mt-1">সমস্ত তথ্য পূরণ করে চুক্তিনামা প্রিন্ট করুন</p>
                </div>
                                <div className="flex gap-3">
                {!isAgreementSaved ? (
                  <button 
                    onClick={handleSaveInvestor}
                    className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Users size={16} /> বিনিয়োগকারী হিসেবে সেভ করুন
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      const dataStr = encodeURIComponent(JSON.stringify(agreementData));
                      window.open(`/print-agreement?data=${dataStr}`, '_blank');
                    }}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <FileText size={16} /> প্রিন্ট করুন
                  </button>
                )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Party 1 */}
                <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">১ম পক্ষ ক্রেতা</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম</label>
                      <input type="text" value={agreementData.party1.name} onChange={e => setAgreementData(p => ({...p, party1: {...p.party1, name: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">পিতার নাম</label>
                      <input type="text" value={agreementData.party1.fname} onChange={e => setAgreementData(p => ({...p, party1: {...p.party1, fname: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মাতার নাম</label>
                      <input type="text" value={agreementData.party1.mname} onChange={e => setAgreementData(p => ({...p, party1: {...p.party1, mname: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল</label>
                      <input type="text" value={agreementData.party1.mobile} onChange={e => setAgreementData(p => ({...p, party1: {...p.party1, mobile: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                      <input type="text" value={agreementData.party1.nid} onChange={e => setAgreementData(p => ({...p, party1: {...p.party1, nid: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                      <input type="text" value={agreementData.party1.address} onChange={e => setAgreementData(p => ({...p, party1: {...p.party1, address: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="গ্রাম/রাস্তা, ডাকঘর, থানা, জেলা" />
                    </div>
                  </div>
                </div>

                {/* Party 2 */}
                <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">২য় পক্ষ বিক্রেতা</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম</label>
                      <input type="text" value={agreementData.party2.name} onChange={e => setAgreementData(p => ({...p, party2: {...p.party2, name: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">পিতার নাম</label>
                      <input type="text" value={agreementData.party2.fname} onChange={e => setAgreementData(p => ({...p, party2: {...p.party2, fname: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মাতার নাম</label>
                      <input type="text" value={agreementData.party2.mname} onChange={e => setAgreementData(p => ({...p, party2: {...p.party2, mname: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল</label>
                      <input type="text" value={agreementData.party2.mobile} onChange={e => setAgreementData(p => ({...p, party2: {...p.party2, mobile: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                      <input type="text" value={agreementData.party2.nid} onChange={e => setAgreementData(p => ({...p, party2: {...p.party2, nid: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                      <input type="text" value={agreementData.party2.address} onChange={e => setAgreementData(p => ({...p, party2: {...p.party2, address: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="গ্রাম/রাস্তা, ডাকঘর, থানা, জেলা" />
                    </div>
                  </div>
                </div>

                {/* Nominee */}
                <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">বিনিয়োগকারীর নমিনী</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম</label>
                      <input type="text" value={agreementData.nominee.name} onChange={e => setAgreementData(p => ({...p, nominee: {...p.nominee, name: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">পিতার নাম</label>
                      <input type="text" value={agreementData.nominee.fname} onChange={e => setAgreementData(p => ({...p, nominee: {...p.nominee, fname: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মাতার নাম</label>
                      <input type="text" value={agreementData.nominee.mname} onChange={e => setAgreementData(p => ({...p, nominee: {...p.nominee, mname: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল</label>
                      <input type="text" value={agreementData.nominee.mobile} onChange={e => setAgreementData(p => ({...p, nominee: {...p.nominee, mobile: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                      <input type="text" value={agreementData.nominee.nid} onChange={e => setAgreementData(p => ({...p, nominee: {...p.nominee, nid: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                      <input type="text" value={agreementData.nominee.address} onChange={e => setAgreementData(p => ({...p, nominee: {...p.nominee, address: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="গ্রাম/রাস্তা, ডাকঘর, থানা, জেলা" />
                    </div>
                  </div>
                </div>

                {/* Agreement Details */}
                <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">শর্তাবলী ও আর্থিক বিবরণ</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোট টাকা (অংকে)</label>
                      <input type="text" value={agreementData.details.totalAmount} onChange={e => setAgreementData(p => ({...p, details: {...p.details, totalAmount: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="১,৪০,০০০" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোট টাকা (কথায়)</label>
                      <input type="text" value={agreementData.details.totalAmountWords} onChange={e => setAgreementData(p => ({...p, details: {...p.details, totalAmountWords: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="এক লক্ষ চল্লিশ হাজার" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মাসিক কিস্তি (অংকে)</label>
                      <input type="text" value={agreementData.details.installmentAmount} onChange={e => setAgreementData(p => ({...p, details: {...p.details, installmentAmount: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="৩,৩৩৩" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মাসিক কিস্তি (কথায়)</label>
                      <input type="text" value={agreementData.details.installmentAmountWords} onChange={e => setAgreementData(p => ({...p, details: {...p.details, installmentAmountWords: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="তিন হাজার তিনশত তেত্রিশ" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">কত মাস (কিস্তি সংখ্যা)</label>
                      <input type="text" value={agreementData.details.installmentCount} onChange={e => setAgreementData(p => ({...p, details: {...p.details, installmentCount: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="১২ (বারো)" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">পরিশোধের তারিখ</label>
                      <input type="text" value={agreementData.details.paymentDate} onChange={e => setAgreementData(p => ({...p, details: {...p.details, paymentDate: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="১০/০৭/২০২৭" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">বাকী টাকা (অংকে)</label>
                      <input type="text" value={agreementData.details.dueAmount} onChange={e => setAgreementData(p => ({...p, details: {...p.details, dueAmount: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="১,০০,০০০" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">বাকী টাকা (কথায়)</label>
                      <input type="text" value={agreementData.details.dueAmountWords} onChange={e => setAgreementData(p => ({...p, details: {...p.details, dueAmountWords: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="এক লক্ষ" />
                    </div>
                    
                    <div className="col-span-2 mt-2 pt-2 border-t border-slate-200">
                      <h4 className="text-[11px] font-bold text-slate-600 mb-3">ব্যাংক বিবরণ</h4>
                    </div>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">১ম পক্ষের ব্যাংক নাম</label>
                      <input type="text" value={agreementData.details.party1Bank} onChange={e => setAgreementData(p => ({...p, details: {...p.details, party1Bank: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="ডাচ বাংলা ব্যাংক লিঃ" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">১ম পক্ষের হিসাব নং</label>
                      <input type="text" value={agreementData.details.party1Account} onChange={e => setAgreementData(p => ({...p, details: {...p.details, party1Account: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="২৭০১..." />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">২য় পক্ষের ব্যাংক নাম</label>
                      <input type="text" value={agreementData.details.party2Bank} onChange={e => setAgreementData(p => ({...p, details: {...p.details, party2Bank: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="ইসলামী ব্যাংক লিঃ" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">২য় পক্ষের হিসাব নং</label>
                      <input type="text" value={agreementData.details.party2Account} onChange={e => setAgreementData(p => ({...p, details: {...p.details, party2Account: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="২০৫০..." />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">১ম পক্ষের চেক পাতা নং</label>
                      <input type="text" value={agreementData.details.chequeNumber} onChange={e => setAgreementData(p => ({...p, details: {...p.details, chequeNumber: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="০৯০২৬০৮৯২" />
                    </div>
                  </div>
                </div>

                {/* Warishan */}
                <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50 lg:col-span-2">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">স্থলবর্তী ওয়ারিশানগন</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Warish 1 */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-indigo-600">ওয়ারিশ-১</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">সম্পর্ক</label>
                          <input type="text" value={agreementData.warish1.relation} onChange={e => setAgreementData(p => ({...p, warish1: {...p.warish1, relation: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="যেমন: ছোট ভাই" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম</label>
                          <input type="text" value={agreementData.warish1.name} onChange={e => setAgreementData(p => ({...p, warish1: {...p.warish1, name: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                          <input type="text" value={agreementData.warish1.nid} onChange={e => setAgreementData(p => ({...p, warish1: {...p.warish1, nid: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল</label>
                          <input type="text" value={agreementData.warish1.mobile} onChange={e => setAgreementData(p => ({...p, warish1: {...p.warish1, mobile: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                          <input type="text" value={agreementData.warish1.address} onChange={e => setAgreementData(p => ({...p, warish1: {...p.warish1, address: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                      </div>
                    </div>

                    {/* Warish 2 */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-indigo-600">ওয়ারিশ-২</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">সম্পর্ক</label>
                          <input type="text" value={agreementData.warish2.relation} onChange={e => setAgreementData(p => ({...p, warish2: {...p.warish2, relation: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="যেমন: স্ত্রী" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম</label>
                          <input type="text" value={agreementData.warish2.name} onChange={e => setAgreementData(p => ({...p, warish2: {...p.warish2, name: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                          <input type="text" value={agreementData.warish2.nid} onChange={e => setAgreementData(p => ({...p, warish2: {...p.warish2, nid: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল</label>
                          <input type="text" value={agreementData.warish2.mobile} onChange={e => setAgreementData(p => ({...p, warish2: {...p.warish2, mobile: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                          <input type="text" value={agreementData.warish2.address} onChange={e => setAgreementData(p => ({...p, warish2: {...p.warish2, address: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Witnesses */}
                <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50 lg:col-span-2">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">সাক্ষীগণ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="space-y-4">
                        <h4 className="text-xs font-bold text-indigo-600">সাক্ষী-{num}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম</label>
                            <input type="text" value={(agreementData[`witness${num}` as keyof typeof agreementData] as any).name} onChange={e => setAgreementData(p => ({...p, [`witness${num}`]: {...p[`witness${num}` as keyof typeof p], name: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                            <input type="text" value={(agreementData[`witness${num}` as keyof typeof agreementData] as any).address} onChange={e => setAgreementData(p => ({...p, [`witness${num}`]: {...p[`witness${num}` as keyof typeof p], address: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                            <input type="text" value={(agreementData[`witness${num}` as keyof typeof agreementData] as any).nid} onChange={e => setAgreementData(p => ({...p, [`witness${num}`]: {...p[`witness${num}` as keyof typeof p], nid: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল</label>
                            <input type="text" value={(agreementData[`witness${num}` as keyof typeof agreementData] as any).mobile} onChange={e => setAgreementData(p => ({...p, [`witness${num}`]: {...p[`witness${num}` as keyof typeof p], mobile: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => {
                    const dataStr = encodeURIComponent(JSON.stringify(agreementData));
                    window.open(`/print-agreement?data=${dataStr}`, '_blank');
                  }}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <FileText size={18} /> প্রিন্ট করুন
                </button>
              </div>
            </div>
          )}
          
                    {/* TAB: STAFF PORTAL */}
          {activeTab === 'staff' && <StaffPortal />}
          
          {/* TAB: SCAN STATUS */}
          {activeTab === 'scan_status' && (
            <div className="max-w-3xl bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="font-extrabold text-base text-slate-800">স্ক্যান ও স্ট্যাটাস আপডেট</h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5">বারকোড স্ক্যান করে অর্ডার বা কুরিয়ার স্ট্যাটাস আপডেট করুন</p>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">টার্গেট স্ট্যাটাস নির্ধারণ করুন</label>
                  <select
                    value={scanStatusTarget}
                    onChange={(e) => setScanStatusTarget(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none focus:border-[#2e7d32]"
                  >
                    <option value="Pending">Pending (পেন্ডিং)</option>
                    <option value="Processing">Processing (প্রসেসিং)</option>
                    <option value="Shipped">Shipped (কুরিয়ারে)</option>
                    <option value="Delivered">Delivered (ডেলিভার্ড)</option>
                    <option value="Cancelled">Cancelled (ক্যান্সেল)</option>
                    <option value="Returned">Returned (রিটার্ন)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">বারকোড স্ক্যান করুন (অর্ডার আইডি / ট্র্যাকিং)</label>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!scanStatusInput.trim()) return;
                    
                    const scannedId = scanStatusInput.trim();
                    let updated = false;

                    // 1. Check Orders
                    const orderToUpdate = orders.find(o => o.id === scannedId);
                    if (orderToUpdate) {
                      updateOrderStatus(orderToUpdate.id, scanStatusTarget as any);
                      addNotification('স্ট্যাটাস আপডেট', `অর্ডার ${orderToUpdate.id} এর স্ট্যাটাস '${scanStatusTarget}' করা হয়েছে।`);
                      updated = true;
                    }

                    // 2. Check Courier (if no order matched, try courier consignment)
                    if (!updated) {
                       const courierMatch = courierHistory.find(c => String(c.consignment_id) === scannedId || String(c.tracking_code) === scannedId);
                       if (courierMatch) {
                          updateDoc(doc(courierHistoryCollection, String(courierMatch.consignment_id)), {
                             status: scanStatusTarget.toLowerCase() === 'delivered' ? 'delivered' : 
                                     (scanStatusTarget.toLowerCase() === 'cancelled' || scanStatusTarget.toLowerCase() === 'returned') ? 'cancelled' : 'in_transit'
                          }).then(() => {
                             addNotification('কুরিয়ার আপডেট', `কুরিয়ার বুকিং ${scannedId} আপডেট করা হয়েছে।`);
                          }).catch(err => alert(err.message));
                          updated = true;
                       }
                    }

                    if (!updated) {
                      alert('এই আইডি দিয়ে কোনো অর্ডার বা কুরিয়ার বুকিং পাওয়া যায়নি!');
                    }

                    setScanStatusInput('');
                  }}>
                    <input
                      type="text"
                      autoFocus
                      value={scanStatusInput}
                      onChange={(e) => setScanStatusInput(e.target.value)}
                      placeholder="এখানে স্ক্যান করুন..."
                      className="w-full px-4 py-4 rounded-xl border-2 border-indigo-200 bg-white font-mono text-lg font-black text-slate-800 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all"
                    />
                    <p className="text-[10px] text-slate-400 mt-2 font-bold flex items-center gap-1"><ScanBarcode size={12}/> ইনপুট ফিল্ডে কার্সর রেখে স্ক্যানার দিয়ে স্ক্যান করুন</p>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SCAN ARTICLE */}
          {activeTab === 'scan_article' && (
            <div className="max-w-3xl bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="font-extrabold text-base text-slate-800">স্ক্যান ও আর্টিকেল এন্ট্রি</h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5">আর্টিকেল স্ক্যান করে দ্রুত স্টক যোগ করুন</p>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">আর্টিকেল বারকোড স্ক্যান করুন</label>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!scanArticleInput.trim()) return;
                    
                    const scannedId = scanArticleInput.trim().toLowerCase();
                    const productMatch = products.find(p => (p.article || '').toLowerCase() === scannedId || p.id.toLowerCase() === scannedId);
                    
                    if (productMatch) {
                      setScanArticleProduct(productMatch);
                      addNotification('পণ্য পাওয়া গেছে', `${productMatch.name} (আর্টিকেল: ${productMatch.article || 'N/A'}) পাওয়া গেছে।`);
                    } else {
                      alert('এই আর্টিকেল বা আইডি দিয়ে কোনো পণ্য পাওয়া যায়নি!');
                      setScanArticleProduct(null);
                    }
                    setScanArticleInput('');
                  }}>
                    <input
                      type="text"
                      autoFocus
                      value={scanArticleInput}
                      onChange={(e) => setScanArticleInput(e.target.value)}
                      placeholder="আর্টিকেল স্ক্যান করুন..."
                      className="w-full px-4 py-4 rounded-xl border-2 border-[#2e7d32]/30 bg-white font-mono text-lg font-black text-slate-800 outline-none focus:border-[#2e7d32] focus:ring-4 focus:ring-[#2e7d32]/10 transition-all"
                    />
                  </form>
                </div>

                {scanArticleProduct && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <div className="flex gap-4 items-center border-b border-slate-200 pb-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                         {scanArticleProduct.image ? <img src={scanArticleProduct.image} className="w-full h-full object-cover" alt="Product" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><Package size={24} /></div>}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg">{scanArticleProduct.name}</h4>
                        <p className="text-xs font-bold text-slate-500">আর্টিকেল: {scanArticleProduct.article || 'N/A'} | বর্তমান স্টক: {scanArticleProduct.stock || 0} পিস</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">বক্স যোগ করুন</label>
                         <input type="number" value={scanArticleBoxes} onChange={e => setScanArticleBoxes(e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 font-bold outline-none focus:border-[#2e7d32]" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">খুচরা জোড়া যোগ করুন</label>
                         <input type="number" value={scanArticlePairs} onChange={e => setScanArticlePairs(e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 font-bold outline-none focus:border-[#2e7d32]" />
                       </div>
                    </div>
                    <button 
                      onClick={() => {
                        const boxes = parseInt(scanArticleBoxes) || 0;
                        const pairs = parseInt(scanArticlePairs) || 0;
                        const addAmount = (boxes * 24) + pairs;
                        if (addAmount <= 0) return;
                        updateProduct({ ...scanArticleProduct, stock: (scanArticleProduct.stock || 0) + addAmount });
                        addNotification('স্টক আপডেট', `${scanArticleProduct.name}-এ ${addAmount} পিস স্টক যোগ করা হয়েছে।`);
                        setScanArticleProduct(null);
                        setScanArticleBoxes('0');
                        setScanArticlePairs('0');
                      }}
                      className="w-full bg-[#2e7d32] hover:bg-[#1b4332] text-white py-3 rounded-xl font-black text-sm shadow-lg shadow-[#2e7d32]/20 active:scale-95 transition-all"
                    >
                      স্টক আপডেট করুন
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: SCAN ORDER */}
          {activeTab === 'scan_order' && (
            <div className="max-w-5xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl p-6 sm:p-8 space-y-8">
              <div>
                <h3 className="font-extrabold text-xl text-slate-800">স্ক্যান করে ম্যানুয়াল অর্ডার</h3>
                <p className="text-sm text-slate-500 font-bold mt-1">পণ্য স্ক্যান করে দ্রুত কাস্টমার অর্ডার তৈরি করুন</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase tracking-wider">বারকোড / আর্টিকেল স্ক্যান করুন</label>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!scanOrderInput.trim()) return;
                      
                      const scannedId = scanOrderInput.trim().toLowerCase();
                      const productMatch = products.find(p => (p.article || '').toLowerCase() === scannedId || p.id.toLowerCase() === scannedId);
                      
                      if (productMatch) {
                        const priceToUse = Math.round((productMatch.discountedPrice || productMatch.originalPrice) / 24);
                        const existing = manualOrderItems.find(i => i.id === productMatch.id);
                        if (existing) {
                          setManualOrderItems(prev => prev.map(item => item.id === productMatch.id ? { ...item, quantity: item.quantity + 1 } : item));
                        } else {
                          setManualOrderItems(prev => [...prev, { id: productMatch.id, name: productMatch.name, quantity: 1, price: priceToUse }]);
                        }
                        triggerSound();
                        addNotification('পণ্য যোগ', `${productMatch.name} অর্ডারে যোগ করা হয়েছে।`);
                      } else {
                        alert('পণ্য পাওয়া যায়নি!');
                      }
                      setScanOrderInput('');
                    }}>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <ScanBarcode className="text-[#2e7d32]/50" size={24} />
                        </div>
                        <input
                          type="text"
                          autoFocus
                          value={scanOrderInput}
                          onChange={(e) => setScanOrderInput(e.target.value)}
                          placeholder="পণ্য স্ক্যান করুন..."
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-slate-50 font-mono text-lg font-black text-slate-800 outline-none focus:border-[#2e7d32] focus:bg-white focus:ring-4 focus:ring-[#2e7d32]/10 transition-all shadow-inner"
                        />
                      </div>
                    </form>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm min-h-[350px] flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                        <ShoppingCart size={16} className="text-[#2e7d32]" />
                        অর্ডার আইটেমস
                      </h4>
                      <span className="bg-[#2e7d32]/10 text-[#2e7d32] px-2.5 py-0.5 rounded-full text-xs font-black">{manualOrderItems.length}</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {manualOrderItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-3 py-10">
                          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                            <ScanLine size={32} />
                          </div>
                          <p className="text-sm font-bold">কোনো পণ্য যোগ করা হয়নি</p>
                        </div>
                      ) : (
                        manualOrderItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-slate-50 hover:bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm transition-colors group">
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-800 leading-tight">{item.name}</p>
                              <p className="text-[11px] text-slate-500 font-extrabold mt-1">{item.quantity} x ৳{item.price.toLocaleString('bn-BD')}</p>
                            </div>
                            <div className="flex items-center gap-4 pl-3 border-l border-slate-200">
                               <p className="text-sm font-black text-[#2e7d32]">৳{(item.quantity * item.price).toLocaleString('bn-BD')}</p>
                               <button onClick={() => setManualOrderItems(prev => prev.filter(i => i.id !== item.id))} className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-colors"><X size={16}/></button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-5 bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#2e7d32]/5 rounded-bl-full pointer-events-none" />
                   
                   <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                     <User size={16} className="text-[#2e7d32]" />
                     কাস্টমার ও বিলিং
                   </h4>
                   
                   <div className="space-y-4 relative z-10">
                     <div>
                       <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">কাস্টমারের নাম</label>
                       <input type="text" value={manualOrderCustomerName} onChange={e => setManualOrderCustomerName(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 bg-white font-bold text-sm outline-none focus:border-[#2e7d32] focus:ring-4 focus:ring-[#2e7d32]/10 transition-all shadow-sm" placeholder="কাস্টমারের নাম লিখুন" />
                     </div>
                     
                     <div>
                       <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">মোবাইল নম্বর</label>
                       <input type="text" value={manualOrderPhone} onChange={e => {
                          const newPhone = e.target.value;
                          setManualOrderPhone(newPhone);
                          if (newPhone.length >= 11) {
                            const prevOrder = orders.find(o => o.phone === newPhone);
                            if (prevOrder) {
                              if (!manualOrderCustomerName) setManualOrderCustomerName(prevOrder.customerName);
                              if (!manualOrderAddress) setManualOrderAddress(prevOrder.address);
                            }
                          }
                       }} className="w-full p-3 rounded-xl border border-slate-200 bg-white font-bold text-sm outline-none focus:border-[#2e7d32] focus:ring-4 focus:ring-[#2e7d32]/10 transition-all shadow-sm" placeholder="01XXX..." />
                     </div>

                     <div>
                       <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">ঠিকানা</label>
                       <textarea value={manualOrderAddress} onChange={e => setManualOrderAddress(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 bg-white font-bold text-sm outline-none focus:border-[#2e7d32] focus:ring-4 focus:ring-[#2e7d32]/10 transition-all resize-none h-20 shadow-sm" placeholder="ডেলিভারি ঠিকানা লিখুন" />
                     </div>

                     <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl shadow-inner">
                        <button type="button" onClick={() => setManualOrderIsDue(false)} className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${!manualOrderIsDue ? 'bg-white shadow-md text-[#2e7d32]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>ক্যাশ অন ডেলিভারি</button>
                        <button type="button" onClick={() => setManualOrderIsDue(true)} className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${manualOrderIsDue ? 'bg-white shadow-md text-[#2e7d32]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>বকেয়া / পেইড</button>
                     </div>
                     
                     {!manualOrderIsDue && (
                       <div>
                         <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">ডেলিভারি চার্জ</label>
                         <input type="number" value={manualDeliveryCharge} onChange={e => setManualDeliveryCharge(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-200 bg-white font-bold text-sm outline-none focus:border-[#2e7d32] focus:ring-4 focus:ring-[#2e7d32]/10 transition-all shadow-sm" placeholder="যেমন: ১২০" />
                       </div>
                     )}

                     <div className="pt-4 mt-2">
                       <div className="bg-[#2e7d32]/5 p-4 rounded-xl border border-[#2e7d32]/10">
                         <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                           <span>সাবটোটাল</span>
                           <span>৳{manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('bn-BD')}</span>
                         </div>
                         {!manualOrderIsDue && (
                           <div className="flex justify-between text-xs font-bold text-slate-600 mb-3">
                             <span>ডেলিভারি চার্জ</span>
                             <span>৳{(Number(manualDeliveryCharge) || 0).toLocaleString('bn-BD')}</span>
                           </div>
                         )}
                         <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-[#2e7d32]/20">
                           <span>মোট বিল</span>
                           <span className="text-[#2e7d32]">৳{(manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (manualOrderIsDue ? 0 : (Number(manualDeliveryCharge) || 0))).toLocaleString('bn-BD')}</span>
                         </div>
                       </div>
                     </div>

                     <button 
                       disabled={manualOrderItems.length === 0 || !manualOrderCustomerName || !manualOrderPhone || !manualOrderAddress}
                       onClick={() => {
                          const subtotal = manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                          const total = subtotal + (manualOrderIsDue ? 0 : (Number(manualDeliveryCharge) || 0));
                          
                          addSimulatedOrder({
                            id: `ord-${Math.floor(100 + Math.random() * 900)}`,
                            customerName: manualOrderCustomerName,
                            phone: manualOrderPhone,
                            address: manualOrderAddress,
                            items: manualOrderItems,
                            total,
                            date: new Date().toISOString(),
                            status: 'Pending' as const
                          });
                          
                          addNotification('ম্যানুয়াল অর্ডার', 'অর্ডারটি সফলভাবে ডাটাবেসে যোগ করা হয়েছে।');
                          setManualOrderItems([]);
                          setManualOrderCustomerName('');
                          setManualOrderPhone('');
                          setManualOrderAddress('');
                       }}
                       className="w-full bg-gradient-to-r from-[#2e7d32] to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-4 rounded-xl font-black text-sm shadow-lg shadow-[#2e7d32]/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
                     >
                       <ShoppingCart size={18} strokeWidth={2.5} />
                       অর্ডার নিশ্চিত করুন
                     </button>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-xl bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-6">
              
              <div>
                <h3 className="font-extrabold text-base text-slate-800">স্টোর ইনফরমেশন সেটিংস</h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5">গ্রাহক স্টোর ইন্টারফেসে প্রদর্শিত যোগাযোগের ডিটেইলস আপডেট করুন</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">স্টোরের নাম</label>
                  <input type="text" defaultValue="এম.কে.গ্রুপ" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs font-bold focus:border-[#2e7d32]" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">স্টোর হটলাইন নাম্বার</label>
                  <input type="text" defaultValue="+880 1969-317241" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs font-bold focus:border-[#2e7d32]" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">হেল্পডেস্ক ইমেইল</label>
                  <input type="email" defaultValue="mkgroupbd.ltd@gmail.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs font-bold focus:border-[#2e7d32]" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">স্টোর আউটলেট ঠিকানা</label>
                  <input type="text" defaultValue="পানধোয়া বাজার (জাহাঙ্গীর নগর বিশ্ববিদ্যালয় সংলগ্ন) সেনওয়ালিয়া-১৩৪৪,আশুলিয়া,সাভার,ঢাকা।" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs font-bold focus:border-[#2e7d32]" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ডেলিভারি চার্জ (টাকা)</label>
                  <input type="number" defaultValue="৮০" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs font-bold focus:border-[#2e7d32]" />
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => alert('সফলভাবে সেটিংস সংরক্ষিত হয়েছে!')}
                    className="bg-[#2e7d32] text-white py-2.5 px-6 rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
                  >
                    সেটিংস সংরক্ষণ করুন
                  </button>
                </div>
              </div>

              {/* Real-time Order push & chime alert setup card */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5">
                    <Bell size={18} className="text-[#2e7d32]" />
                    অর্ডার নোটিফিকেশন ও অ্যালার্ম সেটিংস
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">নতুন অর্ডার জেনারেট হওয়ার সাথে সাথে ব্রাউজারে অ্যালার্ম শুনুন</p>
                </div>

                <div className="space-y-3 font-bold text-xs text-slate-700">
                  {/* Alarm switch toggle */}
                  <label className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/50 rounded-xl cursor-pointer border border-slate-100 transition-colors select-none">
                    <div className="flex flex-col gap-0.5 max-w-[80%]">
                      <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                        {soundEnabled ? <Volume2 size={16} className="text-[#2e7d32]" /> : <VolumeX size={16} className="text-slate-400" />}
                        পিয়ানো রিং টোন চিম অ্যালার্ম
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold leading-relaxed">অর্ডার সম্পন্ন হবার সাথে সাথে রিয়েল-টাইমে অ্যালার্ম সাউন্ড বাজবে</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={soundEnabled} 
                        onChange={() => setSoundEnabled(!soundEnabled)} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2e7d32]"></div>
                    </div>
                  </label>

                  {/* HTML5 Push System status */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-4 font-bold select-none">
                    <div className="flex flex-col gap-0.5 max-w-[70%]">
                      <span className="text-slate-800 font-extrabold">উইন্ডোজ/মোবাইল ডেক্সটপ পুশ অ্যালার্ট</span>
                      <span className="text-[10px] text-slate-400 font-bold leading-relaxed">
                        অবস্থা: {desktopPermission === 'granted' ? 'সিস্টেম চালু আছে (Granted) ✅' : desktopPermission === 'denied' ? 'বন্ধ করা আছে (Denied) ❌' : 'অনুমতি নেওয়া হয়নি ⚠️'}
                      </span>
                    </div>

                    {desktopPermission !== 'granted' ? (
                      <button 
                        onClick={requestDesktopPermission}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        অনুমতি চালু করুন
                      </button>
                    ) : (
                      <span className="text-emerald-600 text-[10px] bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded font-black uppercase">Active</span>
                    )}
                  </div>

                  {/* Manual testing buttons */}
                  <div className="grid grid-cols-2 gap-3.5 pt-2 select-none">
                    <button
                      type="button"
                      onClick={triggerSound}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1.5 border border-slate-200/50 transition-all cursor-pointer active:scale-95"
                    >
                      🗣️ অ্যালার্ম সাউন্ড টেস্ট করুন
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const testNames = ['মুহাম্মদ সালমান রহমান', 'ফারজানা ইয়াসমিন', 'ইশতিয়াক আহমেদ চৌধুরী', 'তানজিম হাসান', 'রুবাইয়া কবীর'];
                        const testPhones = ['01712445522', '01811883311', '01915998822', '01552223344', '01673887755'];
                        const testAddrs = ['রোড ৪, হাউজিং স্টেট, ধানমন্ডি, ঢাকা', 'সেক্টর ৪, উত্তরা মডেল টাউন, ঢাকা', 'মুরাদপুর ফরেস্ট গেট, চট্টগ্রাম', 'সেনপাড়া শ্যাওড়াপাড়া, মিরপুর ২, ঢাকা', 'হাতিমবাগ, সিলেট'];
                        
                        const rN = testNames[Math.floor(Math.random() * testNames.length)];
                        const rP = testPhones[Math.floor(Math.random() * testPhones.length)];
                        const rA = testAddrs[Math.floor(Math.random() * testAddrs.length)];
                        
                        // Select a random product
                        const list = products.length > 0 ? products : [
                          { id: 'p1', name: 'প্রিমিয়াম পণ্য', originalPrice: 799, category: '', weight: '১ কেজি', image: '' }
                        ];
                        const randomP = list[Math.floor(Math.random() * list.length)];
                        
                        const items = [{
                          id: randomP.id,
                          name: randomP.name,
                          quantity: 1,
                          price: (randomP as any).discountedPrice || randomP.originalPrice
                        }];

                        const totalBill = items.reduce((sum, item) => sum + item.price, 0);

                        const randomMockOrderObj = {
                          id: `ord-${Math.floor(100 + Math.random() * 900)}`,
                          customerName: rN,
                          phone: rP,
                          address: rA,
                          items: items,
                          total: totalBill,
                          date: new Date().toISOString(),
                          status: 'Pending' as const
                        };

                        addSimulatedOrder(randomMockOrderObj);
                      }}
                      className="bg-emerald-50 hover:bg-emerald-100 text-[#2e7d32] py-2.5 px-4 rounded-xl text-[10px] font-black border border-emerald-200 flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      🚀 নতুন অর্ডার সিমুলেট
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* 4. MODAL DETAILED IMPLEMENTATION */}
      
      {/* Manual Order Creation Modal */}
            {isManualOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setIsManualOrderModalOpen(false); setEditingOrderId(null); }}></div>
          
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 select-none">
              <h3 className="font-extrabold text-sm md:text-base text-slate-800 flex items-center gap-2">
                <ShoppingBag size={18} className="text-amber-500" />
                <span>{editingOrderId ? 'ম্যানুয়াল ক্যাশ-অন-ডেলিভারি অর্ডার এডিট' : 'ম্যানুয়াল ক্যাশ-অন-ডেলিভারি অর্ডার তৈরি'}</span>
              </h3>
              <button onClick={() => { setIsManualOrderModalOpen(false); setEditingOrderId(null); }} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>
            {!createdOrderForActions ? (
              <>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Form 1: Customer Details */}
              <div className="space-y-3.5">
                <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">১. গ্রাহকের বিবরণী</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">গ্রাহকের নাম *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="যেমন: মুহাম্মদ সালমান" 
                      value={manualOrderCustomerName}
                      onChange={(e) => setManualOrderCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">মোবাইল নম্বর *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="যেমন: 01712345678" 
                      value={manualOrderPhone}
                                            onChange={(e) => {
                        const newPhone = e.target.value;
                        setManualOrderPhone(newPhone);
                        if (newPhone.length >= 11) {
                          const prevOrder = orders.find(o => o.phone === newPhone);
                          if (prevOrder) {
                            if (!manualOrderCustomerName) setManualOrderCustomerName(prevOrder.customerName);
                            if (!manualOrderAddress) setManualOrderAddress(prevOrder.address);
                          }
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">ডেলিভারি ঠিকানা *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="যেমন: রোড ৪, হাউজিং স্টেট, ধানমন্ডি, ঢাকা" 
                      value={manualOrderAddress}
                      onChange={(e) => setManualOrderAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                  <div className="sm:col-span-2 mt-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-2">পেমেন্ট স্ট্যাটাস *</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="paymentStatus" 
                          checked={!manualOrderIsDue}
                          onChange={() => setManualOrderIsDue(false)}
                          className="w-4 h-4 text-[#2e7d32] bg-gray-100 border-gray-300 focus:ring-[#2e7d32]"
                        />
                        <span className="text-xs font-bold text-slate-700">ক্যাশ অন ডেলিভারি (COD)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="paymentStatus" 
                          checked={manualOrderIsDue}
                          onChange={() => setManualOrderIsDue(true)}
                          className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 focus:ring-rose-500"
                        />
                        <span className="text-xs font-black text-rose-600">বকেয়া খাতায় যোগ করুন</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Form 2: Product Adder */}
              <div className="space-y-3.5">
                <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">২. পণ্য এবং পরিমাণ যুক্ত করুন</h4>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">আর্টিকেল নং বা নাম</label>
                    <input 
                      type="text" 
                      value={manualArticleSearch}
                      placeholder="যেমন: ART-1 অথবা পণ্যের নাম"
                      onChange={(e) => {
                        const val = e.target.value;
                        setManualArticleSearch(val);
                        if (val) {
                          const prod = products.find(p => p.article?.toLowerCase() === val.toLowerCase() || p.name?.toLowerCase().includes(val.toLowerCase()));
                          if (prod) {
                            setManualSelectedProductId(prod.id);
                          } else {
                            setManualSelectedProductId('');
                          }
                        } else {
                          setManualSelectedProductId('');
                        }
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32] bg-white"
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">কাস্টম মূল্য</label>
                      <input 
                        type="number" 
                        min="0"
                        value={manualSelectedPrice === '' ? '' : manualSelectedPrice}
                        onChange={(e) => setManualSelectedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]"
                        placeholder="৳"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">পরিমাণ (জোড়া)</label>
                      <input 
                        type="number" 
                        min="1"
                        value={manualSelectedQuantity === '' ? '' : manualSelectedQuantity}
                        onChange={(e) => setManualSelectedQuantity(e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]"
                        placeholder="পরিমাণ"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const qty = Number(manualSelectedQuantity) || 1;
                        let finalId = manualSelectedProductId;
                        let finalName = manualArticleSearch;
                        let finalPrice = Number(manualSelectedPrice) || 0;

                        if (manualSelectedProductId) {
                            const product = products.find(p => p.id === manualSelectedProductId);
                            if (product) {
                                finalName = product.name;
                                if (manualSelectedPrice === '') {
                                    finalPrice = product.discountedPrice || product.originalPrice;
                                    if (!finalPrice) {
                                        alert('এই পণ্যের মূল্য ডাটাবেজে উল্লেখ নেই। দয়া করে একটি কাস্টম মূল্য লিখুন।');
                                        return;
                                    }
                                }
                            }
                        } else {
                            // Allow custom article adding
                            if (!manualArticleSearch.trim()) {
                                alert('অনুগ্রহ করে পণ্যের আর্টিকেল বা নাম লিখুন।');
                                return;
                            }
                            if (manualSelectedPrice === '') {
                                alert('দয়া করে এই কাস্টম পণ্যের মূল্য লিখুন।');
                                return;
                            }
                            finalId = 'custom-' + Date.now();
                        }
                        
                        const existingIndex = manualOrderItems.findIndex(item => item.id === finalId);
                        if (existingIndex > -1) {
                          const updated = [...manualOrderItems];
                          updated[existingIndex].quantity += qty;
                          // update price if provided
                          if (manualSelectedPrice !== '') updated[existingIndex].price = finalPrice;
                          setManualOrderItems(updated);
                        } else {
                          setManualOrderItems(prev => [...prev, {
                            id: finalId,
                            name: finalName,
                            quantity: qty,
                            price: finalPrice
                          }]);
                        }
                        // Reset selection quantity
                        setManualSelectedQuantity('');
                        setManualSelectedPrice('');
                        setManualSelectedProductId('');
                        setManualArticleSearch('');
                      }}
                      className="bg-[#2e7d32] hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-black h-[42px] transition-all cursor-pointer"
                    >
                      যোগ করুন
                    </button>
                  </div>
                </div>
                {manualSelectedProductId && products.find(p => p.id === manualSelectedProductId) && (
                  <p className="text-[10px] text-[#2e7d32] font-bold mt-1.5 bg-emerald-50 px-2.5 py-1.5 border border-emerald-100 rounded inline-block">নির্বাচিত পণ্য: {products.find(p => p.id === manualSelectedProductId)?.name}</p>
                )}
              </div>
              {/* Form 3: Current Order Items list */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">৩. অর্ডার তালিকা ও হিসাব</h4>
                
                {manualOrderItems.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 font-bold bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-[11px]">
                    এখনো কোন পণ্য যুক্ত করা হয়নি। উপর থেকে পণ্য নির্বাচন করে যুক্ত করুন।
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-slate-50/50">
                    {manualOrderItems.map((item, idx) => (
                      <div key={item.id} className="p-3 flex items-center justify-between text-xs font-bold">
                        <div className="min-w-0 flex-1 flex items-start gap-2">
                          <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[9px] mt-0.5 shrink-0">{idx + 1}</span>
                          <div>
                            <span className="text-slate-800 font-black block truncate">{item.name}</span>
                            <span className="text-[10px] text-slate-400">
                              ৳{item.price.toLocaleString('bn-BD')} × {item.quantity}টি
                              {Number(products.find(p => p.id === item.id)?.piecesPerBox || 24) && (
                                <span className="ml-1 text-emerald-600 font-bold">
                                  ({Math.floor(item.quantity / (Number(products.find(p => p.id === item.id)?.piecesPerBox || 24) || 24))} বক্স {item.quantity % (Number(products.find(p => p.id === item.id)?.piecesPerBox || 24) || 24)} পিস)
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-slate-800 font-black">
                            ৳{(((item as any).price || 0) * item.quantity).toLocaleString('bn-BD')}
                          </span>
                          <button 
                            type="button"
                            onClick={() => {
                              setManualOrderItems(prev => prev.filter(p => p.id !== item.id));
                            }}
                            className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Invoice sub calculations */}
                    <div className="p-3 bg-slate-50 text-[11px] font-bold text-slate-500 space-y-3">
                      <div className="flex justify-between items-center">
                        <span>আইটেম সাবটোটাল:</span>
                        <span>৳{manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('bn-BD')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex-1">ডেলিভারি চার্জ:</span>
                        <input type="number" min="0" value={manualDeliveryCharge} onChange={e => setManualDeliveryCharge(Number(e.target.value) || 0)} className="w-20 px-2 py-1 rounded border border-slate-200 text-right outline-none focus:border-[#2e7d32]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex-1">কনডিশন চার্জ:</span>
                        <input type="number" min="0" value={manualConditionCharge} onChange={e => setManualConditionCharge(Number(e.target.value) || 0)} className="w-20 px-2 py-1 rounded border border-slate-200 text-right outline-none focus:border-[#2e7d32]" />
                      </div>
                      <div className="flex justify-between text-slate-800 font-black text-xs pt-2 border-t border-slate-200">
                        <span>সর্বমোট বিল:</span>
                        <span>৳{(manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (Number(manualDeliveryCharge) || 0) + (Number(manualConditionCharge) || 0)).toLocaleString('bn-BD')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex justify-end gap-2 shrink-0 bg-slate-50 select-none">
              <button 
                type="button" 
                onClick={() => { setIsManualOrderModalOpen(false); setEditingOrderId(null); }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
              >
                বাতিল করুন
              </button>
              <button 
                type="button"
                disabled={manualOrderItems.length === 0 || !manualOrderCustomerName || !manualOrderPhone || !manualOrderAddress}
                onClick={() => {
                  if (manualOrderItems.length === 0) return;
                  if (!manualOrderCustomerName || !manualOrderPhone || !manualOrderAddress) {
                    addNotification('সতর্কতা', 'অনুগ্রহ করে গ্রাহকের সম্পূর্ণ বিবরণ ও তথ্য প্রদান করুন।');
                    return;
                  }

                  // Standard BD Phone number quick validation
                  if (!manualOrderPhone.startsWith('01') || manualOrderPhone.length < 11) {
                    addNotification('সতর্কতা', 'অনুগ্রহ করে একটি সঠিক বাংলাদেশী মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।');
                    return;
                  }

                  const subtotal = manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  const grandTotal = subtotal + (Number(manualDeliveryCharge) || 0) + (Number(manualConditionCharge) || 0);
                  
                  // Deduct from stock
                  manualOrderItems.forEach(item => {
                    const prod = products.find(p => p.id === item.id);
                    if (prod) {
                      updateProduct({ ...prod, stock: Math.max(0, (prod.stock || 0) - item.quantity) });
                    }
                  });


                  const newManualOrderObj = {
                    id: (() => {
      const maxId = orders.reduce((max, o) => {
        const match = o.id.match(/^Ord-(\d+)$/i);
        if (match) return Math.max(max, parseInt(match[1], 10));
        const matchLegacy = o.id.match(/^man-(\d+)$/i);
        if (matchLegacy) return Math.max(max, parseInt(matchLegacy[1], 10));
        return max;
      }, 0);
      return `Ord-${(maxId + 1).toString().padStart(3, '0')}`;
    })(),
                    customerName: manualOrderCustomerName,
                    phone: manualOrderPhone,
                    address: manualOrderAddress,
                    items: manualOrderItems,
                    total: grandTotal,
                    date: new Date().toISOString(),
                    status: 'Pending' as const
                  };

                  addSimulatedOrder(newManualOrderObj);

                  if (manualOrderIsDue) {
                    const addedDue = {
                      id: `d-${Date.now()}`,
                      customerName: manualOrderCustomerName,
                      phone: manualOrderPhone,
                      amount: grandTotal,
                      paidAmount: 0,
                      date: new Date().toISOString(),
                      status: 'Unpaid' as const
                    };
                    setDues(prevDues => [addedDue, ...prevDues]);
                  }


                  // Play sound
                  if (soundEnabled) {
                    triggerSound();
                  }

                  setCreatedOrderForActions(newManualOrderObj);
                }}
                className={`px-5 py-2 rounded-xl text-xs font-black text-white shadow-md transition-all ${
                  (manualOrderItems.length === 0 || !manualOrderCustomerName || !manualOrderPhone || !manualOrderAddress)
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-[#2e7d32] hover:bg-emerald-700'
                }`}
              >
                অর্ডার নিশ্চিত করুন
              </button>
            </div>
            </>
            ) : (
                <div className="text-center py-8 space-y-5 px-5 overflow-y-auto">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={40} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-xl">অর্ডার তৈরি সফল হয়েছে!</h3>
                    <p className="text-sm text-slate-500 mt-1 font-bold">নতুন ম্যানুয়াল অর্ডার সফলভাবে সিস্টেমে যোগ করা হয়েছে।</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm font-bold inline-block w-full text-left space-y-3">
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-500">Order ID:</span>
                      <span className="text-slate-900 font-mono font-black">{createdOrderForActions.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-500">Customer:</span>
                      <span className="text-slate-900 font-black">{createdOrderForActions.customerName}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-slate-500">Total Bill:</span>
                      <span className="text-slate-900 font-mono font-black">৳{createdOrderForActions.total.toLocaleString('bn-BD')}</span>
                    </div>
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => window.open(`/print-invoice?orderId=${createdOrderForActions.id}&name=${encodeURIComponent(createdOrderForActions.customerName)}&phone=${encodeURIComponent(createdOrderForActions.phone)}&amount=${createdOrderForActions.total}`, '_blank')}
                      className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 py-3 rounded-xl text-sm font-extrabold transition-colors cursor-pointer text-center shadow-sm flex justify-center items-center gap-2"
                    >
                      <Download size={18} /> প্রিন্ট ইনভয়েস
                    </button>
                    <button 
                      onClick={() => { 
                        setCourierBookingData({
                          invoice: createdOrderForActions.id,
                          recipient_name: createdOrderForActions.customerName,
                          recipient_phone: createdOrderForActions.phone,
                          recipient_address: createdOrderForActions.address,
                          cod_amount: createdOrderForActions.total.toString(),
                          note: ''
                        });
                        setIsManualOrderModalOpen(false); 
                        setIsCourierBookingOpen(true);
                      }}
                      className="flex-1 bg-[#2e7d32] hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-extrabold transition-colors cursor-pointer shadow-md flex justify-center items-center gap-2"
                    >
                      <Truck size={18} /> কুরিয়ার বুকিং
                    </button>
                  </div>
                  <button 
                    onClick={() => { 
                      setIsManualOrderModalOpen(false); 
                      setCreatedOrderForActions(null); 
                      setManualOrderIsDue(false);
                      setManualOrderCustomerName('');
                      setManualOrderPhone('');
                      setManualOrderAddress('');
                      setManualOrderItems([]);
                      setEditingOrderId(null);
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-sm font-extrabold transition-colors cursor-pointer mt-2"
                  >
                    বন্ধ করুন
                  </button>
                </div>
            )}
          </div>
        </div>
      )}

      
      
{/* Courier Booking Modal */}
      {isCourierBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setIsCourierBookingOpen(false); setAutoBookingResult(null); }}></div>
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <Truck size={18} className="text-[#2e7d32]" /> Steadfast অটো বুকিং
              </h3>
              <button onClick={() => { setIsCourierBookingOpen(false); setAutoBookingResult(null); }} className="text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            {!autoBookingResult ? (
              <>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">কাস্টমারের নাম <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={courierBookingData.recipient_name}
                  onChange={(e) => setCourierBookingData(p => ({ ...p, recipient_name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                  placeholder="নাম লিখুন"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">ফোন নম্বর <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={courierBookingData.recipient_phone}
                    onChange={(e) => setCourierBookingData(p => ({ ...p, recipient_phone: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold font-mono" 
                    placeholder="01..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">কালেকশন অ্যামাউন্ট (৳) <span className="text-rose-500">*</span></label>
                  <input 
                    type="number" 
                    value={courierBookingData.cod_amount}
                    onChange={(e) => setCourierBookingData(p => ({ ...p, cod_amount: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                    placeholder="যেমন: ১৫০০"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">ডেলিভারি ঠিকানা <span className="text-rose-500">*</span></label>
                <textarea 
                  value={courierBookingData.recipient_address}
                  onChange={(e) => setCourierBookingData(p => ({ ...p, recipient_address: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold resize-none" 
                  placeholder="সম্পূর্ণ ঠিকানা লিখুন..."
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">ইনভয়েস নম্বর (ঐচ্ছিক)</label>
                <input 
                  type="text" 
                  value={courierBookingData.invoice}
                  onChange={(e) => setCourierBookingData(p => ({ ...p, invoice: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                  placeholder="INV-XXXX"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">নোট (ঐচ্ছিক)</label>
                <input 
                  type="text" 
                  value={courierBookingData.note}
                  onChange={(e) => setCourierBookingData(p => ({ ...p, note: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                  placeholder="কুরিয়ারের জন্য কোনো নির্দেশনা"
                />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => { setIsCourierBookingOpen(false); setAutoBookingResult(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button 
                onClick={async () => {
                  if (!courierBookingData.recipient_name || !courierBookingData.recipient_phone || !courierBookingData.recipient_address || !courierBookingData.cod_amount) {
                    alert('দয়া করে সব প্রয়োজনীয় তথ্য পূরণ করুন।');
                    return;
                  }
                  
                  try {
                    const response = await fetch('https://portal.packzy.com/api/v1/create_order', {
                      method: 'POST',
                      headers: {
                        'Api-Key': '2p80tiyscewtjoczqbqy9fcugkhpocvz',
                        'Secret-Key': 'y0i0bp251lyktq4vx8fwcr2l',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        invoice: courierBookingData.invoice,
                        recipient_name: courierBookingData.recipient_name,
                        recipient_phone: courierBookingData.recipient_phone,
                        recipient_address: courierBookingData.recipient_address,
                        cod_amount: courierBookingData.cod_amount,
                        note: courierBookingData.note
                      })
                    });
                    const data = await response.json();
                    
                    if (data.status === 200 || data.consignment_id) {
                      const newBooking = {
                        consignment_id: data.consignment?.consignment_id || data.consignment_id,
                        tracking_code: data.consignment?.tracking_code || data.tracking_code || '',
                        tracking_link: data.consignment?.tracking_link || data.tracking_link || '',
                        customer_name: courierBookingData.recipient_name,
                        customer_phone: courierBookingData.recipient_phone,
                        amount: courierBookingData.cod_amount,
                        recipient_address: courierBookingData.recipient_address,
                        status: 'pending',
                        created_at: new Date().toISOString()
                      };
                      await setDoc(doc(courierHistoryCollection, newBooking.consignment_id.toString()), newBooking);
                      setAutoBookingResult({
                        status: 'Success',
                        consignment_id: data.consignment?.consignment_id || data.consignment_id,
                        tracking_code: data.consignment?.tracking_code || data.tracking_code || '',
                        tracking_link: data.consignment?.tracking_link || data.tracking_link || '',
                        invoice: courierBookingData.invoice || 'N/A',
                        cod_amount: courierBookingData.cod_amount,
                        customer_name: courierBookingData.recipient_name,
                        customer_phone: courierBookingData.recipient_phone,
                        customer_address: courierBookingData.recipient_address
                      });
                      setCourierBookingData({ invoice: '', recipient_name: '', recipient_phone: '', recipient_address: '', cod_amount: '', note: '' });
                    } else {
                      alert('বুকিং ব্যর্থ হয়েছে। এরর: ' + (data.message || 'অজানা ত্রুটি'));
                    }
                  } catch (e: any) {
                     alert('নেটওয়ার্ক এরর। দয়া করে আবার চেষ্টা করুন। এরর: ' + e.message);
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#2e7d32] text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-[#2e7d32]/20 cursor-pointer"
              >
                <Check size={16} /> কুরিয়ারে বুক করুন
              </button>
            </div>
              </>
            ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">কুরিয়ার বুকিং সফল হয়েছে!</h3>
                    <p className="text-xs text-slate-500 mt-1 font-bold">অর্ডারটি সরাসরি কুরিয়ার প্যানেলে প্রেরণ করা হয়েছে।</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-bold inline-block w-full text-left space-y-2">
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Booking Status:</span>
                      <span className="text-slate-800 font-extrabold text-emerald-600">{autoBookingResult.status}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Consignment ID:</span>
                      <span className="text-slate-800 font-mono font-black select-all">{autoBookingResult.consignment_id}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Tracking Code:</span>
                      <span className="text-slate-800 font-mono font-black select-all">{autoBookingResult.tracking_code}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Invoice:</span>
                      <span className="text-slate-800 font-mono font-black select-all">{autoBookingResult.invoice}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-400">COD Amount:</span>
                      <span className="text-[#115e5a] font-mono font-black">৳{autoBookingResult.cod_amount}</span>
                    </div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => window.open(`/print-invoice?consignmentId=${autoBookingResult?.consignment_id}&orderId=${encodeURIComponent(autoBookingResult?.invoice || '')}&name=${encodeURIComponent(courierBookingData?.recipient_name || '')}&phone=${encodeURIComponent(courierBookingData?.recipient_phone || '')}&amount=${autoBookingResult?.cod_amount}`, '_blank')}
                      className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer text-center"
                    >
                      প্রিন্ট ইনভয়েস
                    </button>
                    <button 
                      onClick={() => {
                        window.open(`/print-sticker?id=${autoBookingResult.consignment_id}&name=${encodeURIComponent(autoBookingResult.customer_name || courierBookingData?.recipient_name || '')}&phone=${encodeURIComponent(autoBookingResult.customer_phone || courierBookingData?.recipient_phone || '')}&address=${encodeURIComponent(autoBookingResult.customer_address || courierBookingData?.recipient_address || '')}`, '_blank');
                      }}
                      className="flex-1 bg-[#115e5a] text-white py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <Printer size={14} /> স্টিকার
                    </button>
                    <button 
                      onClick={() => { setIsCourierBookingOpen(false); setAutoBookingResult(null); }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      বন্ধ
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      )}


      {/* Custom Receive Modal */}
      {isCustomReceiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCustomReceiveModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800">কাস্টম পণ্য রিসিভ</h3>
              <button onClick={() => setIsCustomReceiveModalOpen(false)} className="text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">পণ্যের নাম <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={customReceiveData.name}
                  onChange={(e) => setCustomReceiveData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                  placeholder="পণ্যের নাম লিখুন"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">পরিমাণ <span className="text-rose-500">*</span></label>
                  <input 
                    type="number" 
                    value={customReceiveData.quantity}
                    onChange={(e) => setCustomReceiveData(p => ({ ...p, quantity: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                    placeholder="যেমন: ৫০"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">কেনার মূল্য (ঐচ্ছিক)</label>
                  <input 
                    type="number" 
                    value={customReceiveData.buyingPrice}
                    onChange={(e) => setCustomReceiveData(p => ({ ...p, buyingPrice: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                    placeholder="যেমন: ১২০০"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">সাপ্লায়ার / ভেন্ডর (ঐচ্ছিক)</label>
                <input 
                  type="text" 
                  value={customReceiveData.supplier}
                  onChange={(e) => setCustomReceiveData(p => ({ ...p, supplier: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                  placeholder="সাপ্লায়ারের নাম"
                />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setIsCustomReceiveModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                বাতিল
              </button>
              <button 
                onClick={() => {
                  if (!customReceiveData.name || !customReceiveData.quantity) {
                    alert('দয়া করে পণ্যের নাম এবং পরিমাণ দিন।');
                    return;
                  }
                  
                  const qty = parseInt(customReceiveData.quantity);
                  if (isNaN(qty) || qty <= 0) {
                    alert('সঠিক পরিমাণ দিন।');
                    return;
                  }

                  const newProduct = {
                    name: customReceiveData.name,
                    originalPrice: customReceiveData.buyingPrice ? parseFloat(customReceiveData.buyingPrice) * 1.2 : 0, // Mock 20% markup
                    category: 'কাস্টম',
                    weight: '১ পিস',
                    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
                    stock: qty,
                    isHidden: true
                  };
                  addProduct(newProduct);
                  alert('কাস্টম রিসিভ সফল হয়েছে!');
                  setIsCustomReceiveModalOpen(false);
                  setCustomReceiveData({ name: '', quantity: '', buyingPrice: '', supplier: '' });
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#2e7d32] text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-[#2e7d32]/20"
              >
                <Check size={16} /> রিসিভ সম্পন্ন
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Product ADD / EDIT Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)}></div>
          
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 select-none">
              <h3 className="font-extrabold text-sm md:text-base text-slate-800 flex items-center gap-2">
                <Package size={18} className="text-[#2e7d32]" />
                {editingProduct ? 'পণ্য সংশোধন করুন' : 'নতুন পণ্য যোগ করুন'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 font-bold">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">পণ্যের পূর্ণ নাম লিখুন (বাংলায়) (ঐচ্ছিক)</label>
                <input 
                  type="text" 
                  value={productFormData.name}
                  onChange={(e) => setProductFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                  placeholder="যেমন: প্রিমিয়াম সাধারণ পণ্য (হাড় ছাড়া)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">আসল মূল্য (৳) <span className="text-rose-500">*</span></label>
                  <input 
                    type="number" 
                    required
                    value={productFormData.originalPrice}
                    onChange={(e) => setProductFormData(p => ({ ...p, originalPrice: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                    placeholder="যেমন: ৮৫০"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">অফার মূল্য (৳) <span className="text-slate-400">(ঐচ্ছিক)</span></label>
                  <input 
                    type="number"
                    value={productFormData.discountedPrice}
                    onChange={(e) => setProductFormData(p => ({ ...p, discountedPrice: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                    placeholder="যেমন: ৭৯৯"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">ক্যাটাগরি নির্ধারণ করুন <span className="text-rose-500">*</span></label>
                  <input 
                    type="text"
                    value={productFormData.category}
                    onChange={(e) => setProductFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#1b4332] text-xs text-slate-700 font-bold"
                    placeholder="ক্যাটাগরির নাম লিখুন (যেমন: সাধারণ পণ্য)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">ওজন / পরিমাপ <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={productFormData.weight}
                    onChange={(e) => setProductFormData(p => ({ ...p, weight: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                    placeholder="যেমন: ১ কেজি, ৫ কেজি, ১ ডজন"
                  />
                </div>
              </div>

               <div>
                <label className="block text-xs text-slate-500 mb-1.5">ছবির লিংক (Unsplash বা পাবলিক URL / আপলোড)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={productFormData.image}
                    onChange={(e) => setProductFormData(p => ({ ...p, image: e.target.value }))}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-normal font-sans" 
                    placeholder="https://images.unsplash.com/..."
                  />
                  <label className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-xs shrink-0 select-none font-bold">
                    <Upload size={14} />
                    ছবি আপলোড (Max 2MB)
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, (url) => {
                            setProductFormData(p => ({ ...p, image: url }));
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                {productFormData.image && productFormData.image.startsWith('data:image/') && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-150 bg-slate-50 relative shrink-0">
                      <img src={productFormData.image} alt="Uploaded" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold font-sans">✓ ছবি সফলভাবে আপলোড হয়েছে</span>
                    <button 
                      type="button" 
                      onClick={() => setProductFormData(p => ({ ...p, image: '' }))} 
                      className="text-rose-500 hover:text-rose-700 text-[10px] font-bold bg-rose-50 px-2 py-1 rounded transition-colors"
                    >
                      মুছে ফেলুন
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1.5">প্রাথমিক স্টক (ঐচ্ছিক)</label>
                <input 
                  type="number" 
                  value={productFormData.stock}
                  onChange={(e) => setProductFormData(p => ({ ...p, stock: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                  placeholder="যেমন: ১০০"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">প্রতি বক্সে কয়টি (ঐচ্ছিক)</label>
                <input 
                  type="number" 
                  value={productFormData.piecesPerBox}
                  onChange={(e) => setProductFormData(p => ({ ...p, piecesPerBox: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                  placeholder="যেমন: ২৪"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1.5">আর্টিকেল নম্বর</label>
                <input 
                  type="text"
                  value={productFormData.article || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProductFormData(p => {
                      const existing = !editingProduct ? products.find(prod => prod.article === val.trim()) : null;
                      if (existing) {
                        return { 
                          ...p, 
                          article: val,
                          originalPrice: p.originalPrice || existing.originalPrice.toString(),
                          name: p.name || existing.name
                        };
                      }
                      return { ...p, article: val };
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#1b4332] text-xs text-slate-700 font-bold mb-4"
                  placeholder="যেমন: ART-1234"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1.5">পণ্যের বিবরণ (বাংলায়)</label>
                <textarea 
                  value={productFormData.description}
                  onChange={(e) => setProductFormData(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold resize-none" 
                  placeholder="যেমন: ১০০% ফ্রেশ এবং রাসায়নিক মুক্ত সাধারণ পণ্য..."
                />
              </div>

              <div className="flex gap-6 pt-2 select-none">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 text-xs">
                  <input 
                    type="checkbox" 
                    checked={productFormData.isNew} 
                    onChange={(e) => setProductFormData(p => ({ ...p, isNew: e.target.checked }))} 
                    className="w-4 h-4 text-[#2e7d32] border-[#2e7d32]/20 rounded focus:ring-0 cursor-pointer"
                  />
                  <span>নতুন প্রোটিন লেবেল</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 text-xs">
                  <input 
                    type="checkbox" 
                    checked={productFormData.isFlashSale} 
                    onChange={(e) => setProductFormData(p => ({ ...p, isFlashSale: e.target.checked }))} 
                    className="w-4 h-4 text-[#2e7d32] border-[#2e7d32]/20 rounded focus:ring-0 cursor-pointer"
                  />
                  <span>ফ্ল্যাশ সেল তালিকাভুক্ত</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-rose-700 text-xs bg-rose-50 px-2 py-1.5 rounded-lg border border-rose-100">
                  <input 
                    type="checkbox" 
                    checked={productFormData.isHidden} 
                    onChange={(e) => setProductFormData(p => ({ ...p, isHidden: e.target.checked }))} 
                    className="w-4 h-4 text-rose-600 border-rose-300 rounded focus:ring-rose-500 cursor-pointer"
                  />
                  <span className="font-bold">হোমপেজ থেকে লুকান (শুধুমাত্র স্টকের জন্য)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 shrink-0 select-none">
                <button 
                  type="button" 
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs"
                >
                  বাতিল করুন
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#2e7d32] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {editingProduct ? 'সংশোধন বুকিং' : 'যুক্ত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details View Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 select-none">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <ShoppingBag size={18} className="text-[#2e7d32]" />
                অর্ডার রিসিট নম্বর: {selectedOrder.id}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto list-none">
              
              {/* Order status banner */}
              <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
                selectedOrder.status === 'Completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                selectedOrder.status === 'Cancelled' ? 'bg-rose-50 border-rose-100 text-rose-800' :
                'bg-amber-50 border-amber-100 text-amber-800'
              }`}>
                <div className="shrink-0">
                  {selectedOrder.status === 'Completed' ? <CheckCircle size={22} className="text-emerald-500" /> :
                   selectedOrder.status === 'Cancelled' ? <AlertTriangle size={22} className="text-rose-500" /> :
                   <Clock size={22} className="text-amber-500 animate-pulse" />}
                </div>
                <div className="font-bold">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold">অর্ডারের বর্তমান অবস্থা</h4>
                  <p className="text-xs font-extrabold mt-0.5">
                    {selectedOrder.status === 'Completed' ? 'সম্পন্ন হয়েছে এবং ডেলিভার্ড' :
                     selectedOrder.status === 'Cancelled' ? 'অর্ডারটি বাতিল করা হয়েছে' :
                     'অর্ডারটি পেন্ডিং অবস্থায় আছে'}
                  </p>
                </div>
              </div>

              {courierHistory.some(c => c.invoice === selectedOrder.id) && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2.5 font-bold text-xs select-none">
                  <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-extrabold text-[#1b4332]">কুরিয়ার বুকিং সম্পূর্ণ (Booking Completed)</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      ট্র্যাকিং আইডি: <span className="font-mono text-slate-900 select-all font-black">{courierHistory.find(c => c.invoice === selectedOrder.id)?.tracking_code || courierHistory.find(c => c.invoice === selectedOrder.id)?.consignment_id}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Client Info Grid */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3 font-semibold text-xs text-slate-600 leading-relaxed">
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">গ্রাহকের নাম</span>
                  <p className="text-slate-800 font-extrabold text-sm">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">মোবাইল নাম্বার</span>
                  <p className="text-slate-800 font-bold text-sm select-all">{selectedOrder.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">ডেলিভারি ঠিকানা</span>
                  <p className="text-slate-800 leading-relaxed">{selectedOrder.address}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">অর্ডার তারিখ</span>
                  <p className="text-slate-700 font-bold">
                    {new Date(selectedOrder.date).toLocaleDateString('bn-BD', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Items Summary list */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-500 uppercase mb-3 select-none">অর্ডারকৃত আইটেম সমূহ</h4>
                <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {selectedOrder.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 font-bold text-xs">
                      <div>
                        <p className="text-slate-800 font-extrabold leading-snug">{item.name}</p>
                        <p className="text-slate-400 text-[10px] font-medium mt-1">{item.quantity} x ৳{item.price}</p>
                      </div>
                      <span className="text-slate-900 font-black">৳{item.quantity * item.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-4 bg-slate-50 font-black text-sm">
                    <span className="text-slate-700 font-extrabold">মোট বিল (ক্যাশ অন ডেলিভারি):</span>
                    <span className="text-[#0b3d18] font-black text-base">৳{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 justify-end shrink-0 select-none">
                {selectedOrder.status !== 'Completed' && (
                  courierHistory.some(c => c.invoice === selectedOrder.id) ? (
                    <button 
                      onClick={() => {
                        const bookingItem = courierHistory.find(c => c.invoice === selectedOrder.id);
                        const consignmentId = bookingItem?.consignment_id || bookingItem?.tracking_code || '';
                        window.open(`/print-invoice?consignmentId=${consignmentId}&orderId=${encodeURIComponent(selectedOrder.id)}&name=${encodeURIComponent(selectedOrder.customerName)}&phone=${encodeURIComponent(selectedOrder.phone)}&amount=${selectedOrder.total}`, '_blank');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                    >
                      <Download size={13} /> প্রিন্ট ইনভয়েস
                    </button>
                  ) : (
                    <button 
                      onClick={() => { setBookingOrder(selectedOrder); setSelectedOrder(null); }}
                      className="px-4 py-2 bg-[#1b4332] hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                    >
                      <Truck size={13} /> কুরিয়ার বুকিং করুন
                    </button>
                  )
                )}
                
                {selectedOrder.status === 'Pending' && (
                  <button 
                    onClick={() => {
                      setEditingOrderId(selectedOrder.id);
                      setManualOrderCustomerName(selectedOrder.customerName);
                      setManualOrderPhone(selectedOrder.phone);
                      setManualOrderAddress(selectedOrder.address || '');
                      setManualOrderItems(selectedOrder.items);
                      setManualDeliveryCharge(selectedOrder.deliveryCharge || 0);
                      setManualConditionCharge(selectedOrder.conditionCharge || 0);
                      
                      // Check if there is an associated due
                      setManualOrderIsDue(selectedOrder.total !== (selectedOrder.deliveryCharge + selectedOrder.conditionCharge) && false); // We might need a better way, but for now we default to COD (false) or derive it
                      
                      setIsManualOrderModalOpen(true);
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all"
                  >
                    <Edit size={13} /> এডিট
                  </button>
                )}

                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  ওকে
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Courier Booking Modal */}
      {bookingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setBookingOrder(null); setBookingResult(null); }}></div>
          
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white select-none">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Truck size={18} className="text-emerald-400" />
                সরাসরি কুরিয়ার বুকিং (Courier Book API)
              </h3>
              <button onClick={() => { setBookingOrder(null); setBookingResult(null); }} className="text-slate-300 hover:text-white p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              {!bookingResult ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 text-slate-800 p-3.5 rounded-2xl border border-emerald-100 font-semibold text-xs leading-relaxed">
                    <p className="font-extrabold text-[#1b4332] text-sm">গ্রাহক ও অর্ডার বিবরণ:</p>
                    <p className="mt-1">নাম: <strong className="text-slate-950">{bookingOrder.customerName}</strong></p>
                    <p>ফোন: <strong className="text-slate-950 font-mono">{bookingOrder.phone}</strong></p>
                    <p>ঠিকানা: <strong className="text-slate-950">{bookingOrder.address}</strong></p>
                    <p>মোট মূল্য: <strong className="text-slate-950 font-black">৳{bookingOrder.total} (ক্যাশ অন ডেলিভারি)</strong></p>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-black uppercase tracking-wider mb-2">কুরিয়ার সার্ভিস</label>
                    <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-2xl flex items-center justify-between font-bold text-xs select-none">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></span>
                        <span>Steadfast Courier API (সক্রিয়)</span>
                      </div>
                      <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-lg text-[9px] uppercase font-black tracking-wider">Default</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-black uppercase tracking-wider mb-1.5">প্যাকেজের ওজন (কেজি)</label>
                    <input 
                      type="text" 
                      value={weightKg} 
                      onChange={(e) => setWeightKg(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-emerald-600" 
                      placeholder="যেমন: ১.৫"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-black uppercase tracking-wider mb-2">ডেলিভারি ধরন (Delivery Type)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button" 
                        onClick={() => setDeliveryType('home')}
                        className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                          deliveryType === 'home' ? 'bg-[#1b4332]/10 border-[#1b4332] text-[#1b4332]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        হোম ডেলিভারি
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setDeliveryType('point')}
                        className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                          deliveryType === 'point' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        পয়েন্ট ডেলিভারি
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-black uppercase tracking-wider mb-1.5">পণ্য ক্যাটাগরি</label>
                    <select 
                      value={bookingCategory}
                      onChange={(e) => setBookingCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-emerald-600 bg-white"
                    >
                      <option value="ব্যাগ">ব্যাগ (Bags)</option>
                      <option value="জুতো ও স্যান্ডেল">জুতো ও স্যান্ডেল (Shoes & Sandals)</option>
                      <option value="ক্রোকারি">ক্রোকারি ও তৈজসপত্র (Crockery)</option>
                      <option value="কসমেটিকস">কসমেটিকস ও সাজসজ্জা (Cosmetics & Decor)</option>
                      <option value="অন্যান্য">অন্যান্য পণ্য (Other Products)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={async () => {
                        try {
                           const response = await fetch('https://portal.packzy.com/api/v1/create_order', {
                            method: 'POST',
                            headers: {
                              'Api-Key': '2p80tiyscewtjoczqbqy9fcugkhpocvz',
                              'Secret-Key': 'y0i0bp251lyktq4vx8fwcr2l',
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              invoice: bookingOrder.id,
                              recipient_name: bookingOrder.customerName,
                              recipient_phone: bookingOrder.phone,
                              recipient_address: bookingOrder.address,
                              cod_amount: bookingOrder.total,
                              note: `Weight: ${weightKg}kg | Category: ${bookingCategory} | Delivery: ${deliveryType === 'home' ? 'Home Delivery' : 'Point Delivery'}`
                            })
                          });
                          const data = await response.json();
                          if (data.status === 200 || data.consignment_id) {
                            const newBooking = {
                              consignment_id: data.consignment?.consignment_id || data.consignment_id,
                              tracking_code: data.consignment?.tracking_code || data.tracking_code || '',
                              tracking_link: data.consignment?.tracking_link || data.tracking_link || '',
                              status: 'pending',
                              customer_name: bookingOrder.customerName,
                              customer_phone: bookingOrder.phone,
                              amount: bookingOrder.total,
                              recipient_address: bookingOrder.address,
                              delivery_type: deliveryType,
                              invoice: bookingOrder.id,
                              created_at: new Date().toISOString()
                            };
                            await setDoc(doc(courierHistoryCollection, newBooking.consignment_id.toString()), newBooking);
                            setBookingResult({
                              status: 'Success',
                              consignment_id: data.consignment?.consignment_id || data.consignment_id,
                              tracking_code: data.consignment?.tracking_code || data.tracking_code,
                              invoice: bookingOrder.id,
                              cod_amount: bookingOrder.total
                            });
                          } else {
                            alert('বুকিং ব্যর্থ হয়েছে। এরর: ' + (data.message || 'অজানা ত্রুটি'));
                          }
                        } catch (e: any) {
                          alert('বুকিং ব্যর্থ হয়েছে। এরর: ' + (e.message || 'নেটওয়ার্ক এরর'));
                        }
                      }}
                      className="w-full bg-[#1b4332] text-white py-3 rounded-2xl text-xs font-black hover:bg-emerald-800 transition-all shadow-lg shadow-[#1b4332]/10 active:scale-95 cursor-pointer"
                    >
                      বুকিং সম্পন্ন করুন
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">কুরিয়ার বুকিং সফল হয়েছে!</h3>
                    <p className="text-xs text-slate-500 mt-1 font-bold">অর্ডারটি সরাসরি কুরিয়ার প্যানেলে প্রেরণ করা হয়েছে।</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-bold inline-block w-full text-left">
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">সার্ভিস:</span>
                      <span className="text-slate-800 uppercase font-extrabold">{courierService} Courier</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-400">ট্র্যাকিং নম্বর (Consignment ID):</span>
                      <span className="text-[#115e5a] font-mono font-black select-all">{bookingResult?.tracking_code || bookingResult?.consignment_id}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => window.open(`/print-invoice?consignmentId=${bookingResult?.consignment_id}&orderId=${encodeURIComponent(bookingOrder?.id || '')}&name=${encodeURIComponent(bookingOrder?.customerName || '')}&phone=${encodeURIComponent(bookingOrder?.phone || '')}&amount=${bookingOrder?.total || bookingResult?.cod_amount}`, '_blank')}
                      className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer text-center"
                    >
                      প্রিন্ট ইনভয়েস
                    </button>
                    <button 
                      onClick={() => { setBookingOrder(null); setBookingResult(null); }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Due Modals */}
      {isDueModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm select-none">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800">নতুন বকেয়া যোগ</h3>
              <button onClick={() => setIsDueModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white shadow-sm border border-slate-200 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddDue} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">গ্রাহকের নাম</label>
                <input required type="text" value={newDue.customerName} onChange={e => setNewDue({...newDue, customerName: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-[#2e7d32] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ফোন নাম্বার</label>
                <input type="text" value={newDue.phone} onChange={e => setNewDue({...newDue, phone: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-[#2e7d32] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">বকেয়া পরিমাণ (৳)</label>
                <input required type="number" value={newDue.amount} onChange={e => setNewDue({...newDue, amount: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-[#2e7d32] focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-[#1b4332] text-white font-bold text-xs py-3 rounded-xl hover:bg-emerald-800">সেভ করুন</button>
            </form>
          </div>
        </div>
      )}

      {isDuePayModalOpen && currentDue && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm select-none">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800">বকেয়া জমা নিন</h3>
              <button onClick={() => { setIsDuePayModalOpen(false); setCurrentDue(null); }} className="text-slate-400 hover:text-slate-600 bg-white shadow-sm border border-slate-200 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <form onSubmit={handlePayDue} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-bold mb-1">গ্রাহক: <span className="text-slate-800">{currentDue.customerName}</span></p>
                <p className="text-xs text-slate-500 font-bold">বর্তমান পাওনা: <span className="text-rose-600 font-black">৳{currentDue.amount - currentDue.paidAmount}</span></p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">জমা দেওয়ার পরিমাণ (৳)</label>
                <input required type="number" max={currentDue.amount - currentDue.paidAmount} value={payDueAmount} onChange={e => setPayDueAmount(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-[#2e7d32] focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-emerald-700">আয় হিসেবে জমা করুন</button>
            </form>
          </div>
        </div>
      )}


      {/* Customer History Modal */}
      {selectedCustomerHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 select-none">
              <h2 className="text-sm font-black text-slate-800">কাস্টমার হিস্ট্রি</h2>
              <button 
                onClick={() => setSelectedCustomerHistory(null)}
                className="w-8 h-8 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              <div className="mb-4">
                <h3 className="text-lg font-black text-[#2e7d32]">{selectedCustomerHistory.name}</h3>
                <p className="text-xs font-bold text-slate-500">{selectedCustomerHistory.phone}</p>
              </div>

              <div className="space-y-4">
                {orders
                  .filter(o => o.phone === selectedCustomerHistory.phone)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((order, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-2xl p-4 bg-slate-50">
                      <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200/50">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">অর্ডার তারিখ</span>
                          <span className="text-xs font-bold text-slate-800">{new Date(order.date).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">স্ট্যাটাস</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                            order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                            order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Confirmed' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status === 'Completed' ? 'ডেলিভারি সম্পন্ন' : order.status === 'Cancelled' ? 'বাতিল' : order.status === 'Shipped' ? 'ডেলিভারি পার্টনারের কাছে হস্তান্তরিত' : order.status === 'Confirmed' ? 'পণ্য প্রস্তুত করা হচ্ছে' : 'পেন্ডিং'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-600">{item.name} <span className="text-slate-400 font-normal">x {item.quantity}</span></span>
                            <span className="font-black text-slate-800">৳{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-200/50 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-600">মোট মূল্য:</span>
                        <span className="text-sm font-black text-[#1b4332]">৳{order.total.toLocaleString('bn-BD')}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
