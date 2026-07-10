const STEADFAST_API_KEY = "2p80tiyscewtjoczqbqy9fcugkhpocvz";
const STEADFAST_SECRET_KEY = "y0i0bp251lyktq4vx8fwcr2l";
const STEADFAST_BASE_URL = "https://portal.packzy.com/api/v1";

async function run() {
  const url = `${STEADFAST_BASE_URL}/create_order`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Api-Key": STEADFAST_API_KEY,
      "Secret-Key": STEADFAST_SECRET_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      invoice: "123",
      recipient_name: "Test",
      recipient_phone: "01700000000",
      recipient_address: "Dhaka",
      cod_amount: 1000,
      note: "Test"
    })
  });
  console.log(await response.text());
}
run();
