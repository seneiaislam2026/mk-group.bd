import re

with open('src/pages/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add states for Courier Tab
state_code = """
  // Courier Tab States
  const [courierSearch, setCourierSearch] = useState('');
  const [courierHistory, setCourierHistory] = useState<any[]>([
    {
       consignment_id: '9984920',
       tracking_code: '05E20EE4',
       customer_name: 'রিয়াজুল ইসলাম',
       customer_phone: '01712345678',
       amount: 1500,
       status: 'delivered',
       created_at: '2023-10-25T14:20:00Z'
    },
    {
       consignment_id: '9984921',
       tracking_code: '05E20EE5',
       customer_name: 'আরিফ হোসেন',
       customer_phone: '01812345678',
       amount: 2500,
       status: 'in_transit',
       created_at: '2023-10-26T10:15:00Z'
    },
    {
       consignment_id: '9984922',
       tracking_code: '05E20EE6',
       customer_name: 'সাদিয়া রহমান',
       customer_phone: '01912345678',
       amount: 850,
       status: 'pending',
       created_at: '2023-10-26T16:45:00Z'
    }
  ]);
  const [isCourierBookingOpen, setIsCourierBookingOpen] = useState(false);
  const [courierBookingData, setCourierBookingData] = useState({
    invoice: '',
    recipient_name: '',
    recipient_phone: '',
    recipient_address: '',
    cod_amount: '',
    note: ''
  });
"""
content = content.replace("const [isCustomReceiveModalOpen, setIsCustomReceiveModalOpen] = useState(false);", "const [isCustomReceiveModalOpen, setIsCustomReceiveModalOpen] = useState(false);\n" + state_code)


courier_tab_code = """
          {/* TAB: COURIER DASHBOARD */}
          {activeTab === 'courier' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col min-w-0">
              <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap select-none">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">Steadfast কুরিয়ার প্যানেল</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">অটো বুকিং এবং ডেলিভারি ট্র্যাকিং</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative hidden sm:block">
                    <input 
                      type="text" 
                      placeholder="ট্র্যাকিং কোড বা নাম খুঁজুন..." 
                      value={courierSearch}
                      onChange={(e) => setCourierSearch(e.target.value)}
                      className="w-56 pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32]" 
                    />
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  </div>
                  <button
                    onClick={() => setIsCourierBookingOpen(true)}
                    className="bg-[#2e7d32] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus size={14} /> নতুন বুকিং
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 whitespace-nowrap">তারিখ</th>
                      <th className="p-4 whitespace-nowrap">কাস্টমার</th>
                      <th className="p-4 whitespace-nowrap">ট্র্যাকিং কোড</th>
                      <th className="p-4 whitespace-nowrap">টাকার পরিমাণ</th>
                      <th className="p-4 whitespace-nowrap text-center">স্ট্যাটাস</th>
                      <th className="p-4 whitespace-nowrap text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/80">
                    {courierHistory.filter(c => c.tracking_code.toLowerCase().includes(courierSearch.toLowerCase()) || c.customer_name.toLowerCase().includes(courierSearch.toLowerCase())).map((delivery, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4">
                          <span className="text-xs font-bold text-slate-600">{new Date(delivery.created_at).toLocaleDateString('en-GB')}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">{delivery.customer_name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{delivery.customer_phone}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs font-mono font-bold border border-blue-100/50 select-all cursor-pointer">
                            {delivery.tracking_code}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-black text-slate-700">৳{delivery.amount}</td>
                        <td className="p-4 text-center">
                          {delivery.status === 'delivered' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Delivered
                            </span>
                          ) : delivery.status === 'in_transit' ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> In Transit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button className="text-xs text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                            ট্র্যাক করুন
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
"""

content = content.replace("{/* TAB: PRODUCT RECEIVING */}", courier_tab_code + "\n\n          {/* TAB: PRODUCT RECEIVING */}")

courier_modal_code = """
      {/* Courier Booking Modal */}
      {isCourierBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCourierBookingOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <Truck size={18} className="text-[#2e7d32]" /> Steadfast অটো বুকিং
              </h3>
              <button onClick={() => setIsCourierBookingOpen(false)} className="text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
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
                onClick={() => setIsCourierBookingOpen(false)}
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
                    const response = await fetch('/api/steadfast/create_order', {
                      method: 'POST',
                      headers: {
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
                      setCourierHistory([{
                        consignment_id: data.consignment?.consignment_id || data.consignment_id,
                        tracking_code: data.consignment?.tracking_code || data.tracking_code || 'NEW',
                        customer_name: courierBookingData.recipient_name,
                        customer_phone: courierBookingData.recipient_phone,
                        amount: courierBookingData.cod_amount,
                        status: 'pending',
                        created_at: new Date().toISOString()
                      }, ...courierHistory]);
                      alert('Steadfast কুরিয়ারে বুকিং সফল হয়েছে!');
                      setIsCourierBookingOpen(false);
                      setCourierBookingData({ invoice: '', recipient_name: '', recipient_phone: '', recipient_address: '', cod_amount: '', note: '' });
                    } else {
                      alert('বুকিং ব্যর্থ হয়েছে। এরর: ' + (data.message || 'অজানা ত্রুটি'));
                    }
                  } catch (e) {
                     alert('নেটওয়ার্ক এরর। দয়া করে আবার চেষ্টা করুন।');
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#2e7d32] text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-[#2e7d32]/20 cursor-pointer"
              >
                <Check size={16} /> কুরিয়ারে বুক করুন
              </button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("{/* Custom Receive Modal */}", courier_modal_code + "\n\n      {/* Custom Receive Modal */}")

with open('src/pages/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

