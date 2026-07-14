import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target = """              <div>
                <label className="block text-xs text-slate-500 mb-1.5">প্রাথমিক স্টক (ঐচ্ছিক)</label>
                <input 
                  type="number" 
                  value={productFormData.stock}
                  onChange={(e) => setProductFormData(p => ({ ...p, stock: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2e7d32] outline-none text-xs text-slate-700 font-bold" 
                  placeholder="যেমন: ১০০"
                />
              </div>"""

replacement = """              <div>
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
              </div>"""

content = content.replace(target, replacement)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
