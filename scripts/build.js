const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

const distDir = path.join(__dirname, '../dist');
const publicDir = path.join(__dirname, '../public');

// Minify JavaScript files
async function minifyJS() {
    const jsFiles = [
        {
            input: 'assets/js/contact.js',
            output: 'assets/js/contact.min.js'
        },
        {
            input: 'assets/js/isotope.js',
            output: 'assets/js/isotope.min.js'
        },
        {
            input: 'assets/js/main.js',
            output: 'assets/js/main.min.js'
        }
    ];

    for (const { input, output } of jsFiles) {
        try {
            const inputPath = path.join(publicDir, input);
            if (!fs.existsSync(inputPath)) {
                console.warn(`File not found: ${inputPath}`);
                continue;
            }

            const content = fs.readFileSync(inputPath, 'utf8');
            const minified = await minify(content);
            const outputPath = path.join(distDir, output);

            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, minified.code, 'utf8');
            console.log(`Minified ${input} -> ${output}`);
        } catch (error) {
            console.error(`Error minifying ${input}:`, error);
            throw error;
        }
    }
}

// Minify CSS files
async function minifyCSS() {
    const cssFiles = [
        {
            input: 'assets/css/bootstrap.min.css',
            output: 'assets/css/bootstrap.min.css',
            required: false
        },
        {
            input: 'assets/css/font-awesome.min.css',
            output: 'assets/css/font-awesome.min.css',
            required: false
        },
        {
            input: 'assets/css/animate.min.css',
            output: 'assets/css/animate.min.css',
            required: false
        },
        {
            input: 'assets/css/custom-styles.css',
            output: 'assets/css/custom-styles.min.css',
            required: true
        },
        {
            input: 'assets/css/loading-spinner.css',
            output: 'assets/css/loading-spinner.min.css',
            required: true
        }
    ];

    const cleaner = new CleanCSS({
        level: 2,
        compatibility: '*'
    });

    for (const { input, output, required } of cssFiles) {
        try {
            const inputPath = path.join(publicDir, input);
            if (!fs.existsSync(inputPath)) {
                if (required) {
                    console.warn(`Required file not found: ${inputPath}`);
                } else {
                    console.log(`Skipping optional file: ${inputPath}`);
                }
                continue;
            }

            const content = fs.readFileSync(inputPath, 'utf8');
            const minified = await cleaner.minify(content);
            const outputPath = path.join(distDir, output);

            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, minified.styles, 'utf8');
            console.log(`Minified ${input} -> ${output}`);
        } catch (error) {
            if (required) {
                console.error(`Error minifying required file ${input}:`, error);
                throw error;
            }
            console.warn(`Error minifying optional file ${input}:`, error.message);
        }
    }
}

// Update HTML files with minified references and CDN fallbacks
function updateHTMLReferences() {
    const htmlFiles = ['index.html', '404.html'];
    const cdnFallbacks = {
        'bootstrap.min.css': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        'font-awesome.min.css': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        'animate.min.css': 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
        'header-nav.css': '/assets/css/header-nav.css'
    };

    for (const file of htmlFiles) {
        try {
            const filePath = path.join(distDir, file);
            if (!fs.existsSync(filePath)) {
                console.warn(`HTML file not found: ${filePath}`);
                continue;
            }

            let content = fs.readFileSync(filePath, 'utf8');

            // Update CSS references
            content = content.replace(
                /<link[^>]*href="([^"]*\.css)"[^>]*>/g,
                (match, href) => {
                    if (href.startsWith('http')) return match;
                    if (href.startsWith('data:')) return match;

                    const filename = path.basename(href);
                    const localPath = path.join(distDir, href);

                    if (!fs.existsSync(localPath)) {
                        const fallback = cdnFallbacks[filename] || href;
                        if (fallback !== href) {
                            console.log(`Using fallback for ${filename}: ${fallback}`);
                        } else {
                            console.warn(`No fallback found for ${filename}, keeping original`);
                        }
                        return match.replace(href, fallback);
                    }

                    // Update local references to use minified versions if they exist
                    const minifiedHref = href
                        .replace('custom-styles.css', 'custom-styles.min.css')
                        .replace('loading-spinner.css', 'loading-spinner.min.css');
                    
                    return match.replace(href, minifiedHref);
                }
            );


            // Update JS references
            content = content.replace(
                /<script[^>]*src="([^"]*\.js)"[^>]*><\/script>/g,
                (match, src) => {
                    if (src.startsWith('http')) return match;
                    const newSrc = src
                        .replace('contact.js', 'contact.min.js')
                        .replace('isotope.js', 'isotope.min.js')
                        .replace('main.js', 'main.min.js');
                    return match.replace(src, newSrc);
                }
            );

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated references in ${file}`);
        } catch (error) {
            console.error(`Error updating ${file}:`, error);
            throw error;
        }
    }
}

// Copy public files to dist directory
function copyPublicFiles() {
    try {
        // Create necessary directories
        ['assets/js', 'assets/css', 'assets/images', 'assets/fonts', 'assets/vendors']
            .forEach(dir => {
                const dirPath = path.join(distDir, dir);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }
            });

        // Copy files recursively
        if (fs.existsSync(publicDir)) {
            const copyRecursive = (src, dest) => {
                const entries = fs.readdirSync(src, { withFileTypes: true });
                for (const entry of entries) {
                    const srcPath = path.join(src, entry.name);
                    const destPath = path.join(dest, entry.name);

                    if (entry.isDirectory()) {
                        if (!fs.existsSync(destPath)) {
                            fs.mkdirSync(destPath, { recursive: true });
                        }
                        copyRecursive(srcPath, destPath);
                    } else {
                        fs.copyFileSync(srcPath, destPath);
                    }
                }
            };

            copyRecursive(publicDir, distDir);
            console.log('Copied public files to dist directory');
        } else {
            console.warn('Public directory not found, skipping copy');
        }
    } catch (error) {
        console.error('Error copying public files:', error);
        throw error;
    }
}

// Ensure required files are present
async function ensureRequiredFiles() {
    const requiredFiles = [
        {
            src: path.join(publicDir, 'assets/css/custom-styles.css'),
            dest: path.join(distDir, 'assets/css/custom-styles.css')
        },
        {
            src: path.join(publicDir, 'assets/css/loading-spinner.css'),
            dest: path.join(distDir, 'assets/css/loading-spinner.css')
        }
    ];

    for (const file of requiredFiles) {
        try {
            if (fs.existsSync(file.src) && !fs.existsSync(file.dest)) {
                fs.mkdirSync(path.dirname(file.dest), { recursive: true });
                fs.copyFileSync(file.src, file.dest);
                console.log(`Copied required file to ${file.dest}`);
            }
        } catch (error) {
            console.error(`Error copying required file ${file.src}:`, error);
            throw error;
        }
    }
}

// Main build function
async function build() {
    try {
        console.log('Starting build process...');

        // Create dist directory if it doesn't exist
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }

        // Copy public files
        await copyPublicFiles();

        // Ensure required files exist
        await ensureRequiredFiles();

        // Minify assets
        await Promise.all([
            minifyJS(),
            minifyCSS()
        ]);

        // Update HTML references
        await updateHTMLReferences();

        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

// Run the build if this file is executed directly
if (require.main === module) {
    build().catch(console.error);
}

module.exports = { build };