const { app, BrowserWindow, ipcMain } = require('electron')
const ExcelJS = require('exceljs');

const url = require("url")
const path = require("path")

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
        this.window.loadURL(url.format({
            pathname: path.join(__dirname, this.path),
            protocol: "file:",
            slashes: true
        }))
    }
}

console.log(__dirname)

app.on("ready", () => {
    win1 = new ElectronWindow("./gui/menu.html", settings_menu)
})

ipcMain.on("data", (event, data) => {
    switch(data[1]){
        case "txt":
            content_data = data[0]
            break
        case "xlsx":
            //format xlsx to txt accepted file (comes as a json file)
            let json = data[0]

            let gen_str = ""
            for(let i = 0; i < json[0].length; i++){
                //line iterator
                gen_str += `${json[0][i]}: [`
                for(let i2 = 0; i2 < json.length - 1; i2++){
                    if(json[i2 + 1].length == 0){
                        continue
                    }
                    if(i2 == json.length - 2){
                        gen_str += `${json[i2 + 1][i]}`
                    }
                    else{
                        gen_str += `${json[i2 + 1][i]}, `
                    }
                }

                gen_str += `]\n`
            }

            content_data = gen_str

            break
        case "csv":
            //format csv to txt accepted file
            break
    }

    win1.window.close()
    win2 = new ElectronWindow("./gui/index.html", settings_main)
})

ipcMain.on("data-request", (event, data) => {
    event.reply("data-send", content_data)
})