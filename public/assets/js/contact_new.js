// First, save the current content of the file
const fs = require('fs');
const path = require('path');

const contactJsPath = path.join(__dirname, 'public', 'assets', 'js', 'contact.js');
let content = fs.readFileSync(contactJsPath, 'utf8');

// Replace the dispatchEvent line with the new code
content = content.replace(
    /form\.dispatchEvent\(new CustomEvent\('form:success', \{ bubbles: true \}\)\);/g,
    `// Dispatch custom event for form success
    form.dispatchEvent(new CustomEvent('form:success', { bubbles: true }));
    
    // Show success message for a moment before refreshing
    setTimeout(() => {
        // Store form data in sessionStorage to repopulate after refresh if needed
        const formData = new FormData(form);
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        sessionStorage.setItem('formSubmitted', 'true');
        
        // Refresh the page
        window.location.reload();
    }, 1500); // 1.5 seconds delay before refresh`
);

// Write the updated content back to the file
fs.writeFileSync(contactJsPath, content, 'utf8');
console.log('Successfully updated contact.js with page refresh functionality.');
