import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target = """    setProductFormData({
      name: '',
      originalPrice: '',
      discountedPrice: '',
      category: '',
      weight: '১ কেজি',
      image: '',
      isNew: true,
      isFlashSale: false,
      description: '',
      stock: '',
      article: '',
      isHidden: false
    });"""

replacement = """    setProductFormData({
      name: '',
      originalPrice: '',
      discountedPrice: '',
      category: '',
      weight: '১ কেজি',
      image: '',
      isNew: true,
      isFlashSale: false,
      description: '',
      stock: '',
      article: '',
      isHidden: false,
      piecesPerBox: '24'
    });"""

content = content.replace(target, replacement)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
