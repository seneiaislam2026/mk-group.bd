import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

# Fix openEditProductModal
target3 = """      stock: product.stock !== undefined ? product.stock.toString() : '',
      isHidden: !!product.isHidden
    });"""

replacement3 = """      stock: product.stock !== undefined ? product.stock.toString() : '',
      isHidden: !!product.isHidden,
      piecesPerBox: (product as any).piecesPerBox !== undefined ? (product as any).piecesPerBox.toString() : '24'
    });"""

content = content.replace(target3, replacement3)

# Fix handleProductSubmit
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

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
