import re
with open('src/pages/PrintInvoice.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'Invoice / Delivery Slip',
    'Courier Delivery Slip'
)

with open('src/pages/PrintInvoice.tsx', 'w') as f:
    f.write(content)
