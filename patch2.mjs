import fs from 'fs';
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const target = `                )}
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-2 shrink-0 bg-slate-50 select-none">`;
const replacement = `                )}
              </div>
                  </div>
                </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-2 shrink-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)] select-none z-20">`;
content = content.replace(target, replacement);

const target2 = `              </button>
            </div>
            </>
            ) : (`;
const replacement2 = `              </button>
            </div>
              </div>
            ) : (`;
content = content.replace(target2, replacement2);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
