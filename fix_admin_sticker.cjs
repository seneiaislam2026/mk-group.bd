const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const targetResultObj = `                      setAutoBookingResult({
                        status: 'Success',
                        consignment_id: data.consignment?.consignment_id || data.consignment_id,
                        tracking_code: data.consignment?.tracking_code || data.tracking_code || '',
                        tracking_link: data.consignment?.tracking_link || data.tracking_link || '',
                        invoice: courierBookingData.invoice || 'N/A',
                        cod_amount: courierBookingData.cod_amount
                      });`;

const newResultObj = `                      setAutoBookingResult({
                        status: 'Success',
                        consignment_id: data.consignment?.consignment_id || data.consignment_id,
                        tracking_code: data.consignment?.tracking_code || data.tracking_code || '',
                        tracking_link: data.consignment?.tracking_link || data.tracking_link || '',
                        invoice: courierBookingData.invoice || 'N/A',
                        cod_amount: courierBookingData.cod_amount,
                        customer_name: courierBookingData.recipient_name,
                        customer_phone: courierBookingData.recipient_phone,
                        customer_address: courierBookingData.recipient_address
                      });`;

code = code.replace(targetResultObj, newResultObj);

const targetSuccessModal = `                    <div className="flex justify-between pt-2">
                      <span className="text-slate-400">COD Amount:</span>
                      <span className="text-[#115e5a] font-mono font-black">৳{autoBookingResult.cod_amount}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setIsCourierBookingOpen(false); setAutoBookingResult(null); }}
                    className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>`;

const newSuccessModal = `                    <div className="flex justify-between pt-2">
                      <span className="text-slate-400">COD Amount:</span>
                      <span className="text-[#115e5a] font-mono font-black">৳{autoBookingResult.cod_amount}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => {
                        window.open(\`/print-sticker?id=\${autoBookingResult.consignment_id}&name=\${encodeURIComponent(autoBookingResult.customer_name || '')}&phone=\${encodeURIComponent(autoBookingResult.customer_phone || '')}&address=\${encodeURIComponent(autoBookingResult.customer_address || '')}\`, '_blank');
                      }}
                      className="flex-1 py-3 rounded-xl bg-[#115e5a] text-white font-bold text-xs hover:bg-teal-800 transition-colors cursor-pointer flex justify-center items-center gap-2"
                    >
                      <Printer size={16} /> স্টিকার প্রিন্ট
                    </button>
                    <button 
                      onClick={() => { setIsCourierBookingOpen(false); setAutoBookingResult(null); }}
                      className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
                    >
                      বন্ধ করুন
                    </button>
                  </div>`;

code = code.replace(targetSuccessModal, newSuccessModal);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed AdminDashboard for PrintSticker.');
