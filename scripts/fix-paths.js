const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// Files to process with their path replacements
const filesToProcess = [
  {
    file: path.join(publicDir, 'assets/css/about-section.css'),
    find: "url('/assets/images/about-img.jpg')",
    replace: "url('../images/about-img.jpg')"
  },
  {
    file: path.join(publicDir, 'assets/css/clients.css'),
    find: "url('/assets/images/portfolio-img5.jpg')",
    replace: "url('../images/portfolio-img5.jpg')"
  },
  {
    file: path.join(publicDir, 'assets/css/custom-styles.css'),
    find: "url('/assets/images/tab image.jpg')",
    replace: "url('../images/tab image.jpg')"
  },
  {
    file: path.join(publicDir, 'assets/css/custom-styles.css'),
    find: "url('/assets/images/portfolio-img5.jpg')",
    replace: "url('../images/portfolio-img5.jpg')"
  }
];

// Process each file
filesToProcess.forEach(({ file, find, replace }) => {
  try {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(new RegExp(find, 'g'), replace);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated paths in ${path.relative(process.cwd(), file)}`);
    } else {
      console.warn(`File not found: ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
});

console.log('Path updates complete!');
