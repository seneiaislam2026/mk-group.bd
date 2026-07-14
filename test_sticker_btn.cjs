const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const regex = /print-sticker\?id=\\\$\{autoBookingResult\.consignment_id\}/;
if (regex.test(code)) {
  console.log("Sticker URL is correct in code");
} else {
  console.log("Sticker URL not found!");
}
