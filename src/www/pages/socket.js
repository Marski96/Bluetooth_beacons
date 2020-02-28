import React, {Component} from "react";
import socketIOClient from "socket.io-client";
import { Paper, Table, TableRow, TableHead, TableCell, TableBody } from '@material-ui/core';

class Socket extends Component {
  constructor() {
      super();
      this.state = {
          response: [],
          endpoint: 'http://127.0.0.1:4001'
      };
  }

  componentDidMount() {
      const {endpoint} = this.state;
      //connect io client to specified endpoint
      const socket = socketIOClient(endpoint);
      //listen data -> set to state
      socket.on("outgoing data", data => this.setState({response: data.num}));
  }

  render() {
      const {response} = this.state;
      return (
          <div style={{textAlign: "center"}}>
              <Paper>
              <TableBody>
                        {this.state.response.map(member =>
                            <TableRow key={member.measument_time}>
                            <TableCell>{member.beacon_user}</TableCell>
                            <TableCell>{member.receiver_id}</TableCell>
                            <TableCell>{member.signal_db}</TableCell>
                            <TableCell>{member.measument_time}</TableCell>
                            </TableRow>
                            )}
                    </TableBody>
                  <h2>Currently updating realtime endlessly</h2>
                  <h3>TODO: Limit queries/data to certain number</h3>
                  <h4>Works with backend-service.js now</h4>
                  </Paper>
      
          </div>
      )
  }
}

export default Socket;