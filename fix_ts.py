import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

# Fix 1: productFormData missing fields
target1 = """    setProductFormData({
      name: '',
      originalPrice: '',
      discountedPrice: '',
      category: '',
      weight: '১ কেজি',
      image: '',
      isNew: false,
      isFlashSale: false,
      description: ''
    });"""
replacement1 = """    setProductFormData({
      name: '',
      originalPrice: '',
      discountedPrice: '',
      category: '',
      weight: '১ কেজি',
      image: '',
      isNew: false,
      isFlashSale: false,
      description: '',
      stock: '',
      article: '',
      isHidden: false
    });"""
content = content.replace(target1, replacement1)

target2 = """    setProductFormData({
      name: product.name,
      originalPrice: product.originalPrice.toString(),
      discountedPrice: product.discountedPrice ? product.discountedPrice.toString() : '',
      category: product.category,
      weight: product.weight,
      image: product.image,
      isNew: !!product.isNew,
      isFlashSale: !!product.isFlashSale,
      description: product.description || '',
      article: product.article || '',
      stock: product.stock !== undefined ? product.stock.toString() : ''
    });"""
replacement2 = """    setProductFormData({
      name: product.name,
      originalPrice: product.originalPrice.toString(),
      discountedPrice: product.discountedPrice ? product.discountedPrice.toString() : '',
      category: product.category,
      weight: product.weight,
      image: product.image,
      isNew: !!product.isNew,
      isFlashSale: !!product.isFlashSale,
      description: product.description || '',
      article: product.article || '',
      stock: product.stock !== undefined ? product.stock.toString() : '',
      isHidden: !!product.isHidden
    });"""
content = content.replace(target2, replacement2)

# Fix 3: witness type check error
target3 = """value={agreementData[`witness${num}` as keyof typeof agreementData].name}"""
replacement3 = """value={(agreementData[`witness${num}` as keyof typeof agreementData] as any).name}"""
content = content.replace(target3, replacement3)

target4 = """value={agreementData[`witness${num}` as keyof typeof agreementData].address}"""
replacement4 = """value={(agreementData[`witness${num}` as keyof typeof agreementData] as any).address}"""
content = content.replace(target4, replacement4)

target5 = """value={agreementData[`witness${num}` as keyof typeof agreementData].nid}"""
replacement5 = """value={(agreementData[`witness${num}` as keyof typeof agreementData] as any).nid}"""
content = content.replace(target5, replacement5)

target6 = """value={agreementData[`witness${num}` as keyof typeof agreementData].mobile}"""
replacement6 = """value={(agreementData[`witness${num}` as keyof typeof agreementData] as any).mobile}"""
content = content.replace(target6, replacement6)

# Fix 4: Property 'discountedPrice' does not exist on type 'Product | ...
target7 = """const price = product.discountedPrice || product.originalPrice;"""
replacement7 = """const price = (product as any).discountedPrice || product.originalPrice;"""
content = content.replace(target7, replacement7)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
