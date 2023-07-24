const ipcRender = require("electron").ipcRenderer

function handleFile(param){
    let file_input = document.getElementById("file-input")
    let files = file_input.files

    if (files.length == 0){
        alert("nebyly vybrány žádné .txt soubory")
        return;
    }

    let file = files[0]

    let result = confirm("vybrali jste " + file.name + ", je to OK?")
    if (!result){
        return
    }

    //read contents of file
    let reader = new FileReader()

    reader.onload = function(e){
        let content = e.target.result
        console.log(content)
        ipcRender.send("data", content)
    }
    reader.onerror = function(e){
        alert("něco se pokazilo")
    }

    reader.readAsText(file)
}

function loadData(){
    ipcRender.send("data-request", "")

    ipcRender.on("data-send", (event, data) => {
        
    })
}