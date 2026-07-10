const fs = require('fs');
let file = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Insert states
const stateCode = `
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCustomReceiveModalOpen, setIsCustomReceiveModalOpen] = useState(false);
  const [customReceiveData, setCustomReceiveData] = useState({ name: '', quantity: '', buyingPrice: '', supplier: '' });
`;
file = file.replace("const [isProductModalOpen, setIsProductModalOpen] = useState(false);", stateCode);

// Insert button
const headerCode = `
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">পণ্য রিসিভিং (স্টক ম্যানেজমেন্ট)</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">নতুন স্টক রিসিভ করুন এবং ইনভেন্টরি আপডেট করুন</p>
                </div>
                <button
                  onClick={() => setIsCustomReceiveModalOpen(true)}
                  className="bg-[#2e7d32] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={14} /> কাস্টম রিসিভ
                </button>
`;
file = file.replace(`                <div>
                  <h3 className="font-extrabold text-base text-slate-800">পণ্য রিসিভিং (স্টক ম্যানেজমেন্ট)</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">নতুন স্টক রিসিভ করুন এবং ইনভেন্টরি আপডেট করুন</p>
                </div>`, headerCode);

// Insert modal at the end (before last </div>)
const modalCode = `
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
                    stock: qty
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
`;

file = file.replace("{/* Product ADD / EDIT Modal */}", modalCode + "\n\n      {/* Product ADD / EDIT Modal */}");

fs.writeFileSync('src/pages/AdminDashboard.tsx', file);
