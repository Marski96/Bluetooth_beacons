import React, { Component } from 'react';
import { Paper, Table, TableRow, TableHead, TableCell, TableBody, Button } from '@material-ui/core';
import { Link, Router, BrowserRouter, Route, Switch } from 'react-router-dom'
import AddBeacon from './addnew_beacon'
import EditBeacon from './beacon_edit'

class Beacon_info extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tieto: [],
            navigate: false,
            
        }
    }


    componentDidMount = () => {
        fetch('http://localhost:4000/beacon_info')
        .then((response) => response.json())
        .then(responseJson => {
            this.setState({tieto: responseJson})
            
        })
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
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.tieto.map(member =>
                            <TableRow key={member.beacon_id}>
                            <TableCell>{member.beacon_user}</TableCell>
                            <TableCell>{member.beacon_id}</TableCell>
                            <TableCell><Button>
                                <BrowserRouter>
                                <div>
                                    <nav>
                                    <Link to='/EditBeacon'>Muokkaa</Link>
                                    </nav>
                                    <Switch>
                                        <Route path="/EditBeacon"><EditBeacon/></Route>
                                        </Switch>
                                    </div></BrowserRouter>
                                </Button></TableCell>
                            <TableCell><Button onClick={this.delete_beacon.bind(this, member.beacon_id)}>Poista</Button></TableCell>
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