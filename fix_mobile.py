import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

old_block = """                      {/* Total bill and Actions wrapper - Clean Alignment */}
                      <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-dashed border-slate-200">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">মোট বিল</span>
                          <span className="text-xs font-black text-slate-900">৳{order.total}</span>
                        </div>

                        {/* Interactive mobile actions */}
                        <div className="flex items-center gap-1 font-bold">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-105 px-2 py-1 rounded text-[10px] font-extrabold transition-colors border border-blue-100"
                          >
                            বিবরণ
                          </button>
                          {order.status !== 'Completed' && (
                            <button 
                              onClick={() => setBookingOrder(order)}
                              className="bg-[#1b4332] text-white hover:bg-emerald-800 px-2 py-1 rounded text-[10px] font-extrabold flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                            >
                              <Truck size={10} /> বুকিং
                            </button>
                          )}
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-1.5 py-1 text-[10px] cursor-pointer font-bold focus:outline-none"
                          >
                            <option value="Pending">পেন্ডিং (অর্ডার সফল হয়েছে)</option>
                            <option value="Confirmed">পণ্য প্রস্তুত করা হচ্ছে</option>
                            <option value="Shipped">ডেলিভারি পার্টনারের কাছে হস্তান্তরিত</option>
                            <option value="Completed">ডেলিভারি সম্পন্ন</option>
                            <option value="Cancelled">বাতিল</option>
                          </select>
                          <button 
                            onClick={() => { if(confirm('অর্ডার রেকর্ডটি মুছে ফেলতে চান?')) deleteOrder(order.id); }}
                            className="text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-100 p-1 rounded transition-all cursor-pointer"
                            title="অর্ডার ডিলিট"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>"""

new_block = """                      {/* Total bill and Actions wrapper - Clean Alignment */}
                      <div className="flex flex-col gap-3 mt-1 pt-2.5 border-t border-dashed border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">মোট বিল</span>
                            <span className="text-xs font-black text-slate-900">৳{order.total}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-bold">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="bg-blue-50 text-blue-600 hover:bg-blue-105 px-2.5 py-1.5 rounded text-[10px] font-extrabold transition-colors border border-blue-100"
                            >
                              বিবরণ
                            </button>
                            {order.status !== 'Completed' && (
                              <button 
                                onClick={() => setBookingOrder(order)}
                                className="bg-[#1b4332] text-white hover:bg-emerald-800 px-2.5 py-1.5 rounded text-[10px] font-extrabold flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                              >
                                <Truck size={10} /> বুকিং
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Status Select and Delete */}
                        <div className="flex items-center justify-between gap-2">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded px-2 py-1.5 text-[10px] cursor-pointer font-bold focus:outline-none truncate max-w-[200px] sm:max-w-none"
                          >
                            <option value="Pending">পেন্ডিং (অর্ডার সফল হয়েছে)</option>
                            <option value="Confirmed">পণ্য প্রস্তুত করা হচ্ছে</option>
                            <option value="Shipped">ডেলিভারি পার্টনারের কাছে হস্তান্তরিত</option>
                            <option value="Completed">ডেলিভারি সম্পন্ন</option>
                            <option value="Cancelled">বাতিল</option>
                          </select>
                          <button 
                            onClick={() => { if(confirm('অর্ডার রেকর্ডটি মুছে ফেলতে চান?')) deleteOrder(order.id); }}
                            className="text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-100 p-1.5 rounded transition-all cursor-pointer shrink-0"
                            title="অর্ডার ডিলিট"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>"""

content = content.replace(old_block, new_block)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
