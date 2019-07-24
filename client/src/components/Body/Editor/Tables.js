import React from 'react';
import { withAuth } from '@okta/okta-react';
import ItemMap from "./ItemMap";
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
        this.props.auth.getUser()
            .then(user => this.setState({user}));
    }
    
    componentDidMount(){
        this.getCurrentUser();
    }

    render() {
        if(!this.state.user) return null;


        return (
            
            <div>
                <ItemEdit uri="table" />
                <ItemList 
                    title="Tables" 
                    uri="table"
                    columns={ ['id', 'businessId', 'customerId'] }
                    add={ true }
                    actions={ [<Buttons.Edit/>, <Buttons.Delete/>] } />
            </div>
        )
    }
};

export default withAuth(Tables);