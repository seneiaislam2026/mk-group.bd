const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const targetOld = `<div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">আর্টিকেল নং</label>
                    <input 
                      type="text" 
                      value={manualArticleSearch}
                      placeholder="যেমন: ART-1"
                      onChange={(e) => {
                        const val = e.target.value;
                        setManualArticleSearch(val);
                        if (val) {
                          const prod = products.find(p => p.article?.toLowerCase() === val.toLowerCase());
                          if (prod) {
                            setManualSelectedProductId(prod.id);
                          } else {
                            setManualSelectedProductId('');
                          }
                        } else {
                          setManualSelectedProductId('');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32] bg-white"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">কাস্টম মূল্য</label>
                    <input 
                      type="number" 
                      min="0"
                      value={manualSelectedPrice === '' ? '' : manualSelectedPrice}
                      onChange={(e) => setManualSelectedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]"
                      placeholder="৳"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">পরিমাণ (জোড়া)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={manualSelectedQuantity === '' ? '' : manualSelectedQuantity}
                      onChange={(e) => setManualSelectedQuantity(e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]"
                      placeholder="পরিমাণ"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const qty = Number(manualSelectedQuantity) || 1;
                      let finalId = manualSelectedProductId;
                      let finalName = manualArticleSearch;
                      let finalPrice = Number(manualSelectedPrice) || 0;

                      if (manualSelectedProductId) {
                          const product = products.find(p => p.id === manualSelectedProductId);
                          if (product) {
                              finalName = product.name;
                              if (manualSelectedPrice === '') {
                                  finalPrice = product.discountedPrice || product.originalPrice;
                              }
                          }
                      } else {
                          // Allow custom article adding
                          if (!manualArticleSearch.trim()) {
                              alert('অনুগ্রহ করে পণ্যের আর্টিকেল বা নাম লিখুন।');
                              return;
                          }
                          finalId = 'custom-' + Date.now();
                      }
                      
                      const existingIndex = manualOrderItems.findIndex(item => item.id === finalId);
                      if (existingIndex > -1) {
                        const updated = [...manualOrderItems];
                        updated[existingIndex].quantity += qty;
                        // update price if provided
                        if (manualSelectedPrice !== '') updated[existingIndex].price = finalPrice;
                        setManualOrderItems(updated);
                      } else {
                        setManualOrderItems(prev => [...prev, {
                          id: finalId,
                          name: finalName,
                          quantity: qty,
                          price: finalPrice
                        }]);
                      }
                      // Reset selection quantity
                      setManualSelectedQuantity('');
                      setManualSelectedPrice('');
                      setManualSelectedProductId('');
                      setManualArticleSearch('');
                    }}
                    className="bg-[#2e7d32] hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black h-[38px] transition-all cursor-pointer"
                  >
                    যোগ করুন
                  </button>
                </div>`;

const targetNew = `<div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">আর্টিকেল নং বা নাম</label>
                    <input 
                      type="text" 
                      value={manualArticleSearch}
                      placeholder="যেমন: ART-1 অথবা পণ্যের নাম"
                      onChange={(e) => {
                        const val = e.target.value;
                        setManualArticleSearch(val);
                        if (val) {
                          const prod = products.find(p => p.article?.toLowerCase() === val.toLowerCase() || p.name?.toLowerCase().includes(val.toLowerCase()));
                          if (prod) {
                            setManualSelectedProductId(prod.id);
                          } else {
                            setManualSelectedProductId('');
                          }
                        } else {
                          setManualSelectedProductId('');
                        }
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32] bg-white"
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">কাস্টম মূল্য</label>
                      <input 
                        type="number" 
                        min="0"
                        value={manualSelectedPrice === '' ? '' : manualSelectedPrice}
                        onChange={(e) => setManualSelectedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]"
                        placeholder="৳"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">পরিমাণ (জোড়া)</label>
                      <input 
                        type="number" 
                        min="1"
                        value={manualSelectedQuantity === '' ? '' : manualSelectedQuantity}
                        onChange={(e) => setManualSelectedQuantity(e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]"
                        placeholder="পরিমাণ"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const qty = Number(manualSelectedQuantity) || 1;
                        let finalId = manualSelectedProductId;
                        let finalName = manualArticleSearch;
                        let finalPrice = Number(manualSelectedPrice) || 0;

                        if (manualSelectedProductId) {
                            const product = products.find(p => p.id === manualSelectedProductId);
                            if (product) {
                                finalName = product.name;
                                if (manualSelectedPrice === '') {
                                    finalPrice = product.discountedPrice || product.originalPrice;
                                }
                            }
                        } else {
                            // Allow custom article adding
                            if (!manualArticleSearch.trim()) {
                                alert('অনুগ্রহ করে পণ্যের আর্টিকেল বা নাম লিখুন।');
                                return;
                            }
                            finalId = 'custom-' + Date.now();
                        }
                        
                        const existingIndex = manualOrderItems.findIndex(item => item.id === finalId);
                        if (existingIndex > -1) {
                          const updated = [...manualOrderItems];
                          updated[existingIndex].quantity += qty;
                          // update price if provided
                          if (manualSelectedPrice !== '') updated[existingIndex].price = finalPrice;
                          setManualOrderItems(updated);
                        } else {
                          setManualOrderItems(prev => [...prev, {
                            id: finalId,
                            name: finalName,
                            quantity: qty,
                            price: finalPrice
                          }]);
                        }
                        // Reset selection quantity
                        setManualSelectedQuantity('');
                        setManualSelectedPrice('');
                        setManualSelectedProductId('');
                        setManualArticleSearch('');
                      }}
                      className="bg-[#2e7d32] hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-black h-[42px] transition-all cursor-pointer"
                    >
                      যোগ করুন
                    </button>
                  </div>
                </div>`;

code = code.replace(targetOld, targetNew);
fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed manual order UI');
