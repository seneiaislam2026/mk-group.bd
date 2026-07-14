import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target = """setNewBooking({
                     customer_name: createdOrderForActions.customerName,
                     customer_phone: createdOrderForActions.phone,
                     customer_address: createdOrderForActions.address,
                     amount: createdOrderForActions.total
                  });
                  setIsCourierBookingOpen(true);"""

replacement = """setBookingOrder(createdOrderForActions);"""

content = content.replace(target, replacement)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
