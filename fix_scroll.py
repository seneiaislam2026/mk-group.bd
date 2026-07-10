import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

content = content.replace(
    """<div className="flex items-center gap-1.5 font-bold overflow-hidden justify-end w-full">""",
    """<div className="flex items-center gap-1.5 font-bold overflow-x-auto no-scrollbar justify-end w-full pb-1">"""
)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)

