with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

import re

# Fix dues
content = re.sub(r'const \[dues, setDues\].*?\[dues\]\);.*?\{ id: \'d-1\',', 
"""const [dues, setDues] = useState<{ id: string; customerName: string; phone: string; amount: number; paidAmount: number; date: string; status: 'Unpaid' | 'Partial' | 'Paid' }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_dues');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [
        { id: 'd-1',""", content, flags=re.DOTALL)

# Fix campaigns
content = re.sub(r'const \[campaigns, setCampaigns\].*?\[campaigns\]\);.*?\{ id: \'cmp-1\',', 
"""const [campaigns, setCampaigns] = useState<{ id: string; name: string; platform: string; budget: number; spent: number; leads: number; cpa: number; target: string; status: 'Active' | 'Paused' | 'Scheduled' }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_campaigns');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [
        { id: 'cmp-1',""", content, flags=re.DOTALL)

# Fix coupons
content = re.sub(r'const \[coupons, setCoupons\].*?\[coupons\]\);.*?\{ id: \'cop-1\',', 
"""const [coupons, setCoupons] = useState<{ id: string; code: string; type: 'percentage' | 'fixed'; value: number; minSpend: number; usedCount: number; expiry: string }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_coupons');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [
        { id: 'cop-1',""", content, flags=re.DOTALL)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
