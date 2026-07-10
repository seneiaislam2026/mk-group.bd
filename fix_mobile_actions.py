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
                        <div className="flex items-center gap-1 font-bold">"""

new_block = """                      {/* Total bill and Actions wrapper - Clean Alignment */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1 pt-2.5 border-t border-dashed border-slate-200">
                        <div className="flex items-center justify-between sm:w-auto">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">মোট বিল</span>
                            <span className="text-xs font-black text-slate-900">৳{order.total}</span>
                          </div>
                        </div>

                        {/* Interactive mobile actions */}
                        <div className="flex flex-wrap items-center gap-1.5 font-bold justify-end">"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open("src/pages/AdminDashboard.tsx", "w") as f:
        f.write(content)
    print("Success")
else:
    print("Not found")

