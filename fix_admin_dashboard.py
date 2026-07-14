import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

bad_block = """    const newDocId = `cour-${Date.now()}`;
    const newDocData = {
                              consignment_id: data.consignment?.consignment_id || data.consignment_id,
                              tracking_code: data.consignment?.tracking_code || data.tracking_code || '',
                        tracking_link: data.consignment?.tracking_link || data.tracking_link || '',
                              customer_name: bookingOrder.customerName,
                              customer_phone: bookingOrder.phone,
                              amount: bookingOrder.total,
                              status: 'pending',
                              created_at: new Date().toISOString()
                            };
    try {
        await setDoc(doc(courierHistoryCollection, newDocId), { ...newDocData, id: newDocId });
    } catch(e) {
        console.error(e);
    }"""

content = content.replace(bad_block, "")

# Also we need to fix the redeclaration issue if it exists anywhere else, but here the second one is literally just removed.

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
