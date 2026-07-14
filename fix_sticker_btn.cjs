const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const targetButtons = `<div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => window.open(\`/print-invoice?consignmentId=\${autoBookingResult?.consignment_id}&orderId=\${encodeURIComponent(autoBookingResult?.invoice || '')}&name=\${encodeURIComponent(courierBookingData?.recipient_name || '')}&phone=\${encodeURIComponent(courierBookingData?.recipient_phone || '')}&amount=\${autoBookingResult?.cod_amount}\`, '_blank')}
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

const newButtons = `<div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => window.open(\`/print-invoice?consignmentId=\${autoBookingResult?.consignment_id}&orderId=\${encodeURIComponent(autoBookingResult?.invoice || '')}&name=\${encodeURIComponent(courierBookingData?.recipient_name || '')}&phone=\${encodeURIComponent(courierBookingData?.recipient_phone || '')}&amount=\${autoBookingResult?.cod_amount}\`, '_blank')}
                      className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer text-center"
                    >
                      প্রিন্ট ইনভয়েস
                    </button>
                    <button 
                      onClick={() => {
                        window.open(\`/print-sticker?id=\${autoBookingResult.consignment_id}&name=\${encodeURIComponent(autoBookingResult.customer_name || courierBookingData?.recipient_name || '')}&phone=\${encodeURIComponent(autoBookingResult.customer_phone || courierBookingData?.recipient_phone || '')}&address=\${encodeURIComponent(autoBookingResult.customer_address || courierBookingData?.recipient_address || '')}\`, '_blank');
                      }}
                      className="flex-1 bg-[#115e5a] text-white py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <Printer size={14} /> স্টিকার
                    </button>
                    <button 
                      onClick={() => { setIsCourierBookingOpen(false); setAutoBookingResult(null); }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      বন্ধ
                    </button>
                  </div>`;

code = code.replace(targetButtons, newButtons);

// and also check if it's there twice (for the modal after clicking book from table vs book from order)
const targetButtons2 = `<div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => window.open(\`/print-invoice?consignmentId=\${bookingResult?.consignment_id}&orderId=\${encodeURIComponent(bookingResult?.invoice || '')}&name=\${encodeURIComponent(bookingOrder?.customerName || '')}&phone=\${encodeURIComponent(bookingOrder?.phone || '')}&amount=\${bookingResult?.cod_amount}\`, '_blank')}
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

const newButtons2 = `<div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => window.open(\`/print-invoice?consignmentId=\${bookingResult?.consignment_id}&orderId=\${encodeURIComponent(bookingResult?.invoice || '')}&name=\${encodeURIComponent(bookingOrder?.customerName || '')}&phone=\${encodeURIComponent(bookingOrder?.phone || '')}&amount=\${bookingResult?.cod_amount}\`, '_blank')}
                      className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer text-center"
                    >
                      প্রিন্ট ইনভয়েস
                    </button>
                    <button 
                      onClick={() => {
                        window.open(\`/print-sticker?id=\${bookingResult.consignment_id}&name=\${encodeURIComponent(bookingOrder?.customerName || '')}&phone=\${encodeURIComponent(bookingOrder?.phone || '')}&address=\${encodeURIComponent(bookingOrder?.address || '')}\`, '_blank');
                      }}
                      className="flex-1 bg-[#115e5a] text-white py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <Printer size={14} /> স্টিকার
                    </button>
                    <button 
                      onClick={() => { setBookingOrder(null); setBookingResult(null); }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      বন্ধ
                    </button>
                  </div>`;

code = code.replace(targetButtons2, newButtons2);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed PrintSticker buttons.');
