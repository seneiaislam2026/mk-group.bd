import re

with open('src/components/ui/ProductDetailsModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("{quantity}</span>", "{quantity} বক্স</span>")
content = content.replace("className=\"w-12 text-center", "className=\"w-16 text-center")

with open('src/components/ui/ProductDetailsModal.tsx', 'w') as f:
    f.write(content)

print("done")
