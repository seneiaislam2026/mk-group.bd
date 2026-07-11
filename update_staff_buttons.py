import re

with open('src/components/admin/StaffPortal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<button \n                      onClick={() => markAttendance(staff.id, \'present\')}\n                      className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-bold transition-all ${',
    '<button \n                      onClick={() => markAttendance(staff.id, \'present\')}\n                      className={`flex flex-col items-center justify-center py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${'
)
content = content.replace(
    '<button \n                      onClick={() => markAttendance(staff.id, \'absent\')}\n                      className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-bold transition-all ${',
    '<button \n                      onClick={() => markAttendance(staff.id, \'absent\')}\n                      className={`flex flex-col items-center justify-center py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${'
)
content = content.replace(
    '<button \n                      onClick={() => markAttendance(staff.id, \'leave\')}\n                      className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-bold transition-all ${',
    '<button \n                      onClick={() => markAttendance(staff.id, \'leave\')}\n                      className={`flex flex-col items-center justify-center py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${'
)

with open('src/components/admin/StaffPortal.tsx', 'w') as f:
    f.write(content)

print("done")
