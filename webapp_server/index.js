const express = require("express");   
const path = require('path');
const app = express();   

const apiKey = "";
const PORT = 3000;  
 
 
app.get("/" , (request,response) => { 
    response.sendFile(path.join(__dirname+'/html/index.html'));
}); 
 
 

 
app.listen(PORT,() => console.log(`Server listening on ${PORT}`));  

