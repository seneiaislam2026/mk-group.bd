import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r"const \[activeTab, setActiveTab\] = useState<'dashboard' \| 'products' \| 'receiving' \| 'courier' \| 'inventory' \| 'orders' \| 'customers' \| 'settings' \| 'finances' \| 'marketing' \| 'dues'>\('dashboard'\);",
    r"const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'receiving' | 'courier' | 'inventory' | 'orders' | 'customers' | 'settings' | 'finances' | 'marketing' | 'dues' | 'agreement' | 'investors'>('dashboard');",
    content
)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
