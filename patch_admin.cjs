const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const stateTarget = `  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');`;

const stateReplacement = `  const [bookingResult, setBookingResult] = useState<any | null>(null);`;

content = content.replace(stateTarget, stateReplacement);

const resetTarget1 = `onClick={() => { setBookingOrder(null); setIsBookingSuccess(false); }}`;
content = content.replace(/onClick=\{\(\) => \{ setBookingOrder\(null\); setIsBookingSuccess\(false\); \}\}/g, `onClick={() => { setBookingOrder(null); setBookingResult(null); }}`);

const modalBodyTarget = `              {!isBookingSuccess ? (
                <div className="space-y-4">`;

const modalBodyReplacement = `              {!bookingResult ? (
                <div className="space-y-4">`;

content = content.replace(modalBodyTarget, modalBodyReplacement);

const fetchTarget = `                      onClick={async () => {
                        if (courierService === 'steadfast') {
                          try {
                            const response = await fetch('/api/steadfast/create_order', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                invoice: bookingOrder.id,
                                recipient_name: bookingOrder.customerName,
                                recipient_phone: bookingOrder.phone,
                                recipient_address: bookingOrder.address,
                                cod_amount: bookingOrder.total,
                                note: \`Weight: \${weightKg}kg\`
                              })
                            });
                            const data = await response.json();
                            if (data.status === 200 || data.consignment_id) {
                              setBookingId(data.consignment?.tracking_code || data.tracking_code || data.consignment_id || 'NEW');
                              setIsBookingSuccess(true);
                              setCourierHistory(prev => [{
                                consignment_id: data.consignment?.consignment_id || data.consignment_id,
                                tracking_code: data.consignment?.tracking_code || data.tracking_code || 'NEW',
                                customer_name: bookingOrder.customerName,
                                customer_phone: bookingOrder.phone,
                                amount: bookingOrder.total,
                                status: 'pending',
                                created_at: new Date().toISOString()
                              }, ...prev]);
                            } else {
                              alert('বুকিং ব্যর্থ হয়েছে। এরর: ' + (data.message || 'অজানা ত্রুটি'));
                            }
                          } catch (e) {
                            alert('নেটওয়ার্ক এরর। দয়া করে আবার চেষ্টা করুন।');
                          }
                        } else {
                          const randomTrk = courierService.toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000);
                          setBookingId(randomTrk);
                          setIsBookingSuccess(true);
                        }
                      }}`;

const fetchReplacement = `                      onClick={async () => {
                        if (courierService !== 'steadfast') {
                           alert('শুধুমাত্র Steadfast কুরিয়ার API চালু আছে।');
                           return;
                        }
                        try {
                          const response = await fetch('/api/steadfast/create_order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              invoice: bookingOrder.id,
                              recipient_name: bookingOrder.customerName,
                              recipient_phone: bookingOrder.phone,
                              recipient_address: bookingOrder.address,
                              cod_amount: bookingOrder.total,
                              note: \`Weight: \${weightKg}kg\`
                            })
                          });
                          const data = await response.json();
                          if (data.status === 200 || data.consignment_id) {
                            setBookingResult({
                              status: 'Success',
                              consignment_id: data.consignment?.consignment_id || data.consignment_id,
                              tracking_code: data.consignment?.tracking_code || data.tracking_code,
                              invoice: bookingOrder.id,
                              cod_amount: bookingOrder.total
                            });
                            setCourierHistory(prev => [{
                              consignment_id: data.consignment?.consignment_id || data.consignment_id,
                              tracking_code: data.consignment?.tracking_code || data.tracking_code || 'NEW',
                              customer_name: bookingOrder.customerName,
                              customer_phone: bookingOrder.phone,
                              amount: bookingOrder.total,
                              status: 'pending',
                              created_at: new Date().toISOString()
                            }, ...prev]);
                          } else {
                            alert('বুকিং ব্যর্থ হয়েছে। এরর: ' + (data.message || 'অজানা ত্রুটি'));
                          }
                        } catch (e: any) {
                          alert('বুকিং ব্যর্থ হয়েছে। এরর: ' + (e.message || 'নেটওয়ার্ক এরর'));
                        }
                      }}`;
                      
content = content.replace(fetchTarget, fetchReplacement);

const successViewTarget = `              ) : (
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
              )}`;

const successViewReplacement = `              ) : (
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
                      <span className="text-slate-800 font-extrabold text-emerald-600">{bookingResult.status}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Consignment ID:</span>
                      <span className="text-slate-800 font-mono font-black select-all">{bookingResult.consignment_id}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Tracking Code:</span>
                      <span className="text-slate-800 font-mono font-black select-all">{bookingResult.tracking_code}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Invoice:</span>
                      <span className="text-slate-800 font-mono font-black select-all">{bookingResult.invoice}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-400">COD Amount:</span>
                      <span className="text-[#115e5a] font-mono font-black">৳{bookingResult.cod_amount}</span>
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
              )}`;

content = content.replace(successViewTarget, successViewReplacement);

fs.writeFileSync(file, content);
console.log('AdminDashboard Patched Successfully');
