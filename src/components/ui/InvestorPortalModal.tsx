import React, { useState } from 'react';
import { X, Search, Briefcase, FileText, Calendar, ShieldCheck } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { Investor } from '../../types';

export default function InvestorPortalModal() {
  const { isInvestorPortalOpen, setIsInvestorPortalOpen } = useUI();
  const [accountNumber, setAccountNumber] = useState('');
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [error, setError] = useState('');

  if (!isInvestorPortalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!accountNumber || accountNumber.trim() === '') {
      setError('দয়া করে আপনার ৭ সংংখ্যার একাউন্ট নাম্বার দিন।');
      return;
    }

    const stored = localStorage.getItem('mega_investors');
    if (stored) {
      try {
        const investors: Investor[] = JSON.parse(stored);
        const found = investors.find(i => i.accountNumber === accountNumber.trim());
        if (found) {
          setInvestor(found);
        } else {
          setError('এই একাউন্ট নাম্বারের কোন বিনিয়োগকারী পাওয়া যায়নি।');
          setInvestor(null);
        }
      } catch (err) {
        setError('ডাটাবেস ইরর।');
      }
    } else {
      setError('কোন বিনিয়োগকারী নিবন্ধিত নেই।');
      setInvestor(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 sm:px-0">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => setIsInvestorPortalOpen(false)} 
      />
      
      <div className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50">
          <h3 className="font-extrabold text-base md:text-lg text-emerald-800 flex items-center gap-2">
            <Briefcase size={20} className="text-emerald-600" />
            বিনিয়োগকারীর তথ্য
          </h3>
          <button 
            onClick={() => setIsInvestorPortalOpen(false)} 
            className="text-emerald-500 hover:text-emerald-700 p-1 rounded-lg hover:bg-emerald-100/50 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {!investor ? (
            <div className="max-w-md mx-auto py-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck size={32} className="text-emerald-600" />
                </div>
                <h4 className="font-black text-slate-800 text-lg">আপনার বিনিয়োগ প্রোফাইল দেখুন</h4>
                <p className="text-xs text-slate-500 mt-1">৭ সংংখ্যার একাউন্ট নাম্বার দিয়ে অনুসন্ধান করুন</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">একাউন্ট নাম্বার</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      maxLength={7}
                      placeholder="যেমন: 1234567"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 outline-none focus:border-emerald-500 text-slate-800 font-bold tracking-wider transition-colors"
                      autoFocus
                    />
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  {error && <p className="text-xs text-rose-500 mt-1.5 ml-1 font-bold">{error}</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <Search size={18} /> প্রোফাইল খুঁজুন
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-md">
                  {investor.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-lg">{investor.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-0.5">
                    <span className="bg-emerald-200/50 px-2 py-0.5 rounded-md text-emerald-700">A/C: {investor.accountNumber}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">পিতার নাম</p>
                  <p className="font-bold text-slate-800 text-sm">{investor.fname}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">মোবাইল নাম্বার</p>
                  <p className="font-bold text-slate-800 text-sm">{investor.mobile}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">এনআইডি</p>
                  <p className="font-bold text-slate-800 text-sm">{investor.nid}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">যোগদানের তারিখ</p>
                  <p className="font-bold text-slate-800 text-sm">{new Date(investor.date).toLocaleDateString('bn-BD')}</p>
                </div>
              </div>

              <div className="bg-white border-2 border-indigo-50 rounded-2xl p-5 shadow-sm">
                <h5 className="font-black text-slate-800 flex items-center gap-2 mb-4">
                  <FileText size={16} className="text-indigo-600" />
                  বিনিয়োগ ও হিসাব
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500">মোট বিনিয়োগ চুক্তি:</span>
                    <span className="font-black text-slate-800">৳ {investor.totalAmount.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500">পরিশোধিত ব্যালেন্স:</span>
                    <span className="font-black text-emerald-600">৳ {investor.paidAmount.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">বকেয়া পরিমাণ:</span>
                    <span className="font-black text-rose-600">৳ {investor.dueAmount.toLocaleString('bn-BD')}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setInvestor(null)}
                className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold py-3 rounded-xl transition-colors text-sm"
              >
                অন্য একাউন্ট খুঁজুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
