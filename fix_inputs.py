import re
with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("onChange={(e) => setManualDeliveryCharge(Number(e.target.value))}", "onChange={(e) => setManualDeliveryCharge(Number(e.target.value) || 0)}")
content = content.replace("onChange={(e) => setManualConditionCharge(Number(e.target.value))}", "onChange={(e) => setManualConditionCharge(Number(e.target.value) || 0)}")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
