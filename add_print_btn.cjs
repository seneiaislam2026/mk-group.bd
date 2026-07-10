const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// For manual modal (bookingResult)
const target1 = `                  <div className="pt-2">
                    <button 
                      onClick={() => { setBookingOrder(null); setBookingResult(null); }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      বন্ধ করুন
                    </button>
                  </div>`;

const replace1 = `                  <div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => window.open(\`/print-invoice?id=\${bookingResult?.consignment_id}&name=\${encodeURIComponent(bookingOrder?.customerName || '')}&phone=\${encodeURIComponent(bookingOrder?.phone || '')}&amount=\${bookingOrder?.total || bookingResult?.cod_amount}\`, '_blank')}
                      className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer text-center"
                    >
                      প্রিন্ট ইনভয়েস
                    </button>
                    <button 
                      onClick={() => { setBookingOrder(null); setBookingResult(null); }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      বন্ধ করুন
                    </button>
                  </div>`;

// For quick modal (autoBookingResult)
const target2 = `                  <div className="pt-2">
                    <button 
                      onClick={() => { setIsCourierBookingOpen(false); setAutoBookingResult(null); }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      বন্ধ করুন
                    </button>
                  </div>`;

const replace2 = `                  <div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => window.open(\`/print-invoice?id=\${autoBookingResult?.consignment_id}&name=\${encodeURIComponent(courierBookingData?.recipient_name || '')}&phone=\${encodeURIComponent(courierBookingData?.recipient_phone || '')}&amount=\${autoBookingResult?.cod_amount}\`, '_blank')}
                      className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer text-center"
                    >
                      প্রিন্ট ইনভয়েস
                    </button>
                    <button 
                      onClick={() => { setIsCourierBookingOpen(false); setAutoBookingResult(null); }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      বন্ধ করুন
                    </button>
                  </div>`;

if (content.includes(target1)) content = content.replace(target1, replace1);
if (content.includes(target2)) content = content.replace(target2, replace2);

fs.writeFileSync(file, content);
console.log('Added print buttons to modals');
