const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const targetStr = `<div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">`;
                    
code = code.replace(targetStr, `<>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">`);

const endTargetStr = `                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS TRACKING */}`;

code = code.replace(endTargetStr, `                  </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS TRACKING */}`);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed wrapper in AdminDashboard');
