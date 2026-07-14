const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const startStr = `<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredProductsList.map((product) => (`;
const endStr = `                  </div>
                )}
              </div>
            </div>
          )}`;

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  let oldBlock = code.substring(startIndex, endIndex + 24); // To include closing tags properly, or just replace up to endStr
  
  const newBlock = `<div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[11px] select-none text-left">
                          <th className="p-4 font-bold text-center">সিরিয়াল</th>
                          <th className="p-4 font-bold">আর্টিকেল</th>
                          <th className="p-4 font-bold">বর্তমান স্টক</th>
                          <th className="p-4 font-bold">নতুন রিসিভ (জোড়া)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredProductsList.map((product, index) => {
                          const totalStock = product.stock || 0;
                          const boxes = Math.floor(totalStock / 24);
                          const pairs = totalStock % 24;
                          let stockText = '';
                          if (boxes > 0) stockText += \`\${boxes} বক্স \`;
                          if (pairs > 0) stockText += \`\${pairs} জোড়া\`;
                          if (totalStock === 0) stockText = 'স্টক নেই';

                          return (
                            <tr key={'rec-'+product.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 text-center text-slate-500 font-mono">{index + 1}</td>
                              <td className="p-4">
                                <div className="font-extrabold text-slate-900">{product.article || \`PRD-\${product.id}\`}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{product.name}</div>
                              </td>
                              <td className="p-4">
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                                  {stockText}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="number" 
                                    placeholder="পরিমাণ (জোড়া)" 
                                    className="w-24 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#2e7d32]"
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
                                        alert('স্টক আপডেট সফল হয়েছে! নতুন স্টক: ' + ((product.stock || 0) + qty) + ' জোড়া');
                                      } else {
                                        alert('সঠিক পরিমাণ দিন।');
                                      }
                                    }}
                                    className="bg-[#2e7d32] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                                  >
                                    রিসিভ
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>`;
                  
  code = code.replace(code.substring(startIndex, endIndex), newBlock);
  console.log("Replaced using indices!");
  fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
} else {
  console.log("Could not find boundaries.");
}
