import re
with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("orders.find(o => o.phone", "orders?.find(o => o?.phone")
content = content.replace("products.find(p => p.article", "products?.find(p => p?.article")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
