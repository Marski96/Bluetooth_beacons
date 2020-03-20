const express = require('express');
const app = express();
const alert = require('alert-node');
const bodyparser = require('body-parser');
app.use(bodyparser.json());
const database = require('../database/connect_to_db')
const queries = require('../database/queries')
const alerting = require('../detection/alerts')
const multer = require('multer');
const socketServer = require('../socketio/socketio')

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

    //GET ranneke3 avg detections
   app.get('/detections/ranneke1',(req,res)=>{
    function avg_ranneke1() {

        db.query(

            global.GET_detections_ranneke1,

            (err, rows, fields)=> {

                //check if database contains null values (not detected) and change them to -999 ("out of range")
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

                //check which signal is strongest and print the receiver which had the highest value
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
                //Check if all signals are equal, if yes assume that those are not in range
                    else if (rows[0].AVG_Receiver1_Ranneke1 == rows[0].AVG_Receiver2_Ranneke1 && rows[0].AVG_Receiver1_Ranneke1 == rows[0].AVG_Receiver1_Ranneke1 && rows[0].AVG_Receiver2_Ranneke1 == rows[0].AVG_Receiver3_Ranneke1) {
                        console.log('Not in range')
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
                
                    //check if database contains null values (not detected) and change them to -999 ("out of range")
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
                        //check which signal is strongest and print the receiver which had the highest value
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
                        //Check if all signals are equal, if yes assume that those are not in range
                        else if (rows[0].AVG_Receiver1_Ranneke2 == rows[0].AVG_Receiver2_Ranneke2 && rows[0].AVG_Receiver1_Ranneke2 == rows[0].AVG_Receiver1_Ranneke2 && rows[0].AVG_Receiver2_Ranneke2 == rows[0].AVG_Receiver3_Ranneke2) {
                            console.log('Not in range')
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

                //check if database contains null values (not detected) and change them to -999 ("out of range")
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
                    //check which signal is strongest and print the receiver which had the highest value
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
                    //Check if all signals are equal, if yes assume that those are not in range
                    else if (rows[0].AVG_Receiver1_Ranneke3 == rows[0].AVG_Receiver2_Ranneke3 && rows[0].AVG_Receiver1_Ranneke3 == rows[0].AVG_Receiver1_Ranneke3 && rows[0].AVG_Receiver2_Ranneke3 == rows[0].AVG_Receiver3_Ranneke3) {
                        console.log('Not in range')
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

                //check if database contains null values (not detected) and change them to -999 ("out of range")
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
                        //check which signal is strongest and print the receiver which had the highest value
                        if (rows[0].AVG_Receiver1_Ranneke4 > rows[0].AVG_Receiver2_Ranneke4 && rows[0].AVG_Receiver1_Ranneke4 > rows[0].AVG_Receiver3_Ranneke4) {
                            console.log("RECEIVER1 VAHVIN")
                            alert('Ranneke 4 ' + red_alert)  
                        }
                        else if (rows[0].AVG_Receiver2_Ranneke4 > rows[0].AVG_Receiver1_Ranneke4 && rows[0].AVG_Receiver2_Ranneke4 > rows[0].AVG_Receiver3_Ranneke4) {
                            console.log("RECEIVER2 VAHVIN")
                        }
                        else if (rows[0].AVG_Receiver3_Ranneke4 > rows[0].AVG_Receiver2_Ranneke4 && rows[0].AVG_Receiver3_Ranneke4 > rows[0].AVG_Receiver1_Ranneke4) {
                            console.log(rows)
                            console.log("RECEIVER3 VAHVIN")
                        }
                        //Check if all signals are equal, if yes assume that those are not in range
                        else if (rows[0].AVG_Receiver1_Ranneke4 == rows[0].AVG_Receiver2_Ranneke4 && rows[0].AVG_Receiver1_Ranneke4 == rows[0].AVG_Receiver1_Ranneke4 && rows[0].AVG_Receiver2_Ranneke4 == rows[0].AVG_Receiver3_Ranneke4) {
                            console.log('Not in range')
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