import re
with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Replace simulatedOrders with orders in useEffect
content = content.replace("simulatedOrders.find", "orders.find")
content = content.replace("}, [manualOrderPhone, simulatedOrders]);", "}, [manualOrderPhone, orders]);")

# Replace setManualSelectedProductId and setManualSelectedQuantity in onClick
content = re.sub(r"setManualSelectedProductId\([^)]*\);", "setManualArticleInput('');", content)
content = re.sub(r"setManualSelectedQuantity\([^)]*\);", "setManualQuantityInput(1);\n                      setManualRateInput('');", content)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
