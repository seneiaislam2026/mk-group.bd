import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Update activeTab state type
content = re.sub(
    r"const \[activeTab, setActiveTab\] = useState<'dashboard' \| 'products' \| 'receiving' \| 'courier' \| 'inventory' \| 'orders' \| 'customers' \| 'settings' \| 'finances' \| 'marketing' \| 'dues' \| 'agreement' \| 'investors'>\('dashboard'\);",
    r"const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'receiving' | 'courier' | 'inventory' | 'orders' | 'customers' | 'settings' | 'finances' | 'marketing' | 'dues' | 'agreement' | 'investors' | 'staff'>('dashboard');",
    content
)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
