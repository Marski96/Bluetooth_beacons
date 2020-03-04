import React, { Component } from 'react';
import { Paper, Table, TableRow, TableHead, TableCell, TableBody } from '@material-ui/core';
import socketIOClient from "socket.io-client";

class Beacon_locations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            response: [],
            endpoint: 'http://127.0.0.1:4001'
        }
    }


    componentDidMount = () => {
        const {endpoint} = this.state;
      //connect io client to specified endpoint
      const socket = socketIOClient(endpoint);
      //listen data -> set to state
      socket.on("beacon_location_data", data => this.setState({response: data.num}));
        
        }

render() {
        return (
            <div>
                <Paper>
                <TableBody>
                        {this.state.response.map(member =>
                            <TableRow key={member.beacon_user}>
                            <TableCell>{member.beacon_user}</TableCell>
                            <TableCell>{member.receiver_id}</TableCell>
                            <TableCell>{member.signal_db}</TableCell>
                            <TableCell>{member.measument_time}</TableCell>
                            </TableRow>
                            )}
                    </TableBody>
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

export default Beacon_locations;