import re

with open('dist/assets/index-DKWltQCk.js', 'r') as f:
    js = f.read()

# We can search for the tabs to find the render function
idx = js.find('"dashboard"')
print("Found dashboard at:", idx)
start = max(0, idx - 1000)
end = min(len(js), idx + 5000)
print(js[start:end])
