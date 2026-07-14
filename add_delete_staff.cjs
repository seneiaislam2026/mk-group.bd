const fs = require('fs');
let code = fs.readFileSync('src/components/admin/StaffPortal.tsx', 'utf8');

// Add handleDeleteStaff
const addStaffFunc = `  const handleAddStaff = (e: React.FormEvent) => {`;
const deleteStaffFunc = `  const handleDeleteStaff = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm('আপনি কি নিশ্চিত যে এই স্টাফের তথ্য মুছে ফেলতে চান?')) {
      const updated = staffList.filter(s => s.id !== id);
      setStaffList(updated);
      localStorage.setItem('mega_staff', JSON.stringify(updated));
      
      const updatedAttendance = attendance.filter(a => a.staffId !== id);
      setAttendance(updatedAttendance);
      localStorage.setItem('mega_attendance', JSON.stringify(updatedAttendance));
      
      if (selectedStaff?.id === id) {
        setSelectedStaff(null);
      }
    }
  };\n\n  const handleAddStaff = (e: React.FormEvent) => {`;

code = code.replace(addStaffFunc, deleteStaffFunc);

// Add Trash2 to imports
code = code.replace(
  "import { UserCheck, Camera, Plus, Search, CheckCircle, XCircle, Clock, CalendarDays, Upload, X, ChevronLeft, ChevronRight, User } from 'lucide-react';",
  "import { UserCheck, Camera, Plus, Search, CheckCircle, XCircle, Clock, CalendarDays, Upload, X, ChevronLeft, ChevronRight, User, Trash2 } from 'lucide-react';"
);

// Find the staff list item to add delete button
// I'll search for the onClick={() => setSelectedStaff(staff)} and add a button next to it or inside it.
