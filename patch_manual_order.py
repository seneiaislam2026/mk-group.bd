import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

# Add states for delivery and condition charges
state_insert = """  const [manualDeliveryCharge, setManualDeliveryCharge] = useState<number>(0);
  const [manualConditionCharge, setManualConditionCharge] = useState<number>(0);"""
content = content.replace("const [manualSelectedQuantity, setManualSelectedQuantity] = useState(1);", "const [manualSelectedQuantity, setManualSelectedQuantity] = useState(1);\n" + state_insert)

# Add logic to auto-fill address
handle_phone_change = """                      onChange={(e) => {
                        const newPhone = e.target.value;
                        setManualOrderPhone(newPhone);
                        if (newPhone.length >= 11) {
                          const prevOrder = orders.find(o => o.phone === newPhone);
                          if (prevOrder) {
                            if (!manualOrderCustomerName) setManualOrderCustomerName(prevOrder.customerName);
                            if (!manualOrderAddress) setManualOrderAddress(prevOrder.address);
                          }
                        }
                      }}"""
content = re.sub(r'onChange=\{\(e\) => setManualOrderPhone\(e\.target\.value\)\}', handle_phone_change, content)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
