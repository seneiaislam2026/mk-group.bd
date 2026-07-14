import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target1 = """                    {manualOrderItems.map((item) => (
                      <div key={item.id} className="p-3 flex items-center justify-between text-xs font-bold">
                        <div className="min-w-0 flex-1">
                          <span className="text-slate-800 font-black block truncate">{item.name}</span>
                          <span className="text-[10px] text-slate-400">
                            ৳{item.price.toLocaleString('bn-BD')} × {item.quantity}টি
                          </span>
                        </div>"""

replacement1 = """                    {manualOrderItems.map((item, idx) => (
                      <div key={item.id} className="p-3 flex items-center justify-between text-xs font-bold">
                        <div className="min-w-0 flex-1 flex items-start gap-2">
                          <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[9px] mt-0.5 shrink-0">{idx + 1}</span>
                          <div>
                            <span className="text-slate-800 font-black block truncate">{item.name}</span>
                            <span className="text-[10px] text-slate-400">
                              ৳{item.price.toLocaleString('bn-BD')} × {item.quantity}টি
                            </span>
                          </div>
                        </div>"""

content = content.replace(target1, replacement1)

target2 = """                    <div className="p-3 bg-slate-50 text-[11px] font-bold text-slate-500 space-y-1.5">
                      <div className="flex justify-between">
                        <span>আইটেম সাবটোটাল:</span>
                        <span>৳{manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('bn-BD')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>হোম ডেলিভারি চার্জ:</span>
                        <span>৳৬০</span>
                      </div>
                      <div className="flex justify-between text-slate-800 font-black text-xs pt-1.5 border-t border-slate-200">
                        <span>সর্বমোট বিল:</span>
                        <span>৳{(manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 60).toLocaleString('bn-BD')}</span>
                      </div>
                    </div>"""

replacement2 = """                    <div className="p-3 bg-slate-50 text-[11px] font-bold text-slate-500 space-y-3">
                      <div className="flex justify-between items-center">
                        <span>আইটেম সাবটোটাল:</span>
                        <span>৳{manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('bn-BD')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex-1">ডেলিভারি চার্জ:</span>
                        <input type="number" min="0" value={manualDeliveryCharge} onChange={e => setManualDeliveryCharge(Number(e.target.value) || 0)} className="w-20 px-2 py-1 rounded border border-slate-200 text-right outline-none focus:border-[#2e7d32]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex-1">কনডিশন চার্জ:</span>
                        <input type="number" min="0" value={manualConditionCharge} onChange={e => setManualConditionCharge(Number(e.target.value) || 0)} className="w-20 px-2 py-1 rounded border border-slate-200 text-right outline-none focus:border-[#2e7d32]" />
                      </div>
                      <div className="flex justify-between text-slate-800 font-black text-xs pt-2 border-t border-slate-200">
                        <span>সর্বমোট বিল:</span>
                        <span>৳{(manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + manualDeliveryCharge + manualConditionCharge).toLocaleString('bn-BD')}</span>
                      </div>
                    </div>"""

content = content.replace(target2, replacement2)

target3 = """                  const subtotal = manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  const grandTotal = subtotal + 60; // 60 TK delivery fee"""

replacement3 = """                  const subtotal = manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  const grandTotal = subtotal + manualDeliveryCharge + manualConditionCharge;
                  
                  // Deduct from stock
                  manualOrderItems.forEach(item => {
                    const prod = products.find(p => p.id === item.id);
                    if (prod) {
                      updateProduct({ ...prod, stock: Math.max(0, (prod.stock || 0) - item.quantity) });
                    }
                  });
"""

content = content.replace(target3, replacement3)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
