import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

modals = """
      {/* Due Modals */}
      {isDueModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm select-none">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800">নতুন বকেয়া যোগ</h3>
              <button onClick={() => setIsDueModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white shadow-sm border border-slate-200 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddDue} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">গ্রাহকের নাম</label>
                <input required type="text" value={newDue.customerName} onChange={e => setNewDue({...newDue, customerName: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-[#2e7d32] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ফোন নাম্বার</label>
                <input type="text" value={newDue.phone} onChange={e => setNewDue({...newDue, phone: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-[#2e7d32] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">বকেয়া পরিমাণ (৳)</label>
                <input required type="number" value={newDue.amount} onChange={e => setNewDue({...newDue, amount: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-[#2e7d32] focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-[#1b4332] text-white font-bold text-xs py-3 rounded-xl hover:bg-emerald-800">সেভ করুন</button>
            </form>
          </div>
        </div>
      )}

      {isDuePayModalOpen && currentDue && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm select-none">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800">বকেয়া জমা নিন</h3>
              <button onClick={() => { setIsDuePayModalOpen(false); setCurrentDue(null); }} className="text-slate-400 hover:text-slate-600 bg-white shadow-sm border border-slate-200 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <form onSubmit={handlePayDue} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-bold mb-1">গ্রাহক: <span className="text-slate-800">{currentDue.customerName}</span></p>
                <p className="text-xs text-slate-500 font-bold">বর্তমান পাওনা: <span className="text-rose-600 font-black">৳{currentDue.amount - currentDue.paidAmount}</span></p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">জমা দেওয়ার পরিমাণ (৳)</label>
                <input required type="number" max={currentDue.amount - currentDue.paidAmount} value={payDueAmount} onChange={e => setPayDueAmount(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-[#2e7d32] focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-emerald-700">আয় হিসেবে জমা করুন</button>
            </form>
          </div>
        </div>
      )}
"""

content = content.replace("      )}\n    </div>\n  );\n}", "      )}\n" + modals + "    </div>\n  );\n}")

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)

print("Success")
