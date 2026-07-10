const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// I will find the EXACT submit button for Auto Booking:
const target = `              <button 
                onClick={async () => {
                  if (!courierBookingData.recipient_name || !courierBookingData.recipient_phone || !courierBookingData.recipient_address || !courierBookingData.cod_amount) {
                    alert('দয়া করে সব প্রয়োজনীয় তথ্য পূরণ করুন।');
                    return;
                  }
                  
                  try {
                    const response = await fetch('/api/steadfast/create_order', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        invoice: courierBookingData.invoice,
                        recipient_name: courierBookingData.recipient_name,
                        recipient_phone: courierBookingData.recipient_phone,
                        recipient_address: courierBookingData.recipient_address,
                        cod_amount: courierBookingData.cod_amount,
                        note: courierBookingData.note
                      })
                    });
                    const data = await response.json();
                    
                    if (data.status === 200 || data.consignment_id) {
                      setCourierHistory(prev => [{
                        consignment_id: data.consignment?.consignment_id || data.consignment_id,
                        tracking_code: data.consignment?.tracking_code || data.tracking_code || '',
                        customer_name: courierBookingData.recipient_name,
                        customer_phone: courierBookingData.recipient_phone,
                        amount: courierBookingData.cod_amount,
                        status: 'pending',
                        created_at: new Date().toISOString()
                      }, ...prev]);
                      setAutoBookingResult({
                        status: 'Success',
                        consignment_id: data.consignment?.consignment_id || data.consignment_id,
                        tracking_code: data.consignment?.tracking_code || data.tracking_code || '',
                        invoice: courierBookingData.invoice || 'N/A',
                        cod_amount: courierBookingData.cod_amount
                      });
                      setCourierBookingData({ invoice: '', recipient_name: '', recipient_phone: '', recipient_address: '', cod_amount: '', note: '' });
                    } else {
                      alert('বুকিং ব্যর্থ হয়েছে। এরর: ' + (data.message || 'অজানা ত্রুটি'));
                    }
                  } catch (e: any) {
                     alert('নেটওয়ার্ক এরর। দয়া করে আবার চেষ্টা করুন। এরর: ' + e.message);
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#2e7d32] text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-[#2e7d32]/20 cursor-pointer"
              >
                <Check size={16} /> কুরিয়ারে বুক করুন
              </button>
            </div>`;

const replacement = target + `
            </>
            ) : (
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
                      <span className="text-slate-800 font-extrabold text-emerald-600">{autoBookingResult.status}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Consignment ID:</span>
                      <span className="text-slate-800 font-mono font-black select-all">{autoBookingResult.consignment_id}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Tracking Code:</span>
                      <span className="text-slate-800 font-mono font-black select-all">{autoBookingResult.tracking_code}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Invoice:</span>
                      <span className="text-slate-800 font-mono font-black select-all">{autoBookingResult.invoice}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-400">COD Amount:</span>
                      <span className="text-[#115e5a] font-mono font-black">৳{autoBookingResult.cod_amount}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => { setIsCourierBookingOpen(false); setAutoBookingResult(null); }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                </div>
            )}`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log('Fixed auto booking success screen insertion');
