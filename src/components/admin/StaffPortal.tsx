import React, { useState, useEffect, useRef } from 'react';
import { UserCheck, Camera, Plus, Search, CheckCircle, XCircle, Clock, CalendarDays, Upload, X, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  mobile: string;
  designation: string;
  photo: string;
  joinDate: string;
}

interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
  timestamp: string;
}

export default function StaffPortal() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', mobile: '', designation: '', photo: '' });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [viewingMonth, setViewingMonth] = useState(new Date());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedStaff = localStorage.getItem('mega_staff');
    if (storedStaff) setStaffList(JSON.parse(storedStaff));
    
    const storedAttendance = localStorage.getItem('mega_attendance');
    if (storedAttendance) setAttendance(JSON.parse(storedAttendance));
  }, []);

  
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

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.mobile || !newStaff.designation) {
      alert("সব তথ্য পূরণ করুন");
      return;
    }

    const staff: Staff = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStaff.name,
      mobile: newStaff.mobile,
      designation: newStaff.designation,
      photo: newStaff.photo || 'https://i.pravatar.cc/150?u=' + Math.random(),
      joinDate: new Date().toISOString()
    };

    const updated = [staff, ...staffList];
    setStaffList(updated);
    localStorage.setItem('mega_staff', JSON.stringify(updated));
    setNewStaff({ name: '', mobile: '', designation: '', photo: '' });
    setShowAddModal(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStaff(p => ({ ...p, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const markAttendance = (staffId: string, status: 'present' | 'absent' | 'leave') => {
    const existingIndex = attendance.findIndex(a => a.staffId === staffId && a.date === selectedDate);
    
    let newAttendance = [...attendance];
    
    if (existingIndex >= 0) {
      newAttendance[existingIndex] = { ...newAttendance[existingIndex], status, timestamp: new Date().toISOString() };
    } else {
      newAttendance.push({
        id: Math.random().toString(36).substr(2, 9),
        staffId,
        date: selectedDate,
        status,
        timestamp: new Date().toISOString()
      });
    }
    
    setAttendance(newAttendance);
    localStorage.setItem('mega_attendance', JSON.stringify(newAttendance));
  };

  const getAttendanceStatus = (staffId: string) => {
    const record = attendance.find(a => a.staffId === staffId && a.date === selectedDate);
    return record?.status || null;
  };

  const filteredStaff = staffList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.mobile.includes(searchQuery));

  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <UserCheck size={24} className="text-[#2e7d32]" />
            স্টাফ পোর্টাল ও হাজিরা
          </h2>
          <p className="text-xs text-slate-500 mt-1">কর্মীদের দৈনিক হাজিরা এবং প্রোফাইল ব্যবস্থাপনা</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#2e7d32]"
            />
            <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#2e7d32] text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-[#2e7d32]/20 whitespace-nowrap"
          >
            <Plus size={14} /> নতুন স্টাফ
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="স্টাফ খুঁজুন (নাম বা মোবাইল নম্বর)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#2e7d32] focus:ring-2 focus:ring-[#2e7d32]/20 transition-all"
        />
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <UserCheck size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-bold">কোন স্টাফ পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredStaff.map(staff => {
            const currentStatus = getAttendanceStatus(staff.id);
            return (
              <div key={staff.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${
                  currentStatus === 'present' ? 'bg-emerald-500' : 
                  currentStatus === 'absent' ? 'bg-rose-500' : 
                  currentStatus === 'leave' ? 'bg-amber-500' : 'bg-slate-200'
                }`} />
                
                <div className="flex items-center justify-between gap-4 mb-4 pl-2">
                  <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => setSelectedStaff(staff)}>
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
                      <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 leading-tight">{staff.name}</h3>
                      <p className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">{staff.designation}</p>
                      <p className="text-xs text-slate-600 mt-1">{staff.mobile}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteStaff(staff.id, e)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="স্টাফ মুছে ফেলুন"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 pl-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">আজকের হাজিরা ({new Date(selectedDate).toLocaleDateString('bn-BD')})</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => markAttendance(staff.id, 'present')}
                      className={`flex flex-col items-center justify-center py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                        currentStatus === 'present' 
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200 border' 
                          : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle size={14} className="mb-1" /> উপস্থিত
                    </button>
                    <button 
                      onClick={() => markAttendance(staff.id, 'absent')}
                      className={`flex flex-col items-center justify-center py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                        currentStatus === 'absent' 
                          ? 'bg-rose-100 text-rose-700 border-rose-200 border' 
                          : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <XCircle size={14} className="mb-1" /> অনুপস্থিত
                    </button>
                    <button 
                      onClick={() => markAttendance(staff.id, 'leave')}
                      className={`flex flex-col items-center justify-center py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                        currentStatus === 'leave' 
                          ? 'bg-amber-100 text-amber-700 border-amber-200 border' 
                          : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Clock size={14} className="mb-1" /> ছুটি
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      
      {selectedStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white sm:rounded-2xl w-full min-h-screen sm:min-h-0 sm:max-w-3xl overflow-hidden shadow-2xl my-0 sm:my-8 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <User size={18} className="text-[#2e7d32]" /> স্টাফ প্রোফাইল ও হাজিরা রিপোর্ট
              </h3>
              <button onClick={() => setSelectedStaff(null)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 bg-white rounded-lg border border-slate-200">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8 items-center md:items-start bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100">
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <h4 className="text-lg font-bold text-slate-800">মাসিক হাজিরা রিপোর্ট</h4>
                      <div className="flex items-center gap-2 bg-slate-50 rounded-lg border border-slate-200 p-1 w-full sm:w-auto justify-between sm:justify-start">
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

                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2 sm:p-4 text-center">
                        <div className="text-[10px] sm:text-xs font-bold text-emerald-600 mb-1">মোট উপস্থিত</div>
                        <div className="text-lg sm:text-2xl font-black text-emerald-700">{present} দিন</div>
                      </div>
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-2 sm:p-4 text-center">
                        <div className="text-[10px] sm:text-xs font-bold text-rose-600 mb-1">মোট অনুপস্থিত</div>
                        <div className="text-lg sm:text-2xl font-black text-rose-700">{absent} দিন</div>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-2 sm:p-4 text-center">
                        <div className="text-[10px] sm:text-xs font-bold text-amber-600 mb-1">মোট ছুটি</div>
                        <div className="text-lg sm:text-2xl font-black text-amber-700">{leave} দিন</div>
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
                                  {record.status === 'present' && <div className="bg-emerald-100 text-emerald-700 text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded text-center truncate">উপস্থিত</div>}
                                  {record.status === 'absent' && <div className="bg-rose-100 text-rose-700 text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded text-center truncate">অনুপস্থিত</div>}
                                  {record.status === 'leave' && <div className="bg-amber-100 text-amber-700 text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded text-center truncate">ছুটি</div>}
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

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <Plus size={16} className="text-[#2e7d32]" /> নতুন স্টাফ যুক্ত করুন
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 bg-white rounded-lg border border-slate-200">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden bg-slate-50 mb-3 group">
                  {newStaff.photo ? (
                    <img src={newStaff.photo} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={24} className="text-slate-400 group-hover:text-[#2e7d32] transition-colors" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-[#2e7d32] bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Upload size={14} /> ছবি আপলোড করুন
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">নাম <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={newStaff.name}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#2e7d32]"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">পদবী <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="যেমন: ডেলিভারি ম্যান, ম্যানেজার"
                  value={newStaff.designation}
                  onChange={e => setNewStaff({...newStaff, designation: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#2e7d32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">মোবাইল নম্বর <span className="text-rose-500">*</span></label>
                <input 
                  type="tel" 
                  required
                  value={newStaff.mobile}
                  onChange={e => setNewStaff({...newStaff, mobile: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#2e7d32]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  বাতিল
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-[#2e7d32] hover:bg-emerald-700 transition-colors shadow-lg shadow-[#2e7d32]/20"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
