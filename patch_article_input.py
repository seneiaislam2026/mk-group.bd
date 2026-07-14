import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target = """                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">পণ্য নির্বাচন করুন</label>
                    <select 
                      value={manualSelectedProductId}
                      onChange={(e) => setManualSelectedProductId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32] bg-white"
                    >"""

replacement = """                  <div className="w-24">
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
                    >"""

content = content.replace(target, replacement)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
