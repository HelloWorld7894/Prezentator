const { app, BrowserWindow, ipcMain } = require('electron')

var win1, win2
var content_data

const settings_menu = {
    width: 800,
    height: 600,
    title: "Prezentator",
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    },
    resizable: false
}

const settings_main = {
    width: 1920,
    height: 1080,
    title: "Prezentator - Main",
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    },
    resizable: true
}

class ElectronWindow{
    constructor(path, settings){
        this.path = path
        this.settings = settings
        this.set_window()
    }

    set_window(){
        this.window = new BrowserWindow(this.settings)
        this.window.setMenu(null)
        this.window.webContents.openDevTools()
        this.window.loadFile(this.path)
    }
}

app.on("ready", () => {
    win1 = new ElectronWindow("./gui/menu.html", settings_menu)
})

ipcMain.on("data", (event, data) => {
    content_data = data
    win1.window.close()

    win2 = new ElectronWindow("./gui/index.html", settings_main)
})

ipcMain.on("data-request", (event, data) => {
    event.reply("data-send", content_data)
})