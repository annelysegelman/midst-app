const assert = require(process.env['HOME'] + '/.config/yarn/global/node_modules/assert')

module.exports = async function(app) {

    // Main window opens.
    const isVisible = await app.browserWindow.isVisible()
    assert.equal(isVisible, true)

    // Main window has the correct title.
    const title = await app.client.getTitle()
    assert.equal(title, 'Midst App')

}
