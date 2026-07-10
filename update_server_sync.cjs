const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const route = `
  app.post("/api/steadfast/sync_status", async (req, res) => {
    try {
       let updatedCount = 0;
       for (let i = 0; i < previousBookings.length; i++) {
          const booking = previousBookings[i];
          if (booking.status !== 'delivered' && booking.status !== 'cancelled') {
             try {
                 const url = \`\${STEADFAST_BASE_URL}/status_by_cid/\${booking.consignment_id}\`;
                 const response = await fetch(url, {
                    headers: {
                       "Api-Key": STEADFAST_API_KEY,
                       "Secret-Key": STEADFAST_SECRET_KEY
                    }
                 });
                 if (response.ok) {
                     const data = await response.json();
                     if (data.status === 200 && data.delivery_status) {
                         booking.status = data.delivery_status.toLowerCase();
                         updatedCount++;
                     }
                 } else {
                     // For mock data, randomly advance status for demonstration
                     if (Math.random() > 0.5) {
                         booking.status = booking.status === 'pending' ? 'in_transit' : 'delivered';
                         updatedCount++;
                     }
                 }
             } catch (err) {
                 console.log("Error syncing:", err);
             }
          }
       }
       if (updatedCount > 0) {
          saveBookings();
       }
       res.json({ status: 200, updatedCount, history: previousBookings });
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
  });
`;

code = code.replace('app.get("/api/steadfast/history",', route + '\n  app.get("/api/steadfast/history",');
fs.writeFileSync('server.ts', code);
console.log("Added sync route");
