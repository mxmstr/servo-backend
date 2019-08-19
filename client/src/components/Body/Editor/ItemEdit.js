import React from 'react';
import Popup from "reactjs-popup";
import { Button, Grid, Row, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Card from "../../../template/components/Card/Card.jsx";
import { FormInputs } from "../../../template/components/FormInputs/FormInputs.jsx";
//import { Grid } from '@material-ui/core';
import { withAuth } from '@okta/okta-react';
import {fetchItemsApiCall} from "../../../actions/ItemList";
import {clearItemApiCall, fetchItemApiCall, putItemApiCall, postItemApiCall} from "../../../actions/ItemEdit";
import {connect} from "react-redux";


class ItemEdit extends React.Component {

    static defaultProps = {
        editable: []
    }

    constructor(props){
        super(props);
        this.state = { user: null, item: {} };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async getCurrentUser() {
        // Request user credentials from oAuth provider

        await this.props.auth.getUser()
        	.then(user => {
        		this.setState({user});
        	});
    }

    handleChange(event) {
        // Update the pending item changes in the state

	    const target = event.target;
	    const value = target.value;
        const name = target.name;
        this.state.item[name] = value;
	  }

    async handleSubmit(e) {
        e.preventDefault();

        // If creating, use the state item. If editing, merge the state item with the original item
        const item = this.props.create ? this.state.item : Object.assign(this.props.item, this.state.item);
        var data = { uri: this.props.uri, user: this.state.user, auth: this.props.auth, item: item };

        // If creating, do a post api call instead of a put
        this.props.create ? await this.props.postItemApiCall(data) : await this.props.putItemApiCall(data);
        this.props.fetchItemsApiCall(data);
    }

    componentDidMount() {
        this.getCurrentUser();
    }

    render() {
        if (!this.props.item) {
            // Reset the state item since we're no longer editing
            this.state.item = {};
            return null;
        }


        const title = <h2>{ this.props.create ? 'Add New Item' : 'Edit Item' }</h2>;

        // Show all item's fields, disable fields if they're not editable
        const fields = Object.keys(this.props.item).map(key => {

            const keyUpper = key.charAt(0).toUpperCase() + key.slice(1);

            return <FormGroup className="col-md-6">
                    <ControlLabel htmlFor={ key }>{ keyUpper }</ControlLabel>
                    <FormControl type="text" name={ key } id={ key } defaultValue={ this.props.item[key] || '' }
                        onChange={ this.handleChange } autoComplete={ key } 
                        disabled={ !this.props.editable.includes(key) } />
                </FormGroup>
        });


        return (
            <Popup
                trigger={ <div></div> }
                modal={ true }
                closeOnDocumentClick={ false }
                closeOnEscape={ false }
                defaultOpen={ true }
            >
                <span> 
                <Grid fluid>
                    { title }
                    <Form onSubmit={ this.handleSubmit }>
                            { fields }
                        <FormGroup className="col-md-10">
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" onClick={ this.props.clearItemApiCall }>Cancel</Button>
                        </FormGroup>
                    </Form>
                </Grid>
                </span>
            </Popup>
          );
        
    }
};

const mapStateToProps = (state) => {
    return {
        item: state.itemedit.item,
        create: state.itemedit.create,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearItemApiCall: (data) => dispatch(clearItemApiCall(data)),
        fetchItemApiCall: (data) => dispatch(fetchItemApiCall(data)),
        putItemApiCall: (data) => dispatch(putItemApiCall(data)),
        postItemApiCall: (data) => dispatch(postItemApiCall(data)),
        fetchItemsApiCall: (data) => dispatch(fetchItemsApiCall(data))
    }
};

export default connect(
	mapStateToProps,
    mapDispatchToProps
)(withAuth(ItemEdit));