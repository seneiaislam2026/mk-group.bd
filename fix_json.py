import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

def replacer(match):
    return "(() => { try { return JSON.parse(stored); } catch(e) { return " + match.group(1) + "; } })()"

# Replace `stored ? JSON.parse(stored) : [...]`
content = re.sub(r'stored \? JSON\.parse\(stored\) : (\[.*?\])', replacer, content, flags=re.DOTALL)

# For line 553: `const existing = stored ? JSON.parse(stored) : [];`
content = re.sub(r'stored \? JSON\.parse\(stored\) : \[\]', '(() => { try { return JSON.parse(stored); } catch(e) { return []; } })()', content)

# For line 574: `setInvestorsList(JSON.parse(stored));`
content = re.sub(r'setInvestorsList\(JSON\.parse\(stored\)\);', 'try { setInvestorsList(JSON.parse(stored)); } catch(e) { setInvestorsList([]); }', content)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

