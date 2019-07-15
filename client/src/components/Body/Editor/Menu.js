import React from 'react';
import { withAuth } from '@okta/okta-react';
import ItemList from "./ItemList";

class Menu extends React.Component {
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


        return (
            <ItemList 
                title="Menu Items" 
                uri="menu"
                editable={ ['name', 'price', 'options'] } 
                add={ true }
                edit={ true }
                delete={ true } />
        )
    }
};

export default withAuth(Menu);