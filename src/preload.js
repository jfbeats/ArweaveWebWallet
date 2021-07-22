const electron = require('electron')
const { remote, shell, ipcRenderer } = electron

const { Titlebar, Color } = require('custom-electron-titlebar')

const log = require('electron-log')
log.transports.console.level = false

const moment = require('moment')
const GitHub = require('github-api')
const showdown = require('showdown')

window.app = remote.app
window.shell = shell
window.ipcRenderer = ipcRenderer

window.log = log

window.moment = moment
window.moment.locale(window.app.getLocale())

window.github = new GitHub()

showdown.setFlavor('github')
window.mdConverter = new showdown.Converter()

window.addEventListener('DOMContentLoaded', () => {
  window.titlebar = new Titlebar({
    backgroundColor: Color.fromHex(process.env.VUE_APP_BACKGROUND),
    icon: 'build/icons/icon.ico'
  })
})