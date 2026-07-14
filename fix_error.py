import re
with open('index.html', 'r') as f:
    content = f.read()

error_script = """
<script>
  window.addEventListener('error', function(event) {
    var errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100vw';
    errorDiv.style.height = '100vh';
    errorDiv.style.backgroundColor = 'rgba(255,0,0,0.8)';
    errorDiv.style.color = 'white';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.padding = '20px';
    errorDiv.style.overflow = 'auto';
    errorDiv.innerHTML = '<h1>Runtime Error</h1><pre>' + event.error.stack + '</pre>';
    document.body.appendChild(errorDiv);
  });
</script>
</head>
"""

content = content.replace("</head>", error_script)

with open('index.html', 'w') as f:
    f.write(content)
