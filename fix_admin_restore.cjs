const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// The replacement was:
// `<>
//                   <div className="hidden md:block overflow-x-auto">
//                     <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">`
// Let's replace it back to what it was for the inventory tab.

code = code.replace(
  `<>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">`,
  `<div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">`
);

// We also need to fix the end target str that we replaced.
// Where did we replace the end target str?
// `                  </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}
//
//           {/* TAB 3: ORDERS TRACKING */}`

code = code.replace(
  `                  </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS TRACKING */}`,
  `                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS TRACKING */}`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Restored AdminDashboard JSX.');
