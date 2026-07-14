const fs = require('fs');
let code = fs.readFileSync('src/components/admin/StaffPortal.tsx', 'utf8');

if (!code.includes('const handleDeleteStaff')) {
  code = code.replace(/const handleAddStaff = /g, 
    "const handleDeleteStaff = (id: string, e: React.MouseEvent) => {\n" +
    "  e.stopPropagation();\n" +
    "  if (window.confirm('স্টাফ রেকর্ডটি মুছে ফেলতে চান?')) {\n" +
    "    const newStaff = staffList.filter(s => s.id !== id);\n" +
    "    setStaffList(newStaff);\n" +
    "    localStorage.setItem('mega_staff', JSON.stringify(newStaff));\n" +
    "  }\n" +
    "};\n\nconst handleAddStaff = ");
  fs.writeFileSync('src/components/admin/StaffPortal.tsx', code);
  console.log('Fixed StaffPortal');
}
