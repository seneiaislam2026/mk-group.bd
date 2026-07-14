import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r"if\s*\(window\.confirm\('আপনি কি এই বিনিয়োগকারীকে মুছে ফেলতে চান\?'\)\)\s*\{\s*deleteInvestor\(id\);\s*\}",
    r"setConfirmDialog({ isOpen: true, message: 'আপনি কি এই বিনিয়োগকারীকে মুছে ফেলতে চান?', onConfirm: () => deleteInvestor(id) });",
    content
)

content = re.sub(
    r"if\s*\(confirm\('ক্যাম্পেইনটি ডিলিট করতে চান\?'\)\)\s*\{\s*setMetaCampaigns\(prev => prev\.filter\(c => c\.id !== campaign\.id\)\);\s*\}",
    r"setConfirmDialog({ isOpen: true, message: 'ক্যাম্পেইনটি ডিলিট করতে চান?', onConfirm: () => setMetaCampaigns(prev => prev.filter(c => c.id !== campaign.id)) });",
    content
)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
