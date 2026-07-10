import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

# 1. Add state
content = content.replace("const [manualOrderAddress, setManualOrderAddress] = useState('');", 
                          "const [manualOrderAddress, setManualOrderAddress] = useState('');\n  const [manualOrderIsDue, setManualOrderIsDue] = useState(false);")

# 2. Add checkbox in UI
checkbox_ui = """                    <textarea 
                      required
                      placeholder="বিস্তারিত ঠিকানা..." 
                      rows={2}
                      value={manualOrderAddress}
                      onChange={(e) => setManualOrderAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32]"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="manualDueCheck" 
                    checked={manualOrderIsDue}
                    onChange={(e) => setManualOrderIsDue(e.target.checked)}
                    className="w-4 h-4 text-[#2e7d32] bg-gray-100 border-gray-300 rounded focus:ring-[#2e7d32]"
                  />
                  <label htmlFor="manualDueCheck" className="text-xs font-black text-rose-600 cursor-pointer select-none">
                    বাকী বিক্রয় (Dues Ledger এ স্বয়ংক্রিয়ভাবে যোগ হবে)
                  </label>
                </div>"""

content = content.replace("""                    <textarea 
                      required
                      placeholder="বিস্তারিত ঠিকানা..." 
                      rows={2}
                      value={manualOrderAddress}
                      onChange={(e) => setManualOrderAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#2e7d32]"
                    ></textarea>
                  </div>
                </div>""", checkbox_ui)

# 3. Add to dues logic
logic_str = """                  // Close and clean
                  setIsManualOrderModalOpen(false);
                  setManualOrderIsDue(false);
                  setManualOrderCustomerName('');
                  setManualOrderPhone('');
                  setManualOrderAddress('');
                  setManualOrderItems([]);"""

old_logic = """                  // Close and clean
                  setIsManualOrderModalOpen(false);"""

content = content.replace(old_logic, logic_str)

logic_push_due = """                  const newManualOrderObj = {
                    id: `man-${Math.floor(1000 + Math.random() * 9000)}`,
                    customerName: manualOrderCustomerName,
                    phone: manualOrderPhone,
                    address: manualOrderAddress,
                    items: manualOrderItems,
                    total: grandTotal,
                    date: new Date().toISOString(),
                    status: 'Pending' as const
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
                  }"""

content = content.replace("""                  const newManualOrderObj = {
                    id: `man-${Math.floor(1000 + Math.random() * 9000)}`,
                    customerName: manualOrderCustomerName,
                    phone: manualOrderPhone,
                    address: manualOrderAddress,
                    items: manualOrderItems,
                    total: grandTotal,
                    date: new Date().toISOString(),
                    status: 'Pending' as const
                  };
                  addSimulatedOrder(newManualOrderObj);""", logic_push_due)


with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)

print("Success")
