import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r"fetch\('/api/steadfast/create_order',\s*\{\s*method:\s*'POST',\s*headers:\s*\{\s*'Content-Type':\s*'application/json'\s*\}",
    r"fetch('https://portal.packzy.com/api/v1/create_order', {\n                      method: 'POST',\n                      headers: {\n                        'Api-Key': '2p80tiyscewtjoczqbqy9fcugkhpocvz',\n                        'Secret-Key': 'y0i0bp251lyktq4vx8fwcr2l',\n                        'Content-Type': 'application/json'\n                      }",
    content
)

# And fix the setCourierHistory appending logic
content = re.sub(
    r"setCourierHistory\(prev => \[\{\s*consignment_id: data\.consignment\?\.consignment_id \|\| data\.consignment_id,\s*tracking_code: data\.consignment\?\.tracking_code \|\| data\.tracking_code \|\| '',\s*tracking_link: data\.consignment\?\.tracking_link \|\| data\.tracking_link \|\| '',\s*status: 'pending',\s*customer_name: courierBookingData\.recipient_name,\s*customer_phone: courierBookingData\.recipient_phone,\s*amount: courierBookingData\.cod_amount,\s*created_at: new Date\(\)\.toISOString\(\)\s*\}, \.\.\.prev\]\);",
    r"const newBooking = {\n                        consignment_id: data.consignment?.consignment_id || data.consignment_id,\n                        tracking_code: data.consignment?.tracking_code || data.tracking_code || '',\n                        tracking_link: data.consignment?.tracking_link || data.tracking_link || '',\n                        status: 'pending',\n                        customer_name: courierBookingData.recipient_name,\n                        customer_phone: courierBookingData.recipient_phone,\n                        amount: courierBookingData.cod_amount,\n                        invoice: courierBookingData.invoice,\n                        created_at: new Date().toISOString()\n                      };\n                      setCourierHistory(prev => [newBooking, ...prev]);",
    content
)


with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

