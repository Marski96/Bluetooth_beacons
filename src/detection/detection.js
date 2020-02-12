const express = require('express');
const mysql = require('mysql');
var alert = require('alert-node');
const bodyparser = require('body-parser');

var app = express();

app.use(bodyparser.json());

//Connection config
const db = mysql.createConnection({
  host     : '172.28.170.116',
  user     : 'connect',
  password : 'test',
  database : 'bt_beacons',
});

//App, listen this port
app.listen(4001,()=>console.log('Service is running at port no : 4001'));

// Connect to database
db.connect((err) => {
  if(err){
      throw err;
  }
  console.log('Connection established with the database');
});

//Write instructions to / -page
app.get('/', (req, res) => {
    function writeInstructions() {
        res.send(
        'Endpoints:<br /><br /> \
        GET all detections -> /detections/all')
        
    }
    writeInstructions()
});

//GET all detections
app.get('/detections/all',(req,res)=>{
    function calcSignal() {

    db.query(
        '\
        SELECT * \
        FROM beacon_detections where signal_db > "-50" \
        order by measument_time desc limit 10 \
        ',

        (err, rows, fields)=>
    {
        
        console.log(err)
        console.log('true >', rows)
        
    })
    //beacon_detections.signal_db < '-50' 
    db.query(
        '\
        SELECT DISTINCT beacon_detections.beacon_id, beacon_detections.signal_db, beacon_detections.measument_time, receiver_info.receiver_location, receiver_info.location_type \
        FROM beacon_detections \
            INNER JOIN receiver_info on beacon_detections.receiver_id = receiver_info.receiver_id \
        where beacon_detections.beacon_id = "e2:18:git ef:c9:66:f4" \
        ORDER BY beacon_detections.measument_time DESC \
        LIMIT 10 \
        ', 
        
        (err, rows, fields)=>
   {
       
       console.log(err)
            console.log('testing ---- device id:  ' + rows[0].beacon_id, rows)

        alert(
            rows[0].beacon_id + '\n' + 
            rows[0].receiver_location + '\n' + 
            rows[0].location_type + '\n' + 
            rows[0].signal_db + 
            '\nsignal over 50dB')
        
    })

    //device id found in room where location type is color ... signal:_db is this..




}setInterval(calcSignal,1000);
//todo: if signal is weakening from c area and is increasing in D area then alert.
// Ignore signal dB from allowed areas?



});