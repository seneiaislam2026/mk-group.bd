import re

with open('src/components/admin/StaffPortal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="flex flex-col md:flex-row gap-6 mb-8 items-center md:items-start bg-slate-50 p-6 rounded-2xl border border-slate-100">',
    '<div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8 items-center md:items-start bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100">'
)

content = content.replace(
    '<div className="bg-white p-2 min-h-[80px]"></div>',
    '<div className="bg-white p-1 sm:p-2 min-h-[60px] sm:min-h-[80px]"></div>'
)

with open('src/components/admin/StaffPortal.tsx', 'w') as f:
    f.write(content)

print("done")
