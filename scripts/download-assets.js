const fs = require('fs');
const path = require('path');
const https = require('https');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '../public/assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Download function
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', err => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

// Download Bootstrap bundle
const bootstrapBundleUrl = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js';
const bootstrapBundlePath = path.join(assetsDir, 'js/bootstrap.bundle.min.js');
downloadFile(bootstrapBundleUrl, bootstrapBundlePath)
    .then(() => console.log('Bootstrap bundle downloaded'))
    .catch(err => console.error('Error downloading Bootstrap bundle:', err));

// Download WOW.js
const wowJsUrl = 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js';
const wowJsPath = path.join(assetsDir, 'js/wow.min.js');
downloadFile(wowJsUrl, wowJsPath)
    .then(() => console.log('WOW.js downloaded'))
    .catch(err => console.error('Error downloading WOW.js:', err));
