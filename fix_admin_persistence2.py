import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

def inject_local_storage(state_name):
    global content
    
    # Let's find the exact line
    pattern = rf"(const \[\s*{state_name}\s*,\s*set{state_name[0].upper() + state_name[1:]}\s*\]\s*=\s*useState(<[^>]*>)?)\(([\s\S]*?)\);"
    match = re.search(pattern, content)
    if not match:
        print("Not found: " + state_name)
        return
        
    start_decl = match.group(1)
    type_str = match.group(2) or ""
    default_str = match.group(3)
    
    new_state = f"""{start_decl}(() => {{
    if (typeof window !== 'undefined') {{
      const saved = localStorage.getItem('admin_data_{state_name}');
      if (saved) {{
        try {{ return JSON.parse(saved); }} catch(e) {{}}
      }}
    }}
    return {default_str};
  }});

  useEffect(() => {{
    if (typeof window !== 'undefined') {{
      localStorage.setItem('admin_data_{state_name}', JSON.stringify({state_name}));
    }}
  }}, [{state_name}]);"""
    
    content = content.replace(match.group(0), new_state)

inject_local_storage('transactions')
inject_local_storage('dues')
inject_local_storage('campaigns')
inject_local_storage('coupons')
inject_local_storage('investorsList')
inject_local_storage('agreementData')

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
