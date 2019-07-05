import React from 'react';
import { withAuth } from '@okta/okta-react';
import ItemList from "./ItemList";
import Sidebar from "../Sidebar/Sidebar";
import {connect} from "react-redux";

class ProfilePage extends React.Component {
    constructor(props){
        super(props);
        this.state = { user: null, oldPassword: '', newPassword: '' };
        this.getCurrentUser = this.getCurrentUser.bind(this);
    }

    async getCurrentUser(){
        this.props.auth.getUser()
            .then(user => this.setState({user}));
    }
    
    componentDidMount(){
        this.getCurrentUser();
    }

    render() {
        if(!this.state.user) return null;
        const errorMessage = this.props.error ?
            (<div className="alert alert-danger"><strong>Error! </strong>{this.props.error}</div>):
            null;
        const successMessage = this.props.success ?
            (<div className="alert alert-success"><strong>Success! </strong>{this.props.success}</div>):
            null;


        return (
            <div className="d-flex flex-row">
        		<div className="p-2"><Sidebar /></div>
        		<ItemList title="Menu Items" uri="/api/menu" />
            </div>
        )
    }
};

export default withAuth(ProfilePage);