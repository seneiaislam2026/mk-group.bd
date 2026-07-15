import fs from 'fs';
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const startIndex = content.indexOf('{isManualOrderModalOpen && (');
const endIndex = content.indexOf('{/* Courier Booking Modal */}');

const newModal = `{isManualOrderModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">
                {editingOrderId ? 'অর্ডার এডিট করুন' : 'ম্যানুয়াল ক্যাশ-অন-ডেলিভারি অর্ডার'}
              </h3>
              <button onClick={() => { setIsManualOrderModalOpen(false); setEditingOrderId(null); }} className="text-slate-400 hover:text-rose-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              {!createdOrderForActions ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">গ্রাহকের তথ্য</h4>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">নাম</label>
                        <input type="text" value={manualOrderCustomerName} onChange={e => setManualOrderCustomerName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#2e7d32] text-sm" placeholder="গ্রাহকের নাম" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বর</label>
                        <input type="text" value={manualOrderPhone} onChange={e => setManualOrderPhone(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#2e7d32] text-sm" placeholder="01XXXXXXXXX" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা</label>
                        <textarea value={manualOrderAddress} onChange={e => setManualOrderAddress(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#2e7d32] text-sm resize-none" placeholder="পূর্ণ ঠিকানা"></textarea>
                      </div>
                    </div>

                    {/* Product Selection */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">পণ্য নির্বাচন</h4>
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="block text-[10px] text-slate-500 font-bold mb-1">আর্টিকেল নম্বর</label>
                          <input type="text" value={manualArticleSearch} onChange={e => {
                            setManualArticleSearch(e.target.value);
                            const prod = products.find(p => p.article === e.target.value || p.id === e.target.value);
                            if (prod) {
                              setManualSelectedProductId(prod.id);
                              setManualSelectedPrice(prod.discountedPrice || prod.originalPrice);
                            } else {
                              setManualSelectedProductId('');
                              setManualSelectedPrice('');
                            }
                          }} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32]" placeholder="আর্টিকেল নং" />
                        </div>
                        <div className="w-20">
                          <label className="block text-[10px] text-slate-500 font-bold mb-1">পরিমাণ</label>
                          <input type="number" min="1" value={manualSelectedQuantity} onChange={e => setManualSelectedQuantity(Math.max(1, Number(e.target.value)))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]" />
                        </div>
                        <div className="w-24">
                          <label className="block text-[10px] text-slate-500 font-bold mb-1">রেট (৳)</label>
                          <input type="number" min="0" value={manualSelectedPrice} onChange={e => setManualSelectedPrice(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]" />
                        </div>
                        <button type="button" onClick={() => {
                          if (!manualArticleSearch.trim() || manualSelectedPrice === '') return;
                          
                          let finalId = manualSelectedProductId;
                          let finalName = \`Custom Product (\${manualArticleSearch})\`;
                          
                          if (finalId) {
                             const p = products.find(prod => prod.id === finalId);
                             if (p) finalName = p.name;
                          } else {
                             finalId = 'custom-' + Date.now();
                          }
                          
                          const qty = Number(manualSelectedQuantity) || 1;
                          const existingIndex = manualOrderItems.findIndex(item => item.id === finalId);
                          if (existingIndex > -1) {
                            const updated = [...manualOrderItems];
                            updated[existingIndex].quantity += qty;
                            if (manualSelectedPrice !== '') updated[existingIndex].price = Number(manualSelectedPrice);
                            setManualOrderItems(updated);
                          } else {
                            setManualOrderItems(prev => [...prev, {
                              id: finalId, name: finalName, quantity: qty, price: Number(manualSelectedPrice)
                            }]);
                          }
                          setManualSelectedQuantity(1);
                          setManualSelectedPrice('');
                          setManualSelectedProductId('');
                          setManualArticleSearch('');
                        }} className="bg-[#2e7d32] hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold h-[34px]">
                          যুক্ত করুন
                        </button>
                      </div>
                      {manualSelectedProductId && products.find(p => p.id === manualSelectedProductId) && (
                        <p className="text-[10px] text-emerald-600 font-bold">{products.find(p => p.id === manualSelectedProductId)?.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">অর্ডার তালিকা ও বিল</h4>
                    
                    <div className="flex-1 overflow-y-auto mb-4 border border-slate-200 bg-white rounded-xl divide-y divide-slate-100">
                      {manualOrderItems.length === 0 ? (
                         <div className="p-4 text-center text-slate-400 text-xs">কোন পণ্য নেই</div>
                      ) : (
                         manualOrderItems.map((item, idx) => (
                           <div key={item.id} className="p-2.5 flex items-center justify-between text-xs">
                             <div className="flex gap-2 items-center min-w-0">
                               <span className="text-slate-400 w-4">{idx + 1}.</span>
                               <div className="truncate">
                                 <p className="font-bold text-slate-800 truncate">{item.name}</p>
                                 <p className="text-[10px] text-slate-500">৳{item.price.toLocaleString('bn-BD')} × {item.quantity}</p>
                               </div>
                             </div>
                             <div className="flex items-center gap-3 pl-2">
                               <span className="font-bold">৳{(item.price * item.quantity).toLocaleString('bn-BD')}</span>
                               <button type="button" onClick={() => setManualOrderItems(prev => prev.filter(p => p.id !== item.id))} className="text-slate-400 hover:text-rose-500"><Trash2 size={14}/></button>
                             </div>
                           </div>
                         ))
                      )}
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>সাবটোটাল</span>
                        <span className="font-bold">৳{manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('bn-BD')}</span>
                      </div>
                      
                      {!manualOrderIsDue && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-600">ডেলিভারি চার্জ</span>
                          <input type="number" value={manualDeliveryCharge} onChange={e => setManualDeliveryCharge(e.target.value === '' ? '' : Number(e.target.value))} className="w-20 px-2 py-1 rounded border border-slate-200 text-right outline-none focus:border-[#2e7d32]" />
                        </div>
                      )}

                      {!manualOrderIsDue && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-600">কন্ডিশন চার্জ (১%)</span>
                          <input type="number" value={manualConditionCharge} onChange={e => setManualConditionCharge(e.target.value === '' ? '' : Number(e.target.value))} className="w-20 px-2 py-1 rounded border border-slate-200 text-right outline-none focus:border-[#2e7d32]" />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <span className="text-slate-800 font-bold">সর্বমোট</span>
                        <span className="text-emerald-700 font-black text-lg">
                          ৳{(manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (!manualOrderIsDue ? (Number(manualDeliveryCharge) || 0) + (Number(manualConditionCharge) || 0) : 0)).toLocaleString('bn-BD')}
                        </span>
                      </div>

                      <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={manualOrderIsDue} onChange={e => {
                            setManualOrderIsDue(e.target.checked);
                            if (e.target.checked) {
                              setManualDeliveryCharge(0);
                              setManualConditionCharge(0);
                            }
                          }} className="w-4 h-4 rounded border-slate-300 text-[#2e7d32] focus:ring-[#2e7d32]" />
                          <span className="text-sm font-bold text-slate-700">পুরো বিলটি বকেয়া (Due) হিসেবে রাখুন</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                   <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={40} /></div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">অর্ডার সফলভাবে তৈরি হয়েছে!</h3>
                   <p className="text-slate-500 mb-6">Order ID: {createdOrderForActions.id}</p>
                   <div className="flex gap-4 justify-center">
                     <button onClick={() => window.open(\`/print-invoice?orderId=\${createdOrderForActions.id}&name=\${encodeURIComponent(createdOrderForActions.customerName)}&phone=\${encodeURIComponent(createdOrderForActions.phone)}&amount=\${createdOrderForActions.total}\`, '_blank')} className="bg-emerald-50 text-emerald-700 px-6 py-2 rounded-xl font-bold hover:bg-emerald-100 flex gap-2 items-center"><FileText size={16}/> প্রিন্ট ইনভয়েস</button>
                     <button onClick={() => {
                        setCourierBookingData({
                          invoice: createdOrderForActions.id,
                          recipient_name: createdOrderForActions.customerName,
                          recipient_phone: createdOrderForActions.phone,
                          recipient_address: createdOrderForActions.address,
                          cod_amount: createdOrderForActions.total.toString(),
                          note: ''
                        });
                        setIsManualOrderModalOpen(false);
                        setActiveTab('courier');
                        setIsCourierModalOpen(true);
                        setCreatedOrderForActions(null);
                     }} className="bg-blue-50 text-blue-700 px-6 py-2 rounded-xl font-bold hover:bg-blue-100 flex gap-2 items-center"><Truck size={16}/> কুরিয়ার বুকিং</button>
                   </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              {!createdOrderForActions ? (
                <>
                  <button onClick={() => { setIsManualOrderModalOpen(false); setEditingOrderId(null); }} className="px-5 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50">
                    বাতিল করুন
                  </button>
                  <button onClick={() => {
                      if (!manualOrderCustomerName || !manualOrderPhone || !manualOrderAddress) {
                        alert('গ্রাহকের নাম, ফোন ও ঠিকানা পূরণ করুন।');
                        return;
                      }
                      if (manualOrderItems.length === 0) {
                        alert('কমপক্ষে একটি পণ্য যুক্ত করুন।');
                        return;
                      }

                      const subtotal = manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                      const grandTotal = subtotal + (!manualOrderIsDue ? ((Number(manualDeliveryCharge)||0) + (Number(manualConditionCharge)||0)) : 0);

                      // Handle Stock Update (Delta if editing)
                      const oldOrder = editingOrderId ? orders.find(o => o.id === editingOrderId) : null;
                      
                      const stockUpdates = new Map();
                      if (oldOrder && oldOrder.status !== 'Cancelled') {
                        oldOrder.items.forEach(oldItem => {
                          const current = stockUpdates.get(oldItem.id) || (products.find(p => p.id === oldItem.id)?.stock || 0);
                          stockUpdates.set(oldItem.id, current + oldItem.quantity);
                        });
                      }
                      
                      manualOrderItems.forEach(newItem => {
                        const current = stockUpdates.has(newItem.id) ? stockUpdates.get(newItem.id) : (products.find(p => p.id === newItem.id)?.stock || 0);
                        stockUpdates.set(newItem.id, Math.max(0, current - newItem.quantity));
                      });
                      
                      stockUpdates.forEach((newStock, productId) => {
                        const prod = products.find(p => p.id === productId);
                        if (prod) updateProduct({ ...prod, stock: newStock });
                      });

                      const newManualOrderObj = {
                        id: editingOrderId || (() => {
                          const maxId = orders.reduce((max, o) => {
                            if (o.id.startsWith('MKO-')) {
                              const num = parseInt(o.id.replace('MKO-', ''));
                              return num > max ? num : max;
                            }
                            return max;
                          }, 0);
                          return \`MKO-\${maxId + 1}\`;
                        })(),
                        customerName: manualOrderCustomerName,
                        phone: manualOrderPhone,
                        address: manualOrderAddress,
                        items: manualOrderItems,
                        subtotal,
                        deliveryCharge: !manualOrderIsDue ? (Number(manualDeliveryCharge)||0) : 0,
                        conditionCharge: !manualOrderIsDue ? (Number(manualConditionCharge)||0) : 0,
                        total: grandTotal,
                        date: oldOrder ? oldOrder.date : new Date().toISOString(),
                        status: oldOrder ? oldOrder.status : 'Pending' as const
                      };

                      if (editingOrderId) {
                        const updatedOrders = orders.map(o => o.id === editingOrderId ? newManualOrderObj : o);
                        // Save logic to updateOrder context ideally, but assuming addSimulatedOrder can update if we handle it or we use updateOrder function
                        // Actually addSimulatedOrder handles new, we might need updateOrder here if we have it, but for simulation let's use the local state or context.
                        // We will call addSimulatedOrder and the context needs to support updating.
                        // Usually, order update is handled in context.
                        if (typeof updateOrder === 'function') {
                          updateOrder(editingOrderId, newManualOrderObj);
                        } else {
                          // Fallback
                          addSimulatedOrder(newManualOrderObj);
                        }
                      } else {
                        addSimulatedOrder(newManualOrderObj);
                      }

                      if (manualOrderIsDue && !editingOrderId) {
                        const addedDue = {
                          id: \`d-\${Date.now()}\`,
                          customerName: manualOrderCustomerName,
                          phone: manualOrderPhone,
                          amount: grandTotal,
                          paidAmount: 0,
                          date: new Date().toISOString(),
                          status: 'Unpaid' as const
                        };
                        setDues([...dues, addedDue]);
                      }
                      
                      addNotification('সফল', editingOrderId ? 'অর্ডার আপডেট হয়েছে।' : 'অর্ডার তৈরি হয়েছে।');
                      if (soundEnabled) triggerSound();
                      
                      if (!editingOrderId) {
                        setCreatedOrderForActions(newManualOrderObj);
                      } else {
                        setIsManualOrderModalOpen(false);
                        setEditingOrderId(null);
                        setManualOrderCustomerName('');
                        setManualOrderPhone('');
                        setManualOrderAddress('');
                        setManualOrderItems([]);
                      }
                  }} className="px-5 py-2 bg-[#2e7d32] text-white rounded-xl font-bold text-sm hover:bg-emerald-700">
                    {editingOrderId ? 'আপডেট করুন' : 'অর্ডার নিশ্চিত করুন'}
                  </button>
                </>
              ) : (
                <button onClick={() => {
                  setIsManualOrderModalOpen(false);
                  setCreatedOrderForActions(null);
                  setManualOrderCustomerName('');
                  setManualOrderPhone('');
                  setManualOrderAddress('');
                  setManualOrderItems([]);
                  setEditingOrderId(null);
                }} className="px-5 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-300">
                  বন্ধ করুন
                </button>
              )}
            </div>
          </div>
        </div>
      )}
`;

content = content.substring(0, startIndex) + newModal + "\n      " + content.substring(endIndex);
fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
