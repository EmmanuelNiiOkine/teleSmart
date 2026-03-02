#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Organization configurations
const organizations = [
  {
    name: 'GHANA PHYSICIANS ASSISTANTS ASSOCIATION',
    shortName: 'GPAA',
    folderName: 'ghana-physicians-assistants',
    tagline: 'Physician Assistant Member Bundles',
    description: 'Exclusive mobile bundles designed for Ghana Physicians Assistants Association members. Enjoy special rates and benefits.',
    primaryColor: '#1e40af',
    secondaryColor: '#1e3a8a',
    accentColor: '#3b82f6',
    logo: 'gpaa-logo.png',
    domain: 'gpaa-bundles.com'
  },
  {
    name: 'UNIVERSITY TEACHERS ASSOCIATION OF GHANA',
    shortName: 'UTAG',
    folderName: 'university-teachers-ghana',
    tagline: 'University Faculty Member Packages',
    description: 'Exclusive mobile packages designed for University Teachers Association of Ghana members. Enjoy special rates and benefits.',
    primaryColor: '#dc2626',
    secondaryColor: '#b91c1c',
    accentColor: '#ef4444',
    logo: 'utag-logo.png',
    domain: 'utag-bundles.com'
  },
  {
    name: 'NATIONAL HEALTH INSURANCE SCHEME',
    shortName: 'NHIS',
    folderName: 'national-health-insurance',
    tagline: 'NHIS Staff Member Offers',
    description: 'Exclusive mobile offers designed for National Health Insurance Scheme staff members. Enjoy special rates and benefits.',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentColor: '#10b981',
    logo: 'nhis-logo.png',
    domain: 'nhis-bundles.com'
  },
  {
    name: 'UNION OF PROFESSIONAL NURSES AND MIDWIVES GHANA',
    shortName: 'UPNMG',
    folderName: 'professional-nurses-midwives',
    tagline: 'Professional Nurses & Midwives Packages',
    description: 'Exclusive mobile packages designed for Union of Professional Nurses and Midwives Ghana members. Enjoy special rates and benefits.',
    primaryColor: '#7c3aed',
    secondaryColor: '#6d28d9',
    accentColor: '#8b5cf6',
    logo: 'upnmg-logo.png',
    domain: 'upnmg-bundles.com'
  },
  {
    name: 'GHANA REGISTERED NURSES AND MIDWIVES ASSOCIATION',
    shortName: 'GRNMA',
    folderName: 'ghana-registered-nurses',
    tagline: 'Registered Nurses & Midwives Bundles',
    description: 'Exclusive mobile bundles designed for Ghana Registered Nurses and Midwives Association members. Enjoy special rates and benefits.',
    primaryColor: '#ea580c',
    secondaryColor: '#c2410c',
    accentColor: '#f97316',
    logo: 'grnma-logo.png',
    domain: 'grnma-bundles.com'
  }
];

function createProjectFolder(org) {
  const projectPath = `../${org.folderName}`;
  
  console.log(`\n📁 Creating project folder: ${org.folderName}`);
  
  // Create project directory
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }
  
  // Copy all files from current project
  copyFolderSync('.', projectPath, {
    exclude: ['node_modules', 'dist', '.git', 'DS_Store']
  });
  
  return projectPath;
}

function customizeProject(projectPath, org) {
  console.log(`🎨 Customizing project for ${org.shortName}`);
  
  // Update package.json
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = `${org.folderName}-bundles`;
    packageJson.description = `${org.name} - ${org.tagline}`;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
  
  // Update index.html title
  const indexPath = path.join(projectPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    indexContent = indexContent.replace(
      /<title>.*?<\/title>/,
      `<title>${org.name} - ${org.tagline}</title>`
    );
    fs.writeFileSync(indexPath, indexContent);
  }
  
  // Create custom Tailwind config
  const tailwindConfig = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: org.primaryColor,
          secondary: org.secondaryColor,
          accent: org.accentColor,
          [org.shortName.toLowerCase()]: {
            DEFAULT: org.primaryColor,
            dark: org.secondaryColor,
            light: org.accentColor
          }
        },
        screens: {
          'xs': '475px',
        },
        animation: {
          'fade-in': 'fadeIn 0.3s ease-in-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(-10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          }
        }
      },
    },
    plugins: [],
  };
  
  fs.writeFileSync(
    path.join(projectPath, 'tailwind.config.js'),
    `/** @type {import('tailwindcss').Config} */
export default ${JSON.stringify(tailwindConfig, null, 2)}`
  );
  
  // Customize components
  customizeComponents(projectPath, org);
  
  // Create placeholder logo
  createPlaceholderLogo(projectPath, org);
}

