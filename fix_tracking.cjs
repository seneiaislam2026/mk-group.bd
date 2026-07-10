const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetBtn = `<button className="text-xs text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                            ট্র্যাক করুন
                          </button>`;

const replacementBtn = `<div className="flex justify-center gap-2">
                            <button 
                              onClick={() => window.open(\`https://steadfast.com.bd/t/\${delivery.consignment_id || delivery.tracking_code}\`, '_blank')}
                              className="text-xs text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              ট্র্যাক
                            </button>
                            <button 
                              onClick={() => window.open(\`/print-invoice?id=\${delivery.consignment_id}&name=\${encodeURIComponent(delivery.customer_name)}&phone=\${encodeURIComponent(delivery.customer_phone)}&amount=\${delivery.amount}\`, '_blank')}
                              className="text-xs text-emerald-600 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              প্রিন্ট
                            </button>
                          </div>`;

content = content.replace(targetBtn, replacementBtn);
fs.writeFileSync(file, content);
console.log('Fixed tracking');
