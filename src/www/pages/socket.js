import React, { Component } from "react";
import {
  Paper,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody
} from "@material-ui/core";
import socketIOClient from "socket.io-client";

class Socket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: [],
      endpoint: "http://127.0.0.1:4001",
      tieto: []
    };
  }

  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ tieto: responseJson });

        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        socket.on("emitSocket", data => this.setState({ response: data }));
      });
  }

  render() {
    const { response } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
        <Paper>
          

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>rofl</TableCell>
                <TableCell>lmao</TableCell>
                <TableCell>ayy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.response.map(member => (
                <TableRow key={member.receiver_id}>
                  <TableCell>{member.beacon_id}</TableCell>
                  <TableCell>{member.signal_db}</TableCell>
                  <TableCell>{member.measument_time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default Socket;
