const express = require('express');
const app = express();
const alert = require('alert-node');
const bodyparser = require('body-parser');
app.use(bodyparser.json());
const database = require('../database/connect_to_db')
const queries = require('../database/queries')
const alerting = require('../detection/alerts')
const socketServer = require('../socketio/socketio')

//App, listen this port
socketServer.start();
expressPort = 4000;
var server = app.listen(expressPort,()=>console.log('\nExpress is running at port no : ' + expressPort));

    //Write instructions to / -page
    app.get('/', (req, res) => {
        function writeInstructions() {
            res.send(
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

    //GET receiver_info from DB
    app.get('/receiver_info', function(req, res) {

        db.query(global.GET_receiver_info, (err, rows, fields) => {
    
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

    app.get('/delete/:id', function(req, res) {
        let id = req.params.id;
      
        db.query(global_DELETE_beacon, [id], function (error, result) {
      
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.send(result)
        })
    })

    //GET ranneke3 avg detections
   app.get('/detections/ranneke1',(req,res)=>{
    function avg_ranneke1() {

        db.query(

            global.GET_detections_ranneke1,

            (err, rows, fields)=> {

                //check if database contains null values and change them to -999 ("out of range")
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

                //check which signal_db is strongest and print it
                    if (rows[0].AVG_Receiver1_Ranneke1 > rows[0].AVG_Receiver2_Ranneke1 && rows[0].AVG_Receiver1_Ranneke1 > rows[0].AVG_Receiver3_Ranneke1) {
                        console.log("RECEIVER1 VAHVIN")
                        alert('Ranneke 1 ' + red_alert)
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

    //GET ranneke4 avg detections
    app.get('/detections/ranneke2',(req,res)=>{
        function avg_ranneke2() {

            db.query(

                global.GET_detections_ranneke2,

                (err, rows, fields)=> {
                
                    //check if database contains null values and change them to -999 ("out of range")
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
    
                        if (rows[0].AVG_Receiver1_Ranneke2 > rows[0].AVG_Receiver2_Ranneke2 && rows[0].AVG_Receiver1_Ranneke2 > rows[0].AVG_Receiver3_Ranneke2) {
                            console.log("RECEIVER1 VAHVIN")
                            alert('Ranneke 2 ' + red_alert) 
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

   //GET ranneke3 avg detections
   app.get('/detections/ranneke3',(req,res)=>{
    function avg_ranneke3() {

        db.query(

            global.GET_detections_ranneke3,

            (err, rows, fields)=> {

                //check if database contains null values and change them to -999 ("out of range")
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

                    if (rows[0].AVG_Receiver1_Ranneke3 > rows[0].AVG_Receiver2_Ranneke3 && rows[0].AVG_Receiver1_Ranneke3 > rows[0].AVG_Receiver3_Ranneke3) {
                        console.log("RECEIVER1 VAHVIN")
                        alert('Ranneke 3 ' + red_alert) 
                    }
                    else if (rows[0].AVG_Receiver2_Ranneke3 > rows[0].AVG_Receiver1_Ranneke3 && rows[0].AVG_Receiver2_Ranneke3 > rows[0].AVG_Receiver3_Ranneke3) {
                        console.log("RECEIVER2 VAHVIN")
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.json({ receiver: "RECEIVER2 VAHVIN" })

                        setTimeout()
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

                //check if database contains null values and change them to -999 ("out of range")
                if(!err) {
                        if(rows[0].AVG_Receiver1_Ranneke4 == null) {
                            rows[0].AVG_Receiver1_Ranneke4 = -999;
                        }

                        if(rows[0].AVG_Receiver2_Ranneke4 == null) {
                            rows[0].AVG_Receiver2_Ranneke4 = -999;
                        }

                        if(rows[0].AVG_Receiver2_Ranneke4 == null) {
                            rows[0].AVG_Receiver2_Ranneke4 = -999;
                        }

                        if (rows[0].AVG_Receiver1_Ranneke4 > rows[0].AVG_Receiver2_Ranneke4 && rows[0].AVG_Receiver1_Ranneke4 > rows[0].AVG_Receiver3_Ranneke4) {
                            console.log("RECEIVER1 VAHVIN")
                            alert('Ranneke 4 ' + red_alert)  
                        }
                        else if (rows[0].AVG_Receiver2_Ranneke4 > rows[0].AVG_Receiver1_Ranneke4 && rows[0].AVG_Receiver2_Ranneke4 > rows[0].AVG_Receiver3_Ranneke4) {
                            console.log("RECEIVER2 VAHVIN")
                        }
                        else if (rows[0].AVG_Receiver3_Ranneke4 > rows[0].AVG_Receiver2_Ranneke4 && rows[0].AVG_Receiver3_Ranneke4 > rows[0].AVG_Receiver1_Ranneke4) {
                            console.log("RECEIVER3 VAHVIN")
                        }
                }

                else {
                  console.log(err)
                }                
            })
        }setInterval(avg_ranneke4, 1000);
    });