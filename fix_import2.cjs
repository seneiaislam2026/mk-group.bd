const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import React, { useState, useEffect, useRef } from "react";\nimport { PackagePlus } from "lucide-react";\nimport \'react\';', 'import React, { useState, useEffect, useRef } from "react";\nimport { PackagePlus } from "lucide-react";');

fs.writeFileSync(file, content);
