const fs = require('fs');
const file = 'server.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `    } catch (error) {
      console.error("Steadfast API fetch failed, using mock data:", error.message);
      const mockTrackingCode = "STEADFAST-" + Math.floor(100000 + Math.random() * 900000);
      const mockConsignmentId = Math.floor(10000000 + Math.random() * 90000000).toString();
      
      previousBookings.unshift({
        ...req.body,
        tracking_code: mockTrackingCode,
        consignment_id: mockConsignmentId,
        status: 'pending',
        customer_name: req.body.recipient_name,
        customer_phone: req.body.recipient_phone,
        amount: req.body.cod_amount,
        created_at: new Date().toISOString()
      });
      saveBookings();

      res.json({
        status: 200,
        message: "Order placed successfully (Mocked)",
        consignment: {
          tracking_code: mockTrackingCode,
          consignment_id: mockConsignmentId
        }
      });
    }`;

const replacement = `    } catch (error: any) {
      console.error("Steadfast API error:", error);
      res.status(500).json({ 
        status: 500, 
        message: error.message || "Failed to create order" 
      });
    }`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
console.log('Server Patched Successfully');
