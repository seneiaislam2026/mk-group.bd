import re

with open('src/components/admin/StaffPortal.tsx', 'r') as f:
    content = f.read()

# Make the Profile Modal responsive
content = content.replace(
    'p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">\n          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">',
    'p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">\n          <div className="bg-white sm:rounded-2xl w-full min-h-screen sm:min-h-0 sm:max-w-3xl overflow-hidden shadow-2xl my-0 sm:my-8 flex flex-col">'
)

content = content.replace(
    '<div className="p-6">',
    '<div className="p-4 sm:p-6 flex-1 overflow-y-auto">'
)

# Flex column to row for header of the month section
content = content.replace(
    '<div className="flex justify-between items-center mb-4">',
    '<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">'
)

# Improve month navigation wrapper for mobile
content = content.replace(
    '<div className="flex items-center gap-3 bg-slate-50 rounded-lg border border-slate-200 p-1">',
    '<div className="flex items-center gap-2 bg-slate-50 rounded-lg border border-slate-200 p-1 w-full sm:w-auto justify-between sm:justify-start">'
)

# Stat boxes responsiveness
content = content.replace(
    '<div className="grid grid-cols-3 gap-4 mb-6">',
    '<div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">'
)
content = content.replace(
    '<div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">',
    '<div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2 sm:p-4 text-center">'
)
content = content.replace(
    '<div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center">',
    '<div className="bg-rose-50 border border-rose-100 rounded-xl p-2 sm:p-4 text-center">'
)
content = content.replace(
    '<div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">',
    '<div className="bg-amber-50 border border-amber-100 rounded-xl p-2 sm:p-4 text-center">'
)

content = content.replace(
    '<div className="text-xs font-bold',
    '<div className="text-[10px] sm:text-xs font-bold'
)
content = content.replace(
    '<div className="text-2xl font-black',
    '<div className="text-lg sm:text-2xl font-black'
)

# Fix calendar table mobile view
content = content.replace(
    '<div className="border border-slate-200 rounded-xl overflow-hidden">',
    '<div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto pb-1">'
)

content = content.replace(
    '<div className="grid grid-cols-7 gap-px bg-slate-200">',
    '<div className="grid grid-cols-7 gap-px bg-slate-200 min-w-[450px] sm:min-w-0">'
)

content = content.replace(
    '<div className="bg-white p-2 min-h-[80px] border-t border-slate-100 relative group flex flex-col">',
    '<div className="bg-white p-1 sm:p-2 min-h-[60px] sm:min-h-[80px] border-t border-slate-100 relative group flex flex-col">'
)

content = content.replace(
    'text-[10px] font-bold px-1.5 py-0.5 rounded text-center',
    'text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded text-center truncate'
)


with open('src/components/admin/StaffPortal.tsx', 'w') as f:
    f.write(content)

print("done")
