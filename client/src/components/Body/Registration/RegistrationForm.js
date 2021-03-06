import React from 'react';
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from "react-bootstrap";

import { registrationApiCall } from '../../../actions/Registration';
import config from '../../../app.config';

class RegistrationForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            email: '',
            password: ''
        };
        this.oktaAuth = new OktaAuth({ url: config.url });
        this.checkAuthentication = this.checkAuthentication.bind(this);
        this.checkAuthentication();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOrganizationChange = this.handleOrganizationChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);

    }

    async checkAuthentication() {
        const sessionToken = await this.props.auth.getIdToken();
        if (sessionToken) {
            this.setState({ sessionToken });
        }
    }

    componentDidUpdate() {
        this.checkAuthentication();
    }

    handleOrganizationChange(e){
        this.setState({ name: e.target.value });
    }
    handleEmailChange(e) {
        this.setState({ email: e.target.value });
    }
    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    async handleSubmit(e){
        e.preventDefault();
        this.props.registrationApiCall(this.oktaAuth, this.state);
    }

    render(){
        if (this.props.sessionToken) {
            this.props.auth.redirect({ sessionToken: this.props.sessionToken });
            return null;
        }

        const errorMessage = this.props.error ?
            <span className="error-message">{ this.props.error }</span> :
            null;

        return(
            <div className="content">
            <Grid style={ { height: '100vh' } }>
                <Row className="show-grid">
                    <Col xs={1} md={4} />
                    <Col xs={4} md={4} >{

                        <form className="form-vertical"
                            onSubmit={this.handleSubmit}>

                            <h3 style={ {textAlign: 'center'} }>Registration</h3>

                            <br />
                            {errorMessage}
                            <div className="form-group">
                                <label>Organization:</label>
                                <input className="form-control" type="text" id="organization" value={this.state.organization}
                                    onChange={this.handleOrganizationChange} />
                            </div>
                            <div className="form-group">
                                <label className="control-label">Email:</label>
                                <input className="form-control" type="email" id="email" value={this.state.email}
                                    onChange={this.handleEmailChange}/>
                            </div>
                            <div className="form-group">
                                <label>Password:</label>
                                <input className="form-control" type="password" id="password" value={this.state.password}
                                    onChange={this.handlePasswordChange} />
                            </div>
                            <input className="btn btn-outline-success col-2" type="submit" id="submit" value="Register"/>
                        </form>
                        
                        }</Col>
                    <Col xs={1} md={4} />
                </Row>
            </Grid>
            </div>
            
        );
    }

};


const mapStateToProps = (state) => {
    return {
        sessionToken: state.login.sessionToken,
        error: state.registration.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        registrationApiCall: (oktaAuth, data) => dispatch(registrationApiCall(oktaAuth, data))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withAuth(RegistrationForm));