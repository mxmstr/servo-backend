import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Route } from 'react-router-dom';
import { SecureRoute, ImplicitCallback } from '@okta/okta-react';
import { withAuth } from '@okta/okta-react';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Sidebar from './components/Body/Sidebar/Sidebar';
import RegistrationForm from './components/Body/Registration/RegistrationForm';
import config from './app.config';
import LoginPage from './components/Body/Login/LoginPage';
import ProfilePage from './components/Body/Profile/ProfilePage';
import Menu from './components/Body/Editor/Menu';
import Tickets from './components/Body/Editor/Tickets';
import Tables from './components/Body/Editor/Tables';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: null
        };
        this.checkAuthentication = this.checkAuthentication.bind(this);
        this.checkAuthentication();
    }

    async checkAuthentication() {
        const authenticated = await this.props.auth.isAuthenticated();
        if (authenticated !== this.state.authenticated) {
            this.setState({ authenticated });
        }
    }

    componentDidUpdate(e) {
        this.checkAuthentication();

        if (
          window.innerWidth < 993 &&
          e.history.location.pathname !== e.location.pathname &&
          document.documentElement.className.indexOf("nav-open") !== -1
        ) {
          document.documentElement.classList.toggle("nav-open");
        }
        if (e.history && e.history.action === "PUSH") {
          document.documentElement.scrollTop = 0;
          document.scrollingElement.scrollTop = 0;
          this.refs.mainPanel.scrollTop = 0;
        }
    }

    render() {

        const authenticated = this.state.authenticated !== null && this.state.authenticated;

        const contentStyle = authenticated ? {width: "calc(100% - 200px)"} : {width: "100%"};

        const body = (
            <div>
                <Header brandText="Dashboard" />
                <Route path="/" exact={true} render={() => <LoginPage baseUrl={config.url} />} />
                <Route path="/implicit/callback" component={ImplicitCallback} />
                <Route path="/register" component={RegistrationForm} />
                <SecureRoute path="/profile" component={ProfilePage} />
                <SecureRoute path="/menu" component={Menu} />
                <SecureRoute path="/tickets" component={Tickets} />
                <SecureRoute path="/tables" component={Tables} />
                <Footer />
            </div>
        );

        return (
            <div className="wrapper">
                <Sidebar />
                <div id="main-panel" className="main-panel" ref="mainPanel" style={ contentStyle }>
                    {body}
                </div>
            </div>
        );
    }
}

export default withAuth(App);