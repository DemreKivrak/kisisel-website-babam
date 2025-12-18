import zipfile
import os
from pathlib import Path

# Files and folders to exclude
exclude_patterns = [
    'node_modules',
    '*.sqlite',
    '*.zip',
    '*.log',
    '.env',
    'dist',
    'temp-check',
    'create-deployment-zip.py',
    '__pycache__'
]

def should_exclude(path):
    """Check if path should be excluded"""
    for pattern in exclude_patterns:
        if pattern.startswith('*'):
            # File extension pattern
            if path.endswith(pattern[1:]):
                return True
        else:
            # Folder or file name pattern
            if pattern in str(path):
                return True
    return False

# Create zip file
zip_path = 'deployment.zip'
if os.path.exists(zip_path):
    os.remove(zip_path)

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # Walk through all files in current directory
    for root, dirs, files in os.walk('.'):
        # Remove excluded directories from dirs list
        dirs[:] = [d for d in dirs if not should_exclude(d)]
        
        for file in files:
            file_path = os.path.join(root, file)
            
            # Skip excluded files
            if should_exclude(file_path):
                continue
            
            # Create archive name with forward slashes (Linux compatible)
            arcname = os.path.relpath(file_path, '.')
            arcname = arcname.replace('\\', '/')  # Convert to forward slashes
            
            zipf.write(file_path, arcname)
            print(f'Added: {arcname}')

print(f'\nZip file created: {zip_path}')
print(f'Size: {os.path.getsize(zip_path) / 1024 / 1024:.2f} MB')
