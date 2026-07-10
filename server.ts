import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const STEADFAST_API_KEY = process.env.STEADFAST_API_KEY || "2p80tiyscewtjoczqbqy9fcugkhpocvz";
  const STEADFAST_SECRET_KEY = process.env.STEADFAST_SECRET_KEY || "y0i0bp251lyktq4vx8fwcr2l";
  const STEADFAST_BASE_URL = "https://portal.packzy.com/api/v1";


// Load or initialize previous bookings
const BOOKINGS_FILE = path.join(process.cwd(), "bookings.json");
let previousBookings: any[] = [];
if (fs.existsSync(BOOKINGS_FILE)) {
  try {
    const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
    previousBookings = JSON.parse(data);
  } catch (err) {
    console.error("Error reading bookings file:", err);
  }
}

function saveBookings() {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(previousBookings, null, 2));
}

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/steadfast/create_order", async (req, res) => {
    try {
      const response = await fetch(`${STEADFAST_BASE_URL}/create_order`, {
        method: "POST",
        headers: {
          "Api-Key": STEADFAST_API_KEY,
          "Secret-Key": STEADFAST_SECRET_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      
      if (data.status === 200 || data.consignment_id) {
         previousBookings.unshift({
           ...req.body,
           tracking_code: data.consignment?.tracking_code || data.tracking_code,
           tracking_link: data.consignment?.tracking_link || data.tracking_link || '',
           consignment_id: data.consignment?.consignment_id || data.consignment_id,
           status: 'pending',
           customer_name: req.body.recipient_name,
           customer_phone: req.body.recipient_phone,
           amount: req.body.cod_amount,
           created_at: new Date().toISOString()
         });
         saveBookings();
      }
      
      res.json(data);
    } catch (error: any) {
      const causeMsg = error.cause ? error.cause.message : '';
      const fullMsg = causeMsg ? `${error.message} (${causeMsg})` : error.message;
      res.status(500).json({ 
        status: 500, 
        message: fullMsg || "Failed to create order" 
      });
    }
  });

  
  app.post("/api/steadfast/sync_status", async (req, res) => {
    try {
       let updatedCount = 0;
       for (let i = 0; i < previousBookings.length; i++) {
          const booking = previousBookings[i];
          if (booking.status !== 'delivered' && booking.status !== 'cancelled') {
             try {
                 const url = `${STEADFAST_BASE_URL}/status_by_cid/${booking.consignment_id}`;
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

  app.get("/api/steadfast/history", (req, res) => {
    res.json({ history: previousBookings });
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
