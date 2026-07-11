import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

investor_state = """
  // Investors Management
  const [investorsList, setInvestorsList] = useState<Investor[]>([]);
  const [showAddInvestorForm, setShowAddInvestorForm] = useState(false);
  const [newInvestorData, setNewInvestorData] = useState({
    name: '', fname: '', mobile: '', nid: '', address: '', totalAmount: '', dueAmount: ''
  });

  useEffect(() => {
    if (activeTab === 'investors') {
      const stored = localStorage.getItem('mega_investors');
      if (stored) {
        setInvestorsList(JSON.parse(stored));
      }
    }
  }, [activeTab]);

  const handleManualAddInvestor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvestorData.name || !newInvestorData.mobile || !newInvestorData.totalAmount) {
      alert('নাম, মোবাইল এবং মোট বিনিয়োগের পরিমান আবশ্যক।');
      return;
    }

    const totalAmount = parseFloat(newInvestorData.totalAmount) || 0;
    const dueAmount = parseFloat(newInvestorData.dueAmount) || 0;
    const paidAmount = totalAmount - dueAmount;

    const newInvestor: Investor = {
      id: Math.random().toString(36).substr(2, 9),
      accountNumber: Math.floor(1000000 + Math.random() * 9000000).toString(),
      name: newInvestorData.name,
      fname: newInvestorData.fname,
      mobile: newInvestorData.mobile,
      nid: newInvestorData.nid,
      address: newInvestorData.address,
      totalAmount: totalAmount,
      dueAmount: dueAmount,
      paidAmount: paidAmount,
      date: new Date().toISOString()
    };

    const updatedList = [newInvestor, ...investorsList];
    setInvestorsList(updatedList);
    localStorage.setItem('mega_investors', JSON.stringify(updatedList));
    
    setNewInvestorData({ name: '', fname: '', mobile: '', nid: '', address: '', totalAmount: '', dueAmount: '' });
    setShowAddInvestorForm(false);
    alert(`বিনিয়োগকারী সফলভাবে সংরক্ষিত হয়েছে! একাউন্ট নম্বর: ${newInvestor.accountNumber}`);
  };

  const handleDeleteInvestor = (id: string) => {
    if (window.confirm('আপনি কি এই বিনিয়োগকারীকে মুছে ফেলতে চান?')) {
      const updatedList = investorsList.filter(inv => inv.id !== id);
      setInvestorsList(updatedList);
      localStorage.setItem('mega_investors', JSON.stringify(updatedList));
    }
  };
"""

content = content.replace("  const [agreementData, setAgreementData] = useState({", investor_state + "\n  const [agreementData, setAgreementData] = useState({")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
