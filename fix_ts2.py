import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target = """price: randomP.discountedPrice || randomP.originalPrice"""
replacement = """price: (randomP as any).discountedPrice || randomP.originalPrice"""
content = content.replace(target, replacement)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
