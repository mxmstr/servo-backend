import React from 'react';
import Popup from "reactjs-popup";
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import { withAuth } from '@okta/okta-react';
import {fetchItemsApiCall} from "../../../actions/ItemList";
import {clearItemApiCall, fetchItemApiCall, putItemApiCall} from "../../../actions/ItemEdit";
import {connect} from "react-redux";

class ItemEdit extends React.Component {
    constructor(props){
        super(props);
        this.state = { user: null, item: {} };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearItem = this.clearItem.bind(this);
    }

    async getCurrentUser() {
        await this.props.auth.getUser()
        	.then(user => {
        		this.setState({user});
        	});
        	
    }

    clearItem() {
        this.props.clearItemApiCall();
        this.setState({item: {} });
    }

    handleChange(event) {
	    const target = event.target;
	    const value = target.value;
        const name = target.name;
        this.state.item[name] = value;
	  }

    handleSubmit(e) {
        e.preventDefault();

        const item = Object.assign(this.props.item, this.state.item);

        this.props.putItemApiCall(
            { uri: this.props.uri, user: this.state.user, item: item });
        this.props.fetchItemsApiCall(
            { uri: this.props.uri, user: this.state.user });
        
        this.clearItem();
    }

    componentDidMount() {
        this.getCurrentUser();
    }

    render() {
        if (!this.props.item) {
            this.state.item = {};
            return null;
        }

        const fields = Object.keys(this.props.item).map(key => {
            return <FormGroup>
                <Label for={key}>{key}</Label>
                <Input type="text" name={key} id={key} defaultValue={this.props.item[key] || ''}
                    onChange={this.handleChange} autoComplete={key} 
                    disabled={!this.props.editable.includes(key)} />
            </FormGroup>
        });

        return (
            <Container fluid>
                <Form onSubmit={this.handleSubmit}>
                    {fields}
                  <FormGroup>
                    <Button color="primary" type="submit">Save</Button>{' '}
                    <Button color="secondary" onClick={this.clearItem}>Cancel</Button>
                  </FormGroup>
                </Form>
            </Container>
        )
        // return (
        //     <Popup position="right center">
        //         <Form onSubmit={this.handleSubmit}>
        //             {fields}
        //           <FormGroup>
        //             <Button color="primary" type="submit">Save</Button>{' '}
        //             <Button color="secondary" onClick={this.clearItem}>Cancel</Button>
        //           </FormGroup>
        //         </Form>
        //     </Popup>
        // )
    }
};

const mapStateToProps = (state) => {
    return {
        item: state.itemedit.item,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearItemApiCall: (data) => dispatch(clearItemApiCall(data)),
        fetchItemApiCall: (data) => dispatch(fetchItemApiCall(data)),
        putItemApiCall: (data) => dispatch(putItemApiCall(data)),
        fetchItemsApiCall: (data) => dispatch(fetchItemsApiCall(data))
    }
};

export default connect(
	mapStateToProps,
    mapDispatchToProps
)(withAuth(ItemEdit));