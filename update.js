#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// File to store update counter
const COUNTER_FILE = 'update-counter.txt';

// Get next update number
let updateNumber = 1;
if (fs.existsSync(COUNTER_FILE)) {
    updateNumber = parseInt(fs.readFileSync(COUNTER_FILE, 'utf8')) + 1;
}
fs.writeFileSync(COUNTER_FILE, updateNumber.toString());

console.log(`🚀 Update #${updateNumber}`);

// Update HTML file
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace(/&copy; \d{4}/g, `&copy; ${new Date().getFullYear()}`);
content = content.replace(/<!-- Update #\d+.*?-->/g, '');
content = content.replace('</head>', `    <!-- Update #${updateNumber} - ${new Date().toLocaleString('vi-VN')} -->\n</head>`);
content = content.replace(/<title>.*?<\/title>/, `<title>Landing Page - Sản phẩm tuyệt vời (Update #${updateNumber})</title>`);
fs.writeFileSync('index.html', content, 'utf8');

// Git operations
execSync('git add .');
execSync(`git commit -m "update ${updateNumber}"`);
execSync('git push');

console.log(`✅ Update #${updateNumber} completed!`);
