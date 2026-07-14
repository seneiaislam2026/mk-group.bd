import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Add a use effect to load and save to localStorage for these states
# dues, transactions, campaigns, coupons, investorsList, agreementData

# 1. modify isAuthenticated
auth_old = "const [isAuthenticated, setIsAuthenticated] = useState(false);"
auth_new = """const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_logged_in') === 'true';
    }
    return false;
  });"""
content = content.replace(auth_old, auth_new)

login_old = """      setIsAuthenticated(true);
      setRememberMe(false);"""
login_new = """      localStorage.setItem('admin_logged_in', 'true');
      setIsAuthenticated(true);
      setRememberMe(false);"""
content = content.replace(login_old, login_new)

logout_old = """  const handleLogout = () => {
    setIsAuthenticated(false);
  };"""
logout_new = """  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    setIsAuthenticated(false);
  };"""
content = content.replace(logout_old, logout_new)

# 2. Add local storage persistence for transactions, dues, campaigns, coupons, investorsList, agreementData

def inject_local_storage(state_name, default_val):
    global content
    
    old_state = f"const [{state_name}, set{state_name[0].upper() + state_name[1:]}] = useState<{default_val}"
    
    # Let's find the exact line
    match = re.search(f"const \[{state_name}, set{state_name[0].upper() + state_name[1:]}\] = useState(<.*?>)?\((.*?)\);", content)
    if not match:
        return
        
    type_str = match.group(1) or ""
    default_str = match.group(2)
    
    new_state = f"""const [{state_name}, set{state_name[0].upper() + state_name[1:]}] = useState{type_str}(() => {{
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

inject_local_storage('transactions', '')
inject_local_storage('dues', '')
inject_local_storage('campaigns', '')
inject_local_storage('coupons', '')
inject_local_storage('investorsList', '')
inject_local_storage('agreementData', '')

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
