const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const targetTableStart = `                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">`;
                    
const targetTableEnd = `                    </table>
                  </div>`;

// We will extract everything between them and replace it with desktop/mobile view.
// It's easier to just use string replacement for the `overflow-x-auto` part.

let newCode = code.replace(
  `<div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">`,
  `<div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">`
);

const replaceMobileStart = `                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS TRACKING */}`;

const replaceMobileBlock = `                    </table>
                  </div>
                  
                  {/* Mobile responsive view: stacked cards */}
                  <div className="block md:hidden divide-y divide-slate-100">
                    {filteredProductsList.map((product, index) => {
                      const totalStock = product.stock || 0;
                      const boxes = Math.floor(totalStock / 24);
                      const pairs = totalStock % 24;
                      let stockText = '';
                      if (boxes > 0) stockText += \`\${boxes} বক্স \`;
                      if (pairs > 0) stockText += \`\${pairs} জোড়া\`;
                      if (totalStock === 0) stockText = 'স্টক নেই';

                      return (
                        <div key={'rec-mob-'+product.id} className="p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-extrabold text-slate-900">{product.article || \`PRD-\${product.id}\`}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{product.name}</div>
                            </div>
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                              {stockText}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="number"
                              placeholder="পরিমাণ (জোড়া)"
                              className="flex-1 min-w-0 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#2e7d32]"
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
                              className="bg-[#2e7d32] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors whitespace-nowrap"
                            >
                              রিসিভ
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS TRACKING */}`;

newCode = newCode.replace(replaceMobileStart, replaceMobileBlock);

fs.writeFileSync('src/pages/AdminDashboard.tsx', newCode);
console.log('Fixed stock table mobile view.');
