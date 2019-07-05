import React from 'react';
import { withAuth } from '@okta/okta-react';
import {fetchItemList} from "../../../actions/ItemList";
import {connect} from "react-redux";

class ItemList extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
    		name: '',
    		price: '',
    		options: '',
    		image: '',
        };
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOldPasswordChange = this.handleOldPasswordChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
    }

    async getCurrentUser(){
        this.props.auth.getUser()
            .then(user => this.setState({user}));
    }

    handleOldPasswordChange(e) {
        this.setState({ oldPassword: e.target.value });
    }
    handleNewPasswordChange(e) {
        this.setState({ newPassword: e.target.value });
    }

    handleSubmit(e){
        e.preventDefault();

        var data = {
            userId: this.state.user.sub, oldPassword: this.state.oldPassword, newPassword: this.state.newPassword
        };
        this.props.changePasswordApiCall(data);
    }

    componentDidMount(){
        this.getCurrentUser();
        
        fetch('api/menu', {credentials: 'include'})
	      .then(response => response.json())
	      .then(data => this.setState({groups: data, isLoading: false}))
	      .catch(() => this.props.history.push('/'));
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
        		<Container>
                <Form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" value={item.name || ''}
                           onChange={this.handleChange} autoComplete="name"/>
                  </FormGroup>
                  <FormGroup>
                    <Label for="price">Price</Label>
                    <Input type="text" name="price" id="price" value={item.price || ''}
                           onChange={this.handleChange} autoComplete="price"/>
                  </FormGroup>
                  <FormGroup>
                    <Label for="Options">Options</Label>
                    <Input type="text" name="Options" id="Options" value={item.Options || ''}
                           onChange={this.handleChange} autoComplete="Options"/>
                  </FormGroup>
                  <FormGroup>
                    <Button color="primary" type="submit">Save</Button>{' '}
                    <Button color="secondary" tag={Link} to="/">Cancel</Button>
                  </FormGroup>
                </Form>
              </Container>
        )
    }
};


const mapStateToProps = (state) => {
    return {
        error: state.profile.error,
        success: state.profile.success
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changePasswordApiCall: (data) => dispatch(changePasswordApiCall(data))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withAuth(ItemList));