with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

old_address_input = """                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">ডেলিভারি ঠিকানা *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="যেমন: রোড ৪, হাউজিং স্টেট, ধানমন্ডি, ঢাকা" 
                      value={manualOrderAddress}
                      onChange={(e) => setManualOrderAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                </div>"""

new_address_input = """                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">ডেলিভারি ঠিকানা *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="যেমন: রোড ৪, হাউজিং স্টেট, ধানমন্ডি, ঢাকা" 
                      value={manualOrderAddress}
                      onChange={(e) => setManualOrderAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                  <div className="sm:col-span-2 mt-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-2">পেমেন্ট স্ট্যাটাস *</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="paymentStatus" 
                          checked={!manualOrderIsDue}
                          onChange={() => setManualOrderIsDue(false)}
                          className="w-4 h-4 text-[#2e7d32] bg-gray-100 border-gray-300 focus:ring-[#2e7d32]"
                        />
                        <span className="text-xs font-bold text-slate-700">ক্যাশ অন ডেলিভারি / পেইড</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="paymentStatus" 
                          checked={manualOrderIsDue}
                          onChange={() => setManualOrderIsDue(true)}
                          className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 focus:ring-rose-500"
                        />
                        <span className="text-xs font-black text-rose-600">বকেয়া খাতায় যোগ করুন</span>
                      </label>
                    </div>
                  </div>
                </div>"""

content = content.replace(old_address_input, new_address_input)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)

print("Patched.")
