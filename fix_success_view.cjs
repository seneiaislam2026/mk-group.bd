const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">কুরিয়ার বুকিং সফল হয়েছে!</h3>
                    <p className="text-xs text-slate-500 mt-1 font-bold">অর্ডারটি সরাসরি কুরিয়ার প্যানেলে প্রেরণ করা হয়েছে।</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-bold inline-block w-full text-left">
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">সার্ভিস:</span>
                      <span className="text-slate-800 uppercase font-extrabold">{courierService} Courier</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-400">ট্র্যাকিং নম্বর (Consignment ID):</span>
                      <span className="text-[#115e5a] font-mono font-black select-all">{bookingId}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => { setBookingOrder(null); setBookingResult(null); }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                </div>
              )`;

const replacement = `              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">কুরিয়ার বুকিং সফল হয়েছে!</h3>
                    <p className="text-xs text-slate-500 mt-1 font-bold">অর্ডারটি সরাসরি কুরিয়ার প্যানেলে প্রেরণ করা হয়েছে।</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-bold inline-block w-full text-left space-y-2">
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Booking Status:</span>
                      <span className="text-slate-800 font-extrabold text-emerald-600">{bookingResult?.status || 'Success'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Consignment ID:</span>
                      <span className="text-slate-800 font-mono font-black select-all">{bookingResult?.consignment_id}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Tracking Code:</span>
                      <span className="text-slate-800 font-mono font-black select-all">{bookingResult?.tracking_code}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Invoice:</span>
                      <span className="text-slate-800 font-mono font-black select-all">{bookingResult?.invoice}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-400">COD Amount:</span>
                      <span className="text-[#115e5a] font-mono font-black">৳{bookingResult?.cod_amount}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => { setBookingOrder(null); setBookingResult(null); }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                </div>
              )`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Fixed success view');
} else {
  console.log('Target not found, falling back to regex');
  content = content.replace(/\{bookingId\}/g, '{bookingResult?.tracking_code || bookingResult?.consignment_id}');
  fs.writeFileSync(file, content);
}
