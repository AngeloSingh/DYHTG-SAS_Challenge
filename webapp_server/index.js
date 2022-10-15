const express = require("express");   
const path = require('path');
//require csvtojson
const csvtojson = require('csvtojson')
//add file csv file names here and put the files in the "csv_files" folder
const csvfilepaths= ["security_logs.csv","people_data.csv","location_data.csv"]
const fs = require('fs')

const app = express();   

const apiKey = "";
const PORT = 3000;  


 
app.get("/" , (request,response) => { 
    response.sendFile(path.join(__dirname+'/html/index.html'));
}); 

//Reads data from csv files and converts them to json files and will be stored in json_files folder
//checking commit account

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
 

 
app.listen(PORT,() => console.log(`Server listening on ${PORT}`));  

