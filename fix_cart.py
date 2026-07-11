import re

with open('src/components/ui/CartDrawer.tsx', 'r') as f:
    content = f.read()

content = content.replace("{item.quantity}</span>", "{item.quantity} বক্স</span>")
content = content.replace("className=\"w-8 text-center", "className=\"w-12 text-center")

with open('src/components/ui/CartDrawer.tsx', 'w') as f:
    f.write(content)

print("done")
