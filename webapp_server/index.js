const express = require("express");   
const path = require('path');
const csvtojson = require('csvtojson');
const fs = require('fs');  
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

