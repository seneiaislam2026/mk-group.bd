import re
with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("setManualOrderItems([]);", "// setManualOrderItems([]); // Do not clear yet so they can see the table")
content = content.replace("setManualOrderCustomerName('');", "// setManualOrderCustomerName('');")
content = content.replace("setManualOrderPhone('');", "// setManualOrderPhone('');")
content = content.replace("setManualOrderAddress('');", "// setManualOrderAddress('');")
content = content.replace("setManualDeliveryCharge(0);", "// setManualDeliveryCharge(0);")
content = content.replace("setManualConditionCharge(0);", "// setManualConditionCharge(0);")

content = content.replace("setCreatedOrderData(null);", "setCreatedOrderData(null); setManualOrderItems([]); setManualOrderCustomerName(''); setManualOrderPhone(''); setManualOrderAddress(''); setManualDeliveryCharge(0); setManualConditionCharge(0);")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
