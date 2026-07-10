const fs = require('fs');
const file = 'server.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `    } catch (error: any) {
      console.error("Steadfast API error:", error);
      res.status(500).json({ 
        status: 500, 
        message: error.message || "Failed to create order" 
      });
    }`;

const replacement = `    } catch (error: any) {
      const causeMsg = error.cause ? error.cause.message : '';
      const fullMsg = causeMsg ? \`\${error.message} (\${causeMsg})\` : error.message;
      res.status(500).json({ 
        status: 500, 
        message: fullMsg || "Failed to create order" 
      });
    }`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
console.log('Server Patched Successfully');
