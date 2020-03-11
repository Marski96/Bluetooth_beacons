var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyparser = require('body-parser');
var ip = require("ip");
app.use(bodyparser.json());
const cors = require('cors');
const http = require("http");
app.use(cors());




//##############This is the database connection part##############

//Connection config
const db = mysql.createConnection({
  host     : '172.28.170.116',
  user     : 'connect',
  password : 'test',
  database : 'bt_beacons',
});

// Connect to database
db.connect((err) => {
  if(err){
      throw err;
  }
  console.log('\nConnection established with the database');
});

//#################################################################

//Server is listening here
var server = app.listen(4000, function() {
  var host = ip.address()
  var port = server.address().port
  console.log('\nBackend-service is running at http://' + host + ':' + port)
})



//SQL queries//






//GET beacon_info from DB
app.get('/beacon_info', function(req, res) {

  db.query('SELECT * FROM beacon_info', (err, rows, fields) => {
    
    if(!err) {
    console.log(rows, "\n Rows fetched from the database")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(rows)
    }

    else {
    console.log(err)
    res.send(err)
    }
  })
  
});

//GET receiver_info from DB
app.get('/receiver_info', function(req, res) {
  db.query('SELECT * FROM receiver_info', (err, rows, fields) => {

    if(!err) {
      console.log(rows, "\n Rows fetched from the database")
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(rows)
    }

    else {
      console.log(err)
      res.send(err)
    }
  })
});

//GET Last 50 beacon_detections from DB
app.get('/beacon_detections', function(req, res) {
  
  db.query('SELECT * FROM beacon_detections ORDER BY measument_time DESC limit 50;', (err, rows, fields) => {

    if(!err) {
      console.log(rows, "\n Rows fetched from the database")
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(rows)
      socket.on("disconnect", () => console.log("Client disconnected"));
    }

    else {
      console.log(err)
      res.send(err)
    }
  })
});

app.get('/beacon_locations', function(req, res){

  db.query('(SELECT d.receiver_id, i.beacon_user, d.signal_db, d.measument_time FROM beacon_detections d JOIN beacon_info i ON (d.beacon_id = i.beacon_id) WHERE d.beacon_id = "e2:e3:23:d1:b0:54" ORDER BY measument_time DESC limit 1)\
   UNION (SELECT d.receiver_id, i.beacon_user, d.signal_db, d.measument_time FROM beacon_detections d JOIN beacon_info i ON (d.beacon_id = i.beacon_id) WHERE d.beacon_id = "d6:2c:ca:c0:d4:9c" ORDER BY measument_time DESC limit 1)\
    UNION (SELECT d.receiver_id, i.beacon_user, d.signal_db, d.measument_time FROM beacon_detections d JOIN beacon_info i ON (d.beacon_id = i.beacon_id) WHERE d.beacon_id = "f2:36:00:21:c0:50" ORDER BY measument_time DESC limit 1);', (err, rows, fields) =>{
    if (!err){
      console.log(rows, "\n Rows fetched from the databese")
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(rows)
    }
    else{
      console.log(err)
      res.send(err)
    }
  })


});

app.get('/delete/:id', function(req, res) {
  let id = req.params.id;

  db.query('DELETE FROM beacon_info WHERE beacon_id = ?', [id], function (error, result) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(result)
  })
})

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads')
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname)
  }
})
const upload = multer({ storage: storage });


app.post('/new_beacon', upload.none(), function(req,res) {
  
  console.log(req.body);
  db.query('INSERT INTO beacon_info (beacon_user, beacon_id) VALUES (?,?)',
  [req.body.user, req.body.id], function(error, result, fields) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(result)
  })
})



//socketio



app.get('/*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
//new connection named socket
var io = require('socket.io').listen(server);
io.on("connection", socket => {
    console.log("New client connected");

    //data we send named 'data'
    socket.on("beacon_location", (data)=>{
        //emit&broadcast   num to help ease logging, sub to 'outgoing data' topic
       socket.broadcast.emit("beacon_location_data", {num: data});
    });

    socket.on("beacon_info", (data)=>{
      //emit&broadcast   num to help ease logging, sub to 'outgoing data' topic
     socket.broadcast.emit("beacon_info_data", {num: data});
  });

    socket.on("beacon_detections", (data)=>{
      //emit&broadcast   num to help ease logging, sub to 'outgoing data' topic
    socket.broadcast.emit("beacon_detections_data", {num: data});
  });

    socket.on("receiver_info", (data)=>{
      //emit&broadcast   num to help ease logging, sub to 'outgoing data' topic
    socket.broadcast.emit("receiver_info_data", {num: data});
  });

    //disconnection log
    socket.on("disconnect", () => console.log("Client disconnected"));
});

let socket = require('socket.io-client')('http://127.0.0.1:4000');

let info = 
//data here
setInterval(function () {
    
  db.query('(SELECT d.receiver_id, i.beacon_user, d.signal_db, d.measument_time, f.receiver_location \
    FROM beacon_detections d \
    JOIN receiver_info f ON (f.receiver_id = d.receiver_id) \
    JOIN beacon_info i ON (d.beacon_id = i.beacon_id) \
    WHERE d.beacon_id = "e2:e3:23:d1:b0:54" \
    ORDER BY measument_time DESC limit 1)\
    UNION ( \
    SELECT d.receiver_id, i.beacon_user, d.signal_db, d.measument_time, f.receiver_location \
    FROM beacon_detections d \
    JOIN receiver_info f ON (f.receiver_id = d.receiver_id) \
    JOIN beacon_info i ON (d.beacon_id = i.beacon_id) \
    WHERE d.beacon_id = "d6:2c:ca:c0:d4:9c" \
    ORDER BY measument_time DESC limit 1)\
    UNION ( \
    SELECT d.receiver_id, i.beacon_user, d.signal_db, d.measument_time, f.receiver_location \
    FROM beacon_detections d \
    JOIN receiver_info f ON (f.receiver_id = d.receiver_id) \
    JOIN beacon_info i ON (d.beacon_id = i.beacon_id) \
    WHERE d.beacon_id = "f2:36:00:21:c0:50" \
     ORDER BY measument_time DESC limit 1);', (err, rows, fields) => {
    socket.emit('beacon_location', rows);}, 1000);
    
  db.query('SELECT * FROM beacon_info', (err, rows, fields) => {
    socket.emit('beacon_info', rows);}, 1000);

  db.query('SELECT * FROM beacon_detections ORDER BY measument_time DESC limit 50;', (err, rows, fields) => {
    socket.emit('beacon_detections', rows);}, 1000);
    
  db.query('SELECT * FROM receiver_info', (err, rows, fields) => {
    socket.emit('receiver_info', rows);}, 1000);
})

})