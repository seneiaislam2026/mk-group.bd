with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

import re

old_block = r"const \[transactions, setTransactions\] = useState.*?\[transactions\]\);"

new_block = """const [transactions, setTransactions] = useState<{ id: string; type: 'income' | 'expense'; category: string; amount: number; date: string; note: string }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_transactions');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [
        { id: 't-1', type: 'income', category: 'পণ্য বিক্রি', amount: 5500, date: '2026-07-08T10:00:00.000Z', note: 'শোরুম ডিরেক্ট ক্যাশ সেলস' },
        { id: 't-2', type: 'expense', category: 'কাঁচামাল কেনা', amount: 1500, date: '2026-07-08T14:30:00.000Z', note: 'প্রিমিয়াম প্যাকেট ও লেবেল প্রিন্টিং' },
        { id: 't-3', type: 'expense', category: 'শিপিং চার্জ', amount: 350, date: '2026-07-09T09:00:00.000Z', note: 'উত্তরা এরিয়া ডেলিভারি রাইডার ফি' }
    ];
});

useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('admin_data_transactions', JSON.stringify(transactions));
    }
}, [transactions]);"""

content = re.sub(old_block, new_block, content, flags=re.DOTALL)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
