const express = require("express");   
const path = require('path');
const csvtojson = require('csvtojson');
const fs = require('fs');  
require('dotenv').config({ path: path.join(__dirname+'/secret.env') });
const csvfilepaths= ["security_logs.csv","people_data.csv","location_data.csv"]
const app = express();   
const apiKey = process.env.APIKEY; 
const PORT = 3000;

app.use(express.static("mapvis"))

app.get("/socialmap", (req,res) => {
    res.sendFile(path.join(__dirname+'/mapvis/index.html'))
})
 
app.get("/campusmap" , (request,response) => { 
    response.sendFile(path.join(__dirname+'/html/campusmap.html'));
});   
 
app.get("/getlocations" , (request, response) => {  
    fs.readFile(path.join(__dirname+"/json_files/location_data.json"), "utf8", (error, jsonString) => {
        if (error) {
          console.log("File read failed:", error);
          return;
        }
        response.json(jsonString);
      }); 
    }); 
      
     
app.get("/gettime" , (request , response) => {   
    let minutesStart = request.query.minutesStart;
    let hoursStart = request.query.hoursStart; 
    let end = parseInt(hoursStart+minutesStart);
    let minutesEnd = request.query.minutesEnd;
    let hoursEnd = request.query.hoursEnd;  
    let start = parseInt(hoursEnd + minutesEnd); 
    let building = request.query.building;
    let results = [];   
    
    fs.readFile(path.join(__dirname+"/json_files/security_logs.json"), "utf8", (error, jsonString) => {
        if (error) {
          console.log("File read failed:", error);
          return;
        } else {    
            jsonString = JSON.parse(jsonString);  
            for (i = 0 ; i < jsonString.length ; i++) { 
                let time = jsonString[i].Time.split("-"); 
                let timeStart = parseInt(time[0]); 
                let timeEnd = parseInt(time[1]);     
                if (timeEnd > 2359) { 
                    timeEnd = 2359 + timeEnd;
                } 
 
                if ( ((start <= timeStart && timeStart <= end) || (start <= timeEnd && timeEnd <= end) || (start <= timeStart && timeStart <= end &&timeEnd >=start && timeEnd <= end) || (timeStart <= start && timeEnd >= end)) && jsonString[i].Location == building) { 
                    let person = { 
                        timeStart : timeStart,
                        timeEnd : timeEnd, 
                        name : jsonString[i].Name, 
                        location : jsonString[i].Location,  
                        age : jsonString[i].Age, 
                        gender : jsonString[i].Gender, 
                        subject : jsonString[i].Subject, 
                        height : jsonString[i].Height 

                    } 
                    results.push(person);
                }

            }  
            response.json(JSON.stringify(results));
        }
      }); 
    }); 
     


    
 
app.listen(PORT,() => {   
    jsonfiles=[]
    for (let i = 0; i < csvfilepaths.length; i++){
        jsonfiles[i]=csvfilepaths[i].replace(".csv",".json")
        csvtojson()
        .fromFile("csv_files/".concat(csvfilepaths[i]))
        .then((json) =>{
            fs.writeFileSync("json_files/".concat(jsonfiles[i]),JSON.stringify(json),"utf-8",(err)=>{
                if(err) console.log(err)
            }) 
        })
    }  
     

    console.log(`Server listening on ${PORT}`)
});  

