const project = 'ai-studio-mkgroup-5b76dc0c-2a1b-456a-8b16-162e54df4398';
const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/orders?documentId=`;

const orders = [
  {
    id: "MKO-101",
    customerName: "রাকিব হাসান",
    phone: "01711223344",
    address: "মিরপুর ১০, ঢাকা",
    status: "Completed",
    total: 1250,
    deliveryCharge: 60,
    conditionCharge: 0,
    subtotal: 1190,
    date: new Date(Date.now() - 86400000).toISOString(),
    items: [
      { id: "p-dummy-1", name: "ক্যাজুয়াল লোফার", price: 1190, quantity: 1 }
    ]
  },
  {
    id: "MKO-102",
    customerName: "শফিকুল ইসলাম",
    phone: "01811223344",
    address: "উত্তরা, ঢাকা",
    status: "Pending",
    total: 2400,
    deliveryCharge: 120,
    conditionCharge: 25,
    subtotal: 2255,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      { id: "p-dummy-2", name: "স্পোর্টস স্নিকার্স", price: 1127.5, quantity: 2 }
    ]
  },
  {
    id: "MKO-103",
    customerName: "তানভীর আহমেদ",
    phone: "01911223344",
    address: "ধানমন্ডি, ঢাকা",
    status: "Shipped",
    total: 3500,
    deliveryCharge: 60,
    conditionCharge: 35,
    subtotal: 3405,
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    items: [
      { id: "p-dummy-3", name: "ফরমাল শু", price: 3405, quantity: 1 }
    ]
  }
];

async function seed() {
  for (const order of orders) {
    const docData = {
      fields: {
        id: { stringValue: order.id },
        customerName: { stringValue: order.customerName },
        phone: { stringValue: order.phone },
        address: { stringValue: order.address },
        status: { stringValue: order.status },
        total: { integerValue: Math.round(order.total) },
        deliveryCharge: { integerValue: Math.round(order.deliveryCharge) },
        conditionCharge: { integerValue: Math.round(order.conditionCharge) },
        subtotal: { integerValue: Math.round(order.subtotal) },
        date: { stringValue: order.date },
        items: {
          arrayValue: {
            values: order.items.map(item => ({
              mapValue: {
                fields: {
                  id: { stringValue: item.id },
                  name: { stringValue: item.name },
                  price: { integerValue: Math.round(item.price) },
                  quantity: { integerValue: item.quantity }
                }
              }
            }))
          }
        }
      }
    };
    
    await fetch(url + order.id, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData)
    });
    console.log('Seeded', order.id);
  }
}

seed();
