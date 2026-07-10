with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target = """                <div className="w-8 h-8 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center font-bold border border-[#a5d6a7] text-sm select-none shadow-sm">
                  M
                </div>"""

replacement = """                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#2e7d32]/20 shadow-sm shrink-0 bg-white">
                  <img 
                    src="https://i.ibb.co/nsVSmCNP/1783595306658.jpg" 
                    alt="নিরাপদ খাদ্য সম্ভার" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>"""

content = content.replace(target, replacement)
with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
print("done")
