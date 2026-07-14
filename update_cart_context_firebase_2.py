import re

with open('src/context/CartContext.tsx', 'r') as f:
    content = f.read()

# Replace the state initialization
content = content.replace("const [products, setProducts] = useState<Product[]>(getStoredProducts);", "const [products, setProducts] = useState<Product[]>([]);")
content = content.replace("const [orders, setOrders] = useState<Order[]>(getStoredOrders);", "const [orders, setOrders] = useState<Order[]>([]);")
content = re.sub(r'const \[notifications, setNotifications\] = useState<AppNotification\[\]>\(\(\) => \{.*?\n  \}\);', 'const [notifications, setNotifications] = useState<AppNotification[]>([]);', content, flags=re.DOTALL)


with open('src/context/CartContext.tsx', 'w') as f:
    f.write(content)
