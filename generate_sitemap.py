import os
from datetime import datetime

# Configuration
base_url = "https://thecodeman.net"
directory = "posts"
changefreq = "monthly"
priority = "0.8"

# Get the current date
current_date = datetime.now().strftime("%Y-%m-%d")

# Start the sitemap
sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>{base_url}/</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
"""

# Add each file in the directory to the sitemap
for filename in os.listdir(directory):
    if filename.endswith(".md"):
        file_path = os.path.join(directory, filename)
        file_url = f"{base_url}/{directory}/{filename.replace('.md', '')}"
        sitemap += f"""    <url>
        <loc>{file_url}</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>{changefreq}</changefreq>
        <priority>{priority}</priority>
    </url>
"""

# Close the sitemap
sitemap += "</urlset>"

# Write the sitemap to a file
with open("sitemap.xml", "w") as file:
    file.write(sitemap)

print("Sitemap generated successfully.") 