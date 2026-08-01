import React, { useMemo } from 'react';
import { X, TrendingUp, TrendingDown, Users, Package, Truck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Order } from '../../types';

interface DailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  transactions: any[];
  courierHistory: any[];
}

export default function DailySummaryModal({ isOpen, onClose, orders, transactions, courierHistory }: DailySummaryModalProps) {
  const stats = useMemo(() => {
    // 1. Define "today"
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const isToday = (dateString: string) => {
      if (!dateString) return false;
      return dateString.startsWith(todayStr) || new Date(dateString).toLocaleDateString() === today.toLocaleDateString();
    };

    // 2. Orders today
    const ordersToday = orders.filter(o => isToday(o.date));
    const totalSalesToday = ordersToday.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrdersToday = ordersToday.length;

    // 3. New vs Repeat Customers Today
    const phonesToday = [...new Set(ordersToday.map(o => o.phone).filter(Boolean))];
    let newCustomers = 0;
    let repeatCustomers = 0;

    phonesToday.forEach(phone => {
      const hasPastOrders = orders.some(o => o.phone === phone && !isToday(o.date));
      if (hasPastOrders) {
        repeatCustomers++;
      } else {
        newCustomers++;
      }
    });

    // 4. Courier Bookings and Returns Today
    const courierToday = courierHistory.filter(c => isToday(c.created_at || c.timestamp || c.date));
    const totalCourierBookedToday = courierToday.length;
    
    // Courier returns marked today (using updated_at if available, otherwise just created_at)
    const courierReturnsToday = courierHistory.filter(c => 
      c.status?.toLowerCase().includes('return') && 
      isToday(c.updated_at || c.created_at || c.timestamp || '')
    ).length;

    // 5. Income & Expense (Ay Bey)
    const txToday = transactions.filter(t => isToday(t.date || t.timestamp || ''));
    const expenseToday = txToday.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const manualIncomeToday = txToday.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const automatedIncomeToday = ordersToday.filter(o => o.status === 'Completed').reduce((sum, o) => sum + (o.total || 0), 0);
    const totalIncomeToday = manualIncomeToday + automatedIncomeToday;

    return {
      totalSalesToday,
      totalOrdersToday,
      newCustomers,
      repeatCustomers,
      totalCourierBookedToday,
      courierReturnsToday,
      totalIncomeToday,
      expenseToday
    };
  }, [orders, transactions, courierHistory]);

  if (!isOpen) return null;

  const chartData = [
    { name: 'আয় (Income)', amount: stats.totalIncomeToday, color: '#10b981' },
    { name: 'ব্যয় (Expense)', amount: stats.expenseToday, color: '#f43f5e' },
    { name: 'মোট বিক্রি (Sales)', amount: stats.totalSalesToday, color: '#3b82f6' }
  ];

  const pieData = [
    { name: 'নতুন গ্রাহক', value: stats.newCustomers, color: '#8b5cf6' },
    { name: 'রিপিট গ্রাহক', value: stats.repeatCustomers, color: '#f59e0b' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
            <TrendingUp className="text-emerald-500" size={24} />
            আজকের সারাদিনের রিপোর্ট (Daily Summary)
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="text-blue-500 mb-2"><Package size={24} /></div>
              <div className="text-xs md:text-sm font-bold text-slate-600">আজকের অর্ডার</div>
              <div className="text-xl md:text-2xl font-black text-blue-700">{stats.totalOrdersToday} টি</div>
              <div className="text-[10px] md:text-xs text-blue-600/70 mt-1">সর্বমোট বিক্রি: ৳{stats.totalSalesToday.toLocaleString('bn-BD')}</div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <div className="text-emerald-500 mb-2"><TrendingUp size={24} /></div>
              <div className="text-xs md:text-sm font-bold text-slate-600">আজকের আয়</div>
              <div className="text-xl md:text-2xl font-black text-emerald-700">৳{stats.totalIncomeToday.toLocaleString('bn-BD')}</div>
            </div>

            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
              <div className="text-rose-500 mb-2"><TrendingDown size={24} /></div>
              <div className="text-xs md:text-sm font-bold text-slate-600">আজকের ব্যয়</div>
              <div className="text-xl md:text-2xl font-black text-rose-700">৳{stats.expenseToday.toLocaleString('bn-BD')}</div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <div className="text-amber-500 mb-2"><Truck size={24} /></div>
              <div className="text-xs md:text-sm font-bold text-slate-600">কুরিয়ার বুকিং</div>
              <div className="text-xl md:text-2xl font-black text-amber-700">{stats.totalCourierBookedToday} টি</div>
              <div className="text-[10px] md:text-xs text-amber-600/70 mt-1">রিটার্ন হয়েছে: {stats.courierReturnsToday} টি</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm md:text-lg font-bold text-slate-700 mb-4 text-center">আয়, ব্যয় ও বিক্রি চিত্র</h3>
              <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 'bold'}} stroke="#94a3b8" />
                    <YAxis tick={{fontSize: 10}} stroke="#94a3b8" width={40} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', fontWeight: 'bold', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={50}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm md:text-lg font-bold text-slate-700 mb-4 text-center">গ্রাহক বিশ্লেষণ (Customer Analysis)</h3>
              {stats.newCustomers === 0 && stats.repeatCustomers === 0 ? (
                <div className="h-48 md:h-64 flex flex-col items-center justify-center text-slate-400">
                  <Users size={48} className="mb-2 opacity-20" />
                  <p className="font-bold text-xs md:text-sm">আজকে কোনো গ্রাহক নেই</p>
                </div>
              ) : (
                <div className="h-48 md:h-64 flex flex-col items-center justify-center relative">
                  <div className="w-full h-full flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '12px', fontWeight: 'bold', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Custom Legend */}
                  <div className="flex gap-4 w-full justify-center pt-2">
                    {pieData.map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="text-[10px] md:text-xs font-bold text-slate-600">{d.name} ({d.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
