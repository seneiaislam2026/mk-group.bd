import re

with open('src/components/admin/StaffPortal.tsx', 'r') as f:
    content = f.read()

# Update grid
content = content.replace(
    '<div className="grid grid-cols-7 gap-px bg-slate-200 min-w-[450px] sm:min-w-0">',
    '<div className="grid grid-cols-7 gap-px bg-slate-200">'
)

content = content.replace(
    '<div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto pb-1">',
    '<div className="border border-slate-200 rounded-xl overflow-hidden">'
)

# Update empty cells
content = content.replace(
    '<div className="bg-white p-1 sm:p-2 min-h-[60px] sm:min-h-[80px]"></div>',
    '<div className="bg-white p-1 sm:p-2 min-h-[50px] sm:min-h-[80px]"></div>'
)

# Update populated cells
old_cell = """<div key={record.date} className="bg-white p-1 sm:p-2 min-h-[60px] sm:min-h-[80px] border-t border-slate-100 relative group flex flex-col">
                                <span className={`text-xs font-bold mb-1 ${record.status ? 'text-slate-800' : 'text-slate-400'}`}>{record.day}</span>
                                <div className="mt-auto">
                                  {record.status === 'present' && <div className="bg-emerald-100 text-emerald-700 text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded text-center truncate">উপস্থিত</div>}
                                  {record.status === 'absent' && <div className="bg-rose-100 text-rose-700 text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded text-center truncate">অনুপস্থিত</div>}
                                  {record.status === 'leave' && <div className="bg-amber-100 text-amber-700 text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded text-center truncate">ছুটি</div>}
                                </div>
                              </div>"""

new_cell = """<div key={record.date} className="bg-white p-1 sm:p-2 min-h-[50px] sm:min-h-[80px] border-t border-slate-100 relative group flex flex-col items-center sm:items-start justify-center sm:justify-start">
                                <span className={`text-[10px] sm:text-xs font-bold mb-0.5 sm:mb-1 ${record.status ? 'text-slate-800' : 'text-slate-400'}`}>{record.day}</span>
                                <div className="mt-auto w-full flex justify-center sm:block">
                                  {record.status === 'present' && <div className="bg-emerald-100 text-emerald-700 text-[9px] sm:text-[10px] font-bold px-0 sm:px-1.5 py-0.5 rounded text-center truncate w-full"><span className="hidden sm:inline">উপস্থিত</span><span className="sm:hidden">উপঃ</span></div>}
                                  {record.status === 'absent' && <div className="bg-rose-100 text-rose-700 text-[9px] sm:text-[10px] font-bold px-0 sm:px-1.5 py-0.5 rounded text-center truncate w-full"><span className="hidden sm:inline">অনুপস্থিত</span><span className="sm:hidden">অনুঃ</span></div>}
                                  {record.status === 'leave' && <div className="bg-amber-100 text-amber-700 text-[9px] sm:text-[10px] font-bold px-0 sm:px-1.5 py-0.5 rounded text-center truncate w-full"><span className="hidden sm:inline">ছুটি</span><span className="sm:hidden">ছুটি</span></div>}
                                </div>
                              </div>"""

content = content.replace(old_cell, new_cell)


with open('src/components/admin/StaffPortal.tsx', 'w') as f:
    f.write(content)

print("done")
