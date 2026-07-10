const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the opening `{!autoBookingResult ? ( <>` that is currently inside the body div.
content = content.replace(`            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {!autoBookingResult ? (
                <>
              <div>`, `            {!autoBookingResult ? (
              <>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>`);

// 2. The closing part is already exactly where it needs to be! 
// Let's check where it is:
//             </div>
//             </>
//             ) : (
//                 <div className="text-center py-6 space-y-4">

fs.writeFileSync(file, content);
console.log('Fixed auto booking structure');
