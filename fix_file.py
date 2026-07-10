import re

with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

# Replace the messy lines right after </tbody>
content = re.sub(r'</tbody>.*?</table>', '</tbody>\n                </table>', content, flags=re.DOTALL)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
