import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target = r'<div className="w-24">\s*<label className="block text-\[10px\] text-slate-500 font-bold mb-1">আর্টিকেল নং</label>\s*<input[^>]+>\s*</div>\s*<div className="flex-1">\s*<label className="block text-\[10px\] text-slate-500 font-bold mb-1">পণ্য নির্বাচন করুন</label>\s*<select[^>]+>.*?</select>\s*</div>\s*<div className="w-20">\s*<label className="block text-\[10px\] text-slate-500 font-bold mb-1">পরিমাণ</label>\s*<input[^>]+>\s*</div>'

replacement = """<div className="flex-1">
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
                    {manualSelectedProductId && products.find(p => p.id === manualSelectedProductId) && (
                      <p className="text-[10px] text-emerald-600 mt-1 font-bold">{products.find(p => p.id === manualSelectedProductId)?.name}</p>
                    )}
                  </div>
                  <div className="w-24">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">পরিমাণ (পিস/জোড়া)</label>
                    <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#2e7d32]">
                      <input 
                        type="number" 
                        min="1"
                        value={manualSelectedQuantity}
                        onChange={(e) => setManualSelectedQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 text-xs font-black outline-none"
                      />
                    </div>
                  </div>"""

content = re.sub(target, replacement, content, flags=re.DOTALL)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
