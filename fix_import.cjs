const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useRef')) {
  content = content.replace("import { useState, useMemo } from 'react';", "import { useState, useMemo, useRef } from 'react';");
  // maybe it's just import { useState }
  if (content.includes("import { useState } from 'react';")) {
    content = content.replace("import { useState } from 'react';", "import { useState, useRef } from 'react';");
  }
  // catch-all
  if (!content.includes("useRef } from 'react'")) {
     content = content.replace("import { useState", "import { useState, useRef");
  }
  fs.writeFileSync(file, content);
  console.log("useRef imported");
}
