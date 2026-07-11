import re

with open('src/components/ui/ProductDetailsModal.tsx', 'r') as f:
    content = f.read()
content = content.replace("ওজন: <span", "প্রতি বক্সে: <span")
with open('src/components/ui/ProductDetailsModal.tsx', 'w') as f:
    f.write(content)


with open('src/pages/ProductLandingPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("পরিমাণ (ওজন):", "পরিমাণ (বক্স):")
content = content.replace("প্যাকেজ সাইজ (ওজন):", "প্রতি বক্সে:")
content = content.replace("ওজন: {product.weight}", "প্রতি বক্সে: {product.weight}")

with open('src/pages/ProductLandingPage.tsx', 'w') as f:
    f.write(content)

print("done")
