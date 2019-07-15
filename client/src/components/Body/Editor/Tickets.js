import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { withAuth } from '@okta/okta-react';
import ItemList from "./ItemList";

class Tickets extends React.Component {
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

            <Container fluid>
                <Row>
                    <Col>
                        <ItemList
                            title="Open" 
                            uri="tickets/open" />
                    </Col>
                    <Col>
                        <ItemList 
                            title="Closed" 
                            uri="tickets/complete" />
                    </Col>
                    <Col>
                        <ItemList 
                            title="Unresolved" 
                            uri="tickets/incomplete" />
                    </Col>
                </Row>
            </Container>
            
        )
    }
};

export default withAuth(Tickets);