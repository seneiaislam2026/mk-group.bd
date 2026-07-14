import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Fix campaigns
pattern1 = r"const \[campaigns, setCampaigns\] = useState.*?\];\s*\}\);\s*// Coupons states"
replacement1 = """const [campaigns, setCampaigns] = useState<{
    id: string;
    name: string;
    platform: string;
    budget: number;
    targetAudience: string;
    conversions: number;
    status: 'Active' | 'Paused' | 'Scheduled' | 'Completed';
    date: string;
    roi: number;
  }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_campaigns');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [
        { id: 'c-1', name: 'ফেসবুক অর্গানিক ঘি বুস্টিং', platform: 'Facebook Ads', budget: 2500, targetAudience: 'স্বাস্থ্য সচেতন গৃহিণী ও পরিবার', conversions: 18, status: 'Active', date: '2026-07-01T12:00:00.000Z', roi: 3.2 },
        { id: 'c-2', name: 'সুন্দরবন খাটি মধু প্রমোশন', platform: 'SMS Marketing', budget: 1200, targetAudience: 'পুরাতন খদ্দের রি-টার্গেটিং', conversions: 12, status: 'Completed', date: '2026-06-25T10:00:00.000Z', roi: 4.5 },
        { id: 'c-3', name: 'ঈদ স্পেশাল কম্বো অফার বুস্ট', platform: 'Instagram Ads', budget: 4000, targetAudience: 'তরুণ ও কর্পোরেট চাকুরিজীবী', conversions: 0, status: 'Scheduled', date: '2026-07-15T09:00:00.000Z', roi: 0 }
    ];
});
// Coupons states"""

content = re.sub(pattern1, replacement1, content, flags=re.DOTALL)

# Fix coupons
pattern2 = r"const \[coupons, setCoupons\] = useState.*?\];\s*\}\);\s*// Save campaigns & coupons to localStorage"
replacement2 = """const [coupons, setCoupons] = useState<{
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minSpend: number;
    expiryDate: string;
    usageCount: number;
  }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_data_coupons');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
    }
    return [
        { code: 'NUR10', type: 'percentage', value: 10, minSpend: 1000, expiryDate: '2026-12-31', usageCount: 45 },
        { code: 'GHEE200', type: 'fixed', value: 200, minSpend: 2500, expiryDate: '2026-08-30', usageCount: 18 },
        { code: 'WELCOME100', type: 'fixed', value: 100, minSpend: 1200, expiryDate: '2026-10-15', usageCount: 62 }
    ];
});
// Save campaigns & coupons to localStorage"""

content = re.sub(pattern2, replacement2, content, flags=re.DOTALL)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
