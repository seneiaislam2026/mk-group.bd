import re
with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Replace setConfirmDialog back to window.confirm
content = re.sub(
    r"setConfirmDialog\(\{ isOpen: true, message: '([^']*)', onConfirm: \(\) => ([^}]+) \}\);",
    r"if (window.confirm('\1')) { \2; }",
    content
)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
