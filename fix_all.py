import re

with open('src/components/ui/CartDrawer.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const handleCheckoutSubmit = (e: React.FormEvent) => {",
    "const handleCheckoutSubmit = async (e: React.FormEvent) => {"
)
content = content.replace(
    "const trackingId = placeOrder(formData.name, formData.phone, formData.address);",
    "const trackingId = await placeOrder(formData.name, formData.phone, formData.address);"
)

with open('src/components/ui/CartDrawer.tsx', 'w') as f:
    f.write(content)

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Fix 931
content = content.replace(
    """    setProductFormData({
      name: '',
      originalPrice: '',
      discountedPrice: '',
      category: '',
      weight: '১ কেজি',
      image: '',
      isNew: false,
      isFlashSale: false,
      description: ''
    });""",
    """    setProductFormData({
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
)

# And another one at line 946 maybe? Let's check where the second error is.
content = content.replace(
    """  const handleAddProductClick = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      originalPrice: '',
      discountedPrice: '',
      category: '',
      weight: '১ কেজি',
      image: '',
      isNew: false,
      isFlashSale: false,
      description: '',
      article: '',
      stock: ''
    });
    setIsProductModalOpen(true);
  };""",
    """  const handleAddProductClick = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      originalPrice: '',
      discountedPrice: '',
      category: '',
      weight: '১ কেজি',
      image: '',
      isNew: false,
      isFlashSale: false,
      description: '',
      article: '',
      stock: '',
      isHidden: false
    });
    setIsProductModalOpen(true);
  };"""
)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
