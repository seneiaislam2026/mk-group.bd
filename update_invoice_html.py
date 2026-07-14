import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

old_header = """<div class="header">
                              <h1>MK GROUP</h1>
                              <p>Pandhoa Bazar, Beside Jahangirnagar University, Savar, Dhaka</p>
                              <p>Email: mkkhanmahadi01969@gmail.com, Phone: 01969317241, 01330457810</p>
                              <h2>INVOICE</h2>
                            </div>"""

new_header = """<div class="header" style="position: relative; text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                              <img src="https://i.ibb.co/s9n1g23j/1000095789-removebg-preview.png" style="width: 80px; height: 80px; position: absolute; left: 0; top: 0;" />
                              <h1 style="font-size: 28px; margin: 0; color: #1e3a8a; font-weight: 900; letter-spacing: 1px;">MK GROUP</h1>
                              <p style="margin: 4px 0; font-size: 13px; font-weight: bold;">Pandhoa Bazar, Beside Jahangirnagar University, Savar, Dhaka</p>
                              <p style="margin: 2px 0; font-size: 12px;">Email: mkkhanmahadi01969@gmail.com, Phone: 01969317241, 01330457810</p>
                              <h2 style="margin-top: 15px; margin-bottom: 5px; background: #000; color: #fff; padding: 4px 15px; border-radius: 4px; display: inline-block;">INVOICE</h2>
                            </div>"""

content = content.replace(old_header, new_header)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
