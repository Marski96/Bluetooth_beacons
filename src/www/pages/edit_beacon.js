import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import axios from 'axios';




class EditBeacon extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            tieto: [],
            user: '', id: ''
        }
    }


    edit_beacon = (e) => {
        const formData = new FormData();
        formData.append('user', this.state.user);
        axios.post('http://localhost:4000/beacon/edit/'+ this.state.id, formData)

    }

    changeData = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    componentDidMount = () => {
        const {match: {params}} = this.props;

        fetch('http://localhost:4000/beacon/one/' +params.id)
            .then((response) => response.json())
            .then(responseJson => {
                this.setState({user: params.user, id: params.id})

            })
    }

    render()
    {
        return (
            <div>

                <TextField label='Beacon user' name='user' value={this.state.user} onChange = {this.changeData}/>
                <TextField label='Beacon ID' name='id' value={this.state.id} onChange = {this.changeData}/>
                <Button onClick={this.edit_beacon}>Muuta</Button>
            </div>
        );
    }
}

export default EditBeacon;