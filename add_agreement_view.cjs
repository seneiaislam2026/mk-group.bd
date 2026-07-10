const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `          {/* TAB 5: SYSTEM SETTINGS */}`;
const replacement = `          {/* TAB: AGREEMENT */}
          {activeTab === 'agreement' && (
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800">ক্রয় বিক্রয় চুক্তিনামা ফর্ম</h2>
                  <p className="text-xs text-slate-500 mt-1">সমস্ত তথ্য পূরণ করে চুক্তিনামা প্রিন্ট করুন</p>
                </div>
                <button 
                  onClick={() => {
                    const dataStr = encodeURIComponent(JSON.stringify(agreementData));
                    window.open(\`/print-agreement?data=\${dataStr}\`, '_blank');
                  }}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <FileText size={16} /> প্রিন্ট করুন
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Party 1 */}
                <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">১ম পক্ষ ক্রেতা</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম</label>
                      <input type="text" value={agreementData.party1.name} onChange={e => setAgreementData(p => ({...p, party1: {...p.party1, name: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">পিতার নাম</label>
                      <input type="text" value={agreementData.party1.fname} onChange={e => setAgreementData(p => ({...p, party1: {...p.party1, fname: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মাতার নাম</label>
                      <input type="text" value={agreementData.party1.mname} onChange={e => setAgreementData(p => ({...p, party1: {...p.party1, mname: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল</label>
                      <input type="text" value={agreementData.party1.mobile} onChange={e => setAgreementData(p => ({...p, party1: {...p.party1, mobile: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                      <input type="text" value={agreementData.party1.nid} onChange={e => setAgreementData(p => ({...p, party1: {...p.party1, nid: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                      <input type="text" value={agreementData.party1.address} onChange={e => setAgreementData(p => ({...p, party1: {...p.party1, address: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="গ্রাম/রাস্তা, ডাকঘর, থানা, জেলা" />
                    </div>
                  </div>
                </div>

                {/* Party 2 */}
                <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">২য় পক্ষ বিক্রেতা</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম</label>
                      <input type="text" value={agreementData.party2.name} onChange={e => setAgreementData(p => ({...p, party2: {...p.party2, name: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">পিতার নাম</label>
                      <input type="text" value={agreementData.party2.fname} onChange={e => setAgreementData(p => ({...p, party2: {...p.party2, fname: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মাতার নাম</label>
                      <input type="text" value={agreementData.party2.mname} onChange={e => setAgreementData(p => ({...p, party2: {...p.party2, mname: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল</label>
                      <input type="text" value={agreementData.party2.mobile} onChange={e => setAgreementData(p => ({...p, party2: {...p.party2, mobile: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                      <input type="text" value={agreementData.party2.nid} onChange={e => setAgreementData(p => ({...p, party2: {...p.party2, nid: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                      <input type="text" value={agreementData.party2.address} onChange={e => setAgreementData(p => ({...p, party2: {...p.party2, address: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="গ্রাম/রাস্তা, ডাকঘর, থানা, জেলা" />
                    </div>
                  </div>
                </div>

                {/* Nominee */}
                <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">বিনিয়োগকারীর নমিনী</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম</label>
                      <input type="text" value={agreementData.nominee.name} onChange={e => setAgreementData(p => ({...p, nominee: {...p.nominee, name: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">পিতার নাম</label>
                      <input type="text" value={agreementData.nominee.fname} onChange={e => setAgreementData(p => ({...p, nominee: {...p.nominee, fname: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মাতার নাম</label>
                      <input type="text" value={agreementData.nominee.mname} onChange={e => setAgreementData(p => ({...p, nominee: {...p.nominee, mname: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল</label>
                      <input type="text" value={agreementData.nominee.mobile} onChange={e => setAgreementData(p => ({...p, nominee: {...p.nominee, mobile: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                      <input type="text" value={agreementData.nominee.nid} onChange={e => setAgreementData(p => ({...p, nominee: {...p.nominee, nid: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                      <input type="text" value={agreementData.nominee.address} onChange={e => setAgreementData(p => ({...p, nominee: {...p.nominee, address: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="গ্রাম/রাস্তা, ডাকঘর, থানা, জেলা" />
                    </div>
                  </div>
                </div>

                {/* Agreement Details */}
                <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">শর্তাবলী ও আর্থিক বিবরণ</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোট টাকা (অংকে)</label>
                      <input type="text" value={agreementData.details.totalAmount} onChange={e => setAgreementData(p => ({...p, details: {...p.details, totalAmount: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="১,৪০,০০০" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মোট টাকা (কথায়)</label>
                      <input type="text" value={agreementData.details.totalAmountWords} onChange={e => setAgreementData(p => ({...p, details: {...p.details, totalAmountWords: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="এক লক্ষ চল্লিশ হাজার" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মাসিক কিস্তি (অংকে)</label>
                      <input type="text" value={agreementData.details.installmentAmount} onChange={e => setAgreementData(p => ({...p, details: {...p.details, installmentAmount: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="৩,৩৩৩" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">মাসিক কিস্তি (কথায়)</label>
                      <input type="text" value={agreementData.details.installmentAmountWords} onChange={e => setAgreementData(p => ({...p, details: {...p.details, installmentAmountWords: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="তিন হাজার তিনশত তেত্রিশ" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">কত মাস (কিস্তি সংখ্যা)</label>
                      <input type="text" value={agreementData.details.installmentCount} onChange={e => setAgreementData(p => ({...p, details: {...p.details, installmentCount: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="১২ (বারো)" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">পরিশোধের তারিখ</label>
                      <input type="text" value={agreementData.details.paymentDate} onChange={e => setAgreementData(p => ({...p, details: {...p.details, paymentDate: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="১০/০৭/২০২৭" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">বাকী টাকা (অংকে)</label>
                      <input type="text" value={agreementData.details.dueAmount} onChange={e => setAgreementData(p => ({...p, details: {...p.details, dueAmount: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="১,০০,০০০" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">বাকী টাকা (কথায়)</label>
                      <input type="text" value={agreementData.details.dueAmountWords} onChange={e => setAgreementData(p => ({...p, details: {...p.details, dueAmountWords: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="এক লক্ষ" />
                    </div>
                    
                    <div className="col-span-2 mt-2 pt-2 border-t border-slate-200">
                      <h4 className="text-[11px] font-bold text-slate-600 mb-3">ব্যাংক বিবরণ</h4>
                    </div>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">১ম পক্ষের ব্যাংক নাম</label>
                      <input type="text" value={agreementData.details.party1Bank} onChange={e => setAgreementData(p => ({...p, details: {...p.details, party1Bank: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="ডাচ বাংলা ব্যাংক লিঃ" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">১ম পক্ষের হিসাব নং</label>
                      <input type="text" value={agreementData.details.party1Account} onChange={e => setAgreementData(p => ({...p, details: {...p.details, party1Account: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="২৭০১..." />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">২য় পক্ষের ব্যাংক নাম</label>
                      <input type="text" value={agreementData.details.party2Bank} onChange={e => setAgreementData(p => ({...p, details: {...p.details, party2Bank: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="ইসলামী ব্যাংক লিঃ" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">২য় পক্ষের হিসাব নং</label>
                      <input type="text" value={agreementData.details.party2Account} onChange={e => setAgreementData(p => ({...p, details: {...p.details, party2Account: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="২০৫০..." />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">১ম পক্ষের চেক পাতা নং</label>
                      <input type="text" value={agreementData.details.chequeNumber} onChange={e => setAgreementData(p => ({...p, details: {...p.details, chequeNumber: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="০৯০২৬০৮৯২" />
                    </div>
                  </div>
                </div>

                {/* Warishan */}
                <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50 lg:col-span-2">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">স্থলবর্তী ওয়ারিশানগন</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Warish 1 */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-indigo-600">ওয়ারিশ-১</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">সম্পর্ক</label>
                          <input type="text" value={agreementData.warish1.relation} onChange={e => setAgreementData(p => ({...p, warish1: {...p.warish1, relation: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="যেমন: ছোট ভাই" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম</label>
                          <input type="text" value={agreementData.warish1.name} onChange={e => setAgreementData(p => ({...p, warish1: {...p.warish1, name: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                          <input type="text" value={agreementData.warish1.nid} onChange={e => setAgreementData(p => ({...p, warish1: {...p.warish1, nid: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল</label>
                          <input type="text" value={agreementData.warish1.mobile} onChange={e => setAgreementData(p => ({...p, warish1: {...p.warish1, mobile: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                          <input type="text" value={agreementData.warish1.address} onChange={e => setAgreementData(p => ({...p, warish1: {...p.warish1, address: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                      </div>
                    </div>

                    {/* Warish 2 */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-indigo-600">ওয়ারিশ-২</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">সম্পর্ক</label>
                          <input type="text" value={agreementData.warish2.relation} onChange={e => setAgreementData(p => ({...p, warish2: {...p.warish2, relation: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" placeholder="যেমন: স্ত্রী" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম</label>
                          <input type="text" value={agreementData.warish2.name} onChange={e => setAgreementData(p => ({...p, warish2: {...p.warish2, name: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                          <input type="text" value={agreementData.warish2.nid} onChange={e => setAgreementData(p => ({...p, warish2: {...p.warish2, nid: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল</label>
                          <input type="text" value={agreementData.warish2.mobile} onChange={e => setAgreementData(p => ({...p, warish2: {...p.warish2, mobile: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                          <input type="text" value={agreementData.warish2.address} onChange={e => setAgreementData(p => ({...p, warish2: {...p.warish2, address: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Witnesses */}
                <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50 lg:col-span-2">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">সাক্ষীগণ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="space-y-4">
                        <h4 className="text-xs font-bold text-indigo-600">সাক্ষী-{num}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">নাম</label>
                            <input type="text" value={agreementData[\`witness\${num}\` as keyof typeof agreementData].name} onChange={e => setAgreementData(p => ({...p, [\`witness\${num}\`]: {...p[\`witness\${num}\` as keyof typeof p], name: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">ঠিকানা</label>
                            <input type="text" value={agreementData[\`witness\${num}\` as keyof typeof agreementData].address} onChange={e => setAgreementData(p => ({...p, [\`witness\${num}\`]: {...p[\`witness\${num}\` as keyof typeof p], address: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">এনআইডি (NID)</label>
                            <input type="text" value={agreementData[\`witness\${num}\` as keyof typeof agreementData].nid} onChange={e => setAgreementData(p => ({...p, [\`witness\${num}\`]: {...p[\`witness\${num}\` as keyof typeof p], nid: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">মোবাইল</label>
                            <input type="text" value={agreementData[\`witness\${num}\` as keyof typeof agreementData].mobile} onChange={e => setAgreementData(p => ({...p, [\`witness\${num}\`]: {...p[\`witness\${num}\` as keyof typeof p], mobile: e.target.value}}))} className="w-full px-3 py-2 rounded-xl text-xs border outline-none focus:border-indigo-600" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => {
                    const dataStr = encodeURIComponent(JSON.stringify(agreementData));
                    window.open(\`/print-agreement?data=\${dataStr}\`, '_blank');
                  }}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <FileText size={18} /> প্রিন্ট করুন
                </button>
              </div>
            </div>
          )}
          
          {/* TAB 5: SYSTEM SETTINGS */}`;

if(content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log("Added agreement view");
}
