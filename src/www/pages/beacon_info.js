import React, { Component } from 'react';
import { Paper, Table, TableRow, TableHead, TableCell, TableBody, Button } from '@material-ui/core';
import { Link, Router, BrowserRouter, Route, Switch } from 'react-router-dom'
import AddBeacon from './addnew_beacon'
import socketIOClient from "socket.io-client";

class Beacon_info extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tieto: [],
            response: [],
            navigate: false,
            endpoint: 'http://127.0.0.1:4000'
            
        }
    }


    componentDidMount = () => {
        const {endpoint} = this.state;
      //connect io client to specified endpoint
      const socket = socketIOClient(endpoint);
      //listen data -> set to state
      socket.on("beacon_info_data", data => this.setState({response: data.num}));
        
        }

    handlePress = () => {
        this.setState({navigate: true});
    }




    delete_beacon = (beacon_id) => {
        fetch('http://localhost:4000/delete/' + beacon_id)
        .then((response) => response.json())
        .then((responseJson) =>
        {
            this.setState(prevState => ({tieto: prevState.tieto.filter(beacon =>
                beacon.beacon_id !== beacon_id)
            }));
        })
    }

render() {
        return (
      <div>
            <Paper>
               <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Beacon User</TableCell>
                            <TableCell>Beacon ID</TableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.response.map(member =>
                            <TableRow key={member.beacon_id}>
                            <TableCell>{member.beacon_user}</TableCell>
                            <TableCell>{member.beacon_id}</TableCell>
                            <Button onClick={this.delete_beacon.bind(this, member.beacon_id)}>Poista</Button>
                            </TableRow>
                            )}
                            
                    </TableBody>
                </Table>
                </Paper>

                <BrowserRouter>
                    <div>
                <nav>
                <Link to="/AddBeacon"> Add new </Link>
                
                </nav>

                <Switch>
                    <Route path="/AddBeacon">
                    <AddBeacon />
                    </Route>
                </Switch>
                </div>
                </BrowserRouter>
                </div>
           
        );
        
    }


}

const styles =  {
    buttonStyle: {
        width: 80,
        height: 80,
        
    },
    headerStyle: {
        textAlign: 'center'
    }
        
} ;

export default Beacon_info;