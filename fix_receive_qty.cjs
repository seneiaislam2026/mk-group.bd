const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const [receiveQtys')) {
  content = content.replace(
    "const [lastReceivedMsg, setLastReceivedMsg]",
    "const [receiveQtys, setReceiveQtys] = useState<Record<string, string>>({});\n  const [lastReceivedMsg, setLastReceivedMsg]"
  );
}

const oldInputBlock = `<div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              placeholder="পরিমাণ" 
                              className="w-20 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2e7d32]"
                              id={'receive-qty-'+product.id}
                              min="1"
                            />
                            <button 
                              onClick={() => {
                                const input = document.getElementById( 'receive-qty-'+product.id ) as HTMLInputElement; //('receive-qty-'+product.id);
                                const qty = parseInt(input.value);
                                if (!isNaN(qty) && qty > 0) {
                                  updateProduct({ ...product, stock: (product.stock || 0) + qty });
                                  input.value = '';
                                  alert('স্টক আপডেট সফল হয়েছে! নতুন স্টক: ' + ((product.stock || 0) + qty));
                                }
                              }}
                              className="bg-[#2e7d32] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                            >
                              <Check size={14} /> রিসিভ
                            </button>
                          </div>`;

const newInputBlock = `<div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              placeholder="পরিমাণ" 
                              className="w-20 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2e7d32]"
                              value={receiveQtys[product.id] || ''}
                              onChange={(e) => setReceiveQtys(prev => ({ ...prev, [product.id]: e.target.value }))}
                              min="1"
                            />
                            <button 
                              onClick={() => {
                                const qty = parseInt(receiveQtys[product.id] || '0');
                                if (!isNaN(qty) && qty > 0) {
                                  updateProduct({ ...product, stock: (product.stock || 0) + qty });
                                  setReceiveQtys(prev => ({ ...prev, [product.id]: '' }));
                                  alert('স্টক আপডেট সফল হয়েছে! নতুন স্টক: ' + ((product.stock || 0) + qty));
                                } else {
                                  alert('সঠিক পরিমাণ দিন।');
                                }
                              }}
                              className="bg-[#2e7d32] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                            >
                              <Check size={14} /> রিসিভ
                            </button>
                          </div>`;

if (content.includes(oldInputBlock)) {
  content = content.replace(oldInputBlock, newInputBlock);
  fs.writeFileSync(file, content);
  console.log("Replaced receive input block");
} else {
  console.log("Could not find the block to replace");
}
