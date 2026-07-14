with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

import re

# Remove the old handleLogin to useEffect block (which we just replaced)
# Wait, actually, my new block is appended at the end of the file!
# Let's just strip everything after `const [selectedOrder, setSelectedOrder] = useState<any | null>(null);`
# and append my new code. But wait, `agreementData` state is defined THERE!
# Ah, `agreementData` state was on line 504. If I delete it, I will lose `agreementData`.
# I will just write a python script to remove the duplicate `handleLogin` that's before `agreementData`.

old_handle_login = """  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Mk admin' && password === 'Mkgroupbd.ltd@@') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('ভুল ইউজারনেম বা পাসওয়ার্ড! আবার চেষ্টা করুন।');
    }
  };"""

content = content.replace(old_handle_login, "", 1) # Replace first occurrence

content = content.replace("export default AdminDashboard;", "", 1) # Replace the export at the bottom

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
