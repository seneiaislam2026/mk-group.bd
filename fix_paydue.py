with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "alert('বকেয়া জমা হয়েছে এবং আয় হিসেবে যুক্ত হয়েছে!');",
    "addNotification('বকেয়া আদায় 💰', 'বকেয়া জমা হয়েছে এবং আয় হিসেবে যুক্ত হয়েছে!');"
)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
print("done")
