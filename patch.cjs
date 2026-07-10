const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `                      onClick={() => {
                        const randomTrk = courierService.toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000);
                        setBookingId(randomTrk);
                        setIsBookingSuccess(true);
                      }}`;

const replacement = `                      onClick={async () => {
                        if (courierService === 'steadfast') {
                          try {
                            const response = await fetch('/api/steadfast/create_order', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                invoice: bookingOrder.id,
                                recipient_name: bookingOrder.customerName,
                                recipient_phone: bookingOrder.phone,
                                recipient_address: bookingOrder.address,
                                cod_amount: bookingOrder.total,
                                note: \`Weight: \${weightKg}kg\`
                              })
                            });
                            const data = await response.json();
                            if (data.status === 200 || data.consignment_id) {
                              setBookingId(data.consignment?.tracking_code || data.tracking_code || data.consignment_id || 'NEW');
                              setIsBookingSuccess(true);
                              setCourierHistory(prev => [{
                                consignment_id: data.consignment?.consignment_id || data.consignment_id,
                                tracking_code: data.consignment?.tracking_code || data.tracking_code || 'NEW',
                                customer_name: bookingOrder.customerName,
                                customer_phone: bookingOrder.phone,
                                amount: bookingOrder.total,
                                status: 'pending',
                                created_at: new Date().toISOString()
                              }, ...prev]);
                            } else {
                              alert('বুকিং ব্যর্থ হয়েছে। এরর: ' + (data.message || 'অজানা ত্রুটি'));
                            }
                          } catch (e) {
                            alert('নেটওয়ার্ক এরর। দয়া করে আবার চেষ্টা করুন।');
                          }
                        } else {
                          const randomTrk = courierService.toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000);
                          setBookingId(randomTrk);
                          setIsBookingSuccess(true);
                        }
                      }}`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
console.log('Patched Successfully');
