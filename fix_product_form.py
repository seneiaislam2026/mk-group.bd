import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Add isHidden to productFormData initial state
content = re.sub(
    r"const \[productFormData, setProductFormData\] = useState\(\{([\s\S]*?)stock: '',\s*article: ''\s*\}\);",
    r"const [productFormData, setProductFormData] = useState({\1stock: '',\n    article: '',\n    isHidden: false\n  });",
    content
)

# Add isHidden to setProductFormData reset state
content = re.sub(
    r"setProductFormData\(\{([\s\S]*?)stock: '',\s*article: ''\s*\}\);",
    r"setProductFormData({\1stock: '',\n      article: '',\n      isHidden: false\n    });",
    content
)

# Fix openEditProductModal
content = re.sub(
    r"openEditProductModal = \(product: Product\) => \{\s*setEditingProduct\(product\);\s*setProductFormData\(\{([\s\S]*?)stock: product\.stock\?.toString\(\) \|\| '',\s*article: product\.article \|\| ''\s*\}\);",
    r"openEditProductModal = (product: Product) => {\n    setEditingProduct(product);\n    setProductFormData({\1stock: product.stock?.toString() || '',\n      article: product.article || '',\n      isHidden: !!product.isHidden\n    });",
    content
)

# Fix payload in handleProductSubmit
content = re.sub(
    r"const payload = \{([\s\S]*?)article: productFormData\.article,\s*stock: productFormData\.stock \? parseInt\(productFormData\.stock\) : undefined\s*\};",
    r"const payload = {\1article: productFormData.article,\n      stock: productFormData.stock ? parseInt(productFormData.stock) : undefined,\n      isHidden: productFormData.isHidden\n    };",
    content
)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("Replacement successful")
