async function testApi() {
  const payload = {
    invoice: 'test_12345',
    recipient_name: 'Test',
    recipient_phone: '01711111111',
    recipient_address: 'Dhaka',
    cod_amount: 100,
    note: 'Test'
  };

  const types = [0, 1, 2, 3, 4];

  for (const t of types) {
    try {
      const res = await fetch('https://portal.packzy.com/api/v1/create_order', {
        method: 'POST',
        headers: {
          'Api-Key': '2p80tiyscewtjoczqbqy9fcugkhpocvz',
          'Secret-Key': 'y0i0bp251lyktq4vx8fwcr2l',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...payload, delivery_type: t })
      });
      const data = await res.json();
      console.log(`Type ${t}:`, data.status, data.message || data.errors);
    } catch (e) {}
  }
}
testApi();
