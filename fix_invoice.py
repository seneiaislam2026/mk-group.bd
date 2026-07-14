import re
with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("paymentStatus: manualOrderIsDue ? 'Unpaid' : 'Paid'", "paymentStatus: manualOrderIsDue ? 'Unpaid' : 'COD'")

content = content.replace("Payment Status: ${data.paymentStatus === 'Unpaid' ? 'cash on delivery' : 'paid'}", "Payment Status: ${data.paymentStatus === 'COD' ? 'Cash On Delivery' : (data.paymentStatus === 'Paid' ? 'Paid' : 'Due')}")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