function customizeComponents(projectPath, org) {
  const componentsPath = path.join(projectPath, 'src/components');
  
  // Header component
  const headerPath = path.join(componentsPath, 'Header.jsx');
  if (fs.existsSync(headerPath)) {
    let headerContent = fs.readFileSync(headerPath, 'utf8');
    
    // Replace branding
    headerContent = headerContent
      .replace(/src="\/telecellogo\.png"/g, `src="/${org.logo}"`)
      .replace(/alt="Telecel Logo"/g, `alt="${org.shortName} Logo"`)
      .replace(/Telecel/g, org.shortName)
      .replace(/Staff & Student Bundles/g, org.tagline)
      .replace(/from-\[#E30613\] to-\[#CC050F\]/g, `from-[${org.primaryColor}] to-[${org.secondaryColor}]`)
      .replace(/hover:text-telecel-red/g, `hover:text-[${org.primaryColor}]`)
      .replace(/border-telecel-red/g, `border-[${org.primaryColor}]`)
      .replace(/text-telecel-red/g, `text-[${org.primaryColor}]`)
      .replace(/bg-\[#E30613\]/g, `bg-[${org.primaryColor}]`)
      .replace(/hover:bg-\[#CC050F\]/g, `hover:bg-[${org.secondaryColor}]`);
    
    fs.writeFileSync(headerPath, headerContent);
  }
  
  // Footer component
  const footerPath = path.join(componentsPath, 'Footer.jsx');
  if (fs.existsSync(footerPath)) {
    let footerContent = fs.readFileSync(footerPath, 'utf8');
    
    footerContent = footerContent
      .replace(/Telecel Help/g, `${org.shortName} Support`)
      .replace(/© \{year\} Telecel Ghana\. All rights reserved\./g, `© {new Date().getFullYear()} ${org.name}. All rights reserved.`)
      .replace(/hover:text-telecel-red/g, `hover:text-[${org.primaryColor}]`);
    
    fs.writeFileSync(footerPath, footerContent);
  }
  
  // Hero section
  const heroPath = path.join(componentsPath, 'HeroSection.jsx');
  if (fs.existsSync(heroPath)) {
    let heroContent = fs.readFileSync(heroPath, 'utf8');
    
    heroContent = heroContent
      .replace(/Staff & Student Bundle/g, `${org.shortName} ${org.tagline}`)
      .replace(/Exclusive Telecel bundles/g, org.description)
      .replace(/from-telecel-red\/60/g, `from-[${org.primaryColor}]/60`);
    
    fs.writeFileSync(heroPath, heroContent);
  }
  
  // Bundle form
  const bundlePath = path.join(componentsPath, 'BundleForm.jsx');
  if (fs.existsSync(bundlePath)) {
    let bundleContent = fs.readFileSync(bundlePath, 'utf8');
    
    bundleContent = bundleContent
      .replace(/Telecel/g, org.shortName)
      .replace(/bg-telecel-red/g, `bg-[${org.primaryColor}]`);
    
    fs.writeFileSync(bundlePath, bundleContent);
  }
}

function createPlaceholderLogo(projectPath, org) {
  // Create a simple SVG placeholder logo
  const svgLogo = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" fill="${org.primaryColor}" rx="8"/>
  <text x="20" y="25" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">${org.shortName}</text>
</svg>`;
  
  const logoPath = path.join(projectPath, 'public', org.logo);
  fs.writeFileSync(logoPath, svgLogo);
}

function copyFolderSync(src, dest, options = {}) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    // Skip excluded directories and files
    if (options.exclude && options.exclude.some(excluded => srcPath.includes(excluded))) {
      continue;
    }
    
    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath, options);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function installDependencies(projectPath) {
  console.log('📦 Installing dependencies...');
  try {
    process.chdir(projectPath);
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
  }
}

function createReadme(projectPath, org) {
  const readmeContent = `# ${org.name} - ${org.tagline}

${org.description}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`

## Deployment

This project is configured for deployment to Netlify, Vercel, or any static hosting service.

### Netlify Deployment
1. Connect your repository to Netlify
2. Set build command: \`npm run build\`
3. Set publish directory: \`dist\`
4. Deploy!

### Vercel Deployment
1. Install Vercel CLI: \`npm i -g vercel\`
2. Run: \`vercel\`
3. Follow the prompts

## Customization

### Colors
- Primary: ${org.primaryColor}
- Secondary: ${org.secondaryColor}
- Accent: ${org.accentColor}

### Logo
Replace \`public/${org.logo}\` with your organization's official logo.

## Features

- ✅ Mobile-responsive design
- ✅ Bundle purchasing system
- ✅ Student/staff ID verification
- ✅ Secure payment processing
- ✅ Real-time bundle activation
- ✅ Customer support integration

## Support

For technical support, contact the development team.
For bundle-related inquiries, contact ${org.shortName} support.

---

© ${new Date().getFullYear()} ${org.name}. All rights reserved.
`;

  fs.writeFileSync(path.join(projectPath, 'README.md'), readmeContent);
}

function main() {
  console.log('🚀 Creating 5 independent organization projects...\n');
  
  const currentDir = process.cwd();
  
  organizations.forEach((org, index) => {
    console.log(`\n${index + 1}. ${org.name}`);
    console.log('='.repeat(50));
    
    try {
      // Create project folder
      const projectPath = createProjectFolder(org);
      
      // Customize the project
      customizeProject(projectPath, org);
      
      // Create README
      createReadme(projectPath, org);
      
      console.log(`✅ ${org.shortName} project created successfully!`);
      console.log(`📍 Location: ${projectPath}`);
      
    } catch (error) {
      console.error(`❌ Error creating ${org.shortName} project:`, error.message);
    }
  });
  
  console.log('\n🎉 All 5 projects created successfully!');
  console.log('\n📋 Next Steps:');
  console.log('1. Navigate to each project folder');
  console.log('2. Run "npm install" to install dependencies');
  console.log('3. Customize logos and content as needed');
  console.log('4. Deploy each project independently');
  
  console.log('\n📁 Project Locations:');
  organizations.forEach(org => {
    console.log(`   - ../${org.folderName}/`);
  });
  
  // Return to original directory
  process.chdir(currentDir);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createProjectFolder, customizeProject };
