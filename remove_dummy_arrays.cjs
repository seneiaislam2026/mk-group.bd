const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  `return (stored && safeJSONParse(stored, null)) || [
        { id: 't-1', type: 'income' as 'income' | 'expense', category: 'পণ্য বিক্রি', amount: 5500, date: '2026-07-08T10:00:00.000Z', note: 'শোরুম ডিরেক্ট ক্যাশ সেলস' },
        { id: 't-2', type: 'expense' as 'income' | 'expense', category: 'কাঁচামাল কেনা', amount: 1500, date: '2026-07-08T14:30:00.000Z', note: 'প্রিমিয়াম প্যাকেট ও লেবেল প্রিন্টিং' },
        { id: 't-3', type: 'expense' as const, category: 'শিপিং চার্জ', amount: 350, date: '2026-07-09T09:00:00.000Z', note: 'উত্তরা এরিয়া ডেলিভারি রাইডার ফি' }
      ];`,
  `return (stored && safeJSONParse(stored, null)) || [];`
);

code = code.replace(
  `return (stored && safeJSONParse(stored, null)) || [
        { id: 'd-1', customerName: 'করিম সাহেব', phone: '01711000000', amount: 5000, paidAmount: 0, date: '2023-10-01', status: 'Unpaid' }
      ];`,
  `return (stored && safeJSONParse(stored, null)) || [];`
);

code = code.replace(
  `return (stored && safeJSONParse(stored, null)) || [
        { id: 'c-1', name: 'ফেসবুক অর্গানিক ঘি বুস্টিং', platform: 'Facebook Ads', budget: 2500, targetAudience: 'স্বাস্থ্য সচেতন গৃহিণী ও পরিবার', conversions: 18, status: 'Active', date: '2026-07-01T12:00:00.000Z', roi: 3.2 },
        { id: 'c-2', name: 'সুন্দরবন খাটি মধু প্রমোশন', platform: 'SMS Marketing', budget: 1200, targetAudience: 'পুরাতন খদ্দের রি-টার্গেটিং', conversions: 12, status: 'Completed', date: '2026-06-25T10:00:00.000Z', roi: 4.5 },
        { id: 'c-3', name: 'ঈদ স্পেশাল কম্বো অফার বুস্ট', platform: 'Instagram Ads', budget: 4000, targetAudience: 'তরুণ ও কর্পোরেট চাকুরিজীবী', conversions: 0, status: 'Scheduled', date: '2026-07-15T09:00:00.000Z', roi: 0 }
      ];`,
  `return (stored && safeJSONParse(stored, null)) || [];`
);

code = code.replace(
  `return (stored && safeJSONParse(stored, null)) || [
        { code: 'NUR10', type: 'percentage', value: 10, minSpend: 1000, expiryDate: '2026-12-31', usageCount: 45 },
        { code: 'GHEE200', type: 'fixed', value: 200, minSpend: 2500, expiryDate: '2026-08-30', usageCount: 18 },
        { code: 'WELCOME100', type: 'fixed', value: 100, minSpend: 1200, expiryDate: '2026-10-15', usageCount: 62 }
      ];`,
  `return (stored && safeJSONParse(stored, null)) || [];`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Removed dummy arrays.');
