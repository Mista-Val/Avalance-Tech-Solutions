const sharp = require('sharp');
const fs = require('fs');

// Create a simple placeholder icon
sharp({
    create: {
        width: 192,
        height: 192,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
})
    .png()
    .toFile('public/assets/images/pwa-icon-192.png')
    .then(() => {
        console.log('PWA icon created successfully');
    })
    .catch(err => {
        console.error('Error creating PWA icon:', err);
    });
