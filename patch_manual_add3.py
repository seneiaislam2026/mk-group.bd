import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target = """                  <div className="w-24">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">আর্টিকেল নং</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: ART-1"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const prod = products.find(p => p.article === val);
                          if (prod) setManualSelectedProductId(prod.id);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32] bg-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">পণ্য নির্বাচন করুন</label>
                    <select 
                      value={manualSelectedProductId}
                      onChange={(e) => setManualSelectedProductId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32] bg-white"
                    >
                      <option value="">নির্বাচন করুন...</option>
                      {products.map(p => {
                        const price = p.discountedPrice || p.originalPrice;
                        return (
                          <option key={p.id} value={p.id}>
                            {p.name} (৳{price})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="w-20">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">পরিমাণ</label>
                    <input 
                      type="number" 
                      min="1"
                      value={manualSelectedQuantity}
                      onChange={(e) => setManualSelectedQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]"
                    />
                  </div>"""

replacement = """                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">আর্টিকেল নং</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: ART-1"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const prod = products.find(p => p.article === val);
                          if (prod) setManualSelectedProductId(prod.id);
                        } else {
                          setManualSelectedProductId('');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32] bg-white"
                    />
                    {manualSelectedProductId && products.find(p => p.id === manualSelectedProductId) && (
                      <p className="text-[10px] text-emerald-600 mt-1 font-bold">{products.find(p => p.id === manualSelectedProductId)?.name}</p>
                    )}
                  </div>
                  <div className="w-28">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">পরিমাণ (পিস/জোড়া)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={manualSelectedQuantity}
                      onChange={(e) => setManualSelectedQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]"
                    />
                  </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced!")
else:
    print("Not found exactly.")

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
