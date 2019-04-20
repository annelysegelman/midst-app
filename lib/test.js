const { Application } = require(process.env['HOME'] + '/.config/yarn/global/node_modules/spectron')
const { electronPath } = require('./build')
const { readdirSync } = require('fs')

const app = new Application({
    path: __dirname + '/../' + electronPath + '/Contents/MacOS/Midst',
})

const testPattern = /\.test\.js$/

async function runTests() {
    const testFiles = readdirSync(__dirname + '/../test')

    for (const testFile of testFiles) {
        if (testPattern.test(testFile)) {
            await app.start()

            try {
                await require(__dirname + '/../test/' + testFile)(app)
                console.log('Passed! ' + testFile)
            }

            catch(err) {
                console.log('Failed! ' + testFile)
                console.log('Why? ' + err)
            }

            finally {
                app.stop()
            }
        }
    }
}

module.exports = { runTests }
