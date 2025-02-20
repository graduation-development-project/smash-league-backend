const glob = require('glob');
const fs = require('fs-extra');

async function copyTemplates() {
  try {
    const files = await glob.glob('src/infrastructure/templates/**/*.hbs');

    files.forEach(file => {
      const dest = file.replace('src/infrastructure/', 'dist/src/infrastructure/');
      fs.copySync(file, dest);
    });

    console.log('Handlebars files copied successfully!');
  } catch (error) {
    console.error('Error copying files:', error);
  }
}

copyTemplates();
