const fs = require('fs');
const path = require('path');

const contactJsPath = path.join(__dirname, 'public', 'assets', 'js', 'contact.js');

// Read the current content of contact.js
fs.readFile(contactJsPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading contact.js:', err);
        return;
    }

    // Replace the dispatchEvent line with the new code
    const updatedContent = data.replace(
        /form\.dispatchEvent\(new CustomEvent\('form:success', \{ bubbles: true \}\)\);/g,
        `// Dispatch custom event for form success\n                form.dispatchEvent(new CustomEvent('form:success', { bubbles: true }));\n                \n                // Show success message for a moment before refreshing\n                setTimeout(() => {\n                    // Store form data in sessionStorage to repopulate after refresh if needed\n                    const formData = new FormData(form);\n                    const formDataObj = {};\n                    formData.forEach((value, key) => {\n                        formDataObj[key] = value;\n                    });\n                    sessionStorage.setItem('formSubmitted', 'true');\n                    \n                    // Refresh the page\n                    window.location.reload();\n                }, 1500); // 1.5 seconds delay before refresh`
    );

    // Write the updated content back to contact.js
    fs.writeFile(contactJsPath, updatedContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to contact.js:', err);
            return;
        }
        console.log('Successfully updated contact.js with page refresh functionality.');
    });
});
