import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

old_block = """                      {/* Total bill and Actions wrapper - Clean Alignment */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1 pt-2.5 border-t border-dashed border-slate-200">
                        <div className="flex items-center justify-between sm:w-auto">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">মোট বিল</span>
                            <span className="text-xs font-black text-slate-900">৳{order.total}</span>
                          </div>
                        </div>

                        {/* Interactive mobile actions */}
                        <div className="flex flex-wrap items-center gap-1.5 font-bold justify-end">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-105 px-2 py-1 rounded text-[10px] font-extrabold transition-colors border border-blue-100 shrink-0"
                          >
                            বিবরণ
                          </button>
                          {order.status !== 'Completed' && (
                            <button 
                              onClick={() => setBookingOrder(order)}
                              className="bg-[#1b4332] text-white hover:bg-emerald-800 px-2 py-1 rounded text-[10px] font-extrabold flex items-center gap-1 transition-colors shadow-sm cursor-pointer shrink-0"
                            >
                              <Truck size={10} /> বুকিং
                            </button>
                          )}
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-1.5 py-1 text-[10px] cursor-pointer font-bold focus:outline-none"
                          >"""

new_block = """                      {/* Total bill and Actions wrapper - Clean Alignment */}
                      <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-dashed border-slate-200">
                        <div className="flex flex-col shrink-0 pr-2">
                          <span className="text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">মোট বিল</span>
                          <span className="text-xs font-black text-slate-900 whitespace-nowrap">৳{order.total}</span>
                        </div>

                        {/* Interactive mobile actions */}
                        <div className="flex items-center gap-1.5 font-bold overflow-hidden">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded text-[10px] font-extrabold transition-colors border border-blue-100 shrink-0"
                          >
                            বিবরণ
                          </button>
                          {order.status !== 'Completed' && (
                            <button 
                              onClick={() => setBookingOrder(order)}
                              className="bg-[#1b4332] text-white hover:bg-emerald-800 px-2 py-1 rounded text-[10px] font-extrabold flex items-center gap-1 transition-colors shadow-sm cursor-pointer shrink-0"
                            >
                              <Truck size={10} /> বুকিং
                            </button>
                          )}
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-1.5 py-1 text-[10px] cursor-pointer font-bold focus:outline-none max-w-[100px] sm:max-w-none truncate shrink-1"
                          >"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open("src/pages/AdminDashboard.tsx", "w") as f:
        f.write(content)
    print("Success")
else:
    print("Not found")

