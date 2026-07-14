with open('src/pages/AdminDashboard.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "const [investorsList, setInvestorsList] = useState<Investor[]>" in line:
        skip = True
        new_lines.append("""  const [investorsList, setInvestorsList] = useState<Investor[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_investorsList');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [];
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_data_investorsList', JSON.stringify(investorsList));
    }
  }, [investorsList]);\n""")
        continue
    
    if skip and "const [showAddInvestorForm" in line:
        skip = False
        new_lines.append(line)
        continue
        
    if not skip:
        new_lines.append(line)

lines = new_lines
new_lines = []
skip = False
for line in lines:
    if "const [agreementData, setAgreementData] = useState(" in line:
        skip = True
        new_lines.append("""  const [agreementData, setAgreementData] = useState(() => {
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
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_data_agreementData', JSON.stringify(agreementData));
    }
  }, [agreementData]);\n""")
        continue
        
    if skip and "const handleSaveAgreement" in line:
        skip = False
        new_lines.append(line)
        continue
        
    if not skip:
        new_lines.append(line)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.writelines(new_lines)
