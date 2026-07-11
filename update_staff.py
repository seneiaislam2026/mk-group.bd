import re

with open('src/components/admin/StaffPortal.tsx', 'r') as f:
    content = f.read()

# Add ChevronLeft, ChevronRight, User to imports
content = content.replace("CheckCircle, XCircle, Clock, CalendarDays, Upload, X } from 'lucide-react'", "CheckCircle, XCircle, Clock, CalendarDays, Upload, X, ChevronLeft, ChevronRight, User } from 'lucide-react'")

# Add state for selected staff and viewing month
state_to_add = """  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [viewingMonth, setViewingMonth] = useState(new Date());"""

content = content.replace("const [searchQuery, setSearchQuery] = useState('');", "const [searchQuery, setSearchQuery] = useState('');\n" + state_to_add)

# Add logic for profile and month navigation
helper_functions = """
  const handlePrevMonth = () => {
    setViewingMonth(new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewingMonth(new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() + 1, 1));
  };

  const getMonthlyAttendance = (staffId: string) => {
    const year = viewingMonth.getFullYear();
    const month = viewingMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const monthlyRecords = [];
    let present = 0;
    let absent = 0;
    let leave = 0;
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const record = attendance.find(a => a.staffId === staffId && a.date === dateStr);
      monthlyRecords.push({
        date: dateStr,
        day: i,
        status: record?.status || null
      });
      
      if (record?.status === 'present') present++;
      if (record?.status === 'absent') absent++;
      if (record?.status === 'leave') leave++;
    }
    
    return { records: monthlyRecords, present, absent, leave };
  };
"""

content = content.replace("const handleAddStaff = (e: React.FormEvent) => {", helper_functions + "\n  const handleAddStaff = (e: React.FormEvent) => {")

# Wrap staff card with cursor-pointer and onClick to set selected staff
old_card = """<div className="flex items-center gap-4 mb-4 pl-2">"""
new_card = """<div className="flex items-center gap-4 mb-4 pl-2 cursor-pointer" onClick={() => setSelectedStaff(staff)}>"""
content = content.replace(old_card, new_card)

# Add Profile Modal
modal_code = """
      {selectedStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <User size={18} className="text-[#2e7d32]" /> স্টাফ প্রোফাইল ও হাজিরা রিপোর্ট
              </h3>
              <button onClick={() => setSelectedStaff(null)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 bg-white rounded-lg border border-slate-200">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-8 items-center md:items-start bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
                  <img src={selectedStaff.photo} alt={selectedStaff.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-black text-slate-800">{selectedStaff.name}</h2>
                  <p className="text-sm font-bold text-[#2e7d32] bg-emerald-50 px-3 py-1 rounded-full inline-block mt-2 mb-2">{selectedStaff.designation}</p>
                  <div className="text-sm text-slate-600 font-medium">মোবাইল: <span className="font-bold text-slate-800">{selectedStaff.mobile}</span></div>
                </div>
              </div>

              {(() => {
                const { records, present, absent, leave } = getMonthlyAttendance(selectedStaff.id);
                return (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-bold text-slate-800">মাসিক হাজিরা রিপোর্ট</h4>
                      <div className="flex items-center gap-3 bg-slate-50 rounded-lg border border-slate-200 p-1">
                        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white rounded hover:shadow-sm text-slate-600 transition-all">
                          <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-bold w-32 text-center text-slate-800">
                          {viewingMonth.toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={handleNextMonth} className="p-1.5 hover:bg-white rounded hover:shadow-sm text-slate-600 transition-all">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                        <div className="text-xs font-bold text-emerald-600 mb-1">মোট উপস্থিত</div>
                        <div className="text-2xl font-black text-emerald-700">{present} দিন</div>
                      </div>
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center">
                        <div className="text-xs font-bold text-rose-600 mb-1">মোট অনুপস্থিত</div>
                        <div className="text-2xl font-black text-rose-700">{absent} দিন</div>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                        <div className="text-xs font-bold text-amber-600 mb-1">মোট ছুটি</div>
                        <div className="text-2xl font-black text-amber-700">{leave} দিন</div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-7 gap-px bg-slate-200">
                        {['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'].map(day => (
                          <div key={day} className="bg-slate-50 py-2 text-center text-xs font-bold text-slate-600">
                            {day}
                          </div>
                        ))}
                        
                        {(() => {
                          const year = viewingMonth.getFullYear();
                          const month = viewingMonth.getMonth();
                          const firstDay = new Date(year, month, 1).getDay();
                          
                          const cells = [];
                          for (let i = 0; i < firstDay; i++) {
                            cells.push(<div key={`empty-${i}`} className="bg-white p-2 min-h-[80px]"></div>);
                          }
                          
                          records.forEach(record => {
                            cells.push(
                              <div key={record.date} className="bg-white p-2 min-h-[80px] border-t border-slate-100 relative group flex flex-col">
                                <span className={`text-xs font-bold mb-1 ${record.status ? 'text-slate-800' : 'text-slate-400'}`}>{record.day}</span>
                                <div className="mt-auto">
                                  {record.status === 'present' && <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded text-center">উপস্থিত</div>}
                                  {record.status === 'absent' && <div className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded text-center">অনুপস্থিত</div>}
                                  {record.status === 'leave' && <div className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded text-center">ছুটি</div>}
                                </div>
                              </div>
                            );
                          });
                          return cells;
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("{showAddModal && (", modal_code + "\n      {showAddModal && (")

with open('src/components/admin/StaffPortal.tsx', 'w') as f:
    f.write(content)

print("done")
