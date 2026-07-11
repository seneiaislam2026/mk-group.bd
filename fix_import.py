import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Product } from '../types';", "import { Product, Investor } from '../types';")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
