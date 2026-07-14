with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

junk = """      ]; } })();
    }
    return [];
  });"""

replacement = """      ];
  });"""

content = content.replace(junk, replacement)

content = content.replace("localStorage.setItem('mega_dues', JSON.stringify(dues));", "localStorage.setItem('admin_data_dues', JSON.stringify(dues));")
content = content.replace("localStorage.setItem('mega_campaigns', JSON.stringify(campaigns));", "localStorage.setItem('admin_data_campaigns', JSON.stringify(campaigns));")
content = content.replace("localStorage.setItem('mega_coupons', JSON.stringify(coupons));", "localStorage.setItem('admin_data_coupons', JSON.stringify(coupons));")
content = content.replace("localStorage.setItem('mega_investors', JSON.stringify(investorsList));", "localStorage.setItem('admin_data_investorsList', JSON.stringify(investorsList));")
content = content.replace("localStorage.setItem('mega_agreements', JSON.stringify(agreementData));", "localStorage.setItem('admin_data_agreementData', JSON.stringify(agreementData));")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
