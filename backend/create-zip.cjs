const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');
const archiver = require('archiver');

// Files and folders to exclude
const excludePatterns = [
    'node_modules',
    '.sqlite',
    '.zip',
    '.log',
    '.env',
    'dist',
    'temp-check',
    'create-zip.js',
    'create-deployment-zip.py'
];

function shouldExclude(filePath) {
    return excludePatterns.some(pattern => {
        if (pattern.startsWith('.')) {
            return filePath.endsWith(pattern);
        }
        return filePath.includes(pattern);
    });
}

// Delete old zip if exists
const zipPath = 'deployment.zip';
if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
    console.log('Removed old deployment.zip');
}

// Create a file to stream archive data to
const output = createWriteStream(zipPath);
const archive = archiver('zip', {
    zlib: { level: 9 } // Compression level
});

// Listen for all archive data to be written
output.on('close', function() {
    console.log(`\nZip file created: ${zipPath}`);
    console.log(`Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total files: ${archive.pointer()} bytes`);
});

// Handle errors
archive.on('error', function(err) {
    throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files
const addDirectory = (dirPath) => {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const relativePath = path.relative('.', itemPath);
        
        if (shouldExclude(relativePath)) {
            return;
        }
        
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
            addDirectory(itemPath);
        } else {
            // Use forward slashes for Linux compatibility
            const archivePath = relativePath.replace(/\\/g, '/');
            archive.file(itemPath, { name: archivePath });
            console.log(`Added: ${archivePath}`);
        }
    });
};

// Start adding files from current directory
addDirectory('.');

// Finalize the archive
archive.finalize();
