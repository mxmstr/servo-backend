import React from 'react';
import Popup from "reactjs-popup";
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import { withAuth } from '@okta/okta-react';
import {fetchItemsApiCall} from "../../../actions/ItemList";
import {clearItemApiCall, fetchItemApiCall, putItemApiCall, postItemApiCall} from "../../../actions/ItemEdit";
import {connect} from "react-redux";

class ItemEdit extends React.Component {
    constructor(props){
        super(props);
        this.state = { user: null, item: {} };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async getCurrentUser() {
        await this.props.auth.getUser()
        	.then(user => {
        		this.setState({user});
        	});
    }

    handleChange(event) {
	    const target = event.target;
	    const value = target.value;
        const name = target.name;
        this.state.item[name] = value;
	  }

    async handleSubmit(e) {
        e.preventDefault();

        const item = this.props.create ? this.state.item : Object.assign(this.props.item, this.state.item);
        var data = { uri: this.props.uri, user: this.state.user, item: item };

        this.props.create ? await this.props.postItemApiCall(data) : await this.props.putItemApiCall(data);
        this.props.fetchItemsApiCall(data);
    }

    componentDidMount() {
        this.getCurrentUser();
    }

    render() {
        if (!this.props.item) {
            this.state.item = {};
            return null;
        }

        const title = <h2>{ this.props.create ? 'Add New Item' : 'Edit Item' }</h2>;

        const fields = Object.keys(this.props.item).map(key => {
                return <FormGroup>
                    <Label for={ key }>{ key }</Label>
                    <Input type="text" name={ key } id={ key } defaultValue={ this.props.item[key] || '' }
                        onChange={ this.handleChange } autoComplete={ key } 
                        disabled={ !this.props.editable.includes(key) } />
                </FormGroup>
            });
        // const fields = this.props.create ? 
        //     Object.values(this.props.editable).map(value => {
        //         return <FormGroup>
        //             <Label for={ value } >{ value }</Label>
        //             <Input type="text" name={ value } id={ value }
        //                 onChange={ this.handleChange } autoComplete={ value } />
        //         </FormGroup>
        //     }) : 
        //     Object.keys(this.props.item).map(key => {
        //         return <FormGroup>
        //             <Label for={ key }>{ key }</Label>
        //             <Input type="text" name={ key } id={ key } defaultValue={ this.props.item[key] || '' }
        //                 onChange={ this.handleChange } autoComplete={ key } 
        //                 disabled={ !this.props.editable.includes(key) } />
        //         </FormGroup>
        //     });

        return (
            <Container fluid>

                { title }

                <Form onSubmit={ this.handleSubmit }>
                    { fields }
                  <FormGroup>
                    <Button color="primary" type="submit">Save</Button>{' '}
                    <Button color="secondary" onClick={ this.props.clearItemApiCall }>Cancel</Button>
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