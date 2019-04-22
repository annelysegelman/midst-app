const { existsSync, lstatSync, readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

const filesThatShouldExist = [
    'bin/build.js',
    'bin/cleanup.js',
    'bin/install.js',
    'bin/test.js',
    'lib/build.js',
    'lib/plist.js',
    'lib/test.js',
    'src/App.js',
    'src/append-style.js',
    'src/Drop.js',
    'src/index.html',
    'src/index.js',
    'src/jquery.js',
    'src/lodash.js',
    'src/mouse-position.js',
    'src/react.development.js',
    'src/react-dom.development.js',
    'src/react.production.min.js',
    'src/react-dom.production.min.js',
    'src/Slider.js',
    'src/style.css',
    'test/basic-app.test.js',
    '.gitignore',
    'README.md',
    'VERSION',
]

for (const file of filesThatShouldExist) {
    if (!existsSync(join(__dirname, '..', file))) {
        console.error('File does not exist:' + file + '.')
        process.exit(0)
    }
}

console.log('All good.')
