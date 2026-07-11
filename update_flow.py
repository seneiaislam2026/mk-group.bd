import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Add state for isAgreementSaved
state_str = """
  // Agreement Form State
  const [isAgreementSaved, setIsAgreementSaved] = useState(false);
"""
content = content.replace("  // Agreement Form State", state_str)

# Modify handleSaveInvestor
handle_save_old = """  const handleSaveInvestor = () => {
    if (!agreementData.party1.name || !agreementData.party1.mobile || !agreementData.details.totalAmount) {
      alert("১ম পক্ষ ক্রেতার নাম, মোবাইল এবং চুক্তির মোট টাকার পরিমান অবশ্যই পূরণ করতে হবে।");
      return;
    }
    
    // Calculate values
    const totalAmount = parseFloat(agreementData.details.totalAmount) || 0;
    const dueAmount = parseFloat(agreementData.details.dueAmount) || 0;
    const paidAmount = totalAmount - dueAmount;
    
    const newInvestor = {
      id: Math.random().toString(36).substr(2, 9),
      accountNumber: Math.floor(1000000 + Math.random() * 9000000).toString(),
      name: agreementData.party1.name,
      fname: agreementData.party1.fname,
      mobile: agreementData.party1.mobile,
      nid: agreementData.party1.nid,
      address: agreementData.party1.address,
      totalAmount: totalAmount,
      dueAmount: dueAmount,
      paidAmount: paidAmount,
      date: new Date().toISOString()
    };
    
    // Save to localStorage
    const stored = localStorage.getItem('mega_investors');
    const existing = stored ? JSON.parse(stored) : [];
    localStorage.setItem('mega_investors', JSON.stringify([newInvestor, ...existing]));
    
    alert(`বিনিয়োগকারী সফলভাবে সংরক্ষিত হয়েছে! একাউন্ট নম্বর: ${newInvestor.accountNumber}`);
  };"""

handle_save_new = """  const handleSaveInvestor = () => {
    if (!agreementData.party1.name || !agreementData.party1.mobile || !agreementData.details.totalAmount) {
      alert("১ম পক্ষ ক্রেতার নাম, মোবাইল এবং চুক্তির মোট টাকার পরিমান অবশ্যই পূরণ করতে হবে।");
      return;
    }
    
    // Calculate values
    const totalAmount = parseFloat(agreementData.details.totalAmount) || 0;
    const dueAmount = parseFloat(agreementData.details.dueAmount) || 0;
    const paidAmount = totalAmount - dueAmount;
    
    const newInvestor: Investor = {
      id: Math.random().toString(36).substr(2, 9),
      accountNumber: Math.floor(1000000 + Math.random() * 9000000).toString(),
      name: agreementData.party1.name,
      fname: agreementData.party1.fname,
      mobile: agreementData.party1.mobile,
      nid: agreementData.party1.nid,
      address: agreementData.party1.address,
      totalAmount: totalAmount,
      dueAmount: dueAmount,
      paidAmount: paidAmount,
      date: new Date().toISOString()
    };
    
    // Save to localStorage
    const stored = localStorage.getItem('mega_investors');
    const existing = stored ? JSON.parse(stored) : [];
    const updatedList = [newInvestor, ...existing];
    localStorage.setItem('mega_investors', JSON.stringify(updatedList));
    setInvestorsList(updatedList);
    
    setIsAgreementSaved(true);
    alert(`বিনিয়োগকারী সফলভাবে সংরক্ষিত হয়েছে! একাউন্ট নম্বর: ${newInvestor.accountNumber}\\nএখন আপনি চুক্তিনামা প্রিন্ট করতে পারবেন।`);
  };"""

content = content.replace(handle_save_old, handle_save_new)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

