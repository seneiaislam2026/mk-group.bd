import re
with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

old_form_class = """                  className="flex gap-2 items-end"
                >
                  <div className="flex-1">"""

new_form_class = """                  className="flex flex-col sm:flex-row gap-2 sm:items-end"
                >
                  <div className="flex-1 w-full">"""

content = content.replace(old_form_class, new_form_class)

old_qty_class = """                  <div className="w-20">"""
new_qty_class = """                  <div className="w-full sm:w-20">"""
content = content.replace(old_qty_class, new_qty_class)

old_rate_class = """                  <div className="w-24">"""
new_rate_class = """                  <div className="w-full sm:w-24">"""
content = content.replace(old_rate_class, new_rate_class)

old_btn_class = """                  <button 
                    type="submit"
                    className="bg-[#2e7d32] hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black h-[38px] transition-all cursor-pointer"
                  >"""
new_btn_class = """                  <button 
                    type="submit"
                    className="w-full sm:w-auto bg-[#2e7d32] hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black h-[38px] transition-all cursor-pointer"
                  >"""
content = content.replace(old_btn_class, new_btn_class)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
