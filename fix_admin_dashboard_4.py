import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("price: randomP.discountedPrice || randomP.originalPrice", "price: (randomP as any).discountedPrice || randomP.originalPrice")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
