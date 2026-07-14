import re

with open('src/context/CartContext.tsx', 'r') as f:
    content = f.read()

content = content.replace("placeOrder: (customerName: string, phone: string, address: string) => string;", "placeOrder: (customerName: string, phone: string, address: string) => Promise<string>;")
content = content.replace("placeDirectOrder: (customerName: string, phone: string, address: string, product: Product, quantity: number) => string;", "placeDirectOrder: (customerName: string, phone: string, address: string, product: Product, quantity: number) => Promise<string>;")

with open('src/context/CartContext.tsx', 'w') as f:
    f.write(content)
