const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// 1. Add state and function
const stateHook = `const [courierHistory, setCourierHistory] = useState<any[]>([]);`;
const syncFunc = `
  const [isSyncing, setIsSyncing] = useState(false);
  const handleSyncCourier = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/steadfast/sync_status', { method: 'POST' });
      const data = await res.json();
      if (data.history) {
        setCourierHistory(data.history);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };
`;
code = code.replace(stateHook, stateHook + syncFunc);

// 2. Add icon import for RefreshCw
if (!code.includes('RefreshCw')) {
   code = code.replace('import { PackagePlus, ExternalLink } from "lucide-react";', 'import { PackagePlus, ExternalLink, RefreshCw } from "lucide-react";');
}

// 3. Add button next to "New Booking"
const newBookingBtn = `<button
                    onClick={() => setIsCourierBookingOpen(true)}
                    className="bg-[#2e7d32] text-white px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer w-full sm:w-auto"
                  >
                    <Plus size={14} /> নতুন বুকিং
                  </button>`;

const syncBtn = `
                  <button
                    onClick={handleSyncCourier}
                    disabled={isSyncing}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer w-full sm:w-auto disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} /> আপডেট
                  </button>
`;
code = code.replace(newBookingBtn, syncBtn + newBookingBtn);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log("Added sync button");
