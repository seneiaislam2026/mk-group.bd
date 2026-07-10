import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

# Replace desktop mapping
content = content.replace("dues.map(d => {", "dues.filter(d => d.status !== 'Paid').map(d => {")

# To prevent matching both desktop and mobile if they share the same line, let's do a more careful replace.
