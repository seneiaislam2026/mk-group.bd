with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "setDues(dues.filter(d => d.status !== 'Paid').map(d => {",
    "setDues(dues.map(d => {"
)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
