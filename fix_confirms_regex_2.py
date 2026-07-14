import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r"if\s*\(window\.confirm\('আপনি কি এই বিনিয়োগকারীকে মুছে ফেলতে চান\?'\)\)\s*\{([^}]*)\}",
    r"setConfirmDialog({ isOpen: true, message: 'আপনি কি এই বিনিয়োগকারীকে মুছে ফেলতে চান?', onConfirm: () => {\1} });",
    content
)

content = re.sub(
    r"if\s*\(confirm\('ক্যাম্পেইনটি ডিলিট করতে চান\?'\)\)\s*\{([^}]*)\}",
    r"setConfirmDialog({ isOpen: true, message: 'ক্যাম্পেইনটি ডিলিট করতে চান?', onConfirm: () => {\1} });",
    content
)


with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
