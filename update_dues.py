import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

# Filter active dues
content = content.replace(
    "dues.length === 0 ? (",
    "dues.filter(d => d.status !== 'Paid').length === 0 ? ("
)

content = content.replace(
    "dues.map(d => {",
    "dues.filter(d => d.status !== 'Paid').map(d => {"
)

# Replace Mobile buttons to add type="button" and preventDefault/stopPropagation
# Also update the reminder button for both desktop and mobile
desktop_buttons = """                                {!isPaid && (
                                  <>
                                    <button
                                      onClick={() => { setCurrentDue(d); setIsDuePayModalOpen(true); }}
                                      className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded text-[10px] font-extrabold transition-colors border border-emerald-100"
                                    >
                                      টাকা জমা
                                    </button>
                                    <button
                                      onClick={() => { window.open(`https://wa.me/+88${d.phone}?text=আপনার নিরাপদ খাদ্য সম্ভারে ৳${d.amount - d.paidAmount} বকেয়া রয়েছে। অনুগ্রহ করে পরিশোধ করুন।`, '_blank'); }}
                                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded text-[10px] font-extrabold transition-colors border border-blue-100 flex items-center gap-1"
                                      title="হোয়াটসঅ্যাপে রিমাইন্ডার"
                                    >
                                      <PhoneCall size={10} /> রিমাইন্ডার
                                    </button>
                                  </>
                                )}"""

desktop_buttons_new = """                                {!isPaid && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentDue(d); setIsDuePayModalOpen(true); }}
                                      className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded text-[10px] font-extrabold transition-colors border border-emerald-100 cursor-pointer"
                                    >
                                      টাকা জমা
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addNotification('এসএমএস রিমাইন্ডার', `${d.customerName} এর নাম্বারে বকেয়া পরিশোধের রিমাইন্ডার পাঠানো হয়েছে।`); }}
                                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded text-[10px] font-extrabold transition-colors border border-blue-100 flex items-center gap-1 cursor-pointer"
                                      title="সফটওয়্যার থেকে ম্যাসেজ"
                                    >
                                      <PhoneCall size={10} /> রিমাইন্ডার
                                    </button>
                                  </>
                                )}"""

content = content.replace(desktop_buttons, desktop_buttons_new)


mobile_buttons = """                          {!isPaid && (
                            <div className="flex items-center gap-2 justify-end mt-1">
                              <button
                                onClick={() => { setCurrentDue(d); setIsDuePayModalOpen(true); }}
                                className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-2 rounded-xl text-[10px] font-extrabold transition-colors border border-emerald-100 flex-1 flex items-center justify-center gap-1"
                              >
                                টাকা জমা
                              </button>
                              <button
                                onClick={() => { window.open(`https://wa.me/+88${d.phone}?text=আপনার নিরাপদ খাদ্য সম্ভারে ৳${d.amount - d.paidAmount} বকেয়া রয়েছে। অনুগ্রহ করে পরিশোধ করুন।`, '_blank'); }}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-xl text-[10px] font-extrabold transition-colors border border-blue-100 flex-1 flex items-center justify-center gap-1"
                              >
                                <PhoneCall size={12} /> রিমাইন্ডার
                              </button>
                            </div>
                          )}"""

mobile_buttons_new = """                          {!isPaid && (
                            <div className="flex items-center gap-2 justify-end mt-1">
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentDue(d); setIsDuePayModalOpen(true); }}
                                className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-2 rounded-xl text-[10px] font-extrabold transition-colors border border-emerald-100 flex-1 flex items-center justify-center gap-1 cursor-pointer"
                              >
                                টাকা জমা
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addNotification('এসএমএস রিমাইন্ডার', `${d.customerName} এর নাম্বারে বকেয়া পরিশোধের রিমাইন্ডার পাঠানো হয়েছে।`); }}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-xl text-[10px] font-extrabold transition-colors border border-blue-100 flex-1 flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <PhoneCall size={12} /> রিমাইন্ডার
                              </button>
                            </div>
                          )}"""

content = content.replace(mobile_buttons, mobile_buttons_new)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)

print("Script execution done.")
