const express = require('express');
const app = express();
const alert = require('alert-node');
const bodyparser = require('body-parser');
app.use(bodyparser.json());
const database = require('../database/connect_to_db');
const queries = require('../database/queries');
const alerting = require('../detection/alerts');
const multer = require('multer');
const socketServer = require('../socketio/socketio');
const moment = require('moment');
const checkCurrentTime = require('./checkCurrentTime')
const fetch = require("node-fetch");
//This is the backend -code which is required to run with front-end.
//Component handles all the end-point requests and database queries.

//App, listen this port
socketServer.start()
expressPort = 4000;
var server = app.listen(expressPort,()=>console.log('Express is running at port no : ' + expressPort));

    //Write instructions to '/' -page
    app.get('/', (req, res) => {
        function writeInstructions() {
            res.send(
            'GET beacon info -> /beacon_info' + '\n' +
            'GET receiver info -> /receiver_info' + '\n' +
            'GET last 50 beacon detections -> /beacon_detections' + '\n' +
            'GET wristlet 1 detections -> /detections/ranneke1' + '\n' +
            'GET wristlet 1 detections -> /detections/ranneke2' + '\n' +
            'GET wristlet 1 detections -> /detections/ranneke3' + '\n' +
            'GET wristlet 1 detections -> /detections/ranneke4' + '\n' +
            'DELETE a wristled by id -> /delete/(id_here)' + '\n'
            )
        }
        writeInstructions()
    });

    //GET beacon_info from the database
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

    //GET receiver_info from the database
    app.get('/receiver_info', function(req, res) {

        db.query(global.GET_receiver_info, (err, rows, fields) => {
    
        if(!err) {
            console.log(rows, "\n Rows fetched from the database")
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(rows)

            checkCurrentTime.CurrentTime()

        }
    
        else {
            console.log(err)
            res.send(err)
        }
        })
    });


    //GET Last 50 beacon_detections from the database
    app.get('/beacon_detections', function(req, res) {

        db.query(global.GET_last_beacon_detections, (err, rows, fields) => {
    
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

app.get('/beacon_locations', function(req, res){

    db.query(global.GET_beacon_locations, (err, rows, fields) => {
        
        if (!err){
           // console.log(rows, "\n Rows fetched from the databese")
            res.setHeader('Access-Control-Allow-Origin', '*');

            //Get latest packet's timediff and use it as "seconds ago"
            let rawTimeDiff1 = rows[2].Timediff
            let Receiver1_timediff = rawTimeDiff1.split(':');
            let Receiver1_seconds = (+Receiver1_timediff[0]) * 60 * 60 + (Receiver1_timediff[1]) * 60 + (+Receiver1_timediff[2]);

            let rawTimeDiff2 = rows[5].Timediff
            let Receiver2_timediff = rawTimeDiff2.split(':');
            let Receiver2_seconds = (+Receiver2_timediff[0]) * 60 * 60 + (Receiver2_timediff[1]) * 60 + (+Receiver2_timediff[2]);

            let rawTimeDiff3 = rows[8].Timediff
            let Receiver3_timediff = rawTimeDiff3.split(':');
            let Receiver3_seconds = (+Receiver3_timediff[0]) * 60 * 60 + (Receiver3_timediff[1]) * 60 + (+Receiver3_timediff[2])

            let rawTimeDiff4 = rows[11].Timediff
            let Receiver4_timediff = rawTimeDiff4.split(':');
            let Receiver4_seconds = (+Receiver4_timediff[0]) * 60 * 60 + (Receiver4_timediff[1]) * 60 + (+Receiver4_timediff[2]);

                //Calculate the average signal db
                Receiver1_AVG = (Math.round(rows[0].signal_db + rows[1].signal_db + rows[2].signal_db) / 3).toFixed(0);
                Receiver2_AVG = (Math.round(rows[3].signal_db + rows[4].signal_db + rows[5].signal_db) / 3).toFixed(0);
                Receiver3_AVG = (Math.round(rows[6].signal_db + rows[7].signal_db + rows[8].signal_db) / 3).toFixed(0);
                Receiver4_AVG = (Math.round(rows[9].signal_db + rows[10].signal_db + rows[11].signal_db) / 3).toFixed(0);
               /*
                console.log('Averages from receivers:\n' + 
                            'Receiver1: ' + Receiver1_AVG + '\n' +
                            'Receiver2: ' + Receiver2_AVG + '\n' +
                            'Receiver3: ' + Receiver3_AVG + '\n' +
                            'Receiver4: ' + Receiver4_AVG
                            );
              */

            //Add data to json
            //TODO: Add loop here
            rows[0].average_signal_db = Receiver1_AVG;
            rows[1].average_signal_db = Receiver1_AVG;
            rows[2].average_signal_db = Receiver1_AVG;
            rows[2].timediff_in_seconds = Receiver1_seconds;


            rows[3].average_signal_db = Receiver2_AVG;
            rows[4].average_signal_db = Receiver2_AVG;
            rows[5].average_signal_db = Receiver2_AVG;
            rows[5].timediff_in_seconds = Receiver2_seconds;

            rows[6].average_signal_db = Receiver3_AVG;
            rows[7].average_signal_db = Receiver3_AVG;
            rows[8].average_signal_db = Receiver3_AVG;
            rows[8].timediff_in_seconds = Receiver3_seconds;

            rows[9].average_signal_db = Receiver4_AVG;
            rows[10].average_signal_db = Receiver4_AVG;
            rows[11].average_signal_db = Receiver4_AVG;
            rows[11].timediff_in_seconds = Receiver4_seconds;
            
            res.json(rows);
            
           
        }
        else{
            console.log(err)
            res.send(err)
        }
    })


});

app.get('/beacon_locations_average', function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    const url = "http://localhost:4000/beacon_locations";
    let averageData = [];
    const getData = async url => {
        try {
          const res = await fetch(url);
          const json = await res.json();
         
          if (json[0].signal_db> json[1].signal_db && json[0].signal_db > json[2].signal_db) {
           // console.log(json[0])
            averageData.push(json[0])
            
        }
        else if (json[1].signal_db> json[0].signal_db && json[1].signal_db > json[2].signal_db) {
           // console.log(json[1])
            averageData.push(json[1])
            
        }
        else if (json[2].signal_db> json[1].signal_db && json[2].signal_db > json[0].signal_db) {
            //console.log(json[2])
            averageData.push(json[2])
            
        }

         if (json[3].signal_db> json[4].signal_db && json[3].signal_db > json[5].signal_db) {
           //console.log(json[3])
            averageData.push(json[3])
            
        } else if (json[4].signal_db> json[3].signal_db && json[4].signal_db > json[5].signal_db) {
            //console.log(json[4])
            averageData.push(json[4])
         

        } else if (json[5].signal_db> json[3].signal_db && json[5].signal_db > json[4].signal_db) {
            //console.log(json[5])
            averageData.push(json[5])
          

        }

         if (json[6].signal_db> json[7].signal_db && json[6].signal_db > json[8].signal_db) {
            //console.log(json[6])
            averageData.push(json[6])
           

        } else if (json[7].signal_db> json[6].signal_db && json[7].signal_db > json[8].signal_db) {
          //  console.log(json[7])
            averageData.push(json[7])
            

        } else if (json[8].signal_db> json[7].signal_db && json[8].signal_db > json[7].signal_db) {
           // console.log(json[8])
            averageData.push(json[8])
            

        }

        if (json[9].signal_db> json[10].signal_db && json[9].signal_db > json[11].signal_db) {
          // console.log(json[9])
           averageData.push(json[9])
            

        } else if (json[10].signal_db> json[9].signal_db && json[10].signal_db > json[9].signal_db) {
           // console.log(json[10])
            averageData.push(json[10])
           

        } else if (json[11].signal_db> json[10].signal_db && json[11].signal_db > json[9].signal_db) {
            //console.log(json[11])
            averageData.push(json[11])
           
        }
      

        
        } catch (error) {
          console.log(error);
        }
        await res.json(averageData);
 
        //console.log("average data below")
        console.log(averageData.length);
        //console.log(averageData);
      

      };
      
      
      getData(url);
});


    //delete beacon with it's id
    app.get('/delete/:id', function(req, res) {
        let id = req.params.id;
      
        db.query(global_DELETE_beacon, [id], function (error, result) {
      
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.send(result)
        })
    })

    //This essential part of add functionality
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
          callback(null, './uploads')
        },
        filename: function (req, file, callback) {
          callback(null, file.originalname)
        }
      })
      const upload = multer({ storage: storage });

    //Add new beacon
      app.post('/new_beacon', upload.none(), function(req,res) {
  
        console.log(req.body);
        db.query('INSERT INTO beacon_info (beacon_user, beacon_id) VALUES (?,?)',
        [req.body.user, req.body.id], function(error, result, fields) {
      
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.send(result)
        })
    })

    //GET ranneke1 avg detections
   app.get('/detections/ranneke1',(req,res)=>{
    function avg_ranneke1() {

        db.query(

            global.GET_detections_ranneke1,

            (err, rows, fields)=> {

                if(!err) {
                    if(rows[0].AVG_Receiver1_Ranneke1 == null) {
                        rows[0].AVG_Receiver1_Ranneke1 = -999;
                    }

                    if(rows[0].AVG_Receiver2_Ranneke1 == null) {
                        rows[0].AVG_Receiver2_Ranneke1 = -999;
                    }

                    if(rows[0].AVG_Receiver3_Ranneke1 == null) {
                        rows[0].AVG_Receiver3_Ranneke1 = -999;
                    }

                    let Timestamp = checkCurrentTime.CurrentTime()
                    //console.log(rows)

                //check which signal is strongest and print the receiver which had the highest value
                    if (rows[0].AVG_Receiver1_Ranneke1 > rows[0].AVG_Receiver2_Ranneke1 && rows[0].AVG_Receiver1_Ranneke1 > rows[0].AVG_Receiver3_Ranneke1) {
                        console.log("RECEIVER1 VAHVIN")
                    }
                    else if (rows[0].AVG_Receiver2_Ranneke1 > rows[0].AVG_Receiver1_Ranneke1 && rows[0].AVG_Receiver2_Ranneke1 > rows[0].AVG_Receiver3_Ranneke1) {
                        console.log("RECEIVER2 VAHVIN")
                    }
                    else if (rows[0].AVG_Receiver3_Ranneke1 > rows[0].AVG_Receiver2_Ranneke1 && rows[0].AVG_Receiver3_Ranneke1 > rows[0].AVG_Receiver1_Ranneke2) {
                        console.log("RECEIVER3 VAHVIN")
                    }    
            }
        
            else {
              console.log(err)
            }                
        })
        }setInterval(avg_ranneke1, 1000);
});

    //GET ranneke2 detections
    app.get('/detections/ranneke2',(req,res)=>{
        function avg_ranneke2() {

            db.query(

                global.GET_detections_ranneke2,

                (err, rows, fields)=> {
                
                    if(!err) {
                        if(rows[0].AVG_Receiver1_Ranneke2 == null) {
                            rows[0].AVG_Receiver1_Ranneke2 = -999;
                        }
    
                        if(rows[0].AVG_Receiver2_Ranneke2 == null) {
                            rows[0].AVG_Receiver2_Ranneke2 = -999;
                        }
    
                        if(rows[0].AVG_Receiver3_Ranneke2 == null) {
                            rows[0].AVG_Receiver3_Ranneke2 = -999;
                        }

                        let Timestamp = checkCurrentTime.CurrentTime()
                        console.log(rows)

                        //check which signal is strongest and print the receiver which had the highest value
                        if (rows[0].AVG_Receiver1_Ranneke2 > rows[0].AVG_Receiver2_Ranneke2 && rows[0].AVG_Receiver1_Ranneke2 > rows[0].AVG_Receiver3_Ranneke2) {
                            console.log("RECEIVER1 VAHVIN")
                        }
                        else if (rows[0].AVG_Receiver2_Ranneke2 > rows[0].AVG_Receiver1_Ranneke2 && rows[0].AVG_Receiver2_Ranneke2 > rows[0].AVG_Receiver3_Ranneke2) {
                            console.log("RECEIVER2 VAHVIN")
                        }
                        else if (rows[0].AVG_Receiver3_Ranneke2 > rows[0].AVG_Receiver2_Ranneke2 && rows[0].AVG_Receiver3_Ranneke2 > rows[0].AVG_Receiver1_Ranneke2) {
                            console.log("RECEIVER3 VAHVIN")
                        }
                }
            
                else {
                    console.log(err)
                }                
            })
            }setInterval(avg_ranneke2, 1000);
    });

   //GET ranneke3 detections
   app.get('/detections/ranneke3',(req,res)=>{
    function avg_ranneke3() {

        db.query(

            global.GET_detections_ranneke3,

            (err, rows, fields)=> {

                if(!err) {
                    if(rows[0].AVG_Receiver1_Ranneke3 == null) {
                        rows[0].AVG_Receiver1_Ranneke3 = -999;
                    }

                    if(rows[0].AVG_Receiver2_Ranneke3 == null) {
                        rows[0].AVG_Receiver2_Ranneke3 = -999;
                    }

                    if(rows[0].AVG_Receiver3_Ranneke3 == null) {
                        rows[0].AVG_Receiver3_Ranneke3 = -999;
                    }

                    let Timestamp = checkCurrentTime.CurrentTime()
                    console.log(rows)

                    //check which signal is strongest and print the receiver which had the highest value
                    if (rows[0].AVG_Receiver1_Ranneke3 > rows[0].AVG_Receiver2_Ranneke3 && rows[0].AVG_Receiver1_Ranneke3 > rows[0].AVG_Receiver3_Ranneke3) {
                        console.log("RECEIVER1 VAHVIN")
                    }
                    else if (rows[0].AVG_Receiver2_Ranneke3 > rows[0].AVG_Receiver1_Ranneke3 && rows[0].AVG_Receiver2_Ranneke3 > rows[0].AVG_Receiver3_Ranneke3) {
                        console.log("RECEIVER2 VAHVIN")
                       // res.setHeader('Access-Control-Allow-Origin', '*');
                      //  res.json({ receiver: "RECEIVER2 VAHVIN" })

                       // setTimeout()
                    }
                    else if (rows[0].AVG_Receiver3_Ranneke3 > rows[0].AVG_Receiver2_Ranneke3 && rows[0].AVG_Receiver3_Ranneke3 > rows[0].AVG_Receiver1_Ranneke3) {
                        console.log("RECEIVER3 VAHVIN")
                    }
            }
        
            else {
              console.log(err)
            }                
        })
        }setInterval(avg_ranneke3, 1000);
});

    //GET ranneke4 avg detections
    app.get('/detections/ranneke4',(req,res)=>{
        function avg_ranneke4() {

            db.query(
                
                global.GET_detections_ranneke4,

                (err, rows, fields)=> {

                if(!err) {
                    if(rows[0].AVG_Receiver1_Ranneke4 == null) {
                        rows[0].AVG_Receiver1_Ranneke4 = -999;
                    }

                    if(rows[0].AVG_Receiver2_Ranneke4 == null) {
                        rows[0].AVG_Receiver2_Ranneke4 = -999;
                    }

                    if(rows[0].AVG_Receiver3_Ranneke4 == null) {
                        rows[0].AVG_Receiver3_Ranneke4 = -999;
                    }

                    let Timestamp = checkCurrentTime.CurrentTime()
                    console.log(rows)
                      
                        //check which signal is strongest and print the receiver which had the highest value
                        if (rows[0].AVG_Receiver1_Ranneke4 > rows[0].AVG_Receiver2_Ranneke4 && rows[0].AVG_Receiver1_Ranneke4 > rows[0].AVG_Receiver3_Ranneke4) {
                            console.log("RECEIVER1 VAHVIN")
                        }
                        else if (rows[0].AVG_Receiver2_Ranneke4 > rows[0].AVG_Receiver1_Ranneke4 && rows[0].AVG_Receiver2_Ranneke4 > rows[0].AVG_Receiver3_Ranneke4) {
                            console.log("RECEIVER2 VAHVIN")
                        }
                        else if (rows[0].AVG_Receiver3_Ranneke4 > rows[0].AVG_Receiver2_Ranneke4 && rows[0].AVG_Receiver3_Ranneke4 > rows[0].AVG_Receiver1_Ranneke4) {
                            console.log(rows)
                            console.log("RECEIVER3 VAHVIN")
                        }
                }

                else {
                  console.log(err)
                }                
            })
        }setInterval(avg_ranneke4, 1000);
    });

app.get('/beacon/one/:id', function(req,res) {
    let id = req.params.id;

    db.query('SELECT * FROM beacon_info where beacon_id=?', [id], function (error, result) {
        if (error) throw error;

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(result)
    })

});

app.post('/beacon/edit/:id', upload.none(), function(req,res) {

    db.query('UPDATE beacon_info SET beacon_user = ? WHERE beacon_id = ?',
        [req.body.user, req.params.id], function(error, result, fields) {

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(result)
        })
})

