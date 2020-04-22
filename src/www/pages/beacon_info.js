import React, { Component } from 'react';
import { Paper, Table, TableRow, TableHead, TableCell, TableBody, Button } from '@material-ui/core';
import { Link, Router, BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import AddBeacon from './addnew_beacon';
import EditBeacon from "./edit_beacon";
import { withTranslation } from 'react-i18next';

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
        const { t, i18n } = this.props;
        return (
            <div style={{paddingLeft: '20%', paddingRight: '20%', paddingTop:'1%'}}>
                <BrowserRouter>
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("Beacon User")}</TableCell>
                                    <TableCell>{t("Beacon ID")}</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.tieto.map(member =>
                                    <TableRow key={member.beacon_id}>
                                        <TableCell>{member.beacon_user}</TableCell>
                                        <TableCell>{member.beacon_id}</TableCell>
                                        <Button style={{backgroundColor: 'khaki'}}><Link to={"/beacon/one/"+member.beacon_id}>Edit</Link></Button>
                                        <Button style={{backgroundColor: 'indianred'}} onClick={() => { 
                                            if (window.confirm("Beacon user: " + (this,member.beacon_user)  + "\nBeacon ID: " + (this,member.beacon_id) + "\nAre you sure you want to delete this user?")) { 
                                            let delete_beacon = this.delete_beacon.bind(this, member.beacon_id);
                                            delete_beacon();}}} >Delete</Button>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>


                    <div>
                        <nav>
                            <Link to="/AddBeacon"> {t("Add New")} </Link>

                        </nav>

                        <Switch>
                            <Route path="/AddBeacon" component={AddBeacon}></Route>
                            <Route path="/beacon/one/:id" component={EditBeacon}></Route>

                        </Switch>
                    </div>
                </BrowserRouter>
            </div>

        );

    }


}


export default (withTranslation("translation"))(Beacon_info);