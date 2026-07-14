import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

# Add piecesPerBox to productFormData state
target1 = """  const [productFormData, setProductFormData] = useState({
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

replacement1 = """  const [productFormData, setProductFormData] = useState({
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
    isHidden: false,
    piecesPerBox: '24'
  });"""

content = content.replace(target1, replacement1)

# Reset piecesPerBox on openAddProductModal
target2 = """      article: '',
      isHidden: false
    });
  };"""

replacement2 = """      article: '',
      isHidden: false,
      piecesPerBox: '24'
    });
  };"""

content = content.replace(target2, replacement2)

# Set piecesPerBox on openEditProductModal
target3 = """      stock: product.stock !== undefined ? product.stock.toString() : '',
      isHidden: !!product.isHidden
    });
  };"""

replacement3 = """      stock: product.stock !== undefined ? product.stock.toString() : '',
      isHidden: !!product.isHidden,
      piecesPerBox: product.piecesPerBox !== undefined ? product.piecesPerBox.toString() : '24'
    });
  };"""

content = content.replace(target3, replacement3)

# Add piecesPerBox in handleProductSubmit (edit and add)
target4 = """        stock: productFormData.stock ? parseInt(productFormData.stock) : 0,
        article: productFormData.article,
        isHidden: productFormData.isHidden
      });"""

replacement4 = """        stock: productFormData.stock ? parseInt(productFormData.stock) : 0,
        article: productFormData.article,
        isHidden: productFormData.isHidden,
        piecesPerBox: productFormData.piecesPerBox ? parseInt(productFormData.piecesPerBox) : 24
      });"""

content = content.replace(target4, replacement4)

target5 = """        stock: productFormData.stock ? parseInt(productFormData.stock) : 0,
        article: productFormData.article,
        isHidden: productFormData.isHidden
      });"""

replacement5 = """        stock: productFormData.stock ? parseInt(productFormData.stock) : 0,
        article: productFormData.article,
        isHidden: productFormData.isHidden,
        piecesPerBox: productFormData.piecesPerBox ? parseInt(productFormData.piecesPerBox) : 24
      });"""
content = content.replace(target5, replacement5)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
