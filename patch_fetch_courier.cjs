const fs = require('fs');
let file = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Replace mock courierHistory state initialization
const oldCourierState = `  const [courierHistory, setCourierHistory] = useState<any[]>([
    {
       consignment_id: '9984920',
       tracking_code: '05E20EE4',
       customer_name: 'রিয়াজুল ইসলাম',
       customer_phone: '01712345678',
       amount: 1500,
       status: 'delivered',
       created_at: '2023-10-25T14:20:00Z'
    },
    {
       consignment_id: '9984921',
       tracking_code: '05E20EE5',
       customer_name: 'আরিফ হোসেন',
       customer_phone: '01812345678',
       amount: 2500,
       status: 'in_transit',
       created_at: '2023-10-26T10:15:00Z'
    },
    {
       consignment_id: '9984922',
       tracking_code: '05E20EE6',
       customer_name: 'সাদিয়া রহমান',
       customer_phone: '01912345678',
       amount: 850,
       status: 'pending',
       created_at: '2023-10-26T16:45:00Z'
    }
  ]);`;
const newCourierState = `  const [courierHistory, setCourierHistory] = useState<any[]>([]);

  // Fetch courier history
  useEffect(() => {
    if (activeTab === 'courier') {
      fetch('/api/steadfast/history')
        .then(res => res.json())
        .then(data => {
          if (data.history) {
            setCourierHistory(data.history);
          }
        })
        .catch(err => console.error(err));
    }
  }, [activeTab]);`;

file = file.replace(oldCourierState, newCourierState);

fs.writeFileSync('src/pages/AdminDashboard.tsx', file);
