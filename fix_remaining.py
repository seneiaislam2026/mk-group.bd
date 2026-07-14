with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

import re

# Fix dues exactly
content = re.sub(r'const \[dues, setDues\] = useState.*?\]; \} \)\(\);.*?return \[\];\n  \}\);', 
"""const [dues, setDues] = useState<{ id: string; customerName: string; phone: string; amount: number; paidAmount: number; date: string; status: 'Unpaid' | 'Partial' | 'Paid' }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_dues');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [
        { id: 'd-1', customerName: 'করিম সাহেব', phone: '01711000000', amount: 5000, paidAmount: 0, date: '2023-10-01', status: 'Unpaid' }
    ];
});""", content, flags=re.DOTALL)

# Fix campaigns exactly
content = re.sub(r'const \[campaigns, setCampaigns\] = useState.*?\]; \} \)\(\);.*?return \[\];\n  \}\);', 
"""const [campaigns, setCampaigns] = useState<{ id: string; name: string; platform: string; budget: number; spent: number; leads: number; cpa: number; target: string; status: 'Active' | 'Paused' | 'Scheduled' }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_campaigns');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [
        { id: 'cmp-1', name: 'Eid Dhamaka', platform: 'Facebook Ads', budget: 10000, spent: 4500, leads: 120, cpa: 37.5, target: 'Dhaka, Sylhet', status: 'Active' },
        { id: 'cmp-2', name: 'Winter Collection', platform: 'Google Search', budget: 15000, spent: 15000, leads: 300, cpa: 50, target: 'Nationwide', status: 'Paused' }
    ];
});""", content, flags=re.DOTALL)


# Fix coupons exactly
content = re.sub(r'const \[coupons, setCoupons\] = useState.*?\]; \} \)\(\);.*?return \[\];\n  \}\);', 
"""const [coupons, setCoupons] = useState<{ id: string; code: string; type: 'percentage' | 'fixed'; value: number; minSpend: number; usedCount: number; expiry: string }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_coupons');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [
        { id: 'cop-1', code: 'NEW10', type: 'percentage', value: 10, minSpend: 1000, usedCount: 45, expiry: '2026-12-31' },
        { id: 'cop-2', code: 'WINTER500', type: 'fixed', value: 500, minSpend: 3000, usedCount: 12, expiry: '2026-08-01' }
    ];
});""", content, flags=re.DOTALL)


# Fix investorsList exactly
content = re.sub(r'const \[investorsList, setInvestorsList\] = useState.*?\[\]; \} \)\(\);.*?return \[\];\n  \}\);', 
"""const [investorsList, setInvestorsList] = useState<Investor[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_investorsList');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [];
});""", content, flags=re.DOTALL)


# Fix agreementData exactly
content = re.sub(r'const \[agreementData, setAgreementData\] = useState.*?\}\); \} \)\(\);.*?return \{\};\n  \}\);', 
"""const [agreementData, setAgreementData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_agreementData');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return {
    party1: { name: '', fname: '', mname: '', address: '', nid: '', mobile: '' },
    party2: { name: '', fname: '', mname: '', address: '', nid: '', mobile: '' },
    nominee: { name: '', fname: '', mname: '', address: '', nid: '', mobile: '' },
    details: { totalAmount: '', totalAmountWords: '', installmentAmount: '', installmentAmountWords: '', installmentCount: '', dueAmount: '', dueAmountWords: '', paymentDate: '', party1Bank: '', party1Account: '', party2Bank: '', party2Account: '', chequeNumber: '' },
    warish1: { relation: '', name: '', address: '', nid: '', mobile: '' },
    warish2: { relation: '', name: '', address: '', nid: '', mobile: '' },
    witness1: { name: '', address: '', nid: '', mobile: '' },
    witness2: { name: '', address: '', nid: '', mobile: '' },
    witness3: { name: '', address: '', nid: '', mobile: '' }
  };
});""", content, flags=re.DOTALL)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
