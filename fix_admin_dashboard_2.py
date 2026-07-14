import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Fix 931
content = content.replace(
    "setNewProduct({ name: '', originalPrice: '', discountedPrice: '', category: '', weight: '', image: '', isNew: false, isFlashSale: false, description: '' });",
    "setNewProduct({ name: '', originalPrice: '', discountedPrice: '', category: '', weight: '', image: '', isNew: false, isFlashSale: false, description: '', stock: '', article: '', isHidden: false });"
)

# Fix 946 (it's missing isHidden)
content = content.replace(
    "setNewProduct({ name: '', originalPrice: '', discountedPrice: '', category: '', weight: '', image: '', isNew: false, isFlashSale: false, description: '', article: '', stock: '' });",
    "setNewProduct({ name: '', originalPrice: '', discountedPrice: '', category: '', weight: '', image: '', isNew: false, isFlashSale: false, description: '', article: '', stock: '', isHidden: false });"
)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
