const ipcRender = require("electron").ipcRenderer
const XLSX = require("xlsx")

var presentation_data
var n_presentation_rooms = 4 //TODO: make this configurable
var presentation_rooms = []
var PRESENTATION_MAX_LENGTH = 90//in minutes

var room_iterators = [0, 0, 0, 0]

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

    let extension = file.name.split('.').pop();

    //read contents of file
    let reader = new FileReader()
    reader.onerror = function(e){
        alert("něco se pokazilo")
    }

    if (extension == "txt" || extension == "csv"){

        reader.onload = function(e){
            let content = e.target.result
            console.log(content)
            ipcRender.send("data", [content, extension])
        }

        reader.readAsText(file)
    }
    else if (extension == "xlsx"){
        reader.onload = function (e) {
            let data = e.target.result;
            let workbook = XLSX.read(data, { type: "binary" });
            let sheetName = workbook.SheetNames[0];
            let worksheet = workbook.Sheets[sheetName];
            let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
            // Now you can work with jsonData, which contains the Excel data as an array of objects.
            console.log(jsonData);
            ipcRender.send("data", [jsonData, extension])
        };

        reader.readAsBinaryString(file)
    }
}

function loadData(){
    ipcRender.send("data-request", "")

    ipcRender.on("data-send", (event, data) => {
        console.log(data)

        const arrays = data.split('\n').map(line => {
            const matches = line.match(/\[(.*?)\]/g);
            if (matches) {
              return matches.map(match => {
                const items = match.slice(1, -1).split(', ').map(item => item.trim());
                const result = [];
                for (let i = 0; i < items.length; i += 3) {
                  result.push({
                    title: items[i],
                    name: items[i + 1],
                    time: items[i + 2],
                  });
                }
                return result;
              });
            }
            return [];
          });          
        presentation_data = arrays

        let preprocess = data.split("\n")
        for(let i = 0; i < preprocess.length; i++){
            presentation_rooms.push(preprocess[i])
        }

        //update room labels
        let rooms = document.getElementsByClassName("room")
        for(let i = 0; i < presentation_rooms.length; i++){

            let idx = presentation_rooms[i].indexOf(":")
            let str = presentation_rooms[i].substring(0, idx)

            rooms[i].innerHTML = str
        }
    })
}

function ConvertStringIntoTime(TimeString){
    const TimeParts = TimeString.split(':');
    const Time = new Date();
    Time.setHours(parseInt(TimeParts[0], 10));
    Time.setMinutes(parseInt(TimeParts[1], 10));
    Time.setSeconds(0); //TODO: check

    return Time
}

function refresh_presentations(){
    if(presentation_data == undefined){
        return
    }

    console.log(room_iterators)
    
    for(let i = 0; i < n_presentation_rooms; i++){

        //read presentations
        var pres_names = document.getElementsByClassName("name")
        var pres_authors = document.getElementsByClassName("author")
        var pres_times = document.getElementsByClassName("time")
        var pres_divs = document.getElementsByClassName("presentation")

        //check if presentations ended
        if (room_iterators[i] == presentation_data[i][0].length){ //there is no more presentations in spec_room
            room_iterators[i] = 0 //reset
            
            pres_divs[i].innerHTML = ""
            
        }
        else if (pres_names[i] != undefined){
            pres_names[i].innerHTML = presentation_data[i][0][room_iterators[i]].title
            pres_authors[i].innerHTML = presentation_data[i][0][room_iterators[i]].name
            pres_times[i].innerHTML = presentation_data[i][0][room_iterators[i]].time
        }
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
    var progress = document.getElementsByClassName("myBar")

    for (let i = 0; i < n_presentation_rooms; i++){

        if(times[i] == undefined){
            continue
        }

        let string_end = times[i].innerHTML.slice(times[i].innerHTML.indexOf("-") + 1, times[i].innerHTML.length)
        let string_start = times[i].innerHTML.slice(0, 6)

        let time_end = ConvertStringIntoTime(string_end)
        let time_start = ConvertStringIntoTime(string_start)
        let time_curr = new Date()

        let pres_len = time_end - time_start
        let diff = time_end - time_curr
        
        let minutes_diff = Math.round(diff / 60000);
        let minutes_length = Math.round(pres_len / 60000)
        
        let min_diff = Math.round(minutes_diff % 60)
        let hour_diff = Math.floor(minutes_diff / 60)

        let min_diff_str = `${min_diff}`
        if (min_diff_str.length == 1){
            min_diff_str = `0${min_diff}`
        }

        //now convert back to time string
        if (hour_diff == 0){
            sub_time = `00:${min_diff_str}`
        }
        else{
            sub_time = `${hour_diff}:${min_diff_str}`
        }

        console.log(sub_time)

        //check if presentation ended (I had to add so many conditions because sometimes, this apps behaves in a broken way)
        if (sub_time == "00:00" || min_diff < 0 || hour_diff < 0 || (hour_diff * 60 + min_diff > PRESENTATION_MAX_LENGTH)){
            room_iterators[i] += 1 //increment
        }
        else{
            //update time_diff
            timers[i].innerHTML = `Zbývá: ${sub_time}`


            //update all progressbars
            let infill = (1 - (minutes_diff / minutes_length)).toFixed(2)
            progress[i].style.width = (infill * 100) + "%"
        }
    }
}

//main code
setInterval(refresh_presentations, 1000)
setInterval(update_time, 1000)