import re
with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("if (manualOrderPhone.length >=", "if (manualOrderPhone?.length >=")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
