const STEADFAST_API_KEY = "2p80tiyscewtjoczqbqy9fcugkhpocvz";
const STEADFAST_SECRET_KEY = "y0i0bp251lyktq4vx8fwcr2l";
const STEADFAST_BASE_URL = "https://portal.packzy.com/api/v1";

async function run() {
  const url = `${STEADFAST_BASE_URL}/status_by_cid/9984920`;
  const response = await fetch(url, {
    headers: {
      "Api-Key": STEADFAST_API_KEY,
      "Secret-Key": STEADFAST_SECRET_KEY
    }
  });
  console.log(await response.json());
}
run();
