const express = require("express");   
const path = require('path');
const csvtojson = require('csvtojson');
const fs = require('fs');  
const { timeEnd } = require("console");
require('dotenv').config({ path: path.join(__dirname+'/secret.env') });
const csvfilepaths= ["security_logs.csv","people_data.csv","location_data.csv"]
const app = express();   
const apiKey = process.env.APIKEY; 
const PORT = 3000;   
 
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
    console.log("getting time");  
    console.log(request.query); 
    let minutesStart = request.query.minutesStart;
    let hoursStart = request.query.hoursStart; 
    let start = parseInt(hoursStart+minutesStart);
    let minutesEnd = request.query.minutesEnd;
    let hoursEnd = request.query.hoursEnd;  
    let end = parseInt(hoursEnd + minutesEnd); 
    let building = request.query.building;
    let results = [];   
     
    console.log(building)
    
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
                
                if ( ((end <= timeStart && timeStart <= start ) || (end <= timeEnd && timeEnd <=start)) && jsonString[i].Location == building) { 
                    let person = { 
                        timeStart : timeStart,
                        timeEnd : timeEnd, 
                        name : jsonString[i].Name, 
                        location : jsonString[i].Location, 
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

