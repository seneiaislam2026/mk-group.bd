import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("ওজন / পরিমাপ <span", "প্রতি বক্সে পরিমাণ <span")
content = content.replace("যেমন: ১ কেজি, ৫ কেজি, ১ ডজন", "যেমন: ২৪ টি, ১ জোড়া")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
