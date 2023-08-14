const express = require('express');
const logger = require('morgan');
const path = require('path');
const fs = require('fs');
const { initialize_db_connection, set_lamp, get_lamp } = require('./db')
const { USERNAME, PASSWORD } = require('./.credentials.json');


// var logger = initial_logger();
// logger = change_logger_label(logger, "TV_CREATE_ACC_API");

// const router = require("./routes")
const app = express();
var dbo;

(async () => {
  dbo = await initialize_db_connection();
})()

if((process.argv.slice(2)).length>1){
  console.log("\x1b[31m%s\x1b[0m", "Please enter only a port or leave blank to use port 80") // red
  process.exit();
}
if(process.argv.slice(2)[0]){
  var PORT = process.argv.slice(2)[0];
}
else{
  var PORT = 8000;
}

var browsers_dict = [];

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// Endpoint for verifying email
app.get('/set_room_lamp', async (req, res) => {
  try{
    if(!(USERNAME == req.query.username && PASSWORD == req.query.password)){
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const result = await set_lamp(dbo, req.query.id, req.query.value);
    return res.send({'data': result});
  }
  catch(err){
    console.log(err)
    return res.status(500).json({'data': {}, 'message': 'Something went wrong', 'error': err.message});
  }
});
app.get('/get_room_lamp', async (req, res) => {
  try{
    if(!(USERNAME == req.query.username && PASSWORD == req.query.password)){
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const result = await get_lamp(dbo, req.query.id);
    return res.send(result);
  }
  catch(err){
    console.log(err)
    return res.status(500).json({'data': {}, 'message': 'Something went wrong', 'error': err.message});
  }
});

app.listen(PORT, () => console.log(`API IS RUNNING ON PORT: ${PORT}`));