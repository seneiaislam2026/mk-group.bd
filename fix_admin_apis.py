import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# 1. History
pattern_history = r"  const \[courierHistory, setCourierHistory\] = useState<any\[\]>\(\[\]\);\s*const \[isSyncing, setIsSyncing\] = useState\(false\);\s*const handleSyncCourier = async \(\) => \{\s*setIsSyncing\(true\);\s*try \{\s*const res = await fetch\('/api/steadfast/sync_status', \{ method: 'POST' \}\);\s*const data = await res.json\(\);\s*if \(data.history\) \{\s*setCourierHistory\(data.history\);\s*\}\s*\} catch \(err\) \{\s*console.error\(err\);\s*\} finally \{\s*setIsSyncing\(false\);\s*\}\s*\};\s*// Fetch courier history\s*useEffect\(\(\) => \{\s*if \(activeTab === 'courier'\) \{\s*fetch\('/api/steadfast/history'\)\s*\.then\(res => res\.json\(\)\)\s*\.then\(data => \{\s*if \(data.history\) \{\s*setCourierHistory\(data.history\);\s*\}\s*\}\)\s*\.catch\(err => console.error\(err\)\);\s*\}\s*\}, \[activeTab\]\);"

new_history = """  const [courierHistory, setCourierHistory] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mega_courier_history');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mega_courier_history', JSON.stringify(courierHistory));
    }
  }, [courierHistory]);

  const [isSyncing, setIsSyncing] = useState(false);
  const handleSyncCourier = async () => {
    setIsSyncing(true);
    try {
      const updatedHistory = [...courierHistory];
      let updatedCount = 0;
      for (let i = 0; i < updatedHistory.length; i++) {
         const booking = updatedHistory[i];
         if (booking.status !== 'delivered' && booking.status !== 'cancelled') {
            try {
                const response = await fetch(`https://portal.packzy.com/api/v1/status_by_cid/${booking.consignment_id}`, {
                   headers: {
                      "Api-Key": "2p80tiyscewtjoczqbqy9fcugkhpocvz",
                      "Secret-Key": "y0i0bp251lyktq4vx8fwcr2l"
                   }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 200 && data.delivery_status) {
                        updatedHistory[i].status = data.delivery_status.toLowerCase();
                        updatedCount++;
                    }
                }
            } catch (err) {
                console.log("Error syncing:", err);
            }
         }
      }
      if (updatedCount > 0) {
         setCourierHistory(updatedHistory);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch courier history
  useEffect(() => {
    // Loaded from localStorage
  }, [activeTab]);"""

content = re.sub(pattern_history, new_history, content)

# 2. Create Order 1
pattern_create = r"const response = await fetch\('/api/steadfast/create_order', \{\s*method: 'POST',\s*headers: \{\s*'Content-Type': 'application/json'\s*\},\s*body: JSON.stringify\(\{\s*invoice: courierBookingData.invoice,\s*recipient_name: courierBookingData.recipient_name,\s*recipient_phone: courierBookingData.recipient_phone,\s*recipient_address: courierBookingData.recipient_address,\s*cod_amount: courierBookingData.cod_amount,\s*note: courierBookingData.note\s*\}\)\s*\}\);\s*const data = await response.json\(\);\s*if \(data.status === 200 \|\| data.consignment_id\) \{\s*setCourierHistory\(prev => \[\{\s*consignment_id: data.consignment\?\.consignment_id \|\| data.consignment_id,\s*tracking_code: data.consignment\?\.tracking_code \|\| data.tracking_code \|\| '',\s*tracking_link: data.consignment\?\.tracking_link \|\| data.tracking_link \|\| '',\s*status: 'pending',\s*customer_name: courierBookingData.recipient_name,\s*customer_phone: courierBookingData.recipient_phone,\s*amount: courierBookingData.cod_amount,\s*created_at: new Date\(\).toISOString\(\)\s*\}, \.\.\.prev\]\);"

new_create = """const response = await fetch('https://portal.packzy.com/api/v1/create_order', {
                      method: 'POST',
                      headers: {
                        'Api-Key': '2p80tiyscewtjoczqbqy9fcugkhpocvz',
                        'Secret-Key': 'y0i0bp251lyktq4vx8fwcr2l',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        invoice: courierBookingData.invoice,
                        recipient_name: courierBookingData.recipient_name,
                        recipient_phone: courierBookingData.recipient_phone,
                        recipient_address: courierBookingData.recipient_address,
                        cod_amount: courierBookingData.cod_amount,
                        note: courierBookingData.note
                      })
                    });
                    const data = await response.json();
                    
                    if (data.status === 200 || data.consignment_id) {
                      const newBooking = {
                        consignment_id: data.consignment?.consignment_id || data.consignment_id,
                        tracking_code: data.consignment?.tracking_code || data.tracking_code || '',
                        tracking_link: data.consignment?.tracking_link || data.tracking_link || '',
                        status: 'pending',
                        customer_name: courierBookingData.recipient_name,
                        customer_phone: courierBookingData.recipient_phone,
                        amount: courierBookingData.cod_amount,
                        invoice: courierBookingData.invoice,
                        created_at: new Date().toISOString()
                      };
                      setCourierHistory(prev => [newBooking, ...prev]);"""

content = re.sub(pattern_create, new_create, content)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("RegEx Replacement Finished")
