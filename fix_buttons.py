import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("onClick={() => openEditProductModal(product)}", "onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEditProductModal(product); }}")
content = content.replace("onClick={() => { if(confirm('পণ্যটি চিরতরে মুছে ফেলতে চান?')) deleteProduct(product.id); }}", "onClick={(e) => { e.preventDefault(); e.stopPropagation(); if(confirm('পণ্যটি চিরতরে মুছে ফেলতে চান?')) deleteProduct(product.id); }}")

content = content.replace("className=\"fixed inset-0 z-50 flex items-center justify-center p-4\"", "className=\"fixed inset-0 z-[100] flex items-center justify-center p-4\"")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
