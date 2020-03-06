import React, { Component } from 'react';
import { Paper, Table, TableRow, TableHead, TableCell, TableBody } from '@material-ui/core';
import socketIOClient from "socket.io-client";

class Beacon_detections extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tieto: []
            ,response: [],
            endpoint: 'http://127.0.0.1:4000'
        }
    }



    componentDidMount = () => {
        const {endpoint} = this.state;
      //connect io client to specified endpoint
      const socket = socketIOClient(endpoint);
      //listen data -> set to state
      socket.on("beacon_detections_data", data => this.setState({response: data.num}));
        
        }

render() {
        return (
            <div>
                <Paper>
               <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Receiver ID</TableCell>
                            <TableCell>Beacon ID</TableCell>
                            <TableCell>Signal DB</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.response.map(member =>
                            <TableRow key={member.measument_time}>
                            <TableCell>{member.receiver_id}</TableCell>
                            <TableCell>{member.beacon_id}</TableCell>
                            <TableCell>{member.signal_db}</TableCell>
                            <TableCell>{member.measument_time}</TableCell>
                            </TableRow>
                            )}
                    </TableBody>
                </Table>
                </Paper>

            </div>


           
        );
    }


}

const styles =  {
    buttonStyle: {
        width: 80,
        height: 80
    },
    headerStyle: {
        textAlign: 'center'
    }
        
} ;

export default Beacon_detections;