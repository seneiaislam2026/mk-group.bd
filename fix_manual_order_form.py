import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# I will find the exact boundary.
start_marker = r"              \{\/\* Form 2: Product Adder \*\/\}"
end_marker = r"              <\/button>\n            <\/div>\n          <\/div>\n        <\/div>\n      \)\}"

replacement = """              {/* Form 2: Product Adder (Article based) */}
              <div className="space-y-3.5">
                <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">২. আর্টিকেল এবং পরিমাণ যুক্ত করুন</h4>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">আর্টিকেল নম্বর</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: 8644004"
                      value={manualArticleInput}
                      onChange={(e) => setManualArticleInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">পরিমাণ</label>
                    <input 
                      type="number" 
                      min="1"
                      value={manualQuantityInput}
                      onChange={(e) => setManualQuantityInput(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">রেট (Rate)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={manualRateInput}
                      onChange={(e) => setManualRateInput(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      if (!manualArticleInput || manualRateInput === '') return;
                      // Attempt to find product matching article
                      const product = products.find(p => p.article === manualArticleInput || p.id === manualArticleInput);
                      const id = product ? product.id : `custom-${Date.now()}`;
                      const name = product ? product.name : `Custom Article ${manualArticleInput}`;
                      
                      const existingIndex = manualOrderItems.findIndex(item => item.article === manualArticleInput && item.price === manualRateInput);
                      if (existingIndex > -1) {
                        const updated = [...manualOrderItems];
                        updated[existingIndex].quantity += manualQuantityInput;
                        setManualOrderItems(updated);
                      } else {
                        setManualOrderItems(prev => [...prev, {
                          id,
                          name,
                          article: manualArticleInput,
                          quantity: manualQuantityInput,
                          price: Number(manualRateInput)
                        }]);
                      }
                      setManualArticleInput('');
                      setManualQuantityInput(1);
                      setManualRateInput('');
                    }}
                    className="bg-[#2e7d32] hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black h-[38px] transition-all cursor-pointer"
                  >
                    যোগ করুন
                  </button>
                </div>
              </div>

              {/* Form 3: Current Order Items list */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">৩. অর্ডার তালিকা ও হিসাব</h4>
                
                {manualOrderItems.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 font-bold bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-[11px]">
                    এখনো কোন আর্টিকেল যুক্ত করা হয়নি। উপর থেকে আর্টিকেল লিখে যুক্ত করুন।
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-slate-50/50">
                    <table className="w-full text-left text-[10px]">
                      <thead>
                        <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider">
                          <th className="px-2 py-1.5 font-bold">Serial No</th>
                          <th className="px-2 py-1.5 font-bold">Article</th>
                          <th className="px-2 py-1.5 font-bold">Quantity</th>
                          <th className="px-2 py-1.5 font-bold">Rate</th>
                          <th className="px-2 py-1.5 font-bold">Amount</th>
                          <th className="px-2 py-1.5 font-bold text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-bold">
                        {manualOrderItems.map((item, idx) => (
                          <tr key={item.article + idx}>
                            <td className="px-2 py-2 text-slate-600">{idx + 1}</td>
                            <td className="px-2 py-2 text-slate-800">{item.article}</td>
                            <td className="px-2 py-2 text-slate-600">{item.quantity} Pair</td>
                            <td className="px-2 py-2 text-slate-600">{item.price}</td>
                            <td className="px-2 py-2 text-slate-800">{(item.price * item.quantity).toLocaleString('bn-BD')}</td>
                            <td className="px-2 py-2 text-center">
                              <button 
                                type="button"
                                onClick={() => {
                                  setManualOrderItems(prev => prev.filter((_, i) => i !== idx));
                                }}
                                className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Invoice sub calculations */}
                    <div className="p-3 bg-slate-50 text-[11px] font-bold text-slate-500 space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Courier Charge:</span>
                        <input 
                          type="number"
                          className="w-20 px-2 py-1 border border-slate-200 rounded text-right outline-none focus:border-[#2e7d32]"
                          value={manualDeliveryCharge}
                          onChange={(e) => setManualDeliveryCharge(Number(e.target.value))}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Condition charge:</span>
                        <input 
                          type="number"
                          className="w-20 px-2 py-1 border border-slate-200 rounded text-right outline-none focus:border-[#2e7d32]"
                          value={manualConditionCharge}
                          onChange={(e) => setManualConditionCharge(Number(e.target.value))}
                        />
                      </div>
                      <div className="flex justify-between text-slate-800 font-black text-xs pt-1.5 border-t border-slate-200">
                        <span>TOTAL Amount:</span>
                        <span>৳{(manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + manualDeliveryCharge + manualConditionCharge).toLocaleString('bn-BD')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {createdOrderData ? (
              <div className="p-5 border-t border-slate-100 flex flex-col gap-3 shrink-0 bg-slate-50 select-none">
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-2.5 rounded-xl text-xs font-bold mb-2">
                  <CheckCircle size={16} /> অর্ডারটি সফলভাবে তৈরি হয়েছে!
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      const data = createdOrderData;
                      // Logic for printing invoice
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        const printContent = `
                          <html>
                          <head>
                            <title>Invoice</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 20px; font-size: 14px; }
                              .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
                              .header h1 { font-size: 24px; margin: 0; color: #1e3a8a; }
                              .header p { margin: 2px 0; font-size: 12px; }
                              .info { width: 100%; max-width: 350px; margin-bottom: 20px; border: 1px solid #000; border-collapse: collapse; }
                              .info td { border: 1px solid #000; padding: 5px; font-size: 12px; }
                              .info-table-wrap { display: flex; justify-content: space-between; }
                              table.items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                              table.items th, table.items td { border: 1px solid #000; padding: 8px; text-align: center; font-size: 13px; }
                              table.items th { background-color: #f0f0f0; }
                              .totals { width: 100%; display: flex; flex-direction: column; align-items: flex-end; }
                              .totals-table { border-collapse: collapse; width: 400px; }
                              .totals-table td { border: 1px solid #000; padding: 8px; text-align: right; font-size: 13px; font-weight: bold; }
                              .footer { display: flex; justify-content: space-between; margin-top: 50px; }
                              .signature { text-align: center; border-top: 1px solid #000; padding-top: 5px; font-size: 12px; font-weight: bold; width: 200px; }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <h1>MK GROUP</h1>
                              <p>Pandhoa Bazar, Beside Jahangirnagar University, Savar, Dhaka</p>
                              <p>Email: mkkhanmahadi01969@gmail.com, Phone: 01969317241, 01330457810</p>
                              <h2>INVOICE</h2>
                            </div>
                            <div class="info-table-wrap">
                              <table class="info">
                                <tr><td><strong>ID:</strong></td><td>${data.id}</td></tr>
                                <tr><td><strong>Name:</strong></td><td>${data.customerName}</td></tr>
                                <tr><td><strong>Contact:</strong></td><td>${data.phone}</td></tr>
                                <tr><td><strong>Address:</strong></td><td>${data.address}</td></tr>
                              </table>
                              <div style="font-weight: bold; font-size: 12px;">DATE: ${new Date(data.date).toLocaleDateString('en-GB')}</div>
                            </div>
                            <table class="items">
                              <thead>
                                <tr>
                                  <th>Serial No</th>
                                  <th>Article</th>
                                  <th>Unit</th>
                                  <th>Quantity</th>
                                  <th>Rate</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${data.items.map((item: any, i: number) => `
                                  <tr>
                                    <td>${i + 1}</td>
                                    <td>${item.article || item.name}</td>
                                    <td></td>
                                    <td>${item.quantity} Pair</td>
                                    <td>${item.price}</td>
                                    <td>${item.price * item.quantity}</td>
                                  </tr>
                                `).join('')}
                              </tbody>
                            </table>
                            <div class="totals">
                              <table class="totals-table">
                                <tr>
                                  <td style="text-align: right;">Courier Charge:</td>
                                  <td>${data.deliveryCharge || 0} Taka</td>
                                </tr>
                                <tr>
                                  <td style="text-align: right;">Condition charge:</td>
                                  <td>${data.conditionCharge || 0} Taka</td>
                                </tr>
                                <tr>
                                  <td style="text-align: center;">TOTAL Amount:</td>
                                  <td>${data.total} Taka</td>
                                </tr>
                              </table>
                            </div>
                            <div style="margin-top: 15px; border: 1px solid #000; padding: 5px 10px; display: inline-block; font-size: 13px; font-weight: bold;">
                              Payment Status: ${data.paymentStatus === 'Unpaid' ? 'cash on delivery' : 'paid'}
                            </div>
                            <div class="footer">
                              <div class="signature">DIRECTOR OF MK GROUP<br>MD MISBAH KHAN</div>
                              <div class="signature">MANAGER OF MK GROUP<br>MD SHA FIUL ALAM</div>
                            </div>
                            <div style="text-align: center; margin-top: 30px;">
                              <div style="font-size: 20px; font-weight: bold;">PHONE: 01969317241</div>
                              <div style="border: 2px solid #000; padding: 5px; display: inline-block; margin-top: 5px; font-size: 18px; font-weight: bold;">Thanks will come again</div>
                            </div>
                            <script>
                              window.onload = function() { window.print(); };
                            </script>
                          </body>
                          </html>
                        `;
                        printWindow.document.write(printContent);
                        printWindow.document.close();
                      }
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-xs font-black transition-all flex items-center justify-center gap-2"
                  >
                    <FileText size={16} /> ইনভয়েস প্রিন্ট
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      addNotification('স্ট্যাডফাস্ট', 'স্টেডফাস্ট কুরিয়ার বুকিং API ইন্টিগ্রেশন প্রয়োজন।');
                    }}
                    className="flex-1 bg-[#111111] hover:bg-black text-white rounded-xl py-2.5 text-xs font-black transition-all flex items-center justify-center gap-2"
                  >
                    <Package size={16} /> Steadfast Booking
                  </button>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setIsManualOrderModalOpen(false);
                    setCreatedOrderData(null);
                  }}
                  className="w-full mt-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl py-2 text-xs font-bold transition-all"
                >
                  বন্ধ করুন
                </button>
              </div>
            ) : (
              <div className="p-5 border-t border-slate-100 flex justify-end gap-2 shrink-0 bg-slate-50 select-none">
                <button 
                  type="button" 
                  onClick={() => setIsManualOrderModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
                >
                  বাতিল করুন
                </button>
                <button 
                  type="button"
                  disabled={manualOrderItems.length === 0 || !manualOrderCustomerName || !manualOrderPhone || !manualOrderAddress}
                  onClick={() => {
                    if (manualOrderItems.length === 0) return;
                    if (!manualOrderCustomerName || !manualOrderPhone || !manualOrderAddress) {
                      addNotification('সতর্কতা', 'অনুগ্রহ করে গ্রাহকের সম্পূর্ণ বিবরণ ও তথ্য প্রদান করুন।');
                      return;
                    }
                    if (!manualOrderPhone.startsWith('01') || manualOrderPhone.length < 11) {
                      addNotification('সতর্কতা', 'অনুগ্রহ করে একটি সঠিক বাংলাদেশী মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।');
                      return;
                    }
                    
                    const subtotal = manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    const grandTotal = subtotal + manualDeliveryCharge + manualConditionCharge;
                    
                    const newManualOrderObj = {
                      id: `man-${Math.floor(1000 + Math.random() * 9000)}`,
                      customerName: manualOrderCustomerName,
                      phone: manualOrderPhone,
                      address: manualOrderAddress,
                      items: manualOrderItems,
                      total: grandTotal,
                      deliveryCharge: manualDeliveryCharge,
                      conditionCharge: manualConditionCharge,
                      date: new Date().toISOString(),
                      status: 'Pending' as const,
                      paymentStatus: manualOrderIsDue ? 'Unpaid' : 'Paid'
                    };
                    
                    addSimulatedOrder(newManualOrderObj);
                    
                    if (manualOrderIsDue) {
                      const addedDue = {
                        id: `d-${Date.now()}`,
                        customerName: manualOrderCustomerName,
                        phone: manualOrderPhone,
                        amount: grandTotal,
                        paidAmount: 0,
                        date: new Date().toISOString(),
                        status: 'Unpaid' as const
                      };
                      setDues(prevDues => [addedDue, ...prevDues]);
                    }
                    
                    // Stock Deduct
                    for (const item of manualOrderItems) {
                      if (item.id && !item.id.startsWith('custom-')) {
                        const p = products.find(prod => prod.id === item.id);
                        if (p) {
                          updateProduct({ ...p, stock: Math.max(0, (p.stock || 0) - item.quantity) });
                        }
                      }
                    }

                    addNotification(
                      'অর্ডার সফল 📝',
                      `গ্রাহক ${manualOrderCustomerName} এর জন্য ৳${grandTotal} টাকার অর্ডার সম্পন্ন এবং স্টক আপডেট হয়েছে।`
                    );
                    
                    if (soundEnabled) {
                      triggerSound();
                    }
                    
                    setCreatedOrderData(newManualOrderObj);
                    
                    // Reset fields
                    setManualOrderIsDue(false);
                    setManualOrderCustomerName('');
                    setManualOrderPhone('');
                    setManualOrderAddress('');
                    setManualOrderItems([]);
                    setManualDeliveryCharge(120);
                    setManualConditionCharge(0);
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-black text-white shadow-md transition-all ${
                    (manualOrderItems.length === 0 || !manualOrderCustomerName || !manualOrderPhone || !manualOrderAddress)
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-[#2e7d32] hover:bg-emerald-700'
                  }`}
                >
                  অর্ডার সাবমিট করুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}"""

# Replace between the start and end markers
import sys
content_new = re.sub(start_marker + r".*?" + end_marker, replacement, content, flags=re.DOTALL)

if content_new == content:
    print("Replace failed. Outputting a bit of content for debugging.")
    sys.exit(1)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content_new)
