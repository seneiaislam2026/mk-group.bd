import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Fix investorsList
pattern1 = r"const \[investorsList, setInvestorsList\] = useState<Investor\[\]>.*?\[\];\s*\}\);\s*// Save investors to localStorage"
replacement1 = """const [investorsList, setInvestorsList] = useState<Investor[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_investorsList');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [];
});
// Save investors to localStorage"""

content = re.sub(pattern1, replacement1, content, flags=re.DOTALL)

# Fix agreementData
pattern2 = r"const \[agreementData, setAgreementData\] = useState.*?\}\);\s*\}\);\s*// Save agreement to localStorage"
replacement2 = """const [agreementData, setAgreementData] = useState(() => {
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
});
// Save agreement to localStorage"""

content = re.sub(pattern2, replacement2, content, flags=re.DOTALL)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
