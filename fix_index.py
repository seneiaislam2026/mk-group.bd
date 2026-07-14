import re
with open('index.html', 'r') as f:
    content = f.read()

content = re.sub(r'<script>\s*window\.addEventListener.*?<\/script>', '', content, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(content)
