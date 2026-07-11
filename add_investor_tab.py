import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

investor_tab_ui = """
          {/* TAB: INVESTORS */}
          {activeTab === 'investors' && (
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800">বিনিয়োগকারী ব্যবস্থাপনা</h2>
                  <p className="text-xs text-slate-500 mt-1">আপনার সকল বিনিয়োগকারীদের তালিকা এবং নতুন যুক্ত করুন</p>
                </div>
                <button 
                  onClick={() => setShowAddInvestorForm(!showAddInvestorForm)}
                  className="bg-[#2e7d32] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-[#2e7d32]/20"
                >
                  {showAddInvestorForm ? <X size={16} /> : <Users size={16} />} 
                  {showAddInvestorForm ? 'বাতিল করুন' : 'ম্যানুয়ালি যুক্ত করুন'}
                </button>
              </div>

              {showAddInvestorForm ? (
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300 mb-8">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Briefcase size={18} className="text-emerald-600" />
                    নতুন বিনিয়োগকারী ফর্ম
                  </h3>
                  <form onSubmit={handleManualAddInvestor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম <span className="text-rose-500">*</span></label>
                      <input type="text" value={newInvestorData.name} onChange={e => setNewInvestorData(p => ({...p, name: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">পিতার নাম</label>
                      <input type="text" value={newInvestorData.fname} onChange={e => setNewInvestorData(p => ({...p, fname: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল <span className="text-rose-500">*</span></label>
                      <input type="text" value={newInvestorData.mobile} onChange={e => setNewInvestorData(p => ({...p, mobile: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                      <input type="text" value={newInvestorData.nid} onChange={e => setNewInvestorData(p => ({...p, nid: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                      <input type="text" value={newInvestorData.address} onChange={e => setNewInvestorData(p => ({...p, address: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোট বিনিয়োগের পরিমান (৳) <span className="text-rose-500">*</span></label>
                      <input type="number" value={newInvestorData.totalAmount} onChange={e => setNewInvestorData(p => ({...p, totalAmount: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">বকেয়া পরিমান (যদি থাকে)</label>
                      <input type="number" value={newInvestorData.dueAmount} onChange={e => setNewInvestorData(p => ({...p, dueAmount: e.target.value}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-emerald-600" />
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-4">
                      <button type="submit" className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-md">
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {/* List of investors */}
              {investorsList.length === 0 && !showAddInvestorForm ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Briefcase size={28} className="text-slate-400" />
                  </div>
                  <h3 className="font-bold text-slate-800">কোন বিনিয়োগকারী নেই</h3>
                  <p className="text-xs text-slate-500 mt-1">নতুন বিনিয়োগকারী যুক্ত করতে উপরের বাটনে ক্লিক করুন</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {investorsList.map((inv) => (
                    <div key={inv.id} className="border border-slate-100 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDeleteInvestor(inv.id)} className="text-rose-400 hover:text-rose-600 p-1.5 bg-rose-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-3">
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-black text-lg border border-emerald-100">
                          {inv.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 leading-tight">{inv.name}</h4>
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider mt-1 inline-block">A/C: {inv.accountNumber}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-[11px] text-slate-500 font-bold">মোবাইল:</span>
                          <span className="text-[11px] text-slate-800 font-bold">{inv.mobile}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[11px] text-slate-500 font-bold">তারিখ:</span>
                          <span className="text-[11px] text-slate-800 font-bold">{new Date(inv.date).toLocaleDateString('bn-BD')}</span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-[11px] text-slate-500 font-bold">মোট বিনিয়োগ:</span>
                          <span className="text-[11px] text-slate-800 font-black">৳ {inv.totalAmount.toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[11px] text-slate-500 font-bold">পরিশোধিত:</span>
                          <span className="text-[11px] text-emerald-600 font-black">৳ {inv.paidAmount.toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[11px] text-slate-500 font-bold">বকেয়া:</span>
                          <span className="text-[11px] text-rose-600 font-black">৳ {inv.dueAmount.toLocaleString('bn-BD')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
"""

content = content.replace("{/* TAB: AGREEMENT */}", investor_tab_ui + "\n          {/* TAB: AGREEMENT */}")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
