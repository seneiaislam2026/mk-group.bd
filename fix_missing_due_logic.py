import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target = "                  addSimulatedOrder(newManualOrderObj);"

replacement = """                  addSimulatedOrder(newManualOrderObj);

                  if (manualOrderIsDue) {
                    const addedDue = {
                      id: `d-${Date.now()}`,
                      customerName: manualOrderCustomerName,
                      phone: manualOrderPhone,
                      amount: grandTotal,
                      paidAmount: 0,
                      date: new Date().toISOString(),
                      status: 'Unpaid' as const
                    };
                    setDues(prevDues => [addedDue, ...prevDues]);
                  }"""

content = content.replace(target, replacement)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)

print("done")
