import React from 'react';
import { withAuth } from '@okta/okta-react';
import ItemEdit from "./ItemEdit";
import ItemList from "./ItemList";
import Buttons from "./Buttons";

class Tables extends React.Component {
    constructor(props){
        super(props);
        this.state = { user: null, oldPassword: '', newPassword: '' };
        this.getCurrentUser = this.getCurrentUser.bind(this);
    }

    async getCurrentUser(){
        // Request user credentials from oAuth provider
        
        this.props.auth.getUser()
            .then(user => this.setState({user}));
    }
    
    componentDidMount(){
        this.getCurrentUser();
    }

    render() {
        if(!this.state.user) return null;

        const cellStyle = {
            'white-space' : 'nowrap',
            'overflow' : 'hidden'
        };

        return (
            
            <div>
                <ItemEdit uri="table" />
                <ItemList 
                    title="Tables" 
                    uri="table"
                    columns={ ['id', 'businessId', 'customerId'] }
                    add={ true }
                    actions={ [<Buttons.Edit/>, <Buttons.Delete/>] }
                    style={ {"padding": "30px"} }
                    cellStyle={ cellStyle } />
            </div>
        )
    }
};

export default withAuth(Tables);