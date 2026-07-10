const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldTabStart = '{/* TAB: COURIER DASHBOARD */}';
const nextTabStart = '{/* TAB: PRODUCT RECEIVING */}';
const startIndex = content.indexOf(oldTabStart);
const endIndex = content.indexOf(nextTabStart);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find boundaries");
  process.exit(1);
}

const originalCourier = content.substring(startIndex, endIndex);

let newCourier = `          {/* TAB: COURIER DASHBOARD */}
          {activeTab === 'courier' && (
            <div className="bg-white md:rounded-2xl border-0 md:border border-slate-100 md:shadow-sm flex flex-col min-w-0 flex-1">
              <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">Steadfast কুরিয়ার প্যানেল</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">অটো বুকিং এবং ডেলিভারি ট্র্যাকিং</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative w-full sm:w-auto">
                    <input 
                      type="text" 
                      placeholder="ট্র্যাকিং কোড বা নাম খুঁজুন..." 
                      value={courierSearch}
                      onChange={(e) => setCourierSearch(e.target.value)}
                      className="w-full sm:w-56 pl-9 pr-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32]" 
                    />
                    <Search size={14} className="absolute left-3 top-3 sm:top-2.5 text-slate-400" />
                  </div>
                  <button
                    onClick={() => setIsCourierBookingOpen(true)}
                    className="bg-[#2e7d32] text-white px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer w-full sm:w-auto"
                  >
                    <Plus size={14} /> নতুন বুকিং
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-slate-50/50 p-2 md:p-4">
                <div className="space-y-3">
                  {courierHistory.filter(c => c.tracking_code?.toLowerCase().includes(courierSearch.toLowerCase()) || c.customer_name?.toLowerCase().includes(courierSearch.toLowerCase())).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Truck size={32} className="text-slate-300 mb-3" />
                      <p className="text-sm font-bold text-slate-400">কোনো পার্সেল পাওয়া যায়নি</p>
                    </div>
                  ) : (
                    courierHistory.filter(c => c.tracking_code?.toLowerCase().includes(courierSearch.toLowerCase()) || c.customer_name?.toLowerCase().includes(courierSearch.toLowerCase())).map((delivery, i) => (
                      <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800">{delivery.customer_name}</span>
                            <span className="text-[11px] text-slate-500 font-mono mt-0.5">{delivery.customer_phone}</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-1">{new Date(delivery.created_at).toLocaleDateString('en-GB')}</span>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <span className="text-sm font-black text-[#2e7d32]">৳{delivery.amount}</span>
                            <div className="mt-1">
                              {delivery.status === 'delivered' ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border border-emerald-100/50">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Delivered
                                </span>
                              ) : delivery.status === 'in_transit' ? (
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border border-amber-100/50">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> In Transit
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border border-slate-200">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <div 
                            className="bg-blue-50/50 hover:bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border border-blue-100 cursor-pointer flex items-center gap-1.5 transition-colors group/track"
                            onClick={() => {
                              setCourierSearch(delivery.tracking_code);
                              // Scroll top on mobile to see search field
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            title="ক্লিক করে সার্চ বক্সে কপি করুন"
                          >
                            <Search size={12} className="text-blue-400 group-hover/track:text-blue-600" /> {delivery.tracking_code}
                          </div>
                          
                          <button 
                            className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            title="ট্র্যাক করুন"
                            onClick={() => {
                               // Open stead fast tracking
                               window.open('https://steadfast.com.bd/tracking/' + delivery.tracking_code, '_blank');
                            }}
                          >
                            <ExternalLink size={14} /> ট্র্যাক
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          `;

content = content.replace(originalCourier, newCourier);
fs.writeFileSync(file, content);
console.log("Updated courier panel");
