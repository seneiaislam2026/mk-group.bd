import json

with open('dist/assets/index-DKWltQCk.js.map', 'r') as f:
    sm = json.load(f)

for i, source in enumerate(sm['sources']):
    if 'AdminDashboard.tsx' in source:
        content = sm['sourcesContent'][i]
        with open('src/pages/AdminDashboard.tsx', 'w') as out:
            out.write(content)
        print("Recovered AdminDashboard.tsx successfully!")
        break
