const ipcRender = require("electron").ipcRenderer

var presentation_data
var n_presentations

//functions
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
        data_arr = data.split(",")
        presentation_data = data_arr
    })
}

function refresh_presentations(){
    if(presentation_data == undefined){
        return
    }

    n_presentations = Math.floor(presentation_data.length / 3)

    console.log(presentation_data)
    for(let i = 0; i < n_presentations; i++){
        //read presentations
        var pres_names = document.getElementsByClassName("name")
        var pres_authors = document.getElementsByClassName("author")
        var pres_times = document.getElementsByClassName("time")

        pres_names[i].innerHTML = presentation_data[i * 3]
        pres_authors[i].innerHTML = presentation_data[i * 3 + 1]
        pres_times[i].innerHTML = presentation_data[i * 3 + 2]
    }

}

function update_time(){
    let time_elem = document.getElementById("main-time")
    if(time_elem == undefined){
        return
    }

    //update main time
    let curr_date = new Date()

    let hours = curr_date.getHours().toString()
    let minutes = curr_date.getMinutes().toString()
    let seconds = curr_date.getSeconds().toString()

    hours = ((hours.length == 2) ? hours : "0" + hours)
    minutes = ((minutes.length == 2) ? minutes : "0" + minutes)
    seconds = ((seconds.length == 2) ? seconds : "0" + seconds)

    let curr_time = `${hours}:${minutes}:${seconds}`
    let curr_time_short = `${hours}:${minutes}`
    time_elem.innerText = `Čas: ${curr_time}`

    var timers = document.getElementsByClassName("timer")
    var times = document.getElementsByClassName("time")

    //update all progressbars
    for (let i = 0; i < n_presentations; i++){
        let time_end = times[i].innerHTML.slice(times[i].innerHTML.indexOf("-") + 1, times[i].innerHTML.length)
        
        let end_hours = parseInt(time_end.slice(0, 3))
        let end_minutes = parseInt(time_end.slice(5, 7))

        let curr_hours = parseInt(hours)
        let curr_minutes = parseInt(minutes)

        let m_diff = curr_hours * 60 + curr_minutes - end_hours * 60 + end_minutes

        let sub_time

        //now convert back to time string
        if (m_diff / 60 < 1){
            sub_time = `00:${m_diff}`
        }
        else{
            sub_time = `${Math.floor(m_diff / 60)}:${m_diff % 60}`
        }
        
        timers[i].innerHTML = `Zbývá: ${sub_time}`
    }
}

var i = 0;
function move() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}

//main code
setInterval(update_time, 1000)
setInterval(refresh_presentations, 1000)