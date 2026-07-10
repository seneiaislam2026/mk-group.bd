import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "alert('অনুগ্রহ করে গ্রাহকের সম্পূর্ণ বিবরণ ও তথ্য প্রদান করুন।');",
    "addNotification('সতর্কতা', 'অনুগ্রহ করে গ্রাহকের সম্পূর্ণ বিবরণ ও তথ্য প্রদান করুন।');"
)

content = content.replace(
    "alert('অনুগ্রহ করে একটি সঠিক বাংলাদেশী মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।');",
    "addNotification('সতর্কতা', 'অনুগ্রহ করে একটি সঠিক বাংলাদেশী মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।');"
)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)

print("done")
