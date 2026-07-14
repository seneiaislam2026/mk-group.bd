import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("stock: product.stock !== undefined ? product.stock.toString() : '', isHidden: false", "stock: product.stock !== undefined ? product.stock.toString() : '', isHidden: !!product.isHidden")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
