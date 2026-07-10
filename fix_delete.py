import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

content = content.replace(
    """className="text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-100 p-1 rounded transition-all cursor-pointer\"""",
    """className="text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-100 p-1.5 rounded transition-all cursor-pointer shrink-0\""""
)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
