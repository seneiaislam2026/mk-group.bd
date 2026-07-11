import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("{activeTab === 'settings' && 'সিস্টেম সেটিংস'}", "{activeTab === 'settings' && 'সিস্টেম সেটিংস'}\n                  {activeTab === 'staff' && 'স্টাফ পোর্টাল'}")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
