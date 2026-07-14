const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  `                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">`,
  `                  <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">`
);

code = code.replace(
  `                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS TRACKING */}`,
  `                  </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS TRACKING */}`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed JSX wrapper in AdminDashboard for receiving tab.');
