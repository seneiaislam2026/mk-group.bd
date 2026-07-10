const fs = require('fs');
let file = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const receivingCode = `

          {/* TAB: PRODUCT RECEIVING */}
          {activeTab === 'receiving' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col min-w-0">
              <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap select-none">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">পণ্য রিসিভিং (স্টক ম্যানেজমেন্ট)</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">নতুন স্টক রিসিভ করুন এবং ইনভেন্টরি আপডেট করুন</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-5">
                {filteredProductsList.length === 0 ? (
                  <div className="text-center py-10">
                    <Package size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-bold text-slate-400">কোনো পণ্য পাওয়া যায়নি</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredProductsList.map((product) => (
                      <div key={'rec-'+product.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <img loading="lazy" src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-slate-800 truncate">{product.name}</h4>
                            <p className="text-xs text-slate-500 truncate">{product.category}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-200">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">বর্তমান স্টক</span>
                            <span className="text-sm font-black text-slate-700">{product.stock || 0} টি</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              placeholder="পরিমাণ" 
                              className="w-20 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2e7d32]"
                              id={'receive-qty-'+product.id}
                              min="1"
                            />
                            <button 
                              onClick={() => {
                                const input = document.getElementById('receive-qty-'+product.id);
                                const qty = parseInt(input.value);
                                if (!isNaN(qty) && qty > 0) {
                                  updateProduct({ ...product, stock: (product.stock || 0) + qty });
                                  input.value = '';
                                  alert('স্টক আপডেট সফল হয়েছে! নতুন স্টক: ' + ((product.stock || 0) + qty));
                                }
                              }}
                              className="bg-[#2e7d32] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                            >
                              <Check size={14} /> রিসিভ
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
`;

file = file.replace("{/* TAB 3: ORDERS TRACKING */}", receivingCode + "\n          {/* TAB 3: ORDERS TRACKING */}");

fs.writeFileSync('src/pages/AdminDashboard.tsx', file);
