import React, { Component } from 'react';
import { Paper, Table, TableRow, TableHead, TableCell, TableBody } from '@material-ui/core';
import socketIOClient from "socket.io-client";

class Receiver_info extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tieto: [],
            response: [],
            endpoint: 'http://127.0.0.1:4000'

        }
    }


    componentDidMount = () => {
        const {endpoint} = this.state;
      //connect io client to specified endpoint
      const socket = socketIOClient(endpoint);
      //listen data -> set to state
      socket.on("receiver_info_data", data => this.setState({response: data.num}));
        
        }

render() {
        return (
            <div>
               
                <Paper>
               <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Receiver ID</TableCell>
                            <TableCell>Receiver Location</TableCell>
                            <TableCell>Location type</TableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.response.map(member =>
                            <TableRow key={member.receiver_id}>
                            <TableCell>{member.receiver_id}</TableCell>
                            <TableCell>{member.receiver_location}</TableCell>
                            <TableCell>{member.location_type}</TableCell>
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

export default Receiver_info;