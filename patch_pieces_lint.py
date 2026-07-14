import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

content = content.replace("products.find(p => p.id === item.id)?.piecesPerBox", "Number(products.find(p => p.id === item.id)?.piecesPerBox || 24)")

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
