import re

with open('src/pages/ProductLandingPage.tsx', 'r') as f:
    content = f.read()

# Change quantity display in placedOrderDetails
content = content.replace("{placedOrderDetails?.quantity} টি ({product.weight})", "{placedOrderDetails?.quantity} বক্স ({product.weight})")

# Change quantity display in input
content = content.replace("{toBanglaNumber(quantity)}</span>", "{toBanglaNumber(quantity)} বক্স</span>")
content = content.replace("className=\"w-8 text-center", "className=\"w-12 text-center")

with open('src/pages/ProductLandingPage.tsx', 'w') as f:
    f.write(content)

print("done")
