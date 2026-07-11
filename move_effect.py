import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

effect = """  // Reset print state if form is modified
  useEffect(() => {
    setIsAgreementSaved(false);
  }, [agreementData]);"""

content = content.replace(effect, "")
content = content.replace("  const [isAgreementSaved, setIsAgreementSaved] = useState(false);\n\n", "  const [isAgreementSaved, setIsAgreementSaved] = useState(false);\n")

# Now add it back after agreementData declaration
new_effect = """  const [agreementData, setAgreementData] = useState({
    party1: { name: '', fname: '', mname: '', address: '', nid: '', mobile: '' },
    party2: { name: '', fname: '', mname: '', address: '', nid: '', mobile: '' },
    nominee: { name: '', fname: '', mname: '', address: '', nid: '', mobile: '' },
    details: { totalAmount: '', totalAmountWords: '', installmentAmount: '', installmentAmountWords: '', installmentCount: '', dueAmount: '', dueAmountWords: '', paymentDate: '', party1Bank: '', party1Account: '', party2Bank: '', party2Account: '', chequeNumber: '' },
    warish1: { relation: '', name: '', address: '', nid: '', mobile: '' },
    warish2: { relation: '', name: '', address: '', nid: '', mobile: '' },
    witness1: { name: '', address: '', nid: '', mobile: '' },
    witness2: { name: '', address: '', nid: '', mobile: '' },
    witness3: { name: '', address: '', nid: '', mobile: '' }
  });

  // Reset print state if form is modified
  useEffect(() => {
    setIsAgreementSaved(false);
  }, [agreementData]);"""

content = re.sub(r"  const \[agreementData, setAgreementData\] = useState\(\{.*?witness3: \{ name: '', address: '', nid: '', mobile: '' \}\n  \}\);", new_effect, content, flags=re.DOTALL)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
