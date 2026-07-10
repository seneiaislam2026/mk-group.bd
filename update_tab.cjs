const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update activeTab type
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'settings' | 'finances' | 'marketing' | 'dues' | 'courier' | 'receiving'>('dashboard');",
  "const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'settings' | 'finances' | 'marketing' | 'dues' | 'courier' | 'receiving' | 'agreement'>('dashboard');"
);

// We need to find the sidebar buttons and insert 'agreement'
const tabTarget = `          <button 
            onClick={() => setActiveTab('dues')} 
            className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left \${activeTab === 'dues' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <Banknote size={18} /> বাকী খাতা
          </button>`;
          
const tabReplacement = `          <button 
            onClick={() => setActiveTab('dues')} 
            className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left \${activeTab === 'dues' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <Banknote size={18} /> বাকী খাতা
          </button>
          
          <button 
            onClick={() => setActiveTab('agreement')} 
            className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left \${activeTab === 'agreement' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <FileText size={18} /> চুক্তিনামা প্রিন্ট
          </button>`;

if(content.includes(tabTarget)) {
  content = content.replace(tabTarget, tabReplacement);
}

const tabTargetMobile = `              <button 
                onClick={() => { setActiveTab('dues'); setIsMobileMenuOpen(false); }} 
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left \${activeTab === 'dues' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}\`}
              >
                <Banknote size={16} /> বাকী খাতা
              </button>`;

const tabReplacementMobile = `              <button 
                onClick={() => { setActiveTab('dues'); setIsMobileMenuOpen(false); }} 
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left \${activeTab === 'dues' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}\`}
              >
                <Banknote size={16} /> বাকী খাতা
              </button>
              
              <button 
                onClick={() => { setActiveTab('agreement'); setIsMobileMenuOpen(false); }} 
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left \${activeTab === 'agreement' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}\`}
              >
                <FileText size={16} /> চুক্তিনামা প্রিন্ট
              </button>`;
              
if(content.includes(tabTargetMobile)) {
  content = content.replace(tabTargetMobile, tabReplacementMobile);
}

// Add state for agreement form
const stateTarget = `  // Courier booking mockup states`;
const stateReplacement = `  // Agreement Form State
  const [agreementData, setAgreementData] = useState({
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

  // Courier booking mockup states`;

if(content.includes(stateTarget)) {
  content = content.replace(stateTarget, stateReplacement);
}

// Add import FileText if not exists
if(!content.includes("FileText")) {
  content = content.replace("import { ", "import { FileText, ");
}

fs.writeFileSync(file, content);
console.log("Updated activeTab and form states");
