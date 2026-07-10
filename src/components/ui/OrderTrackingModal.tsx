import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle, Clock, Package, MapPin, Phone, AlertCircle } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';

export default function OrderTrackingModal() {
  const { isOrderTrackingOpen, setIsOrderTrackingOpen } = useUI();
  const { orders } = useCart();
  const [orderId, setOrderId] = useState('');
  const [searched, setSearched] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  if (!isOrderTrackingOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setSearched(true);
    const cleanId = orderId.toUpperCase().trim();
    // Allow searching by Tracking ID or Phone
    const foundOrder = orders.find(o => o.id.toUpperCase() === cleanId || o.phone.replace(/[\s-]/g, '') === cleanId.replace(/[\s-]/g, ''));

    if (!foundOrder) {
      setTrackingResult(null);
      return;
    }

    let statusSteps = [
      { title: 'অর্ডার সফল হয়েছে', date: new Date(foundOrder.date).toLocaleString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }), completed: true },
      { title: 'পণ্য প্রস্তুত করা হচ্ছে', date: '', completed: false },
      { title: 'ডেলিভারি পার্টনারের কাছে হস্তান্তরিত', date: '', completed: false },
      { title: 'ডেলিভারি সম্পন্ন', date: '', completed: false }
    ];

    let currentStep = 0; // 0: Placed, 1: Processing/Confirmed, 2: Shipped, 3: Delivered
    let statusText = 'পেন্ডিং';

    if (foundOrder.status === 'Confirmed') {
      currentStep = 1;
      statusSteps[1].completed = true;
      statusText = 'অর্ডার কনফার্মড';
    } else if (foundOrder.status === 'Shipped') {
      currentStep = 2;
      statusSteps[1].completed = true;
      statusSteps[2].completed = true;
      statusText = 'শিপমেন্ট হয়েছে';
    } else if (foundOrder.status === 'Completed') {
      currentStep = 3;
      statusSteps[1].completed = true;
      statusSteps[2].completed = true;
      statusSteps[3].completed = true;
      statusText = 'ডেলিভারি সম্পন্ন';
    } else if (foundOrder.status === 'Cancelled') {
      statusText = 'অর্ডার বাতিল হয়েছে';
    }

    setTrackingResult({
      orderId: foundOrder.id,
      customerName: foundOrder.customerName,
      phone: foundOrder.phone,
      address: foundOrder.address,
      paymentMethod: 'ক্যাশ অন ডেলিভারি (COD)',
      totalAmount: foundOrder.total,
      statusText,
      currentStep,
      steps: statusSteps,
      isCancelled: foundOrder.status === 'Cancelled',
      items: foundOrder.items
    });
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-10">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setIsOrderTrackingOpen(false)}
      />

      {/* Modal Container */}
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl flex flex-col relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl overflow-hidden max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold">
              🚚
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight leading-tight">
                অর্ডার ট্র্যাকিং সিস্টেম
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-1">
                আপনার অর্ডারের সর্বশেষ অবস্থা জানতে আইডি লিখুন
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsOrderTrackingOpen(false)}
            className="w-10 h-10 bg-gray-50 shadow-sm ring-1 ring-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar container */}
        <div className="p-5 border-b border-gray-50 bg-slate-50/40 shrink-0">
          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="যেমন: #NP-1024 অথবা NP-4829..." 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#00693E] font-bold text-gray-800 shadow-sm transition-all"
              />
              <Search size={16} className="absolute left-3.5 top-4 text-slate-400" />
            </div>
            <button 
              type="submit"
              className="bg-[#00693E] hover:bg-[#005030] text-white px-6 rounded-2xl text-sm font-black tracking-wide shadow-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              খুঁজুন
            </button>
          </form>
        </div>

        {/* Result Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {!searched ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 border border-blue-100 animate-bounce">
                <Truck size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-black text-slate-700">আপনার মেমো বা অর্ডারের নম্বর দিন</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs font-bold leading-normal">
                অর্ডার নিশ্চিত করার পর আপনার মোবাইলে প্রেরিত অর্ডার আইডি টাইপ করে ট্র্যাক করুন।
              </p>
            </div>
          ) : trackingResult ? (
            <div className="space-y-6">
              {/* Summary card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">অর্ডার নম্বর</div>
                  <div className="text-base font-black text-[#00693E] mt-0.5">{trackingResult.orderId}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">বর্তমান অবস্থা</div>
                  <div className="text-sm font-black text-blue-700 mt-0.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                    {trackingResult.statusText}
                  </div>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="relative pl-6 space-y-6 py-2">
                {/* Connector line */}
                <div className="absolute left-2.5 top-4 bottom-4 w-0.5 bg-slate-100" />

                {trackingResult.steps.map((step: any, idx: number) => {
                  const isActive = idx <= trackingResult.currentStep;
                  return (
                    <div key={idx} className="relative flex gap-4 items-start">
                      {/* Node icon indicator */}
                      <div className={`absolute -left-5 w-6.5 h-6.5 rounded-full flex items-center justify-center border-2 z-10 transition-colors ${
                        isActive 
                          ? 'bg-[#00693E] border-[#e6f4ea] text-white' 
                          : 'bg-white border-slate-200 text-slate-300'
                      }`}>
                        {idx === 0 && <Clock size={11} strokeWidth={3} />}
                        {idx === 1 && <Package size={11} strokeWidth={3} />}
                        {idx === 2 && <Truck size={11} strokeWidth={3} />}
                        {idx === 3 && <CheckCircle size={11} strokeWidth={3} />}
                      </div>

                      <div className="flex-1 ml-3">
                        <h4 className={`text-sm font-black leading-none ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.title}
                        </h4>
                        <p className={`text-[11px] font-bold mt-1.5 ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                          {step.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Details */}
              <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-2xl p-4.5 space-y-3">
                <h4 className="text-xs uppercase font-black text-[#00693E] tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin size={14} /> ডেলিভারি তথ্য
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-bold text-slate-700">
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-emerald-100/30 pb-2 sm:border-0 sm:pb-0">
                    <span className="text-slate-400">গ্রাহক:</span>
                    <span>{trackingResult.customerName}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-emerald-100/30 pb-2 sm:border-0 sm:pb-0">
                    <span className="text-slate-400">ফোন:</span>
                    <span>{trackingResult.phone}</span>
                  </div>
                  <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-start sm:gap-6 border-b border-emerald-100/30 pb-2 sm:border-0 sm:pb-0">
                    <span className="text-slate-400">ঠিকানা:</span>
                    <span>{trackingResult.address}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-red-500 font-bold">
              দুঃখিত, এই আইডি দিয়ে কোনো অর্ডার পাওয়া যায়নি। অনুগ্রহ করে সঠিক আইডি টাইপ করুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
