sed -i '1803,1845c\
                              <button \
                                onClick={() => setSelectedOrder(order)}\
                                className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-[10px] font-extrabold transition-colors border border-blue-100"\
                              >\
                                বিবরণ\
                              </button>\
                              \
                              {order.status !== '\''Completed'\'' && (\
                                <button \
                                  onClick={() => setBookingOrder(order)}\
                                  className="text-white hover:bg-emerald-800 bg-[#1b4332] px-2 py-1 rounded text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer"\
                                  title="কুরিয়ার বুকিং করুন"\
                                >\
                                  <Truck size={10} /> বুকিং\
                                </button>\
                              )}\
\
                              <select \
                                value={order.status}\
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}\
                                className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-1.5 py-1 text-[10px] cursor-pointer font-bold focus:outline-none"\
                              >\
                                <option value="Pending">পেন্ডিং (অর্ডার সফল হয়েছে)</option>\
                                <option value="Confirmed">পণ্য প্রস্তুত করা হচ্ছে</option>\
                                <option value="Shipped">ডেলিভারি পার্টনারের কাছে হস্তান্তরিত</option>\
                                <option value="Completed">ডেলিভারি সম্পন্ন</option>\
                                <option value="Cancelled">বাতিল</option>\
                              </select>\
                              \
                              <button \
                                onClick={() => { if(confirm('\''অর্ডার রেকর্ডটি মুছে ফেলতে চান?'\'')) deleteOrder(order.id); }}\
                                className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-1 rounded cursor-pointer"\
                                title="অর্ডার ডিলিট"\
                              >\
                                <Trash2 size={12} />\
                              </button>\
                            </div>\
                          </td>\
                        </tr>\
                      ))\
                    )}\
                  </tbody>\
' src/pages/AdminDashboard.tsx
