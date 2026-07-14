import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# 1. Add state
state_code = "  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);\n  const [stockAdjustProductId, setStockAdjustProductId] = useState<string>('');\n  const [stockAdjustQty, setStockAdjustQty] = useState<string>('');\n"
content = content.replace("  const [isProductModalOpen, setIsProductModalOpen] = useState(false);", "  const [isProductModalOpen, setIsProductModalOpen] = useState(false);\n" + state_code)

# 2. Add onClick to button
content = content.replace(
    "<button className=\"flex items-center gap-1.5 bg-[#2e7d32] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors cursor-pointer\">",
    "<button onClick={() => setIsStockAdjustModalOpen(true)} className=\"flex items-center gap-1.5 bg-[#2e7d32] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors cursor-pointer\">"
)

# 3. Add Modal Component at the end, before the last </div> tag (or just after Product ADD / EDIT Modal)
modal_code = """
      {/* Stock Adjust Modal */}
      {isStockAdjustModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsStockAdjustModalOpen(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-6">
            <h3 className="text-lg font-black text-slate-800 mb-4">স্টক সমন্বয়</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">পণ্য নির্বাচন করুন</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#2e7d32]"
                  value={stockAdjustProductId}
                  onChange={(e) => setStockAdjustProductId(e.target.value)}
                >
                  <option value="">নির্বাচন করুন</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (বর্তমান: {p.stock || 0})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">নতুন মোট স্টক</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#2e7d32]"
                  placeholder="নতুন স্টকের পরিমাণ"
                  value={stockAdjustQty}
                  onChange={(e) => setStockAdjustQty(e.target.value)}
                />
              </div>
              
              <button 
                onClick={() => {
                  if (!stockAdjustProductId || !stockAdjustQty) return;
                  const prod = products.find(p => p.id === stockAdjustProductId);
                  if (prod) {
                    updateProduct({ ...prod, stock: parseInt(stockAdjustQty) });
                    setIsStockAdjustModalOpen(false);
                    setStockAdjustProductId('');
                    setStockAdjustQty('');
                    alert('স্টক আপডেট সফল হয়েছে!');
                  }
                }}
                className="w-full bg-[#2e7d32] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-emerald-700"
              >
                আপডেট করুন
              </button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("{/* Product ADD / EDIT Modal */}", modal_code + "\n      {/* Product ADD / EDIT Modal */}")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
