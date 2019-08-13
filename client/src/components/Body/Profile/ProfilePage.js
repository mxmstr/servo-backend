import React from 'react';
import { withAuth } from '@okta/okta-react';
import {changePasswordApiCall} from "../../../actions/Profile";
import {connect} from "react-redux";
import Loading from "../Loading";
import { Grid, Row, Col } from "react-bootstrap";


class ProfilePage extends React.Component {
    constructor(props){
        super(props);
        this.state = { user: null, oldPassword: '', newPassword: '', mounted: false };
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
        this.setState({mounted: true});
    }

    render() {
        if (!this.state.mounted || !this.state.user) return <Loading/>;

        const errorMessage = this.props.error ?
            (<div className="alert alert-danger"><strong>Error! </strong>{this.props.error}</div>):
            null;
        const successMessage = this.props.success ?
            (<div className="alert alert-success"><strong>Success! </strong>{this.props.success}</div>):
            null;


        return (
            <div className="content">
            <Grid style={ { height: '100vh' } }>
                <Row className="show-grid">
                    <Col xs={8} md={8}>
                        <h1>THIS IS YOUR PROFILE.</h1>
                    </Col>
                    <Col xs={8} md={8}>    
                        <div>
                            <label>Name: <span>{this.state.user.name}</span></label>
                        </div>
                    </Col>
                </Row>
            </Grid>
            </div>
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
)(withAuth(ProfilePage));